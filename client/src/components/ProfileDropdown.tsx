import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useSeller } from "@/contexts/SellerContext";

// ─── Logout confirmation modal ────────────────────────────────────────────────

function LogoutModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  // Trap focus / close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onCancel]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed", inset: 0, zIndex: 400,
          background: "rgba(47,31,26,0.4)", backdropFilter: "blur(3px)",
          animation: "fadeIn 180ms ease",
        }}
      />
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Logout confirmation"
        style={{
          position: "fixed", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 401, width: "min(360px, 90vw)",
          background: "#fff", borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "0 24px 64px rgba(47,31,26,0.18), 0 4px 16px rgba(47,31,26,0.08)",
          border: "1px solid rgba(196,164,132,0.15)",
          animation: "slideUp 220ms cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 18px",
          background: "rgba(224,122,138,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#e07a8a" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </div>

        <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18,
          color: "#3d2b1f", textAlign: "center", margin: "0 0 8px" }}>
          Log out?
        </h3>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: "#8a6a55",
          textAlign: "center", margin: "0 0 24px", lineHeight: 1.6 }}>
          Are you sure you want to logout?
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
              color: "#8a6a55", background: "#fff",
              border: "1.5px solid rgba(196,164,132,0.3)", borderRadius: 50,
              padding: "12px", cursor: "pointer", transition: "all 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#fdf4e7"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
              color: "#fff", background: "#e07a8a",
              border: "none", borderRadius: 50, padding: "12px", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(224,122,138,0.35)",
              transition: "all 220ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#d06070"; e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#e07a8a"; e.currentTarget.style.transform = "scale(1)"; }}
          >
            Logout
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
}

// ─── Dropdown menu item ───────────────────────────────────────────────────────

function MenuItem({ icon, label, onClick, danger = false }: {
  icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", borderRadius: 12, border: "none", cursor: "pointer",
        background: hov ? (danger ? "rgba(224,122,138,0.08)" : "#fdf4e7") : "transparent",
        color: danger ? "#e07a8a" : "#3d2b1f",
        transition: "background 160ms ease",
        textAlign: "left",
      }}
    >
      <span style={{ color: danger ? "#e07a8a" : "#c4a484", flexShrink: 0 }}>{icon}</span>
      <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13.5 }}>
        {label}
      </span>
    </button>
  );
}

// ─── ProfileDropdown ──────────────────────────────────────────────────────────

export default function ProfileDropdown() {
  const { user, isLoggedIn, isSeller, logout } = useAuth();
  const { openPanel } = useSeller();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const go = (path: string) => { setOpen(false); setLocation(path); };

  const handleLogout = () => {
    setShowLogout(false);
    setOpen(false);
    logout();
    setLocation("/");
  };

  // ── Not logged in: plain icon ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <button
        onClick={() => setLocation("/login")}
        aria-label="Log in"
        style={{
          width: 38, height: 38, borderRadius: "50%", border: "none",
          background: "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 180ms ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(196,164,132,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="rgba(90,74,66,0.7)" strokeWidth="2" strokeLinecap="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </button>
    );
  }

  // ── Logged in: avatar + dropdown ───────────────────────────────────────────
  return (
    <>
      <div ref={ref} style={{ position: "relative" }}>
        {/* Avatar trigger */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Profile menu"
          aria-expanded={open}
          style={{
            width: 38, height: 38, borderRadius: "50%", border: "none",
            padding: 0, cursor: "pointer", overflow: "hidden",
            boxShadow: open
              ? "0 0 0 2px #fff, 0 0 0 4px #f4a7b9"
              : "0 2px 8px rgba(196,164,132,0.2)",
            transition: "box-shadow 200ms ease",
            flexShrink: 0,
          }}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "#fff", fontFamily: "'Poppins',sans-serif",
                fontWeight: 800, fontSize: 15 }}>
                {user?.name?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
          )}
        </button>

        {/* Dropdown */}
        <div style={{
          position: "absolute", top: "calc(100% + 10px)", right: 0,
          width: 220, background: "#fff", borderRadius: 18,
          boxShadow: "0 16px 48px rgba(47,31,26,0.14), 0 4px 12px rgba(47,31,26,0.06)",
          border: "1px solid rgba(196,164,132,0.15)",
          padding: "8px",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 200ms ease, transform 200ms cubic-bezier(0.34,1.56,0.64,1)",
          transformOrigin: "top right",
          zIndex: 300,
        }}>
          {/* User info header */}
          <div style={{
            padding: "10px 14px 12px",
            borderBottom: "1px solid rgba(196,164,132,0.12)",
            marginBottom: 6,
          }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
              color: "#3d2b1f", margin: 0, whiteSpace: "nowrap",
              overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name}
            </p>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: "#a08070",
              margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.email}
            </p>
          </div>

          {/* Menu items */}
          <MenuItem
            label="Profile"
            onClick={() => go(isSeller ? "/seller/profile" : "/profile")}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          />
          <MenuItem
            label="Orders"
            onClick={() => go("/orders")}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
          />
          <MenuItem
            label="Wishlist"
            onClick={() => go("/wishlist")}
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>}
          />

          {/* Seller-specific */}
          {isSeller ? (
            <MenuItem
              label="Seller Dashboard"
              onClick={() => { setOpen(false); openPanel(); }}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>}
            />
          ) : (
            <MenuItem
              label="Become a Seller"
              onClick={() => go("/seller/onboarding")}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>}
            />
          )}

          <div style={{ height: 1, background: "rgba(196,164,132,0.12)", margin: "6px 0" }} />

          <MenuItem
            label="Logout"
            onClick={() => { setOpen(false); setShowLogout(true); }}
            danger
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
          />
        </div>
      </div>

      {/* Logout modal */}
      {showLogout && (
        <LogoutModal
          onConfirm={handleLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </>
  );
}
