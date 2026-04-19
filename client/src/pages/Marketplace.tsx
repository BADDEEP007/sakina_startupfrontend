import { useState, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import FilterPanel, { Filters, DEFAULT_FILTERS } from "@/components/marketplace/FilterPanel";
import CategorySlider from "@/components/marketplace/CategorySlider";
import { PRODUCTS } from "@/data/products";
import { useIsMobile } from "@/hooks/useMobile";

// ─── Search bar ───────────────────────────────────────────────────────────────

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative", maxWidth: 560, width: "100%", margin: "0 auto" }}>
      <svg
        width="18" height="18" viewBox="0 0 24 24" fill="none"
        stroke="rgba(196,164,132,0.7)" strokeWidth="2" strokeLinecap="round"
        style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      >
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder="Search handmade products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 14,
          color: "#3d2b1f", background: focused ? "#fff" : "#fdf4e7",
          border: `1.5px solid ${focused ? "#f4a7b9" : "rgba(196,164,132,0.25)"}`,
          borderRadius: 50, padding: "13px 20px 13px 46px",
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(244,167,185,0.15), 0 4px 16px rgba(196,164,132,0.12)" : "0 2px 8px rgba(196,164,132,0.08)",
          transition: "all 220ms ease", boxSizing: "border-box",
        }}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "#c4a484",
            display: "flex", alignItems: "center",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Mobile filter drawer ─────────────────────────────────────────────────────

function FilterDrawer({ open, onClose, filters, onChange, onReset }: {
  open: boolean; onClose: () => void;
  filters: Filters; onChange: (f: Filters) => void; onReset: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, background: "rgba(47,31,26,0.4)",
          zIndex: 100, opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none",
          transition: "opacity 280ms ease",
        }}
      />
      {/* Drawer */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: "min(340px, 90vw)",
        background: "#fdf8f2", zIndex: 101, overflowY: "auto",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 320ms cubic-bezier(0.4,0,0.2,1)",
        padding: "24px 16px",
        boxShadow: "4px 0 24px rgba(47,31,26,0.12)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 17, color: "#3d2b1f" }}>
            Filters
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#c4a484" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <FilterPanel filters={filters} onChange={onChange} onReset={onReset} />
      </div>
    </>
  );
}

// ─── Marketplace page ─────────────────────────────────────────────────────────

export default function Marketplace() {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleCategorySelect = useCallback((cat: string) => {
    setActiveCategory(cat);
    setFilters((f) => ({
      ...f,
      categories: cat === "All" ? [] : [cat],
    }));
  }, []);

  const handleReset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setActiveCategory("All");
    setSearch("");
  }, []);

  // ── Filtering logic ──────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.seller.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.categories.length > 0) {
      list = list.filter((p) => filters.categories.includes(p.category));
    }

    // Art type
    if (filters.artTypes.length > 0) {
      list = list.filter((p) => filters.artTypes.includes(p.artType));
    }

    // Size
    if (filters.sizes.length > 0) {
      list = list.filter((p) => filters.sizes.includes(p.size));
    }

    // Price
    list = list.filter((p) => p.price >= filters.minPrice && p.price <= filters.maxPrice);

    // Rating
    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    // Availability
    if (filters.inStockOnly) list = list.filter((p) => p.inStock);
    if (filters.customOrderOnly) list = list.filter((p) => p.size === "Custom");

    // Sort
    switch (filters.sortBy) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "newest":     list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
      case "popular":    list.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }

    return list;
  }, [search, filters]);

  // Active filter count for badge
  const activeFilterCount = [
    filters.categories.length > 0,
    filters.artTypes.length > 0,
    filters.sizes.length > 0,
    filters.minPrice > 0 || filters.maxPrice < 200,
    filters.minRating > 0,
    filters.inStockOnly,
    filters.customOrderOnly,
  ].filter(Boolean).length;

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
      <Navbar />

      {/* ── Slim hero banner ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #fdf4e7 0%, #fce8f0 50%, #ede8ff 100%)",
        padding: "52px 24px 44px",
        textAlign: "center",
      }}>
        {/* Dot texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(196,164,132,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px", pointerEvents: "none",
        }} />
        {/* Blobs */}
        <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(244,167,185,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", bottom: -30, left: -30, width: 160, height: 160,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(200,182,255,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ height: 1, width: 28, background: "linear-gradient(90deg, transparent, #c4a484)" }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 11,
              letterSpacing: "0.14em", textTransform: "uppercase", color: "#c4a484" }}>
              Handmade Marketplace
            </span>
            <div style={{ height: 1, width: 28, background: "linear-gradient(90deg, #c4a484, transparent)" }} />
          </div>
          <h1 style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 4vw, 42px)", color: "#3d2b1f",
            margin: "0 0 10px", lineHeight: 1.2,
          }}>
            Explore Handmade Creations
          </h1>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 15,
            color: "#8a6a55", margin: "0 0 28px" }}>
            Discover unique crochet products crafted with care
          </p>

          {/* Search bar */}
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </div>

      {/* ── Category slider ── */}
      <div style={{ background: "#fdf8f2", padding: "18px 24px 14px",
        borderBottom: "1px solid rgba(196,164,132,0.12)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <CategorySlider active={activeCategory} onSelect={handleCategorySelect} />
        </div>
      </div>

      {/* ── Main layout ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px 60px" }}>

        {/* Mobile: filter button + result count row */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                color: "#3d2b1f",
                background: activeFilterCount > 0
                  ? "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)"
                  : "#fff",
                color: activeFilterCount > 0 ? "#fff" : "#3d2b1f",
                border: "1.5px solid rgba(196,164,132,0.25)",
                borderRadius: 50, padding: "9px 18px", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(196,164,132,0.1)",
              } as React.CSSProperties}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#8a6a55" }}>
              {filtered.length} products
            </span>
          </div>
        )}

        <div style={{ display: "flex", gap: 28, alignItems: "flex-start" }}>

          {/* ── Desktop filter panel ── */}
          {!isMobile && (
            <div style={{ width: 240, flexShrink: 0, position: "sticky", top: 88 }}>
              <FilterPanel filters={filters} onChange={setFilters} onReset={handleReset} />
            </div>
          )}

          {/* ── Product grid ── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Result count + active filters */}
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 20 }}>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: "#8a6a55", margin: 0 }}>
                  Showing <strong style={{ color: "#3d2b1f" }}>{filtered.length}</strong> products
                </p>
                {activeFilterCount > 0 && (
                  <button onClick={handleReset} style={{
                    fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12,
                    color: "#d4856a", background: "rgba(244,167,185,0.1)",
                    border: "1px solid rgba(244,167,185,0.3)", borderRadius: 50,
                    padding: "5px 14px", cursor: "pointer",
                  }}>
                    Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
                  </button>
                )}
              </div>
            )}

            {/* Grid */}
            {filtered.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}>
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: "center", padding: "80px 24px",
                background: "#fff", borderRadius: 20,
                border: "1px solid rgba(196,164,132,0.12)",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
                <h3 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 18,
                  color: "#3d2b1f", margin: "0 0 8px" }}>No products found</h3>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55", margin: "0 0 20px" }}>
                  Try adjusting your filters or search term.
                </p>
                <button onClick={handleReset} style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#fff",
                  background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                  border: "none", borderRadius: 50, padding: "11px 28px", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(244,167,185,0.3)",
                }}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => { handleReset(); setDrawerOpen(false); }}
      />

      <Footer />
    </div>
  );
}
