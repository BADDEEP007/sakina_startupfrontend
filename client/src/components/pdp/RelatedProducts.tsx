import { useRef } from "react";
import { useLocation } from "wouter";
import type { Product } from "@/data/products";
import ProductCard from "@/components/marketplace/ProductCard";

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const [, setLocation] = useLocation();
  if (products.length === 0) return null;

  return (
    <section style={{ marginTop: 64 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 24 }}>
        <div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22,
            color: "#3d2b1f", margin: 0 }}>You might also like</h2>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#8a6a55",
            margin: "4px 0 0" }}>More handmade pieces from our community</p>
        </div>
        <button
          onClick={() => setLocation("/marketplace")}
          style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13,
            color: "#d4856a", background: "rgba(244,167,185,0.1)",
            border: "1px solid rgba(244,167,185,0.3)", borderRadius: 50,
            padding: "8px 18px", cursor: "pointer",
            transition: "all 200ms ease",
          }}
        >
          View all →
        </button>
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div
        className="related-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 18,
        }}
      >
        {products.slice(0, 4).map((p) => (
          <div key={p.id} onClick={() => setLocation(`/product/${p.id}`)}
            style={{ cursor: "pointer" }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .related-grid {
            display: flex !important;
            overflow-x: auto;
            gap: 14px !important;
            padding-bottom: 8px;
            scrollbar-width: none;
          }
          .related-grid::-webkit-scrollbar { display: none; }
          .related-grid > div { flex-shrink: 0; width: 200px; }
        }
      `}</style>
    </section>
  );
}
