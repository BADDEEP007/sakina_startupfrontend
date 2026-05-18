import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useSeller } from "@/contexts/SellerContext";
import { useAuth } from "@/contexts/AuthContext";
import { sellersApi } from "@/lib/api";

// ─── Seller side panel ────────────────────────────────────────────────────────

function SellerPanel() {
  const { panelOpen, closePanel } = useSeller();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closePanel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [closePanel]);

  useEffect(() => {
    document.body.style.overflow = panelOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [panelOpen]);

  const menuItems = [
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      ),
      label: "Add Product",
      sub: "List a new handmade item",
      primary: true,
      onClick: () => { closePanel(); setLocation("/seller/add-product"); },
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      label: "Edit Profile",
      sub: "Update your seller info",
      primary: false,
      onClick: () => closePanel(),
    },
    {
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
          <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
      ),
      label: "View Listings",
      sub: "See all your products",
      primary: false,
      onClick: () => { closePanel(); setLocation("/marketplace"); },
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div onClick={closePanel} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(47,31,26,0.35)", backdropFilter: "blur(2px)",
        opacity: panelOpen ? 1 : 0, pointerEvents: panelOpen ? "auto" : "none",
        transition: "opacity 300ms ease",
      }} />

      {/* Panel */}
      <div role="dialog" aria-label="Seller dashboard" style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: "min(360px, 100vw)", zIndex: 201,
        background: "#fdf8f2",
        transform: panelOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 340ms cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "-8px 0 40px rgba(47,31,26,0.12)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "22px 24px", background: "#fff",
          borderBottom: "1px solid rgba(196,164,132,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16,
              color: "#3d2b1f", margin: 0 }}>Seller Dashboard</p>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#c4a484", margin: 0 }}>
              Manage your shop
            </p>
          </div>
          <button onClick={closePanel} style={{
            width: 34, height: 34, borderRadius: "50%", background: "#fdf4e7",
            border: "none", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", color: "#8a6a55",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Menu items */}
        <div style={{ flex: 1, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 18px", borderRadius: 18, cursor: "pointer",
                background: item.primary
                  ? "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)"
                  : "#fff",
                border: item.primary ? "none" : "1.5px solid rgba(196,164,132,0.2)",
                boxShadow: item.primary
                  ? "0 6px 20px rgba(244,167,185,0.3)"
                  : "0 2px 8px rgba(196,164,132,0.06)",
                transition: "all 220ms ease",
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                background: item.primary ? "rgba(255,255,255,0.25)" : "#fdf4e7",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: item.primary ? "#fff" : "#c4a484",
              }}>
                {item.icon}
              </div>
              <div>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 14,
                  color: item.primary ? "#fff" : "#3d2b1f", margin: 0 }}>{item.label}</p>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12,
                  color: item.primary ? "rgba(255,255,255,0.8)" : "#8a6a55", margin: 0 }}>{item.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(196,164,132,0.12)" }}>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11.5, color: "#a08070",
            textAlign: "center", margin: 0 }}>
            ✦ Handmade with Love marketplace
          </p>
        </div>
      </div>
    </>
  );
}

// ─── Seller Profile Page ──────────────────────────────────────────────────────

export default function SellerProfile() {
  const { profile, openPanel, loading: profileLoading } = useSeller();
  const { user, isLoggedIn } = useAuth();
  const [, setLocation] = useLocation();
  const [sellerProducts, setSellerProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      setLocation("/login");
    }
  }, [isLoggedIn, setLocation]);

  // Load seller's products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      if (!profile?.id) return;
      
      try {
        setLoadingProducts(true);
        const response = await sellersApi.getProducts(profile.id);
        setSellerProducts(response.products || []);
      } catch (err) {
        console.error("Failed to fetch seller products:", err);
        setSellerProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [profile?.id]);

  // No automatic redirect on page reload - only show onboarding button if no profile

  if (profileLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
        <Navbar />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // Show onboarding prompt if no profile
  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
        <Navbar />
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{
            background: "#fff", borderRadius: 24, padding: "48px 32px",
            boxShadow: "0 8px 32px rgba(196,164,132,0.12)",
            border: "1px solid rgba(196,164,132,0.1)",
          }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>🛍️</div>
            <h1 style={{ 
              fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 28,
              color: "#3d2b1f", margin: "0 0 16px" 
            }}>
              Become a Seller
            </h1>
            <p style={{ 
              fontFamily: "'Poppins',sans-serif", fontSize: 16, color: "#8a6a55",
              margin: "0 0 32px", lineHeight: 1.6 
            }}>
              Start your handmade business and reach customers who love unique, crafted items. 
              Set up your seller profile to begin listing your products.
            </p>
            <button
              onClick={() => setLocation("/seller/onboarding")}
              style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 16,
                color: "#fff",
                background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                border: "none", borderRadius: 50, padding: "16px 40px", cursor: "pointer",
                boxShadow: "0 8px 24px rgba(244,167,185,0.35)",
                transition: "all 220ms ease",
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = "scale(1.05)"; 
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(244,167,185,0.5)"; 
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = "scale(1)"; 
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(244,167,185,0.35)"; 
              }}
            >
              Start Selling ✦
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fdf8f2" }}>
      <Navbar />

      {/* ── Profile header ── */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(135deg, #fdf4e7 0%, #fce8f0 50%, #ede8ff 100%)",
        padding: "52px 24px 44px",
      }}>
        {/* Dot texture */}
        <div aria-hidden style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(196,164,132,0.07) 1px, transparent 1px)",
          backgroundSize: "22px 22px", pointerEvents: "none",
        }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1,
          display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" }}>
          {/* Avatar */}
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.displayName}
              style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover",
                border: "4px solid #fff", boxShadow: "0 8px 24px rgba(244,167,185,0.3)" }} />
          ) : (
            <div style={{
              width: 96, height: 96, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "4px solid #fff", boxShadow: "0 8px 24px rgba(244,167,185,0.3)",
            }}>
              <span style={{ color: "#fff", fontFamily: "'Poppins',sans-serif",
                fontWeight: 800, fontSize: 36 }}>
                {profile.displayName[0]?.toUpperCase()}
              </span>
            </div>
          )}

          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <h1 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800,
                fontSize: "clamp(22px, 3vw, 30px)", color: "#3d2b1f", margin: 0 }}>
                {profile.displayName}
              </h1>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 11,
                color: "#fff", background: "#6aab8e", borderRadius: 50, padding: "3px 10px" }}>
                ✓ Verified Seller
              </span>
            </div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13.5, color: "#8a6a55", margin: "0 0 10px" }}>
              {profile.workTypes.join(" · ")}
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button
                onClick={openPanel}
                style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#fff",
                  background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                  border: "none", borderRadius: 50, padding: "9px 22px", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(244,167,185,0.35)",
                  transition: "all 220ms ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
              >
                Open Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Products area ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px 80px" }}>
        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🧶</div>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#8a6a55" }}>
              Loading products...
            </p>
          </div>
        ) : sellerProducts.length === 0 ? (
          /* Empty state */
          <div style={{
            textAlign: "center", padding: "80px 24px",
            background: "#fff", borderRadius: 24,
            border: "2px dashed rgba(196,164,132,0.2)",
            boxShadow: "0 4px 16px rgba(196,164,132,0.06)",
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🧶</div>
            <h2 style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 22,
              color: "#3d2b1f", margin: "0 0 10px" }}>
              You haven't added any products yet
            </h2>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14.5, color: "#8a6a55",
              margin: "0 0 28px", maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
              Start listing your handmade creations and reach buyers who love unique, crafted pieces.
            </p>
            <button
              onClick={openPanel}
              style={{
                fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 15,
                color: "#fff",
                background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                border: "none", borderRadius: 50, padding: "14px 36px", cursor: "pointer",
                boxShadow: "0 6px 20px rgba(244,167,185,0.35)",
                transition: "all 220ms ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(244,167,185,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,167,185,0.35)"; }}
            >
              Add Your First Product ✦
            </button>
          </div>
        ) : (
          /* Product grid */
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 22, color: "#2A2A2A", margin: 0 }}>
                Your Listings ({sellerProducts.length})
              </h2>
              <button
                onClick={openPanel}
                style={{
                  fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
                  color: "#fff", background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
                  border: "none", borderRadius: 50, padding: "9px 20px", cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(244,167,185,0.3)",
                }}
              >
                + Add Product
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 }}>
              {sellerProducts.map((p: any) => (
                <div key={p.id} style={{
                  background: "#fff", borderRadius: 20, overflow: "hidden",
                  boxShadow: "0 4px 16px rgba(196,164,132,0.10)",
                  border: "1px solid rgba(196,164,132,0.1)",
                }}>
                  <img src={p.images?.[0] || p.image} alt={p.name}
                    style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13, color: "#2A2A2A", margin: "0 0 4px" }}>
                      {p.name}
                    </p>
                    <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#C45E73", fontWeight: 700, margin: 0 }}>
                      ${Number(p.current_price || p.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <SellerPanel />
      <Footer />
    </div>
  );
}
