import { useRef, useState } from "react";
import { CATEGORIES } from "@/data/products";

// Category colors matching the brand palette
const CATEGORY_COLORS: Record<string, { base: string; highlight: string }> = {
  All:         { base: "#c4a484", highlight: "#f5e6cc" },
  Sweaters:    { base: "#d4856a", highlight: "#f5c4b0" },
  Bags:        { base: "#b07cc6", highlight: "#dfc8f5" },
  Accessories: { base: "#c4a45a", highlight: "#f5e6cc" },
  Hats:        { base: "#e07a8a", highlight: "#f4c4cc" },
  Blankets:    { base: "#6aab8e", highlight: "#b8e0cc" },
};

interface CategorySliderProps {
  active: string;
  onSelect: (cat: string) => void;
}

export default function CategorySlider({ active, onSelect }: CategorySliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{ position: "relative" }}>
      {/* Left fade */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 32,
        background: "linear-gradient(90deg, #fdf8f2, transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />
      {/* Right fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 32,
        background: "linear-gradient(270deg, #fdf8f2, transparent)",
        pointerEvents: "none", zIndex: 2,
      }} />

      <div
        ref={scrollRef}
        style={{
          display: "flex", gap: 10, overflowX: "auto", padding: "4px 8px",
          scrollbarWidth: "none", msOverflowStyle: "none",
        }}
        className="hide-scrollbar"
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat;
          const colors = CATEGORY_COLORS[cat] ?? { base: "#c4a484", highlight: "#f5e6cc" };
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              style={{
                flexShrink: 0,
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'Poppins',sans-serif", fontWeight: isActive ? 700 : 500,
                fontSize: 13,
                color: isActive ? "#fff" : "#7a5c44",
                background: isActive
                  ? `linear-gradient(135deg, ${colors.base} 0%, ${colors.highlight} 100%)`
                  : "rgba(245,230,204,0.5)",
                border: `1.5px solid ${isActive ? "transparent" : "rgba(196,164,132,0.2)"}`,
                borderRadius: 50, padding: "8px 18px",
                cursor: "pointer",
                boxShadow: isActive ? `0 4px 14px ${colors.base}55` : "none",
                transition: "all 220ms cubic-bezier(0.34,1.56,0.64,1)",
                transform: isActive ? "scale(1.04)" : "scale(1)",
              }}
            >
              {/* Yarn ball dot */}
              <div style={{
                width: 10, height: 10, borderRadius: "50%",
                background: isActive ? "rgba(255,255,255,0.6)" : colors.base,
                flexShrink: 0,
              }} />
              {cat}
            </button>
          );
        })}
      </div>

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}
