import { useCallback, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;
const API_BASE = import.meta.env.VITE_AUTH_API_URL ?? "";

// ── Singleton guard ────────────────────────────────────────────────────────────
// FedCM enforces one outstanding navigator.credentials.get() at a time.
// This module-level flag ensures initialize() is called exactly once per page load,
// regardless of React Strict Mode double-invocations or multiple component mounts.
let gsiInitialized = false;

function ensureGsiInitialized(callback: (credential: string) => void) {
  if (gsiInitialized) return;
  if (!GOOGLE_CLIENT_ID || !window.google?.accounts?.id) return;

  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: (r) => callback(r.credential),
    auto_select: false,           // prevents AbortError from premature credential grab
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true,   // satisfies new FedCM requirement, silences migration warnings
  });

  gsiInitialized = true;
}

export function useGoogleAuth() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Stable ref so the initialize callback never goes stale across re-renders
  const handleCredentialRef = useRef<(credential: string) => Promise<void>>();

  const handleCredentialResponse = useCallback(
    async (credential: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_BASE}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: credential }),
        });

        console.log(res)

        const data = await res.json() as {
          success: boolean;
          token?: string;
          user?: {
            id: string; email: string; name: string | null;
            profile_image: string | null; is_seller: boolean;
            password_hash?: string | null;
          };
          error?: string;
        };

        if (!res.ok || !data.success || !data.user || !data.token) {
          throw new Error(data.error ?? "Authentication failed.");
        }

        const user = {
          id:          data.user.id,
          name:        data.user.name ?? data.user.email.split("@")[0],
          email:       data.user.email,
          avatar:      data.user.profile_image ?? undefined,
          isSeller:    data.user.is_seller,
          hasPassword: data.user.password_hash != null,
        };

        login(user, data.token);
        toast.success(`Welcome, ${user.name}! 🎉`, { duration: 3500 });
        setTimeout(() => setLocation("/profile"), 300);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        toast.error("Google login failed", { description: msg });
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  // Keep the ref current so the singleton callback always delegates to the latest version
  handleCredentialRef.current = handleCredentialResponse;

  const signIn = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      const msg = "VITE_GOOGLE_CLIENT_ID is not set.";
      setError(msg); toast.error("Config error", { description: msg }); return;
    }
    if (!window.google?.accounts?.id) {
      const msg = "Google script not loaded yet. Please refresh.";
      setError(msg); toast.error("Not ready", { description: msg }); return;
    }

    setError(null);

    // Initialize once — subsequent calls are no-ops thanks to the guard
    ensureGsiInitialized((credential) => handleCredentialRef.current?.(credential));

    window.google.accounts.id.prompt((n) => {
      if (n.isNotDisplayed() || n.isSkippedMoment()) {
        console.info("[GSI] prompt suppressed:", n.getNotDisplayedReason?.() ?? n.getSkippedReason?.());
      }
    });
  }, []);

  return { signIn, isLoading, error };
}
