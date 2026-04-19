import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";

export default function OrderSuccess() {
  const [location, setLocation] = useLocation();
  // Extract order number from query string
  const orderNumber = new URLSearchParams(location.split("?")[1] ?? "").get("order") ?? "";

  return (
    <div style={{
      minHeight: "100vh", background: "#FAF7F4",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{
        width: "100%", maxWidth: 420, background: "#fff", borderRadius: 28,
        padding: "48px 32px", textAlign: "center",
        boxShadow: "0 24px 64px rgba(0,0,0,0.08)",
        border: "1px solid rgba(196,164,132,0.12)",
      }}>
        {/* Animated checkmark */}
        <div style={{
          width: 88, height: 88, borderRadius: "50%",
          background: "linear-gradient(135deg, #C45E73 0%, #D8CDC4 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 24px",
          boxShadow: "0 8px 28px rgba(196,94,115,0.35)",
          animation: "popIn 500ms cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 28, color: "#2A2A2A", margin: "0 0 10px" }}>
          Thanks for shopping!
        </h1>
        <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#4A4A4A", margin: "0 0 8px" }}>
          Your order has been placed successfully.
        </p>
        {orderNumber && (
          <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#8a6a55", margin: "0 0 32px" }}>
            Order <strong style={{ color: "#C45E73" }}>#{orderNumber}</strong>
          </p>
        )}

        <button
          onClick={() => setLocation("/orders")}
          style={{
            width: "100%", padding: "14px",
            background: "#C45E73", color: "#fff",
            fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15,
            borderRadius: 50, border: "none", cursor: "pointer",
            boxShadow: "0 6px 20px rgba(196,94,115,0.35)",
            marginBottom: 10, transition: "transform 200ms ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          View My Orders
        </button>

        <button
          onClick={() => setLocation("/")}
          style={{
            width: "100%", padding: "13px", background: "none", color: "#4A4A4A",
            fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 14,
            borderRadius: 50, border: "1.5px solid rgba(196,164,132,0.3)", cursor: "pointer",
          }}
        >
          Continue Shopping
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          from { transform: scale(0.5); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}
