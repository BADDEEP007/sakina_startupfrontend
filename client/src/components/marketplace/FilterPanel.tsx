import { useState } from "react";
import { CATEGORIES, ART_TYPES, SIZES } from "@/data/products";

export interface Filters {
  categories: string[];
  artTypes: string[];
  sizes: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  customOrderOnly: boolean;
  sortBy: "popular" | "newest" | "price-asc" | "price-desc";
}

export const DEFAULT_FILTERS: Filters = {
  categories: [],
  artTypes: [],
  sizes: [],
  minPrice: 0,
  maxPrice: 200,
  minRating: 0,
  inStockOnly: false,
  customOrderOnly: false,
  sortBy: "popular",
};

interface FilterPanelProps {
  filters: Filters;
  onChange: (f: Filters) => void;
  onReset: () => void;
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: "1px solid rgba(196,164,132,0.14)",
      boxShadow: "0 2px 8px rgba(196,164,132,0.06)",
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", background: "none", border: "none", cursor: "pointer",
        }}
      >
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
          color: "#3d2b1f", letterSpacing: "0.02em" }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 220ms ease",
            color: "#c4a484", flexShrink: 0 }}>
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div style={{
        maxHeight: open ? 400 : 0, overflow: "hidden",
        transition: "max-height 280ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ padding: "0 16px 16px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Checkbox pill ────────────────────────────────────────────────────────────

function CheckPill({ label, checked, onChange }: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        fontFamily: "'Poppins',sans-serif", fontWeight: checked ? 600 : 400, fontSize: 12.5,
        color: checked ? "#fff" : "#7a5c44",
        background: checked
          ? "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)"
          : "rgba(245,230,204,0.5)",
        border: `1.5px solid ${checked ? "transparent" : "rgba(196,164,132,0.2)"}`,
        borderRadius: 50, padding: "6px 14px", cursor: "pointer",
        transition: "all 200ms ease",
        boxShadow: checked ? "0 3px 10px rgba(244,167,185,0.3)" : "none",
      }}
    >
      {label}
    </button>
  );
}

// ─── FilterPanel ──────────────────────────────────────────────────────────────

export default function FilterPanel({ filters, onChange, onReset }: FilterPanelProps) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "4px 2px 8px" }}>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 15,
          color: "#3d2b1f" }}>Filters</span>
        <button onClick={onReset} style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 11.5,
          color: "#d4856a", background: "none", border: "none", cursor: "pointer",
          textDecoration: "underline", textDecorationColor: "rgba(212,133,106,0.4)",
        }}>Reset all</button>
      </div>

      {/* Sort By */}
      <Section title="Sort By">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {([
            ["popular", "Popular"],
            ["newest", "Newest"],
            ["price-asc", "Price: Low → High"],
            ["price-desc", "Price: High → Low"],
          ] as const).map(([val, label]) => (
            <label key={val} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                border: `2px solid ${filters.sortBy === val ? "#f4a7b9" : "rgba(196,164,132,0.4)"}`,
                background: filters.sortBy === val ? "#f4a7b9" : "transparent",
                flexShrink: 0, transition: "all 180ms ease",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {filters.sortBy === val && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                )}
              </div>
              <input type="radio" checked={filters.sortBy === val}
                onChange={() => onChange({ ...filters, sortBy: val })}
                style={{ display: "none" }} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13,
                color: filters.sortBy === val ? "#3d2b1f" : "#8a6a55", fontWeight: filters.sortBy === val ? 600 : 400 }}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Price Range */}
      <Section title="Price Range">
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "#a08070",
              margin: "0 0 4px", fontWeight: 500 }}>Min ($)</p>
            <input
              type="number" min={0} max={filters.maxPrice} value={filters.minPrice}
              onChange={(e) => onChange({ ...filters, minPrice: Number(e.target.value) })}
              style={{
                width: "100%", fontFamily: "'Poppins',sans-serif", fontSize: 13,
                color: "#3d2b1f", background: "#fdf4e7",
                border: "1.5px solid rgba(196,164,132,0.25)", borderRadius: 10,
                padding: "8px 10px", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <span style={{ color: "#c4a484", marginTop: 18, fontWeight: 600 }}>—</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "#a08070",
              margin: "0 0 4px", fontWeight: 500 }}>Max ($)</p>
            <input
              type="number" min={filters.minPrice} max={500} value={filters.maxPrice}
              onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
              style={{
                width: "100%", fontFamily: "'Poppins',sans-serif", fontSize: 13,
                color: "#3d2b1f", background: "#fdf4e7",
                border: "1.5px solid rgba(196,164,132,0.25)", borderRadius: 10,
                padding: "8px 10px", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {CATEGORIES.filter((c) => c !== "All").map((cat) => (
            <CheckPill key={cat} label={cat}
              checked={filters.categories.includes(cat)}
              onChange={() => onChange({ ...filters, categories: toggle(filters.categories, cat) })}
            />
          ))}
        </div>
      </Section>

      {/* Type of Art */}
      <Section title="Type of Art">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {ART_TYPES.map((t) => (
            <CheckPill key={t} label={t}
              checked={filters.artTypes.includes(t)}
              onChange={() => onChange({ ...filters, artTypes: toggle(filters.artTypes, t) })}
            />
          ))}
        </div>
      </Section>

      {/* Size */}
      <Section title="Size">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
          {SIZES.map((s) => (
            <CheckPill key={s} label={s}
              checked={filters.sizes.includes(s)}
              onChange={() => onChange({ ...filters, sizes: toggle(filters.sizes, s) })}
            />
          ))}
        </div>
      </Section>

      {/* Rating */}
      <Section title="Rating">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[4, 3, 0].map((r) => (
            <label key={r} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
              <div style={{
                width: 16, height: 16, borderRadius: "50%",
                border: `2px solid ${filters.minRating === r ? "#f4a7b9" : "rgba(196,164,132,0.4)"}`,
                background: filters.minRating === r ? "#f4a7b9" : "transparent",
                flexShrink: 0, transition: "all 180ms ease",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {filters.minRating === r && (
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />
                )}
              </div>
              <input type="radio" checked={filters.minRating === r}
                onChange={() => onChange({ ...filters, minRating: r })}
                style={{ display: "none" }} />
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13,
                color: filters.minRating === r ? "#3d2b1f" : "#8a6a55",
                fontWeight: filters.minRating === r ? 600 : 400 }}>
                {r === 0 ? "All ratings" : `${r}★ & above`}
              </span>
            </label>
          ))}
        </div>
      </Section>

      {/* Availability */}
      <Section title="Availability">
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            ["inStockOnly", "In Stock"] as const,
            ["customOrderOnly", "Custom Order"] as const,
          ].map(([key, label]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
              <div
                onClick={() => onChange({ ...filters, [key]: !filters[key] })}
                style={{
                  width: 18, height: 18, borderRadius: 5,
                  border: `2px solid ${filters[key] ? "#f4a7b9" : "rgba(196,164,132,0.4)"}`,
                  background: filters[key] ? "#f4a7b9" : "transparent",
                  flexShrink: 0, transition: "all 180ms ease",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {filters[key] && (
                  <svg width="10" height="10" viewBox="0 0 10 10">
                    <path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                )}
              </div>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13,
                color: filters[key] ? "#3d2b1f" : "#8a6a55",
                fontWeight: filters[key] ? 600 : 400 }}>{label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
