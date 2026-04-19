import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { useLocation } from "wouter";

export default function Hero() {
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();

  /* ─────────────────────────────────────────────────────────────────────────
     MOBILE HERO
     Matches reference image exactly:
     - Warm taupe full-bleed background (#C9A99A gradient)
     - Frosted white card in the centre (rounded-3xl, backdrop-blur)
     - Three crochet product photos arranged around the card:
         top-right  → crochet hat (circle)
         mid-left   → chunky knit blanket (large circle, bleeds off edge)
         mid-right  → yarn balls (medium circle)
         bottom-right → crochet bag (circle)
     - H1 "Handmade with Love" — Playfair, dark charcoal, centred
     - Body copy — Inter, centred
     - Primary pill button: #C45E73 pink, white text, arrow
     - Secondary pill button: warm taupe fill, dark text
  ───────────────────────────────────────────────────────────────────────── */
  if (isMobile) {
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
            <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 700, fontSize: 14, color: "#fff", margin: 0, textShadow: "0 1px 4px rgba(0,0,0,0.18)" }}>Handmade</p>
            <p style={{ fontFamily: "'Inter','Poppins',sans-serif", fontWeight: 400, fontSize: 9, color: "rgba(255,255,255,0.80)", margin: 0, letterSpacing: "0.06em" }}>with Love</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BACKGROUND IMAGE TILES
            All images replaced with premium
            handmade / crochet / thread-art content
        ══════════════════════════════════════════ */}

        {/* 1. Top-right — intricate thread-art / colorful abstract piece */}
        <div style={{
          position: "absolute", top: -20, right: -24,
          width: 155, height: 155, borderRadius: "50%",
          overflow: "hidden", zIndex: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
        }}>
          <img
            src="https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&q=90"
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
            Handmade with Love
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

          {/* Primary CTA */}
          <button
            onClick={() => setLocation("/marketplace")}
            style={{
              width: "100%",
              padding: "12px 20px",
              background: "#C45E73",
              color: "#fff",
              fontFamily: "'Inter','Poppins',sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              marginBottom: 8,
              boxShadow: "0 4px 14px rgba(196,94,115,0.35)",
              transition: "transform 200ms ease",
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Shop New Arrivals
            <ArrowRight size={15} />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => setLocation("/marketplace")}
            style={{
              width: "100%",
              padding: "12px 20px",
              background: "rgba(216,205,196,0.55)",
              color: "#2A2A2A",
              fontFamily: "'Inter','Poppins',sans-serif",
              fontWeight: 700,
              fontSize: "0.875rem",
              borderRadius: 50,
              border: "none",
              cursor: "pointer",
              backdropFilter: "blur(6px)",
              transition: "transform 200ms ease",
            }}
            onTouchStart={(e) => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Explore Collections
          </button>
        </div>
      </section>
    );
  }

  /* ─────────────────────────────────────────────────────────────────────────
     DESKTOP HERO — unchanged
  ───────────────────────────────────────────────────────────────────────── */
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      id="hero"
    >
      <div className="absolute inset-0 z-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663551432808/LbhAdw86gWwUBeNNLSPuNP/hero-crochet-flatlay-5ZM33zrHNzpk8HJt7TKQxi.webp"
          alt="Handmade crochet background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-pink-50/60 to-green-50/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 flex flex-col items-start justify-center min-h-screen">
        <div className="max-w-2xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-transparent" />
            <span className="text-sm font-poppins font-semibold text-accent tracking-widest uppercase">
              Artisan Crafted
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold text-foreground mb-6 leading-tight">
            Handmade with
            <span className="block text-accent mt-2">Love</span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground/80 font-poppins mb-8 max-w-xl leading-relaxed">
            Each piece is carefully crafted with passion and attention to detail.
            Discover the warmth and authenticity of handmade crochet fashion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <button
              onClick={() => setLocation("/marketplace")}
              className="group px-8 py-4 text-white font-poppins font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              style={{ background: "#C45E73" }}
            >
              Shop Now
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <button
              onClick={() => setLocation("/marketplace")}
              className="px-8 py-4 bg-white/80 text-foreground font-poppins font-semibold rounded-full border-2 border-foreground/20 hover:border-accent hover:bg-white hover:shadow-md transition-all duration-300"
            >
              Explore Collection
            </button>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-8 text-sm font-poppins text-foreground/70">
            {["100% Handmade", "Premium Materials", "Sustainable"].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-accent font-bold">✓</span>
                </div>
                <span>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce flex flex-col items-center gap-2">
        <span className="text-xs font-poppins text-foreground/60 uppercase tracking-widest">Scroll</span>
        <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
