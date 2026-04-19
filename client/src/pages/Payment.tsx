import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { useIsMobile } from "@/hooks/useMobile";

// ─── Shared input style ───────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder, type = "text", maxLength,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; maxLength?: number;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: "#2A2A2A" }}>
        {label}
      </label>
      <input
        type={type} value={value} placeholder={placeholder} maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#2A2A2A",
          background: focused ? "#fff" : "#FAF7F4",
          border: `1.5px solid ${focused ? "#C45E73" : "rgba(196,164,132,0.3)"}`,
          borderRadius: 12, padding: "11px 14px", outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(196,94,115,0.12)" : "none",
          transition: "all 200ms ease", boxSizing: "border-box", width: "100%",
        }}
      />
    </div>
  );
}

// ─── Payment method tab ───────────────────────────────────────────────────────

type Method = "card" | "upi" | "qr";

function MethodTab({ id, label, icon, active, onClick }: {
  id: Method; label: string; icon: React.ReactNode; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
        padding: "14px 8px", borderRadius: 16, border: "none", cursor: "pointer",
        background: active ? "rgba(196,94,115,0.08)" : "transparent",
        outline: active ? "2px solid #C45E73" : "2px solid transparent",
        transition: "all 200ms ease",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: active ? 700 : 500, fontSize: 12, color: active ? "#C45E73" : "#4A4A4A" }}>
        {label}
      </span>
    </button>
  );
}

// ─── QR placeholder ──────────────────────────────────────────────────────────

function QRPlaceholder({ total }: { total: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, padding: "24px 0" }}>
      {/* Simulated QR grid */}
      <div style={{
        width: 180, height: 180, borderRadius: 16, background: "#fff",
        border: "2px solid rgba(196,164,132,0.3)",
        display: "grid", gridTemplateColumns: "repeat(9,1fr)", gap: 2, padding: 12,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      }}>
        {Array.from({ length: 81 }).map((_, i) => {
          // Deterministic pattern for a QR-like look
          const row = Math.floor(i / 9), col = i % 9;
          const corner = (row < 3 && col < 3) || (row < 3 && col > 5) || (row > 5 && col < 3);
          const fill = corner || (Math.sin(i * 2.7) > 0.1);
          return (
            <div key={i} style={{ borderRadius: 2, background: fill ? "#2A2A2A" : "transparent" }} />
          );
        })}
      </div>
      <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 14, color: "#2A2A2A", margin: 0 }}>
        Scan to Pay
      </p>
      <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: 0 }}>
        Amount: <strong style={{ color: "#C45E73" }}>${total.toFixed(2)}</strong>
      </p>
      <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11, color: "#8a6a55", margin: 0, textAlign: "center" }}>
        Use any UPI app · PhonePe · GPay · Paytm
      </p>
    </div>
  );
}

// ─── Payment page ─────────────────────────────────────────────────────────────

export default function Payment() {
  const { items, subtotal, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const [method, setMethod] = useState<Method>("card");
  const [processing, setProcessing] = useState(false);

  // Card fields
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // UPI field
  const [upiId, setUpiId] = useState("");

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  const handleSimulate = async () => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1400));
    const order = placeOrder(items, total);
    clearCart();
    setLocation(`/order-success?order=${order.orderNumber}`);
  };

  const formatCard = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F4" }}>
      <Navbar />
      <div style={{ maxWidth: 520, margin: "0 auto", padding: isMobile ? "20px 16px 120px" : "36px 24px 80px" }}>

        {/* Header */}
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 26, color: "#2A2A2A", margin: "0 0 4px" }}>
          Payment
        </h1>
        <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: "0 0 24px" }}>
          Total: <strong style={{ color: "#C45E73" }}>${total.toFixed(2)}</strong>
        </p>

        {/* ── Method selector ── */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(196,164,132,0.12)",
          marginBottom: 16,
        }}>
          <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: "#4A4A4A", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Choose Payment Method
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <MethodTab id="card" label="Card" icon="💳" active={method === "card"} onClick={() => setMethod("card")} />
            <MethodTab id="upi"  label="UPI"  icon="📱" active={method === "upi"}  onClick={() => setMethod("upi")} />
            <MethodTab id="qr"   label="QR"   icon="⬛" active={method === "qr"}   onClick={() => setMethod("qr")} />
          </div>
        </div>

        {/* ── Method panels ── */}
        <div style={{
          background: "#fff", borderRadius: 20, padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(196,164,132,0.12)",
          marginBottom: 20,
        }}>
          {method === "card" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="Cardholder Name" value={cardName} onChange={setCardName} placeholder="Name on card" />
              <Field
                label="Card Number" value={cardNumber}
                onChange={(v) => setCardNumber(formatCard(v))}
                placeholder="1234 5678 9012 3456" maxLength={19}
              />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field
                  label="Expiry" value={expiry}
                  onChange={(v) => setExpiry(formatExpiry(v))}
                  placeholder="MM/YY" maxLength={5}
                />
                <Field label="CVV" value={cvv} onChange={setCvv} placeholder="•••" type="password" maxLength={4} />
              </div>
            </div>
          )}

          {method === "upi" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <Field label="UPI ID" value={upiId} onChange={setUpiId} placeholder="yourname@upi" />
              <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12, color: "#8a6a55", margin: 0 }}>
                Enter your UPI ID linked to PhonePe, GPay, Paytm, or any UPI app.
              </p>
            </div>
          )}

          {method === "qr" && <QRPlaceholder total={total} />}
        </div>

        {/* ── Simulate button ── */}
        <button
          onClick={handleSimulate}
          disabled={processing}
          style={{
            width: "100%", padding: "16px",
            background: processing ? "rgba(196,94,115,0.5)" : "#C45E73",
            color: "#fff",
            fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 15,
            borderRadius: 50, border: "none", cursor: processing ? "not-allowed" : "pointer",
            boxShadow: processing ? "none" : "0 6px 20px rgba(196,94,115,0.35)",
            transition: "all 200ms ease",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          {processing ? (
            <>
              <span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
              Processing…
            </>
          ) : (
            "✦ Simulate Successful Payment"
          )}
        </button>

        <button
          onClick={() => setLocation("/checkout")}
          style={{
            width: "100%", padding: "13px", background: "none", color: "#4A4A4A",
            fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 14,
            borderRadius: 50, border: "1.5px solid rgba(196,164,132,0.3)", cursor: "pointer",
            marginTop: 10,
          }}
        >
          ← Back to Checkout
        </button>

        <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11, color: "#8a6a55", textAlign: "center", marginTop: 16 }}>
          🔒 This is a simulation — no real payment is processed.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
