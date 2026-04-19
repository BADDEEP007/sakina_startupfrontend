import { useState } from "react";
import { useLocation } from "wouter";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

// ─── Star rating ──────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12">
          <path
            d="M6 1l1.2 3.6H11L8.1 6.8l1.1 3.6L6 8.4l-3.2 2 1.1-3.6L1 4.6h3.8z"
            fill={i <= Math.round(rating) ? "#f4a7b9" : "rgba(196,164,132,0.25)"}
          />
        </svg>
      ))}
      <span style={{
        fontFamily: "'Poppins',sans-serif", fontSize: 11, fontWeight: 500,
        color: "#a08070", marginLeft: 3,
      }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setLocation(`/product/${product.id}`)}
      style={{
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 40px rgba(196,164,132,0.22), 0 4px 12px rgba(196,164,132,0.12)"
          : "0 4px 16px rgba(196,164,132,0.10)",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 300ms cubic-bezier(0.4,0,0.2,1)",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Image container */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden" }}>
        <img
          src={product.image}
          alt={product.name}
          draggable={false}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 500ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
          {product.isNew && (
            <span style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 10,
              color: "#fff", background: "#c8b6ff", borderRadius: 50,
              padding: "3px 9px", letterSpacing: "0.04em",
            }}>NEW</span>
          )}
          {product.isBestSeller && (
            <span style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 10,
              color: "#fff", background: "#f4a7b9", borderRadius: 50,
              padding: "3px 9px", letterSpacing: "0.04em",
            }}>★ BEST</span>
          )}
          {!product.inStock && (
            <span style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 10,
              color: "#fff", background: "rgba(0,0,0,0.45)", borderRadius: 50,
              padding: "3px 9px",
            }}>SOLD OUT</span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.stopPropagation(); setWishlisted((w) => !w); }}
          aria-label="Add to wishlist"
          style={{
            position: "absolute", top: 10, right: 10,
            width: 32, height: 32, borderRadius: "50%",
            background: "rgba(255,255,255,0.88)", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            opacity: hovered || wishlisted ? 1 : 0,
            transform: hovered || wishlisted ? "scale(1)" : "scale(0.8)",
            transition: "all 220ms ease",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill={wishlisted ? "#f4a7b9" : "none"}
            stroke={wishlisted ? "#f4a7b9" : "#c4a484"} strokeWidth="2" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* Hover overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, transparent 40%, rgba(47,31,26,0.72) 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 300ms ease",
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          padding: "0 16px 16px",
          gap: 8,
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); setLocation(`/product/${product.id}`); }}
            style={{
              flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 12,
              color: "#3d2b1f", background: "#fff", border: "none",
              borderRadius: 50, padding: "9px 12px", cursor: "pointer",
              transform: hovered ? "translateY(0)" : "translateY(8px)",
              transition: "transform 300ms ease 60ms",
            }}
          >
            View Product
          </button>
          {product.inStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart({
                  productId: product.id,
                  name: product.name,
                  image: product.image,
                  price: product.price,
                  selectedOptions: {},
                  sellerName: product.seller,
                });
              }}
              style={{
                flex: 1, fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 12,
                color: "#fff",
                background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                border: "none", borderRadius: 50, padding: "9px 12px", cursor: "pointer",
                transform: hovered ? "translateY(0)" : "translateY(8px)",
                transition: "transform 300ms ease 100ms",
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px 16px" }}>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
          color: "#3d2b1f", margin: "0 0 3px",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {product.name}
        </p>
        <p style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 11.5,
          color: "#c4a484", margin: "0 0 8px",
        }}>
          Made by {product.seller}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stars rating={product.rating} />
          <span style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15,
            color: "#d4856a",
          }}>
            ${product.price}
          </span>
        </div>
      </div>
    </div>
  );
}
