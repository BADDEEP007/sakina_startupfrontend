import { useState } from "react";
import type { Product } from "@/data/products";

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12">
          <path d="M6 1l1.2 3.6H11L8.1 6.8l1.1 3.6L6 8.4l-3.2 2 1.1-3.6L1 4.6h3.8z"
            fill={i <= Math.round(rating) ? "#f4a7b9" : "rgba(196,164,132,0.25)"} />
        </svg>
      ))}
    </div>
  );
}

// ─── ReviewSection ────────────────────────────────────────────────────────────

function ReviewSection({ product }: { product: Product }) {
  const { reviews, rating, reviewCount } = product;

  // Rating breakdown
  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating) === star).length,
    pct: reviews.length > 0
      ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  if (reviews.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🧶</div>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
          No reviews yet — be the first!
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Summary */}
      <div style={{ display: "flex", gap: 32, alignItems: "center", marginBottom: 28,
        padding: "20px 24px", background: "#fdf4e7", borderRadius: 18 }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 48,
            color: "#3d2b1f", margin: 0, lineHeight: 1 }}>{rating.toFixed(1)}</p>
          <Stars rating={rating} size={16} />
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#8a6a55",
            margin: "4px 0 0" }}>{reviewCount} reviews</p>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          {breakdown.map(({ star, count, pct }) => (
            <div key={star} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12,
                color: "#8a6a55", width: 16, textAlign: "right" }}>{star}★</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(196,164,132,0.2)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, borderRadius: 3,
                  background: "linear-gradient(90deg, #f4a7b9, #c4a484)",
                  transition: "width 600ms ease" }} />
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11,
                color: "#a08070", width: 20 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {reviews.map((r) => (
          <div key={r.id} style={{
            padding: "18px 20px", background: "#fff", borderRadius: 16,
            border: "1px solid rgba(196,164,132,0.12)",
            boxShadow: "0 2px 8px rgba(196,164,132,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <img src={r.avatar} alt={r.user} loading="lazy"
                style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover",
                  border: "2px solid rgba(244,167,185,0.3)" }} />
              <div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#3d2b1f", margin: 0 }}>{r.user}</p>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11,
                  color: "#a08070", margin: 0 }}>{r.date}</p>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Stars rating={r.rating} size={12} />
              </div>
            </div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: "#5a4a42",
              lineHeight: 1.65, margin: 0 }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ProductTabs ──────────────────────────────────────────────────────────────

const TABS = ["Description", "Details", "Reviews"] as const;
type Tab = typeof TABS[number];

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState<Tab>("Description");

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid rgba(196,164,132,0.15)",
        marginBottom: 24 }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: active === tab ? 700 : 500,
              fontSize: 14, color: active === tab ? "#d4856a" : "#8a6a55",
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 20px", position: "relative",
              transition: "color 200ms ease",
            }}
          >
            {tab}
            {tab === "Reviews" && (
              <span style={{
                marginLeft: 6, fontSize: 11, fontWeight: 700,
                background: active === tab ? "#f4a7b9" : "rgba(196,164,132,0.2)",
                color: active === tab ? "#fff" : "#8a6a55",
                borderRadius: 50, padding: "1px 7px",
                transition: "all 200ms ease",
              }}>{product.reviewCount}</span>
            )}
            {/* Active underline */}
            <div style={{
              position: "absolute", bottom: -2, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, #f4a7b9, #c4a484)",
              borderRadius: 2,
              transform: active === tab ? "scaleX(1)" : "scaleX(0)",
              transition: "transform 250ms cubic-bezier(0.4,0,0.2,1)",
              transformOrigin: "left",
            }} />
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ minHeight: 160 }}>
        {active === "Description" && (
          <div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 14.5,
              color: "#5a4a42", lineHeight: 1.8, margin: 0 }}>
              {product.description}
            </p>
          </div>
        )}

        {active === "Details" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Materials", value: product.materials },
              { label: "Care Instructions", value: product.careInstructions },
              { label: "Delivery", value: product.deliveryInfo },
              { label: "Art Type", value: product.artType },
              { label: "Category", value: product.category },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: "flex", gap: 16, padding: "12px 16px",
                background: "#fdf4e7", borderRadius: 12,
                border: "1px solid rgba(196,164,132,0.12)",
              }}>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#c4a484", minWidth: 130, flexShrink: 0 }}>{label}</span>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13,
                  color: "#5a4a42", lineHeight: 1.6 }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {active === "Reviews" && <ReviewSection product={product} />}
      </div>
    </div>
  );
}
