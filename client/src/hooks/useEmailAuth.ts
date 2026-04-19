import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

interface BackendUser {
  id: string;
  email: string;
  name: string | null;
  profile_image: string | null;
  is_seller: boolean;
  password_hash?: string | null;
  email_verified: boolean;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: BackendUser;
  error?: string;
  code?: string;
  linked?: boolean;
  emailVerificationSent?: boolean;
}

function mapUser(u: BackendUser) {
  return {
    id:            u.id,
    name:          u.name ?? u.email.split("@")[0],
    email:         u.email,
    avatar:        u.profile_image ?? undefined,
    isSeller:      u.is_seller,
    hasPassword:   u.password_hash != null,
    emailVerified: u.email_verified,
  };
}

export function useEmailAuth() {
  const { login, token, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // ── Signup ──────────────────────────────────────────────────────────────────
  async function signUp(name: string, email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success || !data.user || !data.token) {
        throw new Error(data.error ?? "Signup failed.");
      }

      login(mapUser(data.user), data.token);

      if (data.linked) {
        toast.success("Password linked to your Google account!", { duration: 3500 });
      } else {
        toast.success(`Welcome, ${data.user.name ?? email}! 🎉`, { duration: 3500 });
      }
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Signup failed.";
      setError(msg);
      toast.error("Signup failed", { description: msg });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // ── Login — always succeeds if credentials are correct, never blocks on verification ──
  async function signIn(email: string, password: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success || !data.user || !data.token) {
        throw new Error(data.error ?? "Login failed.");
      }

      login(mapUser(data.user), data.token);
      toast.success(`Welcome back, ${data.user.name ?? email}! 🎉`, { duration: 3500 });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      setError(msg);
      toast.error("Login failed", { description: msg });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // ── Set password (Google-only accounts) ─────────────────────────────────────
  async function setPassword(password: string): Promise<boolean> {
    if (!token) { setError("Not authenticated."); return false; }
    setIsLoading(true);
    setError(null);
    try {
      const res  = await fetch(`${API_BASE}/auth/set-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      });
      const data: AuthResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Failed to set password.");
      }

      updateUser({ hasPassword: true });
      toast.success("Password set successfully!");
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to set password.";
      setError(msg);
      toast.error("Error", { description: msg });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // ── Resend verification email ────────────────────────────────────────────────
  async function resendVerification(email: string): Promise<boolean> {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to resend.");
      toast.success("Verification email sent! Check your inbox.", { duration: 5000 });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend.";
      setError(msg);
      toast.error("Error", { description: msg });
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    signUp,
    signIn,
    setPassword,
    resendVerification,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
