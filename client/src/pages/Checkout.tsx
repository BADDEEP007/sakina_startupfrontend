import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { addressesApi } from "@/lib/api";
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
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { placeOrder } = useOrders();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const response = await addressesApi.getAll();
        const addressList = response.addresses || [];
        setAddresses(addressList);
        
        // Select default address or first address
        const defaultAddr = addressList.find((a: any) => a.is_default);
        if (defaultAddr) {
          setSelectedAddress(defaultAddr.id);
        } else if (addressList.length > 0) {
          setSelectedAddress(addressList[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch addresses:", err);
        setError("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError("Please select a delivery address");
      return;
    }

    try {
      setPlacing(true);
      setError(null);
      
      await placeOrder(selectedAddress, paymentMethod);
      await clearCart();
      
      setLocation("/order-success");
    } catch (err) {
      console.error("Failed to place order:", err);
      setError("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    setLocation("/cart");
    return null;
  }

  if (loading) {
    return (
      <div style={S.page}>
        <Navbar />
        <div style={S.wrap(isMobile)}>
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
              Loading checkout...
            </p>
          </div>
        </div>
      </div>
    );
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

        {/* ── Delivery address ── */}
        <div style={S.card}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#2A2A2A", margin: "0 0 12px" }}>
            Delivery Address
          </p>
          {addresses.length === 0 ? (
            <div style={{ padding: "12px 14px", background: "#FAF7F4", borderRadius: 12, border: "1px dashed rgba(196,164,132,0.4)" }}>
              <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: "0 0 8px" }}>
                No addresses found. Please add an address.
              </p>
              <button
                onClick={() => setLocation("/profile")}
                style={{
                  fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 12,
                  color: "#C45E73", background: "rgba(244,167,185,0.1)",
                  border: "1px solid rgba(244,167,185,0.3)", borderRadius: 50,
                  padding: "7px 16px", cursor: "pointer",
                }}
              >
                Add Address
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {addresses.map((addr: any) => (
                <label key={addr.id} style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  padding: "12px 14px", background: selectedAddress === addr.id ? "rgba(244,167,185,0.1)" : "#FAF7F4",
                  borderRadius: 12, border: `1.5px solid ${selectedAddress === addr.id ? "#f4a7b9" : "rgba(196,164,132,0.2)"}`,
                  cursor: "pointer", transition: "all 200ms ease",
                }}>
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddress === addr.id}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    style={{ marginTop: 2 }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 13, color: "#2A2A2A", margin: "0 0 4px" }}>
                      {addr.full_name} {addr.is_default && <span style={{ color: "#C45E73", fontSize: 11 }}>(Default)</span>}
                    </p>
                    <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12, color: "#4A4A4A", margin: 0 }}>
                      {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}<br />
                      {addr.city}, {addr.state} {addr.postal_code}<br />
                      {addr.phone}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* ── Payment method ── */}
        <div style={S.card}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#2A2A2A", margin: "0 0 12px" }}>
            Payment Method
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { value: "cod", label: "Cash on Delivery" },
              { value: "card", label: "Credit/Debit Card" },
              { value: "upi", label: "UPI" },
              { value: "wallet", label: "Wallet" },
              { value: "netbanking", label: "Net Banking" },
            ].map((method) => (
              <label key={method.value} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "12px 14px", background: paymentMethod === method.value ? "rgba(244,167,185,0.1)" : "#FAF7F4",
                borderRadius: 12, border: `1.5px solid ${paymentMethod === method.value ? "#f4a7b9" : "rgba(196,164,132,0.2)"}`,
                cursor: "pointer", transition: "all 200ms ease",
              }}>
                <input
                  type="radio"
                  name="payment"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 500, fontSize: 13, color: "#2A2A2A" }}>
                  {method.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Error message ── */}
        {error && (
          <div style={{
            padding: "12px 16px", background: "rgba(244,167,185,0.15)",
            border: "1px solid rgba(244,167,185,0.4)", borderRadius: 12,
            fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#C45E73",
          }}>
            {error}
          </div>
        )}

        {/* ── CTAs ── */}
        <button
          style={S.btn}
          onClick={handlePlaceOrder}
          disabled={placing || !selectedAddress}
          onMouseEnter={(e) => { if (!placing && selectedAddress) e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {placing ? "Placing Order..." : "Place Order →"}
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
