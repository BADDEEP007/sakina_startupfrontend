import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

type Status = "loading" | "success" | "already" | "error";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const { login }       = useAuth();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      setStatus("error");
      setErrorMsg("No verification token found in the URL.");
      return;
    }

    fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data: {
        success: boolean;
        alreadyVerified?: boolean;
        token?: string;
        user?: { id: string; email: string; name: string | null; profile_image: string | null; is_seller: boolean; email_verified: boolean };
        error?: string;
      }) => {
        if (!data.success) {
          setStatus("error");
          setErrorMsg(data.error ?? "Verification failed.");
          return;
        }
        if (data.alreadyVerified) {
          setStatus("already");
          return;
        }
        // Log the user in immediately after verification
        if (data.token && data.user) {
          login(
            {
              id:            data.user.id,
              name:          data.user.name ?? data.user.email.split("@")[0],
              email:         data.user.email,
              avatar:        data.user.profile_image ?? undefined,
              isSeller:      data.user.is_seller,
              emailVerified: true,
              hasPassword:   true,
            },
            data.token
          );
          toast.success("Email verified! You're now logged in. 🎉");
        }
        setStatus("success");
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const card: React.CSSProperties = {
    width: "100%", maxWidth: 420, background: "#fff", borderRadius: 28,
    padding: "48px 32px", textAlign: "center",
    boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
    border: "1px solid rgba(196,164,132,0.12)",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F4", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={card}>

        {status === "loading" && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(196,94,115,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <span style={{ display: "inline-block", width: 24, height: 24, border: "3px solid rgba(196,94,115,0.3)", borderTopColor: "#C45E73", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 22, color: "#2A2A2A", margin: "0 0 8px" }}>
              Verifying your email…
            </h2>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A", margin: 0 }}>
              Just a moment.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #C45E73 0%, #c4a484 100%)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 8px 24px rgba(196,94,115,0.3)", animation: "popIn 400ms cubic-bezier(0.34,1.56,0.64,1)" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 24, color: "#2A2A2A", margin: "0 0 10px" }}>
              Email verified!
            </h2>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A", margin: "0 0 28px" }}>
              Your account is now active. You're logged in.
            </p>
            <button onClick={() => setLocation("/")} style={{ width: "100%", padding: "14px", background: "#C45E73", color: "#fff", fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15, borderRadius: 50, border: "none", cursor: "pointer", boxShadow: "0 6px 20px rgba(196,94,115,0.35)" }}>
              Go to Home
            </button>
          </>
        )}

        {status === "already" && (
          <>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 22, color: "#2A2A2A", margin: "0 0 10px" }}>
              Already verified
            </h2>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A", margin: "0 0 24px" }}>
              Your email is already verified. You can log in.
            </p>
            <button onClick={() => setLocation("/login")} style={{ width: "100%", padding: "14px", background: "#C45E73", color: "#fff", fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15, borderRadius: 50, border: "none", cursor: "pointer" }}>
              Log In
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(224,122,138,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e07a8a" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 22, color: "#2A2A2A", margin: "0 0 10px" }}>
              Verification failed
            </h2>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A", margin: "0 0 24px" }}>
              {errorMsg}
            </p>
            <button onClick={() => setLocation("/login")} style={{ width: "100%", padding: "14px", background: "#C45E73", color: "#fff", fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15, borderRadius: 50, border: "none", cursor: "pointer", marginBottom: 10 }}>
              Back to Login
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes popIn  { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
