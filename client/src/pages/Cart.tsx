import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartItem from "@/components/cart/CartItem";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/useMobile";
// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCartPage() {
  const [, setLocation] = useLocation();
  return (
    <div style={{ textAlign: "center", padding: "80px 24px" }}>
      <svg width="100" height="100" viewBox="0 0 80 80" fill="none" style={{ marginBottom: 24 }}>
        <circle cx="40" cy="40" r="36" fill="#fdf4e7" />
        <circle cx="40" cy="40" r="28" fill="#f5e6cc" opacity="0.6" />
        <ellipse cx="40" cy="40" rx="28" ry="10" stroke="#c4a484" strokeWidth="1.5" fill="none" opacity="0.5" />
        <ellipse cx="40" cy="40" rx="10" ry="28" stroke="#c4a484" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M20 55 Q40 35 60 45" stroke="#f4a7b9" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 26,
        color: "#2A2A2A", margin: "0 0 10px" }}>Your cart is empty</h2>
      <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 15, color: "#4A4A4A",
        margin: "0 0 28px" }}>
        Discover unique handmade pieces crafted with love.
      </p>
      <button
        onClick={() => setLocation("/marketplace")}
        style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
          color: "#fff",
          background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
          border: "none", borderRadius: 50, padding: "14px 36px", cursor: "pointer",
          boxShadow: "0 6px 20px rgba(244,167,185,0.35)",
        }}
      >
        Explore Products
      </button>
    </div>
  );
}

// ─── Cart page ────────────────────────────────────────────────────────────────

export default function Cart() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
      <Navbar />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px 120px" : "32px 24px 80px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
              fontSize: isMobile ? 24 : 30, color: "#2A2A2A", margin: 0 }}>Shopping Cart</h1>
            {totalItems > 0 && (
              <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A",
                margin: "4px 0 0" }}>{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13,
                color: "#e07a8a", background: "rgba(224,122,138,0.08)",
                border: "1px solid rgba(224,122,138,0.2)", borderRadius: 50,
                padding: "8px 18px", cursor: "pointer",
              }}
            >
              Clear cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCartPage />
        ) : (
          <div className="cart-layout" style={{ display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 340px", gap: isMobile ? 20 : 32, alignItems: isMobile ? "stretch" : "start" }}>

            {/* ── Items list ── */}
            <div style={{
              background: "#fff", borderRadius: 24,
              padding: isMobile ? "16px 12px" : "8px 28px",
              boxShadow: "0 4px 20px rgba(196,164,132,0.10)",
              border: "1px solid rgba(196,164,132,0.1)",
            }}>
              {items.map((item) => (
                <CartItem key={item.cartId} item={item} compact={false} />
              ))}
            </div>

            {/* ── Order summary ── */}
            <div style={{
              background: "#fff",
              boxShadow: "0 4px 20px rgba(196,164,132,0.10)",
              border: "1px solid rgba(196,164,132,0.1)",
              position: isMobile ? "fixed" : "sticky", 
              bottom: isMobile ? 80 : "auto",
              left: isMobile ? 0 : "auto",
              right: isMobile ? 0 : "auto",
              width: isMobile ? "100%" : "auto",
              borderRadius: isMobile ? "24px 24px 0 0" : "24px",
              top: isMobile ? "auto" : 88,
              zIndex: isMobile ? 30 : "auto",
              margin: isMobile ? "0 0 0 0" : "0",
              padding: isMobile ? "20px 16px" : "24px",
            }}>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 17,
                color: "#2A2A2A", margin: "0 0 20px" }}>Order Summary</h2>

              {/* Free shipping progress */}
              {subtotal < 50 && (
                <div style={{
                  padding: "12px 14px", background: "rgba(244,167,185,0.08)",
                  borderRadius: 12, marginBottom: 20,
                  border: "1px solid rgba(244,167,185,0.15)",
                }}>
                  <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12.5,
                    color: "#8a6a55", margin: "0 0 8px" }}>
                    Add <strong style={{ color: "#d4856a" }}>${(50 - subtotal).toFixed(2)}</strong> for free shipping
                  </p>
                  <div style={{ height: 5, borderRadius: 3, background: "rgba(196,164,132,0.2)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 3,
                      background: "linear-gradient(90deg, #f4a7b9, #c4a484)",
                      width: `${Math.min((subtotal / 50) * 100, 100)}%`,
                      transition: "width 400ms ease",
                    }} />
                  </div>
                </div>
              )}

              {/* Line items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
                    Subtotal ({totalItems} items)
                  </span>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#3d2b1f" }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>Shipping</span>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
                    color: shipping === 0 ? "#6aab8e" : "#3d2b1f" }}>
                    {shipping === 0 ? "Free 🎉" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div style={{ height: 1, background: "rgba(196,164,132,0.15)" }} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16, color: "#3d2b1f" }}>Total</span>
                  <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20, color: "#d4856a" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Trust note */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20,
                padding: "10px 12px", background: "#fdf4e7", borderRadius: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#c4a484" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: "#8a6a55" }}>
                  Secure checkout · 100% handmade
                </span>
              </div>

              {/* Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => setLocation("/checkout")}
                  style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
                    color: "#fff",
                    background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                    border: "none", borderRadius: 50, padding: "14px", cursor: "pointer",
                    boxShadow: "0 6px 20px rgba(244,167,185,0.35)",
                    transition: "all 220ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(244,167,185,0.5)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,167,185,0.35)"; }}
                >
                  Proceed to Checkout →
                </button>
                <button
                  onClick={() => setLocation("/marketplace")}
                  style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 14,
                    color: "#8a6a55", background: "none",
                    border: "1.5px solid rgba(196,164,132,0.25)", borderRadius: 50,
                    padding: "12px", cursor: "pointer",
                    transition: "all 200ms ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#fdf4e7"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
          }
          .cart-layout > div:last-child {
            position: static !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
