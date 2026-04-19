import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import { useOrders, type Order, type OrderStatus } from "@/contexts/OrdersContext";
import { useIsMobile } from "@/hooks/useMobile";

// ─── Status tracker ───────────────────────────────────────────────────────────

const STEPS: OrderStatus[] = ["Ordered", "Packed", "Shipped", "Delivered"];

const STEP_ICONS: Record<OrderStatus, string> = {
  Ordered:   "📦",
  Packed:    "🎁",
  Shipped:   "🚚",
  Delivered: "✅",
};

function StatusTracker({ status }: { status: OrderStatus }) {
  const activeIdx = STEPS.indexOf(status);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, margin: "16px 0 8px" }}>
      {STEPS.map((step, i) => {
        const done    = i <= activeIdx;
        const current = i === activeIdx;
        return (
          <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
            {/* Node */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: current ? 36 : 28, height: current ? 36 : 28,
                borderRadius: "50%",
                background: done ? "#C45E73" : "rgba(196,164,132,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: current ? 16 : 12,
                boxShadow: current ? "0 4px 12px rgba(196,94,115,0.35)" : "none",
                transition: "all 300ms ease",
                flexShrink: 0,
              }}>
                {done ? (
                  <span style={{ fontSize: current ? 16 : 12 }}>{STEP_ICONS[step]}</span>
                ) : (
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(196,164,132,0.4)" }} />
                )}
              </div>
              <span style={{
                fontFamily: "'Inter','Poppins',sans-serif",
                fontWeight: current ? 700 : 400,
                fontSize: 10,
                color: done ? "#C45E73" : "#8a6a55",
                whiteSpace: "nowrap",
              }}>
                {step}
              </span>
            </div>
            {/* Connector */}
            {i < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2, margin: "0 4px",
                background: i < activeIdx ? "#C45E73" : "rgba(196,164,132,0.2)",
                marginBottom: 20,
                transition: "background 300ms ease",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Order card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const delivery = new Date(order.expectedDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div style={{
      background: "#fff", borderRadius: 20, padding: "20px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(196,164,132,0.12)",
      marginBottom: 16,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <div>
          <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: "#C45E73", margin: "0 0 2px" }}>
            #{order.orderNumber}
          </p>
          <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12, color: "#8a6a55", margin: 0 }}>
            Placed {date}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 16, color: "#2A2A2A", margin: "0 0 2px" }}>
            ${order.total.toFixed(2)}
          </p>
          <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11, color: "#8a6a55", margin: 0 }}>
            Est. delivery: {delivery}
          </p>
        </div>
      </div>

      {/* Status tracker */}
      <StatusTracker status={order.status} />

      {/* Item thumbnails */}
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        {order.items.slice(0, 4).map((item) => (
          <img key={item.cartId} src={item.image} alt={item.name}
            style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", border: "1.5px solid rgba(196,164,132,0.2)" }} />
        ))}
        {order.items.length > 4 && (
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: "#FAF7F4",
            border: "1.5px solid rgba(196,164,132,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 12, color: "#4A4A4A",
          }}>
            +{order.items.length - 4}
          </div>
        )}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        style={{
          marginTop: 12, background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: "#C45E73",
          padding: 0, display: "flex", alignItems: "center", gap: 4,
        }}
      >
        {expanded ? "Hide items ▲" : `View all ${order.items.length} item${order.items.length !== 1 ? "s" : ""} ▼`}
      </button>

      {expanded && (
        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
          {order.items.map((item) => (
            <div key={item.cartId} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <img src={item.image} alt={item.name}
                style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 600, fontSize: 12, color: "#2A2A2A", margin: 0 }}>
                  {item.name}
                </p>
                <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 11, color: "#8a6a55", margin: 0 }}>
                  Qty: {item.quantity} · ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Orders page ──────────────────────────────────────────────────────────────

export default function Orders() {
  const { orders } = useOrders();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();
  const [focused, setFocused] = useState(false);

  const filtered = orders.filter((o) =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "#FAF7F4" }}>
      <Navbar />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "20px 16px 100px" : "36px 24px 80px" }}>

        {/* Header */}
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 26, color: "#2A2A2A", margin: "0 0 4px" }}>
          My Orders
        </h1>
        <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: "0 0 20px" }}>
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(196,164,132,0.7)" strokeWidth="2" strokeLinecap="round"
            style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text" placeholder="Search by order number…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            style={{
              width: "100%", fontFamily: "'Inter','Poppins',sans-serif", fontSize: 14, color: "#2A2A2A",
              background: focused ? "#fff" : "#FAF7F4",
              border: `1.5px solid ${focused ? "#C45E73" : "rgba(196,164,132,0.3)"}`,
              borderRadius: 50, padding: "12px 16px 12px 40px", outline: "none",
              boxShadow: focused ? "0 0 0 3px rgba(196,94,115,0.12)" : "none",
              transition: "all 200ms ease", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Orders list */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", borderRadius: 20, border: "2px dashed rgba(196,164,132,0.2)" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧶</div>
            <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 20, color: "#2A2A2A", margin: "0 0 8px" }}>
              {search ? "No orders found" : "No orders yet"}
            </h2>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 13, color: "#4A4A4A", margin: "0 0 20px" }}>
              {search ? "Try a different order number." : "Your completed orders will appear here."}
            </p>
            {!search && (
              <button
                onClick={() => setLocation("/marketplace")}
                style={{
                  padding: "12px 28px", background: "#C45E73", color: "#fff",
                  fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  borderRadius: 50, border: "none", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(196,94,115,0.3)",
                }}
              >
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          filtered.map((order) => <OrderCard key={order.orderNumber} order={order} />)
        )}
      </div>
    </div>
  );
}
