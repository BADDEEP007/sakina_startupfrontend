import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/useMobile";

const S = {
  page: { minHeight: "100vh", background: "#FAF7F4" } as React.CSSProperties,
  wrap: (mobile: boolean): React.CSSProperties => ({
    maxWidth: 900, margin: "0 auto",
    padding: mobile ? "20px 16px 120px" : "36px 24px 80px",
  }),
  h1: { fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 26, color: "#2A2A2A", margin: "0 0 4px" } as React.CSSProperties,
  sub: { fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: "0 0 28px" } as React.CSSProperties,
  card: { background: "#fff", borderRadius: 20, padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(196,164,132,0.12)", marginBottom: 16 } as React.CSSProperties,
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 } as React.CSSProperties,
  label: { fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A" } as React.CSSProperties,
  value: { fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#2A2A2A" } as React.CSSProperties,
  total: { fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 20, color: "#C45E73" } as React.CSSProperties,
  divider: { height: 1, background: "rgba(196,164,132,0.15)", margin: "12px 0" } as React.CSSProperties,
  btn: {
    width: "100%", padding: "15px", background: "#C45E73", color: "#fff",
    fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15,
    borderRadius: 50, border: "none", cursor: "pointer",
    boxShadow: "0 6px 20px rgba(196,94,115,0.35)", transition: "transform 200ms ease",
  } as React.CSSProperties,
  secondaryBtn: {
    width: "100%", padding: "13px", background: "none", color: "#4A4A4A",
    fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 14,
    borderRadius: 50, border: "1.5px solid rgba(196,164,132,0.3)", cursor: "pointer",
    marginTop: 10, transition: "background 200ms ease",
  } as React.CSSProperties,
};

export default function Checkout() {
  const { items, subtotal, totalItems } = useCart();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div style={S.page}>
      <Navbar />
      <div style={S.wrap(isMobile)}>
        <h1 style={S.h1}>Checkout</h1>
        <p style={S.sub}>{totalItems} item{totalItems !== 1 ? "s" : ""} in your order</p>

        {/* ── Items summary ── */}
        <div style={S.card}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#2A2A2A", margin: "0 0 16px" }}>
            Order Summary
          </p>
          {items.map((item) => (
            <div key={item.cartId} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "center" }}>
              <img src={item.image} alt={item.name}
                style={{ width: 56, height: 56, borderRadius: 12, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: "#2A2A2A", margin: "0 0 2px" }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12, color: "#4A4A4A", margin: 0 }}>
                  Qty: {item.quantity} · by {item.sellerName}
                </p>
              </div>
              <span style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 14, color: "#2A2A2A" }}>
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* ── Price breakdown ── */}
        <div style={S.card}>
          <div style={S.row}>
            <span style={S.label}>Subtotal</span>
            <span style={S.value}>${subtotal.toFixed(2)}</span>
          </div>
          <div style={S.row}>
            <span style={S.label}>Shipping</span>
            <span style={{ ...S.value, color: shipping === 0 ? "#6aab8e" : "#2A2A2A" }}>
              {shipping === 0 ? "Free 🎉" : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div style={S.divider} />
          <div style={S.row}>
            <span style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15, color: "#2A2A2A" }}>Total</span>
            <span style={S.total}>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* ── Delivery address placeholder ── */}
        <div style={S.card}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#2A2A2A", margin: "0 0 12px" }}>
            Delivery Address
          </p>
          <div style={{ padding: "12px 14px", background: "#FAF7F4", borderRadius: 12, border: "1px dashed rgba(196,164,132,0.4)" }}>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: 0 }}>
              123 Handmade Lane, Craft City, CA 90210
            </p>
          </div>
        </div>

        {/* ── CTAs ── */}
        <button
          style={S.btn}
          onClick={() => setLocation("/payment")}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Proceed to Payment →
        </button>
        <button
          style={S.secondaryBtn}
          onClick={() => setLocation("/cart")}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#FAF7F4"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}
