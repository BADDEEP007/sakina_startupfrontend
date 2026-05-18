import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthCard from "@/components/auth/AuthCard";
import InputField from "@/components/auth/InputField";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { useAuth } from "@/contexts/AuthContext";

function Spinner() {
  return (
    <span style={{
      display: "inline-block", width: 16, height: 16,
      border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
      borderRadius: "50%", animation: "spin 0.65s linear infinite", flexShrink: 0,
    }} />
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" style={{
      display: "flex", alignItems: "flex-start", gap: 8,
      padding: "10px 14px", background: "rgba(224,122,138,0.08)",
      border: "1px solid rgba(224,122,138,0.25)", borderRadius: 12, marginTop: 4,
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e07a8a" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12.5, color: "#c0505f", margin: 0, lineHeight: 1.5 }}>
        {message}
      </p>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  if (!password) return null;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#e07a8a", "#f5c842", "#6aab8e", "#4a9e7a"];

  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= score ? colors[score] : "rgba(196,164,132,0.2)", transition: "background 300ms ease" }} />
        ))}
      </div>
      <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11, color: colors[score], margin: 0 }}>
        {labels[score]}
      </p>
    </div>
  );
}

function TransitionOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "linear-gradient(135deg, #fdf4e7 0%, #fce8f0 60%, #ede8ff 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 18,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: "50%",
        background: "linear-gradient(135deg, #c8b6ff 0%, #C45E73 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 8px 24px rgba(200,182,255,0.4)",
      }}>
        <Spinner />
      </div>
      <p style={{
        fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700,
        fontSize: 18, color: "#2A2A2A", margin: 0,
      }}>
        Setting up your account…
      </p>
    </div>
  );
}

export default function Signup() {
  const [, setLocation] = useLocation();
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [transitioning, setTransitioning] = useState(false);

  const { isLoggedIn } = useAuth();
  const { signIn: googleSignIn, isLoading: googleLoading, error: googleError } = useGoogleAuth();
  const { signUp, isLoading: emailLoading, error: emailError, clearError } = useEmailAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isLoggedIn) {
      setLocation("/profile");
    }
  }, [isLoggedIn, setLocation]);

  const loading = googleLoading || emailLoading || transitioning;
  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mismatch || password.length < 8) return;
    clearError();
    const ok = await signUp(name, email, password);
    if (ok) {
      setTransitioning(true);
      setTimeout(() => setLocation("/profile"), 900);
    }
  };

  return (
    <>
      <TransitionOverlay visible={transitioning} />
    <AuthLayout mode="signup">
      <AuthCard>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 26, color: "#2A2A2A", margin: "0 0 6px" }}>
            Create Account
          </h1>
          <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13.5, color: "#8a6a55", margin: 0 }}>
            Join a community that celebrates handcrafted.
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          disabled={loading}
          onClick={googleSignIn}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 13.5, color: "#3d2b1f",
            background: "#fff", border: "1.5px solid rgba(196,164,132,0.3)", borderRadius: 50,
            padding: "12px 20px", cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1, transition: "all 220ms ease",
            boxShadow: "0 2px 8px rgba(196,164,132,0.08)",
          }}
        >
          {googleLoading ? <><Spinner /> Signing in…</> : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </>
          )}
        </button>
        {googleError && <ErrorBanner message={googleError} />}

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(196,164,132,0.2)" }} />
          <span style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11.5, color: "#c4a484", fontWeight: 500 }}>or sign up with email</span>
          <div style={{ flex: 1, height: 1, background: "rgba(196,164,132,0.2)" }} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField label="Full name" type="text" placeholder="Your name" value={name} onChange={setName} autoComplete="name" />
          <InputField label="Email address" type="email" placeholder="you@example.com" value={email} onChange={setEmail} autoComplete="email" />
          <div>
            <InputField label="Password" type="password" placeholder="Min. 8 characters" value={password} onChange={setPassword} autoComplete="new-password" />
            <PasswordStrength password={password} />
          </div>
          <div>
            <InputField label="Confirm password" type="password" placeholder="Repeat your password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
            {mismatch && (
              <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11.5, color: "#e07a8a", margin: "5px 0 0" }}>
                Passwords don't match
              </p>
            )}
          </div>

          {emailError && <ErrorBanner message={emailError} />}

          <button
            type="submit"
            disabled={loading || mismatch || password.length < 8}
            style={{
              width: "100%", fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700,
              fontSize: 14.5, color: "#fff",
              background: (loading || mismatch || password.length < 8) ? "rgba(196,164,132,0.4)" : "linear-gradient(135deg, #c8b6ff 0%, #C45E73 100%)",
              border: "none", borderRadius: 50, padding: "14px 20px",
              cursor: (loading || mismatch || password.length < 8) ? "not-allowed" : "pointer",
              boxShadow: "0 6px 18px rgba(200,182,255,0.28)", transition: "all 240ms ease", marginTop: 4,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {emailLoading ? <><Spinner /> Creating account…</> : "Create Account"}
          </button>
        </form>

        <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#8a6a55", textAlign: "center", marginTop: 20, marginBottom: 0 }}>
          Already have an account?{" "}
          <button type="button" onClick={() => setLocation("/login")}
            style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: "#C45E73", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Log In
          </button>
        </p>
      </AuthCard>

      <p style={{ textAlign: "center", marginTop: 18 }}>
        <button type="button" onClick={() => setLocation("/")}
          style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 500, fontSize: 12.5, color: "#c4a484", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          ← Back to home
        </button>
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AuthLayout>
    </>
  );
}
