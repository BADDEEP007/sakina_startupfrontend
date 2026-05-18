import { useLocation } from "wouter";

/**
 * AuthLayout
 *
 * Desktop: 50/50 split — visual panel left, form panel right.
 * Tablet:  visual panel shrinks, form stays centered.
 * Mobile:  visual panel hidden, form is full-screen centered card.
 */

interface AuthLayoutProps {
  /** Which mode drives the left-panel copy */
  mode: "login" | "signup";
  children: React.ReactNode;
}

// ─── Inline SVG illustration — yarn balls + thread ───────────────────────────

function YarnIllustration() {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", maxWidth: 320, opacity: 0.92 }}
      aria-hidden
    >
      {/* Flowing thread */}
      <path
        d="M20 200 Q80 140 140 180 Q200 220 260 150 Q300 100 310 60"
        stroke="#c4a484"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M10 220 Q70 160 130 195 Q190 230 250 165 Q295 115 308 75"
        stroke="#f4a7b9"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Yarn ball 1 — blush pink, large */}
      <circle cx="80" cy="130" r="52" fill="#f4a7b9" opacity="0.85" />
      <circle cx="80" cy="130" r="52" fill="url(#b1)" />
      {/* texture lines */}
      <ellipse cx="80" cy="130" rx="52" ry="20" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
      <ellipse cx="80" cy="130" rx="30" ry="52" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <circle cx="80" cy="130" r="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
      {/* specular */}
      <ellipse cx="62" cy="112" rx="14" ry="9" fill="rgba(255,255,255,0.28)" transform="rotate(-25 62 112)" />

      {/* Yarn ball 2 — lavender, medium */}
      <circle cx="210" cy="90" r="40" fill="#c8b6ff" opacity="0.88" />
      <circle cx="210" cy="90" r="40" fill="url(#b2)" />
      <ellipse cx="210" cy="90" rx="40" ry="15" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" fill="none" />
      <ellipse cx="210" cy="90" rx="22" ry="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" fill="none" />
      <ellipse cx="196" cy="76" rx="11" ry="7" fill="rgba(255,255,255,0.28)" transform="rotate(-25 196 76)" />

      {/* Yarn ball 3 — cream/brown, small */}
      <circle cx="240" cy="185" r="30" fill="#f5e6cc" opacity="0.9" />
      <circle cx="240" cy="185" r="30" fill="url(#b3)" />
      <ellipse cx="240" cy="185" rx="30" ry="11" stroke="rgba(196,164,132,0.4)" strokeWidth="1.2" fill="none" />
      <ellipse cx="240" cy="185" rx="16" ry="30" stroke="rgba(196,164,132,0.3)" strokeWidth="1.2" fill="none" />
      <ellipse cx="229" cy="174" rx="9" ry="6" fill="rgba(255,255,255,0.35)" transform="rotate(-25 229 174)" />

      {/* Knitting needles */}
      <line x1="50" y1="80" x2="115" y2="175" stroke="#c4a484" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="50" cy="78" r="5" fill="#c4a484" opacity="0.7" />
      <line x1="110" y1="75" x2="55" y2="178" stroke="#c4a484" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="110" cy="73" r="5" fill="#c4a484" opacity="0.7" />

      {/* Loose thread from ball 1 */}
      <path d="M128 148 Q160 200 210 215 Q240 222 260 210"
        stroke="#f4a7b9" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5" />

      <defs>
        <radialGradient id="b1" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(200,100,120,0.25)" />
        </radialGradient>
        <radialGradient id="b2" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(140,100,220,0.2)" />
        </radialGradient>
        <radialGradient id="b3" cx="38%" cy="35%" r="65%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(196,164,132,0.3)" />
        </radialGradient>
      </defs>
    </svg>
  );
}

// ─── Left visual panel ────────────────────────────────────────────────────────

function VisualPanel({ mode }: { mode: "login" | "signup" }) {
  const [, setLocation] = useLocation();

  return (
    <div
      className="auth-visual-panel"
      style={{
        flex: 1,
        minHeight: "100vh",
        background: "linear-gradient(145deg, #fdf4e7 0%, #fce8f0 45%, #ede8ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot texture */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(196,164,132,0.07) 1px, transparent 1px)",
        backgroundSize: "22px 22px", pointerEvents: "none",
      }} />

      {/* Blobs */}
      <div aria-hidden style={{ position: "absolute", top: -60, right: -60, width: 260, height: 260,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(244,167,185,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(200,182,255,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Logo */}
      <button
        onClick={() => setLocation("/")}
        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 52,
          background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF8A65 0%, #4FC3F7 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(255,138,101,0.35)",
        }}>
          <span style={{ color: "#fff", fontSize: 17 }}>f</span>
        </div>
        <div style={{ textAlign: "left" }}>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15,
            color: "#3d2b1f", margin: 0, lineHeight: 1.1 }}>Feedle</p>
        </div>
      </button>

      {/* Illustration */}
      <div style={{ marginBottom: 44, position: "relative", zIndex: 1 }}>
        <YarnIllustration />
      </div>

      {/* Copy */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 800,
          fontSize: "clamp(24px, 2.8vw, 34px)", color: "#3d2b1f",
          margin: "0 0 12px", lineHeight: 1.2,
        }}>
          {mode === "login" ? "Welcome Back" : "Join Our Community"}
        </h2>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 14,
          color: "#8a6a55", lineHeight: 1.65, maxWidth: 280, margin: "0 auto",
        }}>
          {mode === "login"
            ? "Log in to continue your Feedle journey."
            : "Create an account and discover handcrafted pieces made with care."}
        </p>
      </div>

      {/* Decorative dots row */}
      <div style={{ display: "flex", gap: 6, marginTop: 32 }}>
        {["#f4a7b9", "#c8b6ff", "#c4a484", "#f5e6cc"].map((c) => (
          <div key={c} style={{ width: 7, height: 7, borderRadius: "50%", background: c, opacity: 0.7 }} />
        ))}
      </div>
    </div>
  );
}

// ─── AuthLayout ───────────────────────────────────────────────────────────────

export default function AuthLayout({ mode, children }: AuthLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#fdf8f2",
      }}
    >
      {/* Left visual panel — hidden on mobile */}
      <div className="auth-visual-wrapper" style={{ display: "flex", flex: 1 }}>
        <VisualPanel mode={mode} />
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 24px",
          minHeight: "100vh",
          background: "#fdf8f2",
          position: "relative",
        }}
      >
        {/* Subtle texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(196,164,132,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px", pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420 }}>
          {children}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-visual-wrapper { display: none !important; }
        }
      `}</style>
    </div>
  );
}
