import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import CartItem from "./CartItem";

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCart({ onClose }: { onClose: () => void }) {
  const [, setLocation] = useLocation();
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      {/* Yarn ball illustration */}
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 20 }}>
        <circle cx="40" cy="40" r="36" fill="#fdf4e7" />
        <circle cx="40" cy="40" r="28" fill="#f5e6cc" opacity="0.6" />
        <ellipse cx="40" cy="40" rx="28" ry="10" stroke="#c4a484" strokeWidth="1.5" fill="none" opacity="0.5" />
        <ellipse cx="40" cy="40" rx="10" ry="28" stroke="#c4a484" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M20 55 Q40 35 60 45" stroke="#f4a7b9" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 18,
        color: "#3d2b1f", margin: "0 0 8px" }}>Your cart is empty</h3>
      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: "#8a6a55",
        margin: "0 0 24px", lineHeight: 1.6 }}>
        Discover unique handcrafted pieces made with care.
      </p>
      <button
        onClick={() => { onClose(); setLocation("/marketplace"); }}
        style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
          color: "#fff",
          background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
          border: "none", borderRadius: 50, padding: "12px 28px", cursor: "pointer",
          boxShadow: "0 6px 18px rgba(244,167,185,0.3)",
        }}
      >
        Explore Products
      </button>
    </div>
  );
}

// ─── CartDrawer ───────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const { items, totalItems, subtotal, drawerOpen, closeDrawer } = useCart();
  const [, setLocation] = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(47,31,26,0.35)",
          backdropFilter: "blur(2px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal="true"
        style={{
          position: "fixed", top: 0, right: 0, bottom: 0,
          width: "min(420px, 100vw)",
          zIndex: 201,
          background: "#fdf8f2",
          display: "flex", flexDirection: "column",
          transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 340ms cubic-bezier(0.4,0,0.2,1)",
          boxShadow: "-8px 0 40px rgba(47,31,26,0.12)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 24px",
          borderBottom: "1px solid rgba(196,164,132,0.15)",
          background: "#fff",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#c4a484" strokeWidth="2" strokeLinecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17,
              color: "#3d2b1f", margin: 0 }}>
              Your Cart
            </h2>
            {totalItems > 0 && (
              <span style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11,
                color: "#fff", background: "#f4a7b9", borderRadius: 50,
                padding: "2px 8px", lineHeight: 1.6,
              }}>{totalItems}</span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            style={{
              width: 34, height: 34, borderRadius: "50%", background: "#fdf4e7",
              border: "none", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center",
              color: "#8a6a55", transition: "background 180ms",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5e6cc")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fdf4e7")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && subtotal < 50 && (
          <div style={{
            padding: "10px 24px",
            background: "rgba(244,167,185,0.08)",
            borderBottom: "1px solid rgba(196,164,132,0.1)",
            flexShrink: 0,
          }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#8a6a55",
              margin: "0 0 6px" }}>
              Add <strong style={{ color: "#d4856a" }}>${(50 - subtotal).toFixed(2)}</strong> more for free shipping!
            </p>
            <div style={{ height: 4, borderRadius: 2, background: "rgba(196,164,132,0.2)", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg, #f4a7b9, #c4a484)",
                width: `${Math.min((subtotal / 50) * 100, 100)}%`,
                transition: "width 400ms ease",
              }} />
            </div>
          </div>
        )}

        {/* Items list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
          {items.length === 0 ? (
            <EmptyCart onClose={closeDrawer} />
          ) : (
            items.map((item) => <CartItem key={item.cartId} item={item} compact />)
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "20px 24px",
            borderTop: "1px solid rgba(196,164,132,0.15)",
            background: "#fff",
            flexShrink: 0,
          }}>
            {/* Totals */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#8a6a55" }}>Subtotal</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: "#3d2b1f" }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#8a6a55" }}>Shipping</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13,
                  color: shipping === 0 ? "#6aab8e" : "#3d2b1f" }}>
                  {shipping === 0 ? "Free 🎉" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div style={{ height: 1, background: "rgba(196,164,132,0.15)", margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15, color: "#3d2b1f" }}>Total</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#d4856a" }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button
                onClick={() => { closeDrawer(); setLocation("/cart"); }}
                style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  color: "#3d2b1f", background: "#fff",
                  border: "1.5px solid rgba(196,164,132,0.3)", borderRadius: 50,
                  padding: "12px", cursor: "pointer",
                  transition: "all 200ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#fdf4e7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; }}
              >
                View Cart
              </button>
              <button
                style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  color: "#fff",
                  background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                  border: "none", borderRadius: 50, padding: "13px", cursor: "pointer",
                  boxShadow: "0 6px 18px rgba(244,167,185,0.35)",
                  transition: "all 220ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 28px rgba(244,167,185,0.5)"; e.currentTarget.style.transform = "scale(1.01)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 6px 18px rgba(244,167,185,0.35)"; e.currentTarget.style.transform = "scale(1)"; }}
              >
                Checkout →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
