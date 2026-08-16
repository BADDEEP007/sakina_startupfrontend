import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/pdp/ProductGallery";
import ProductTabs from "@/components/pdp/ProductTabs";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import { productsApi, reviewsApi } from "@/lib/api";
import { useIsMobile } from "@/hooks/useMobile";
import { useCart } from "@/contexts/CartContext";

// ─── Stars ────────────────────────────────────────────────────────────────────

function Stars({ rating, count }: { rating: number; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 12 12">
          <path d="M6 1l1.2 3.6H11L8.1 6.8l1.1 3.6L6 8.4l-3.2 2 1.1-3.6L1 4.6h3.8z"
            fill={i <= Math.round(rating) ? "#f4a7b9" : "rgba(196,164,132,0.25)"} />
        </svg>
      ))}
      <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 13,
        color: "#8a6a55" }}>{rating.toFixed(1)}</span>
      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#a08070" }}>
        ({count} reviews)
      </span>
    </div>
  );
}

// ─── Option pill ──────────────────────────────────────────────────────────────

function OptionPill({ label, selected, onClick }: {
  label: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Poppins',sans-serif", fontWeight: selected ? 700 : 500, fontSize: 13,
        color: selected ? "#fff" : "#7a5c44",
        background: selected ? "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)" : "rgba(245,230,204,0.5)",
        border: `1.5px solid ${selected ? "transparent" : "rgba(196,164,132,0.25)"}`,
        borderRadius: 50, padding: "7px 18px", cursor: "pointer",
        boxShadow: selected ? "0 4px 12px rgba(244,167,185,0.3)" : "none",
        transition: "all 220ms cubic-bezier(0.34,1.56,0.64,1)",
        transform: selected ? "scale(1.04)" : "scale(1)",
      }}
    >
      {label}
    </button>
  );
}

// ─── Color swatch ─────────────────────────────────────────────────────────────

function ColorSwatch({ name, hex, selected, onClick }: {
  name: string; hex: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={name}
      aria-label={name}
      style={{
        width: 32, height: 32, borderRadius: "50%", background: hex,
        border: `3px solid ${selected ? "#f4a7b9" : "rgba(196,164,132,0.2)"}`,
        cursor: "pointer", padding: 0,
        boxShadow: selected ? `0 0 0 2px #fff, 0 0 0 4px #f4a7b9` : "0 2px 6px rgba(0,0,0,0.1)",
        transform: selected ? "scale(1.15)" : "scale(1)",
        transition: "all 220ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
    />
  );
}

// ─── Trust badge ──────────────────────────────────────────────────────────────

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
      flex: 1, minWidth: 70 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fdf4e7",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(196,164,132,0.2)" }}>
        {icon}
      </div>
      <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 10.5,
        color: "#8a6a55", textAlign: "center", lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

// ─── CTA button ───────────────────────────────────────────────────────────────

function CTAButton({ label, primary, disabled, onClick }: {
  label: string; primary?: boolean; disabled?: boolean; onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 400);
    onClick?.();
  };

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      disabled={disabled}
      style={{
        flex: 1,
        fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14.5,
        color: primary ? "#fff" : "#3d2b1f",
        background: disabled
          ? "rgba(196,164,132,0.2)"
          : primary
            ? hovered
              ? "linear-gradient(135deg, #e8909f 0%, #b8946a 100%)"
              : "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)"
            : hovered ? "#fdf4e7" : "#fff",
        border: primary ? "none" : "1.5px solid rgba(196,164,132,0.3)",
        borderRadius: 50, padding: "15px 20px", cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: disabled ? "none" : primary
          ? hovered ? "0 12px 28px rgba(244,167,185,0.45)" : "0 6px 18px rgba(244,167,185,0.3)"
          : hovered ? "0 6px 16px rgba(196,164,132,0.15)" : "0 2px 8px rgba(196,164,132,0.08)",
        transform: clicked ? "scale(0.97)" : hovered && !disabled ? "scale(1.02)" : "scale(1)",
        transition: "all 240ms cubic-bezier(0.34,1.56,0.64,1)",
        letterSpacing: "0.02em",
      }}
    >
      {disabled ? "Out of Stock" : label}
    </button>
  );
}

// ─── ProductDetail page ───────────────────────────────────────────────────────

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Fetch product and related products
  useEffect(() => {
    const fetchProduct = async () => {
      if (!params.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch
        const productData = await productsApi.getById(params.id);
        setProduct(productData.product);
        
        // Fetch related products (same category)
        if (productData.product?.category) {
          const relatedData = await productsApi.getAll({
            category: productData.product.category,
            limit: 5,
          });
          const relatedProducts = (relatedData.products || []).filter(
            (p: any) => p.id !== params.id
          ).slice(0, 4);
          setRelated(relatedProducts);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to load product. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.availableSizes?.[0] || product.size || "");
      setSelectedColor(product.availableColors?.[0]?.name || "");
      setQty(1);
      setAddedToCart(false);
    }
  }, [product?.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      await addToCart({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.current_price || product.price,
        quantity: qty,
        selectedOptions: {
          size: selectedSize || undefined,
          color: selectedColor || undefined,
        },
        sellerName: product.seller_name || product.seller,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
            Loading product...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
        <Navbar />
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 20, color: "#3d2b1f", margin: "0 0 8px" }}>
            {error || "Product not found"}
          </h2>
          <button onClick={() => setLocation("/marketplace")} style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
            color: "#fff", background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
            border: "none", borderRadius: 50, padding: "11px 28px", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(244,167,185,0.3)", marginTop: 20,
          }}>
            Back to Marketplace
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
      <Navbar />

      {/* ── Breadcrumb ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { label: "Home", href: "/" },
            { label: "Marketplace", href: "/marketplace" },
            { label: product.category, href: "/marketplace" },
            { label: product.name, href: null },
          ].map((crumb, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {crumb.href ? (
                <button onClick={() => setLocation(crumb.href!)}
                  style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12, color: "#C45E73",
                    background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  {crumb.label}
                </button>
              ) : (
                <span style={{ fontFamily: "'Inter','Poppins',sans-serif", fontSize: 12,
                  color: "#4A4A4A", fontWeight: 600 }}>{crumb.label}</span>
              )}
              {i < arr.length - 1 && (
                <span style={{ color: "rgba(196,164,132,0.5)", fontSize: 12 }}>›</span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main two-column layout ── */}
      <div
        className="pdp-grid"
        style={{
          maxWidth: 1200, margin: "0 auto",
          padding: "24px 24px 60px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* ════ LEFT — Gallery ════ */}
        <div style={{ position: "sticky", top: 88 }}>
          <ProductGallery images={product.images || product.gallery || [product.image]} name={product.name} />
        </div>

        {/* ════ RIGHT — Info + Actions ════ */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8 }}>
            {product.is_new && (
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 10.5,
                color: "#fff", background: "#c8b6ff", borderRadius: 50, padding: "4px 12px" }}>NEW</span>
            )}
            {product.is_bestseller && (
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 10.5,
                color: "#fff", background: "#f4a7b9", borderRadius: 50, padding: "4px 12px" }}>★ BEST SELLER</span>
            )}
            {(product.stock || 0) === 0 && (
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 10.5,
                color: "#fff", background: "rgba(160,128,112,0.7)", borderRadius: 50, padding: "4px 12px" }}>SOLD OUT</span>
            )}
          </div>

          {/* Name */}
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
              fontSize: "clamp(22px, 3vw, 32px)", color: "#2A2A2A",
              margin: "0 0 8px", lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* Seller */}
            <button
              style={{ fontFamily: "'Inter', 'Poppins', sans-serif", fontWeight: 500, fontSize: 13.5,
                color: "#C45E73", background: "none", border: "none", cursor: "pointer",
                padding: 0, textDecoration: "underline",
                textDecorationColor: "rgba(196, 94, 115, 0.4)" }}
            >
              Made by {product.seller_name || product.seller}
            </button>
          </div>

          {/* Rating */}
          <Stars rating={product.rating || 0} count={product.review_count || 0} />

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800,
              fontSize: 34, color: "#d4856a", lineHeight: 1 }}>
              ${product.current_price || product.price}
            </span>
            <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13,
              color: "#a08070" }}>USD · Free shipping over $50</span>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(196,164,132,0.15)" }} />

          {/* Size selector */}
          {(product.availableSizes || []).length > 0 && (
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                color: "#3d2b1f", margin: "0 0 10px" }}>
                Size: <span style={{ fontWeight: 500, color: "#8a6a55" }}>{selectedSize}</span>
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {product.availableSizes.map((s: string) => (
                  <OptionPill key={s} label={s} selected={selectedSize === s}
                    onClick={() => setSelectedSize(s)} />
                ))}
              </div>
            </div>
          )}

          {/* Color selector */}
          {(product.availableColors || []).length > 0 && (
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                color: "#3d2b1f", margin: "0 0 10px" }}>
                Color: <span style={{ fontWeight: 500, color: "#8a6a55" }}>{selectedColor}</span>
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {product.availableColors.map((c: any) => (
                  <ColorSwatch key={c.name} name={c.name} hex={c.hex}
                    selected={selectedColor === c.name}
                    onClick={() => setSelectedColor(c.name)} />
                ))}
              </div>
            </div>
          )}

          {/* Quantity + CTA */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: 0,
              background: "#fff", borderRadius: 50, border: "1.5px solid rgba(196,164,132,0.25)",
              overflow: "hidden", boxShadow: "0 2px 8px rgba(196,164,132,0.08)" }}>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                style={{ width: 40, height: 48, background: "none", border: "none",
                  cursor: "pointer", fontSize: 18, color: "#c4a484",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
                color: "#3d2b1f", minWidth: 28, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}
                style={{ width: 40, height: 48, background: "none", border: "none",
                  cursor: "pointer", fontSize: 18, color: "#c4a484",
                  display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => setWishlisted((w) => !w)}
              aria-label="Add to wishlist"
              style={{
                width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                background: wishlisted ? "rgba(244,167,185,0.15)" : "#fff",
                border: `1.5px solid ${wishlisted ? "#f4a7b9" : "rgba(196,164,132,0.25)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 220ms ease",
                boxShadow: "0 2px 8px rgba(196,164,132,0.08)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"
                fill={wishlisted ? "#f4a7b9" : "none"}
                stroke={wishlisted ? "#f4a7b9" : "#c4a484"} strokeWidth="2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          {/* Add to Cart + Buy Now */}
          <div style={{ display: "flex", gap: 10 }}>
            <CTAButton
              label={addedToCart ? "✓ Added!" : "Add to Cart"}
              primary
              disabled={(product.stock || 0) === 0}
              onClick={handleAddToCart}
            />
            <CTAButton label="Buy Now" disabled={(product.stock || 0) === 0} />
          </div>

          {/* Trust badges */}
          <div style={{
            display: "flex", gap: 8, padding: "16px 20px",
            background: "#fff", borderRadius: 18,
            border: "1px solid rgba(196,164,132,0.12)",
            boxShadow: "0 2px 8px rgba(196,164,132,0.06)",
          }}>
            <TrustBadge label="100% Handcrafted" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4a484" strokeWidth="1.8" strokeLinecap="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
              </svg>
            } />
            <TrustBadge label="Secure Checkout" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4a484" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            } />
            <TrustBadge label="Verified Seller" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4a484" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            } />
            <TrustBadge label="Customizable" icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4a484" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            } />
          </div>

          {/* Seller info card */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14, padding: "16px 20px",
            background: "#fff", borderRadius: 18,
            border: "1px solid rgba(196,164,132,0.12)",
            boxShadow: "0 2px 8px rgba(196,164,132,0.06)",
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 3px 10px rgba(244,167,185,0.3)",
            }}>
              <span style={{ color: "#fff", fontFamily: "'Poppins',sans-serif",
                fontWeight: 800, fontSize: 16 }}>
                {(product.seller_name || product.seller || "S")[0]}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                color: "#3d2b1f", margin: 0 }}>{product.seller_name || product.seller}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <svg width="12" height="12" viewBox="0 0 12 12">
                  <path d="M6 1l1.2 3.6H11L8.1 6.8l1.1 3.6L6 8.4l-3.2 2 1.1-3.6L1 4.6h3.8z" fill="#f4a7b9" />
                </svg>
                <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#8a6a55" }}>
                  {product.seller_rating || product.sellerRating || 5.0} · {product.seller_sales || product.sellerSales || 0} sales
                </span>
              </div>
            </div>
            <button style={{
              fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 12,
              color: "#d4856a", background: "rgba(244,167,185,0.1)",
              border: "1px solid rgba(244,167,185,0.3)", borderRadius: 50,
              padding: "7px 16px", cursor: "pointer", whiteSpace: "nowrap",
            }}>
              View Shop
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 60px" }}>
        <ProductTabs product={product} />
        <RelatedProducts products={related} />
      </div>

      {/* ── Mobile sticky bottom bar ── */}
      {isMobile && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          background: "rgba(253,248,242,0.96)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(196,164,132,0.2)",
          padding: "12px 16px",
          display: "flex", gap: 10,
          boxShadow: "0 -4px 20px rgba(196,164,132,0.12)",
        }}>
          <CTAButton label={addedToCart ? "✓ Added!" : "Add to Cart"} primary
            disabled={(product.stock || 0) === 0} onClick={handleAddToCart} />
          <CTAButton label="Buy Now" disabled={(product.stock || 0) === 0} />
        </div>
      )}

      {/* Responsive grid */}
      <style>{`
        @media (max-width: 768px) {
          .pdp-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
          .pdp-grid > div:first-child {
            position: static !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
