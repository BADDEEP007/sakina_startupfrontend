import { useRef, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useEmailAuth } from "@/hooks/useEmailAuth";
import { useSeller } from "@/contexts/SellerContext";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  rose:    "#C45E73",
  taupe:   "#D8CDC4",
  cream:   "#FAF7F4",
  card:    "#FFFFFF",
  dark:    "#2A2A2A",
  mid:     "#4A4A4A",
  muted:   "#8a8a8a",
  border:  "rgba(196,164,132,0.18)",
  green:   "#6aab8e",
  amber:   "#f5c842",
};

const font = "'Inter','Poppins',sans-serif";
const serif = "'Playfair Display',Georgia,serif";

// ─── Shared primitives ────────────────────────────────────────────────────────

function Spinner({ size = 14, light = true }: { size?: number; light?: boolean }) {
  return (
    <span style={{
      display: "inline-block", width: size, height: size, flexShrink: 0,
      border: `2px solid ${light ? "rgba(255,255,255,0.3)" : "rgba(196,164,132,0.3)"}`,
      borderTopColor: light ? "#fff" : C.rose,
      borderRadius: "50%", animation: "spin 0.65s linear infinite",
    }} />
  );
}

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.card, borderRadius: 24, padding: "24px",
      boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
      border: `1px solid ${C.border}`,
      ...style,
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: serif, fontWeight: 700, fontSize: 15, color: C.dark, margin: "0 0 16px" }}>
      {children}
    </p>
  );
}

// ─── Action tile ──────────────────────────────────────────────────────────────

function ActionTile({
  icon, label, sublabel, onClick, accent = false, badge,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  onClick: () => void;
  accent?: boolean;
  badge?: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "flex-start",
        gap: 8, padding: "18px 16px", borderRadius: 18, border: "none",
        cursor: "pointer", textAlign: "left", position: "relative",
        background: hov
          ? accent ? "rgba(196,94,115,0.08)" : C.cream
          : accent ? "rgba(196,94,115,0.04)" : "#FDFAF7",
        boxShadow: hov ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "all 200ms ease",
        transform: hov ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      {/* Icon bubble */}
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: accent ? "rgba(196,94,115,0.12)" : "rgba(196,164,132,0.12)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon}
      </div>

      <div>
        <p style={{ fontFamily: font, fontWeight: 700, fontSize: 13.5, color: C.dark, margin: 0 }}>
          {label}
        </p>
        {sublabel && (
          <p style={{ fontFamily: font, fontSize: 11.5, color: C.muted, margin: "2px 0 0" }}>
            {sublabel}
          </p>
        )}
      </div>

      {/* Badge */}
      {badge != null && badge > 0 && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          minWidth: 20, height: 20, borderRadius: 10,
          background: C.rose, color: "#fff",
          fontFamily: font, fontWeight: 700, fontSize: 10,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "0 5px",
        }}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </button>
  );
}

// ─── Verification banner ──────────────────────────────────────────────────────

function VerificationBanner({ email, onDismiss }: { email: string; onDismiss: () => void }) {
  const { resendVerification, isLoading } = useEmailAuth();
  const [, setLocation] = useLocation();
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    const ok = await resendVerification(email);
    if (ok) setResent(true);
  };

  return (
    <div role="alert" style={{
      background: "linear-gradient(135deg, #fffbeb 0%, #fef9e7 100%)",
      borderRadius: 18, border: "1.5px solid rgba(245,193,77,0.45)",
      padding: "16px 18px", marginBottom: 20,
      boxShadow: "0 2px 12px rgba(245,193,77,0.12)",
      position: "relative",
    }}>
      {/* Dismiss */}
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          position: "absolute", top: 12, right: 12,
          width: 24, height: 24, borderRadius: "50%", border: "none",
          background: "rgba(122,92,0,0.08)", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#7a5c00", fontSize: 14, lineHeight: 1,
        }}
      >×</button>

      {/* Icon + text */}
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingRight: 28 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
          background: "rgba(245,193,77,0.18)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: font, fontWeight: 700, fontSize: 13.5, color: "#7a5c00", margin: "0 0 4px" }}>
            Verify your email to unlock full features
          </p>
          <p style={{ fontFamily: font, fontSize: 12.5, color: "#9a7a20", margin: "0 0 12px", lineHeight: 1.5 }}>
            Your email is not verified. Some features like placing orders and becoming a seller require a verified email.
          </p>

          {resent ? (
            <p style={{ fontFamily: font, fontWeight: 600, fontSize: 12.5, color: "#4a9e7a", margin: 0 }}>
              ✓ Verification email sent — check your inbox.
            </p>
          ) : (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setLocation("/verify-email")}
                style={{
                  fontFamily: font, fontWeight: 700, fontSize: 12.5,
                  color: "#fff", background: "#b8860b",
                  border: "none", borderRadius: 50, padding: "8px 16px",
                  cursor: "pointer", transition: "all 180ms ease",
                  boxShadow: "0 3px 10px rgba(184,134,11,0.3)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#9a7009"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#b8860b"; }}
              >
                Verify Email
              </button>
              <button
                onClick={handleResend}
                disabled={isLoading}
                style={{
                  fontFamily: font, fontWeight: 600, fontSize: 12.5,
                  color: "#7a5c00", background: "rgba(245,193,77,0.18)",
                  border: "1.5px solid rgba(245,193,77,0.5)", borderRadius: 50,
                  padding: "8px 16px", cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.7 : 1, transition: "all 180ms ease",
                  display: "flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.background = "rgba(245,193,77,0.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,193,77,0.18)"; }}
              >
                {isLoading ? <><Spinner size={11} light={false} /> Sending…</> : "Resend Email"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Set password form ────────────────────────────────────────────────────────

function SetPasswordCard() {
  const { setPassword, isLoading, error } = useEmailAuth();
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [done, setDone]           = useState(false);

  if (done) return (
    <SectionCard style={{ background: "rgba(106,171,142,0.08)", border: "1px solid rgba(106,171,142,0.3)" }}>
      <p style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: "#4a9e7a", margin: 0 }}>
        ✓ Password set! You can now sign in with email too.
      </p>
    </SectionCard>
  );

  const mismatch = confirmPw.length > 0 && newPw !== confirmPw;
  const disabled = isLoading || mismatch || newPw.length < 8;

  const fieldStyle: React.CSSProperties = {
    width: "100%", fontFamily: font, fontSize: 14, color: C.dark,
    background: C.cream, border: `1.5px solid ${C.border}`,
    borderRadius: 12, padding: "11px 14px", outline: "none",
    boxSizing: "border-box", transition: "border-color 200ms ease",
  };

  return (
    <SectionCard>
      <SectionTitle>Set a Password</SectionTitle>
      <p style={{ fontFamily: font, fontSize: 13, color: C.mid, margin: "0 0 18px" }}>
        Add a password so you can also sign in with email.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (disabled) return;
          const ok = await setPassword(newPw);
          if (ok) { setDone(true); setNewPw(""); setConfirmPw(""); }
        }}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input type="password" placeholder="New password (min. 8 chars)"
          value={newPw} onChange={(e) => setNewPw(e.target.value)} style={fieldStyle} />
        <input type="password" placeholder="Confirm password"
          value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
          style={{ ...fieldStyle, borderColor: mismatch ? "#e07a8a" : C.border }} />
        {mismatch && <p style={{ fontFamily: font, fontSize: 11.5, color: "#e07a8a", margin: 0 }}>Passwords don't match</p>}
        {error   && <p style={{ fontFamily: font, fontSize: 11.5, color: "#e07a8a", margin: 0 }}>{error}</p>}
        <button type="submit" disabled={disabled} style={{
          padding: "13px", background: disabled ? "rgba(196,164,132,0.35)" : C.rose,
          color: "#fff", fontFamily: font, fontWeight: 700, fontSize: 14,
          borderRadius: 50, border: "none", cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: disabled ? "none" : "0 4px 14px rgba(196,94,115,0.3)",
          transition: "all 200ms ease",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {isLoading ? <><Spinner /> Saving…</> : "Set Password"}
        </button>
      </form>
    </SectionCard>
  );
}

// ─── Main Profile page ────────────────────────────────────────────────────────

export default function Profile() {
  const { user, isLoggedIn, logout } = useAuth();
  const { totalItems, openDrawer }   = useCart();
  const { openPanel }                = useSeller();
  const [, setLocation]              = useLocation();
  const fileRef                      = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loggingOut, setLoggingOut]       = useState(false);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  if (!isLoggedIn) { setLocation("/login"); return null; }

  const displayAvatar = avatarPreview ?? user?.avatar;

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    setLoggingOut(true);
    setTimeout(() => {
      logout();
      setLocation("/");
    }, 700);
  };

  const handleBecomeSeller = () => {
    setSellerLoading(true);
    setTimeout(() => setLocation("/seller/onboarding"), 600);
  };

  const handleAddProduct = () => {
    setSellerLoading(true);
    setTimeout(() => setLocation("/add-product"), 600);
  };

  const handleShare = async () => {
    const url = window.location.origin;
    if (navigator.share) {
      await navigator.share({ title: "Feedle with Love", url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  // ── SVG icons ──────────────────────────────────────────────────────────────
  const icons = {
    cart: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    orders: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
        <rect x="9" y="3" width="6" height="4" rx="1"/>
        <path d="M9 12h6M9 16h4"/>
      </svg>
    ),
    reviews: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    wishlist: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    seller: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    share: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.rose} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
    logout: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e07a8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
    camera: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
      </svg>
    ),
  };

  return (
    <>
      {/* Logout mini-overlay */}
      {loggingOut && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(250,247,244,0.92)", backdropFilter: "blur(6px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
        }}>
          <Spinner size={28} light={false} />
          <p style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: C.mid, margin: 0 }}>
            Signing out…
          </p>
        </div>
      )}

      {/* Seller navigation overlay */}
      {sellerLoading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(250,247,244,0.92)", backdropFilter: "blur(6px)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14,
        }}>
          <Spinner size={28} light={false} />
          <p style={{ fontFamily: font, fontWeight: 600, fontSize: 15, color: C.mid, margin: 0 }}>
            Loading…
          </p>
        </div>
      )}

    <div style={{ minHeight: "100vh", background: C.cream }}>
      <Navbar />

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoChange} />

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "28px 16px 100px" }}>

        {/* ── Email verification banner ── */}
        {user?.emailVerified === false && !bannerDismissed && (
          <VerificationBanner email={user.email} onDismiss={() => setBannerDismissed(true)} />
        )}

        {/* ══════════════════════════════════════════
            PROFILE CARD
        ══════════════════════════════════════════ */}
        <SectionCard style={{ marginBottom: 16 }}>
          {/* Avatar + info row */}
          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
            {/* Avatar with camera overlay */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {displayAvatar ? (
                <img src={displayAvatar} alt={user?.name}
                  style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.rose}` }} />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.rose} 0%, ${C.taupe} 100%)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `3px solid ${C.rose}`,
                }}>
                  <span style={{ color: "#fff", fontFamily: serif, fontWeight: 700, fontSize: 28 }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
              )}
              {/* Camera button */}
              <button
                onClick={() => fileRef.current?.click()}
                aria-label="Change photo"
                style={{
                  position: "absolute", bottom: 0, right: 0,
                  width: 26, height: 26, borderRadius: "50%",
                  background: C.rose, border: "2px solid #fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {icons.camera}
              </button>
            </div>

            {/* Name + email */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h1 style={{ fontFamily: serif, fontWeight: 700, fontSize: 20, color: C.dark, margin: "0 0 3px", lineHeight: 1.2 }}>
                {user?.name}
              </h1>
              <p style={{ fontFamily: font, fontSize: 13, color: C.mid, margin: "0 0 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
              {/* Badges */}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontFamily: font, fontWeight: 600, fontSize: 10.5, color: "#fff", background: user?.isSeller ? C.green : C.rose, borderRadius: 50, padding: "2px 10px" }}>
                  {user?.isSeller ? "Seller" : "Buyer"}
                </span>
                {user?.hasPassword && (
                  <span style={{ fontFamily: font, fontWeight: 600, fontSize: 10.5, color: "#fff", background: user?.emailVerified ? C.green : C.amber, borderRadius: 50, padding: "2px 10px" }}>
                    {user?.emailVerified ? "✓ Verified" : "⚠ Unverified"}
                  </span>
                )}
                <span style={{ fontFamily: font, fontWeight: 600, fontSize: 10.5, color: C.mid, background: "#F5F0EB", borderRadius: 50, padding: "2px 10px" }}>
                  {user?.hasPassword ? "Email + Google" : "Google only"}
                </span>
              </div>
            </div>
          </div>

          {/* Change Photo button */}
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              width: "100%", padding: "11px", fontFamily: font, fontWeight: 600, fontSize: 13.5,
              color: C.rose, background: "rgba(196,94,115,0.06)",
              border: `1.5px solid rgba(196,94,115,0.25)`, borderRadius: 50,
              cursor: "pointer", transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,94,115,0.12)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(196,94,115,0.06)"; }}
          >
            Change Photo
          </button>
        </SectionCard>

        {/* ══════════════════════════════════════════
            QUICK ACTIONS GRID
        ══════════════════════════════════════════ */}
        <SectionCard style={{ marginBottom: 16 }}>
          <SectionTitle>My Account</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <ActionTile
              icon={icons.cart} label="My Cart"
              sublabel={totalItems > 0 ? `${totalItems} item${totalItems !== 1 ? "s" : ""}` : "Empty"}
              onClick={openDrawer} badge={totalItems} accent
            />
            <ActionTile
              icon={icons.orders} label="My Orders"
              sublabel={user?.emailVerified === false ? "Verify email to order" : "Track & reorder"}
              onClick={() => {
                if (user?.emailVerified === false) { setBannerDismissed(false); return; }
                setLocation("/orders");
              }} accent
            />
            <ActionTile
              icon={icons.reviews} label="My Reviews"
              sublabel="Your feedback"
              onClick={() => setLocation("/marketplace")}
            />
            <ActionTile
              icon={icons.wishlist} label="Wishlist"
              sublabel="Saved items"
              onClick={() => setLocation("/wishlist")}
            />
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            SELLER SECTION
        ══════════════════════════════════════════ */}
        <SectionCard style={{ marginBottom: 16 }}>
          <SectionTitle>Seller</SectionTitle>
          {user?.isSeller ? (
            <button
              onClick={handleAddProduct}
              style={{
                width: "100%", padding: "14px",
                background: `linear-gradient(135deg, ${C.rose} 0%, ${C.taupe} 100%)`,
                color: "#fff", fontFamily: font, fontWeight: 700, fontSize: 14.5,
                borderRadius: 50, border: "none", cursor: "pointer",
                boxShadow: "0 6px 20px rgba(196,94,115,0.30)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 200ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {icons.seller}
              Go to Seller Dashboard
            </button>
          ) : (
            <div>
              <p style={{ fontFamily: font, fontSize: 13, color: C.mid, margin: "0 0 14px", lineHeight: 1.6 }}>
                Turn your craft into a business. List your Feedle pieces and reach buyers who love unique, artisan work.
              </p>
              <button
                onClick={handleBecomeSeller}
                disabled={user?.emailVerified === false}
                title={user?.emailVerified === false ? "Verify your email to become a seller" : undefined}
                style={{
                  width: "100%", padding: "14px",
                  background: user?.emailVerified === false ? "rgba(196,164,132,0.15)" : "none",
                  color: user?.emailVerified === false ? C.muted : C.rose,
                  fontFamily: font, fontWeight: 700, fontSize: 14.5,
                  borderRadius: 50,
                  border: `2px solid ${user?.emailVerified === false ? "rgba(196,164,132,0.25)" : C.rose}`,
                  cursor: user?.emailVerified === false ? "not-allowed" : "pointer",
                  transition: "all 200ms ease",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                }}
                onMouseEnter={(e) => { if (user?.emailVerified !== false) e.currentTarget.style.background = "rgba(196,94,115,0.06)"; }}
                onMouseLeave={(e) => { if (user?.emailVerified !== false) e.currentTarget.style.background = "none"; }}
              >
                {icons.seller}
                {user?.emailVerified === false ? "Verify email to become a seller" : "Become a Seller"}
              </button>
            </div>
          )}
        </SectionCard>

        {/* ══════════════════════════════════════════
            EXTRA ACTIONS
        ══════════════════════════════════════════ */}
        <SectionCard style={{ marginBottom: 16 }}>
          <SectionTitle>More</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Share */}
            <button
              onClick={handleShare}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 14px", borderRadius: 14, border: "none",
                background: "transparent", cursor: "pointer", textAlign: "left",
                transition: "background 160ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.cream; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(196,164,132,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icons.share}
              </div>
              <div>
                <p style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: C.dark, margin: 0 }}>Share with a Friend</p>
                <p style={{ fontFamily: font, fontSize: 12, color: C.muted, margin: "2px 0 0" }}>Invite someone to discover Feedle</p>
              </div>
            </button>

            <div style={{ height: 1, background: C.border, margin: "4px 0" }} />

            {/* Logout */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "13px 14px", borderRadius: 14, border: "none",
                background: "transparent", cursor: "pointer", textAlign: "left",
                transition: "background 160ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(224,122,138,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "rgba(224,122,138,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {icons.logout}
              </div>
              <p style={{ fontFamily: font, fontWeight: 600, fontSize: 14, color: "#e07a8a", margin: 0 }}>
                Log Out
              </p>
            </button>
          </div>
        </SectionCard>

        {/* ══════════════════════════════════════════
            SET PASSWORD (Google-only accounts)
        ══════════════════════════════════════════ */}
        {!user?.hasPassword && <SetPasswordCard />}

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
    </>
  );
}
