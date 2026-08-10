import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";


export default function Hero() {
  const [, setLocation] = useLocation();
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop' | 'large'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewport('mobile');
      } else if (width < 1024) {
        setViewport('tablet');
      } else if (width < 1440) {
        setViewport('desktop');
      } else {
        setViewport('large');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  /* ─────────────────────────────────────────────────────────────────────────
     MOBILE HERO (< 768px)
     Matches reference image exactly:
     - Warm taupe full-bleed background (#C9A99A gradient)
     - Frosted white card in the centre (rounded-3xl, backdrop-blur)
     - Three crochet product photos arranged around the card
     - H1 "Feedle with love" — Playfair, dark charcoal, centred
     - Body copy — Inter, centred
     - Primary pill button: #C45E73 pink, white text, arrow
     - Secondary pill button: warm taupe fill, dark text
  ───────────────────────────────────────────────────────────────────────── */
  if (viewport === 'mobile') {
    return (
      <section
        id="hero"
        style={{
          position: "relative",
          width: "100%",
          /* ── COMPACTION: 68vh max, not full screen ── */
          minHeight: "68svh",
          maxHeight: "72svh",
          overflow: "hidden",
          background: "linear-gradient(160deg, #C9A99A 0%, #D4B5A8 40%, #E8D5CC 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          /* Tighter vertical padding */
          padding: "56px 20px 36px",
        }}
      >
        {/* ── Top-left logo ── */}
        <div style={{
          position: "absolute", top: 14, left: 18, zIndex: 30,
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%", background: "#C45E73",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 10px rgba(196,94,115,0.40)",
          }}>
            <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>✦</span>
          </div>
          <div style={{ lineHeight: 1 }}>
            <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 14, color: "#fff", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>Feedle</p>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 400, fontSize: 9, color: "rgba(255,255,255,0.80)", margin: 0, letterSpacing: "0.06em" }}>with Love</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BACKGROUND IMAGE TILES
            All images replaced with premium
            Feedle / crochet / thread-art content
        ══════════════════════════════════════════ */}

        {/* 1. Top-right — intricate thread-art / colorful abstract piece */}
        <div style={{
          position: "absolute", top: -20, right: -24,
          width: 155, height: 155, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
        }}>
          <img
            src="images/featuredsection.jpeg"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 2. Top-left — macro crocheted coaster / patterned threadwork patch */}
        <div style={{
          position: "absolute", top: -8, left: -36,
          width: 130, height: 130, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 18px rgba(0,0,0,0.10)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=400&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 3. Mid-left — chunky knit blanket, large, bleeds off edge */}
        <div style={{
          position: "absolute", top: "32%", left: -58,
          width: 210, height: 210, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 4. Bottom-left — patterned thread keychains */}
        <div style={{
          position: "absolute", bottom: 32, left: -16,
          width: 115, height: 115, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 5. Mid-right — macrame wall hanging / complex textile */}
        <div style={{
          position: "absolute", top: "33%", right: -20,
          width: 140, height: 140, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 6. Bottom-right — crochet amigurumi / color-blocked crochet bag */}
        <div style={{
          position: "absolute", bottom: 28, right: -24,
          width: 130, height: 130, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 7. Upper-mid-right — small accent: crochet flowers */}
        <div style={{
          position: "absolute", top: "13%", right: 8,
          width: 78, height: 78, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 3px 10px rgba(0,0,0,0.10)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=300&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* 8. Lower-mid-left — small accent: woven textile close-up */}
        <div style={{
          position: "absolute", bottom: "20%", left: 6,
          width: 68, height: 68, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 3px 8px rgba(0,0,0,0.10)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* ── Frosted white card — COMPACT ── */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 340,
            background: "rgba(255,255,255,0.84)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: 28,
            /* Tighter padding */
            padding: "24px 24px 22px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)",
            border: "1px solid rgba(255,255,255,0.65)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* H1 — tighter line-height */}
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontWeight: 700,
            fontSize: "1.9rem",
            lineHeight: 1.1,
            color: "#2A2A2A",
            margin: "0 0 8px",   /* compressed mb */
            letterSpacing: "-0.01em",
          }}>
            Handmade 
            
           <span className="block text-accent mt-2">
            Made for You
            
            </span> 
          </h1>

          {/* Body — compressed mb */}
          <p style={{
            fontFamily: "'Inter','Poppins',sans-serif",
            fontWeight: 400,
            fontSize: "0.875rem",
            lineHeight: 1.5,
            color: "#4A4A4A",
            margin: "0 0 18px",  /* compressed mb */
            maxWidth: 260,
          }}>
            Discover handcrafted crochet pieces made with passion and care.
          </p>

          {/* Primary CTA - Enhanced */}
          <button
            onClick={() => setLocation("/marketplace")}
            style={{
              width: "100%",
              padding: "20px 32px",
              background: "linear-gradient(135deg, #C45E73 0%, #E07A8A 50%, #F4A7B9 100%)",
              color: "#fff",
              fontFamily: "'Inter','Poppins',sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 14,
              boxShadow: "0 12px 32px rgba(196,94,115,0.5), 0 6px 12px rgba(196,94,115,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
              transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
            onTouchStart={(e) => { 
              e.currentTarget.style.transform = "scale(0.96) translateY(2px)"; 
              e.currentTarget.style.boxShadow = "0 6px 16px rgba(196,94,115,0.4)";
            }}
            onTouchEnd={(e) => { 
              e.currentTarget.style.transform = "scale(1) translateY(0)"; 
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(196,94,115,0.5), 0 6px 12px rgba(196,94,115,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
              e.currentTarget.style.boxShadow = "0 20px 48px rgba(196,94,115,0.6), 0 10px 20px rgba(196,94,115,0.4), inset 0 1px 0 rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow = "0 12px 32px rgba(196,94,115,0.5), 0 6px 12px rgba(196,94,115,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
            }}
          >
            <span style={{ position: "relative", zIndex: 2, fontWeight: 800 }}>Shop New Arrivals</span>
            <ArrowRight size={20} style={{ position: "relative", zIndex: 2, transition: "transform 300ms ease" }} />
            {/* Enhanced shine effect */}
            <div style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "100%",
              height: "100%",
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              transition: "left 800ms ease",
            }} />
            {/* Subtle pattern overlay */}
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              zIndex: 1,
            }} />
          </button>

          {/* Secondary CTA - Enhanced */}
          <button
            onClick={() => setLocation("/marketplace")}
            style={{
              width: "100%",
              padding: "20px 32px",
              background: "rgba(255,255,255,0.95)",
              color: "#2A2A2A",
              fontFamily: "'Inter','Poppins',sans-serif",
              fontWeight: 700,
              fontSize: "1.1rem",
              borderRadius: 50,
              border: "2px solid rgba(196,94,115,0.3)",
              cursor: "pointer",
              backdropFilter: "blur(16px)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(196,94,115,0.1)",
              transition: "all 400ms cubic-bezier(0.4, 0, 0.2, 1)",
              position: "relative",
              overflow: "hidden",
            }}
            onTouchStart={(e) => { 
              e.currentTarget.style.transform = "scale(0.96) translateY(2px)"; 
              e.currentTarget.style.background = "rgba(196,94,115,0.12)";
              e.currentTarget.style.borderColor = "rgba(196,94,115,0.5)";
            }}
            onTouchEnd={(e) => { 
              e.currentTarget.style.transform = "scale(1) translateY(0)"; 
              e.currentTarget.style.background = "rgba(255,255,255,0.95)";
              e.currentTarget.style.borderColor = "rgba(196,94,115,0.3)";
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.03)";
              e.currentTarget.style.background = "rgba(196,94,115,0.08)";
              e.currentTarget.style.borderColor = "rgba(196,94,115,0.5)";
              e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(196,94,115,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.background = "rgba(255,255,255,0.95)";
              e.currentTarget.style.borderColor = "rgba(196,94,115,0.3)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(196,94,115,0.1)";
            }}
          >
            <span style={{ position: "relative", zIndex: 2, fontWeight: 700 }}>Explore Collections</span>
          </button>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     TABLET HERO (768px - 1024px)
     Hybrid layout between mobile and desktop:
     - Reduced height compared to desktop
     - Simplified background elements
     - Centered content with medium sizing
     - Side-by-side buttons on larger tablets
  ───────────────────────────────────────────────────────────────────────── */
  if (viewport === 'tablet') {
    return (
      <section
        id="hero"
        className="relative w-full flex items-center justify-center overflow-hidden"
        style={{
          minHeight: "75vh",
          maxHeight: "85vh",
          background: "linear-gradient(160deg, #C9A99A 0%, #D4B5A8 40%, #E8D5CC 100%)",
          padding: "60px 24px 40px",
        }}
      >
        {/* Simplified background elements for tablet */}
        <div style={{
          position: "absolute", top: -30, right: -40,
          width: 180, height: 180, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1585914924626-15adac1e6402?w=400&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{
          position: "absolute", top: "25%", left: -60,
          width: 200, height: 200, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div style={{
          position: "absolute", bottom: -20, right: -30,
          width: 150, height: 150, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=90"
            alt="" aria-hidden
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Main content card */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: 480,
            background: "rgba(255,255,255,0.88)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: 32,
            padding: "32px 32px 28px",
            boxShadow: "0 12px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.7)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h1 style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontWeight: 700,
            fontSize: "2.5rem",
            lineHeight: 1.1,
            color: "#2A2A2A",
            margin: "0 0 12px",
            letterSpacing: "-0.01em",
          }}>
            Handmade 
            <span className="block text-accent mt-2">
            Made for You
            
            </span> 
          </h1>

          <p style={{
            fontFamily: "'Inter','Poppins',sans-serif",
            fontWeight: 400,
            fontSize: "1.1rem",
            lineHeight: 1.5,
            color: "#4A4A4A",
            margin: "0 0 24px",
            maxWidth: 380,
          }}>
            Discover handcrafted crochet pieces made with passion and care by artisan makers.
          </p>

          <div style={{ 
            display: "flex", 
            flexDirection: window.innerWidth > 900 ? "row" : "column",
            gap: window.innerWidth > 900 ? "16px" : "12px",
            width: "100%",
            maxWidth: window.innerWidth > 900 ? "none" : "320px"
          }}>
            <button
              onClick={() => setLocation("/marketplace")}
              style={{
                flex: window.innerWidth > 900 ? 1 : "none",
                padding: "18px 32px",
                background: "linear-gradient(135deg, #C45E73 0%, #E07A8A 100%)",
                color: "#fff",
                fontFamily: "'Inter','Poppins',sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: 50,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                boxShadow: "0 10px 30px rgba(196,94,115,0.4), 0 4px 10px rgba(196,94,115,0.2)",
                transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; 
                e.currentTarget.style.boxShadow = "0 15px 40px rgba(196,94,115,0.5), 0 8px 15px rgba(196,94,115,0.3)";
                // Trigger shine effect
                const shine = e.currentTarget.querySelector('div') as HTMLElement;
                if (shine) shine.style.left = "100%";
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = "translateY(0) scale(1)"; 
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(196,94,115,0.4), 0 4px 10px rgba(196,94,115,0.2)";
                // Reset shine effect
                const shine = e.currentTarget.querySelector('div') as HTMLElement;
                if (shine) shine.style.left = "-100%";
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>Shop New Arrivals</span>
              <ArrowRight size={20} style={{ 
                position: "relative", 
                zIndex: 2, 
                transition: "transform 200ms ease" 
              }} />
              {/* Shine effect */}
              <div style={{
                position: "absolute",
                top: 0,
                left: "-100%",
                width: "100%",
                height: "100%",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                transition: "left 600ms ease",
              }} />
            </button>

            <button
              onClick={() => setLocation("/marketplace")}
              style={{
                flex: window.innerWidth > 900 ? 1 : "none",
                padding: "18px 32px",
                background: "rgba(255,255,255,0.95)",
                color: "#2A2A2A",
                fontFamily: "'Inter','Poppins',sans-serif",
                fontWeight: 700,
                fontSize: "1.1rem",
                borderRadius: 50,
                border: "2px solid rgba(196,94,115,0.25)",
                cursor: "pointer",
                backdropFilter: "blur(16px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
                transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { 
                e.currentTarget.style.transform = "translateY(-3px) scale(1.02)"; 
                e.currentTarget.style.background = "rgba(196,94,115,0.08)";
                e.currentTarget.style.borderColor = "rgba(196,94,115,0.4)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9)";
              }}
              onMouseLeave={(e) => { 
                e.currentTarget.style.transform = "translateY(0) scale(1)"; 
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.borderColor = "rgba(196,94,115,0.25)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)";
              }}
            >
              <span style={{ position: "relative", zIndex: 2 }}>Explore Collections</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     DESKTOP HERO (1024px+)
     Full desktop experience with all features
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <section
    
      className="relative w-full flex items-center justify-center overflow-hidden"
      id="hero"
      style={{
        paddingLeft:"13%",
        minHeight: viewport === 'desktop' ? "90vh" : "100vh",
        maxHeight: viewport === 'desktop' ? "95vh" : "none"
      }}
    >
      <div className="absolute inset-0 z-0">
        <img
          src="images/featuredsection.jpeg"
          alt="Feedle crochet background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-pink-50/60 to-green-50/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-start justify-center min-h-screen">
        <div className={`max-w-2xl ${viewport === 'desktop' ? 'lg:max-w-xl' : ''}`}>
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-transparent" />
            <span className={`text-sm font-poppins font-semibold text-accent tracking-widest uppercase ${viewport === 'desktop' ? 'lg:text-xs' : ''}`}>
              Artisan Crafted
            </span>
          </div>

          <h1 className={`font-playfair font-bold text-foreground mb-6 leading-tight ${
            viewport === 'desktop' 
              ? 'text-4xl lg:text-5xl' 
              : 'text-5xl sm:text-6xl lg:text-7xl'
          }`}>
            Every Piece Has a Story
           
             <span className="block text-accent mt-2"> Every Story Has a Maker</span>
          </h1>

          <p className={`text-foreground/80 font-poppins mb-8 max-w-xl leading-relaxed ${
            viewport === 'desktop' 
              ? 'text-base lg:text-lg' 
              : 'text-lg sm:text-xl'
          }`}>
            Each piece is carefully crafted with passion and attention to detail.
            Discover the warmth and authenticity of Feedle crochet fashion.
          </p>

          <div style={{margin:20}} className={`flex gap-4 ${viewport === 'desktop' ? 'flex-row' : 'flex-col sm:flex-row'} sm:gap-6`}>
            <button
              onClick={() => setLocation("/marketplace")}
              className={`group text-white font-poppins font-bold rounded-full transition-all duration-500 flex items-center justify-center gap-3 ${
                viewport === 'desktop' 
                  ? 'px-12 py-6 text-xl' 
                  : 'px-14 py-7 text-2xl'
              }`}
              style={{ 
                background: "linear-gradient(135deg, #C45E73 0%, #E07A8A 50%, #F4A7B9 100%)",
                boxShadow: viewport === 'desktop' 
                  ? "0 12px 32px rgba(196,94,115,0.4), 0 6px 12px rgba(196,94,115,0.2), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "0 16px 40px rgba(196,94,115,0.5), 0 8px 16px rgba(196,94,115,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                position: "relative",
                overflow: "hidden",
                border: "none",
                cursor: "pointer",
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                fontWeight: 800,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.05)";
                e.currentTarget.style.boxShadow = viewport === 'desktop'
                  ? "0 20px 48px rgba(196,94,115,0.6), 0 10px 20px rgba(196,94,115,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
                  : "0 28px 64px rgba(196,94,115,0.7), 0 14px 28px rgba(196,94,115,0.5), inset 0 1px 0 rgba(255,255,255,0.3)";
                // Trigger shine effect
                const shine = e.currentTarget.querySelector('.shine-effect') as HTMLElement;
                if (shine) shine.style.left = "100%";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = viewport === 'desktop'
                  ? "0 12px 32px rgba(196,94,115,0.4), 0 6px 12px rgba(196,94,115,0.2), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "0 16px 40px rgba(196,94,115,0.5), 0 8px 16px rgba(196,94,115,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
                // Reset shine effect
                const shine = e.currentTarget.querySelector('.shine-effect') as HTMLElement;
                if (shine) shine.style.left = "-100%";
              }}
            >
              <span style={{ position: "relative",zIndex: 2, fontWeight: 500, fontSize:18 , padding:15 }}>Shop Now</span>
              <ArrowRight 
                size={viewport === 'desktop' ? 24 : 28} 
                className="group-hover:translate-x-2 transition-transform duration-300" 
                style={{ position: "relative", zIndex: 2 ,paddingRight:10,paddingLeft:-10}}
              />
              {/* Enhanced shine effect */}
              <div 
                className="shine-effect"
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  transition: "left 800ms ease",
                }} 
              />
              {/* Subtle pattern overlay */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                zIndex: 1,
              }} />
            </button>
            <button
              onClick={() => setLocation("/marketplace")}
              className={`font-poppins font-bold rounded-full border-2 transition-all duration-500 ${
                viewport === 'desktop' 
                  ? 'px-12 py-6 text-xl' 
                  : 'px-14 py-7 text-2xl'
              }`}
              style={{
                background: "rgba(255,255,255,0.95)",
                color: "#2A2A2A",
                borderColor: "rgba(196,94,115,0.4)",
                backdropFilter: "blur(20px)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(196,94,115,0.1)",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                fontWeight: 700,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.05)";
                e.currentTarget.style.background = "rgba(196,94,115,0.08)";
                e.currentTarget.style.borderColor = "rgba(196,94,115,0.6)";
                e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(196,94,115,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.95)";
                e.currentTarget.style.borderColor = "rgba(196,94,115,0.4)";
                e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(196,94,115,0.1)";
              }}
            >
              <span style={{ position: "relative", zIndex: 2, fontWeight: 500, fontSize:18 , padding:15 }}>Explore Collection</span>
            </button>
          </div>

          <div className={`mt-12 flex gap-8 text-sm font-poppins text-foreground/70 ${
            viewport === 'desktop' ? 'flex-row' : 'flex-col sm:flex-row'
          }`}>
            {["100% Feedle", "Premium Materials", "Sustainable"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <div className={`rounded-full bg-accent/20 flex items-center justify-center ${
                  viewport === 'desktop' ? 'w-6 h-6' : 'w-8 h-8'
                }`}>
                  <span className="text-accent font-bold">✓</span>
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {viewport !== 'desktop' && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce flex flex-col items-center gap-2">
          <span className="text-xs font-poppins text-foreground/60 uppercase tracking-widest">Scroll</span>
          <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      )}
    </section>
  );
}
