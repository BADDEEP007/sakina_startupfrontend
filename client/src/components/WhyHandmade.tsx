import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface TrustBadge {
  icon: React.ReactNode;
  label: string;
}

// ─── Icons (inline SVG, yarn/crochet themed) ──────────────────────────────────

const IconHandcraft = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M7 21c0-4 3-7 7-7s7 3 7 7" stroke="#c4a484" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="14" cy="10" r="4" stroke="#c4a484" strokeWidth="2"/>
    <path d="M4 24h20" stroke="#f4a7b9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconLeaf = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M6 22c2-8 8-14 16-14-2 8-8 14-16 14z" stroke="#c4a484" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M6 22l6-6" stroke="#f4a7b9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconSparkle = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 4v4M14 20v4M4 14h4M20 14h4" stroke="#c4a484" strokeWidth="2" strokeLinecap="round"/>
    <path d="M7.76 7.76l2.83 2.83M17.41 17.41l2.83 2.83M7.76 20.24l2.83-2.83M17.41 10.59l2.83-2.83" stroke="#f4a7b9" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="14" cy="14" r="3" stroke="#c4a484" strokeWidth="2"/>
  </svg>
);

const IconHeart = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path d="M14 22s-9-5.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5.5-9 11-9 11z"
      stroke="#c4a484" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M10 13c1 1 2.5 2 4 2" stroke="#f4a7b9" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" stroke="#c4a484" strokeWidth="1.5"/>
    <path d="M5 8l2 2 4-4" stroke="#c4a484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconShield = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2l5 2v4c0 3-2.5 5.5-5 6-2.5-.5-5-3-5-6V4l5-2z" stroke="#c4a484" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M5.5 8l2 2 3-3" stroke="#c4a484" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="7" rx="2" stroke="#c4a484" strokeWidth="1.5"/>
    <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#c4a484" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="8" cy="11" r="1" fill="#c4a484"/>
  </svg>
);

const IconStar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2l1.5 3.5L13 6l-2.5 2.5.5 3.5L8 10.5 5 12l.5-3.5L3 6l3.5-.5L8 2z"
      stroke="#c4a484" strokeWidth="1.5" strokeLinejoin="round"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURES: Feature[] = [
  {
    icon: <IconHandcraft />,
    title: "Handcrafted Quality",
    description: "Every stitch is placed with intention. No shortcuts, no machines — just skilled hands and genuine care.",
  },
  {
    icon: <IconLeaf />,
    title: "Sustainable & Ethical",
    description: "We source natural yarns responsibly and support fair-wage artisans in every piece we create.",
  },
  {
    icon: <IconSparkle />,
    title: "Unique Designs",
    description: "Each pattern is original. You'll never find our pieces mass-produced on a factory floor.",
  },
  {
    icon: <IconHeart />,
    title: "Made with Love",
    description: "Behind every item is a maker who poured warmth and creativity into their craft, just for you.",
  },
];

const TRUST_BADGES: TrustBadge[] = [
  { icon: <IconCheck />,  label: "100% Feedle Products" },
  { icon: <IconShield />, label: "Verified Sellers" },
  { icon: <IconLock />,   label: "Secure Checkout" },
  { icon: <IconStar />,   label: "Customer Loved" },
];

// ─── Fade-in hook ─────────────────────────────────────────────────────────────

function useFadeIn(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// ─── FeatureBlock ─────────────────────────────────────────────────────────────

function FeatureBlock({
  feature,
  index,
  visible,
}: {
  feature: Feature;
  index: number;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 600ms ease ${index * 120}ms, transform 600ms ease ${index * 120}ms`,
      }}
    >
      <div
        style={{
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 12px 32px rgba(196,164,132,0.18), 0 2px 8px rgba(196,164,132,0.10)"
            : "0 4px 16px rgba(196,164,132,0.10)",
          transition: "transform 280ms ease, box-shadow 280ms ease",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(8px)",
          borderRadius: 20,
          padding: "20px 22px",
          border: "1px solid rgba(196,164,132,0.15)",
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {/* Icon bubble */}
        <div
          style={{
            flexShrink: 0,
            width: 52,
            height: 52,
            borderRadius: 14,
            background: "linear-gradient(135deg, #f5e6cc 0%, #fdf6ee 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(196,164,132,0.15)",
          }}
        >
          {feature.icon}
        </div>

        {/* Text */}
        <div>
          <h4
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#5a3e2b",
              marginBottom: 5,
              lineHeight: 1.3,
            }}
          >
            {feature.title}
          </h4>
          <p
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 13,
              color: "#8a6a55",
              lineHeight: 1.65,
              margin: 0,
            }}
          >
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WhyFeedle() {
  const { ref: sectionRef, visible } = useFadeIn(0.1);

  return (
    <section
      ref={sectionRef}
      id="why-Feedle"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(160deg, #fdf8f2 0%, #fef4f7 50%, #f8f4ff 100%)",
        padding: "96px 0",
      }}
    >
      {/* ── Subtle crochet texture overlay ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle, rgba(196,164,132,0.06) 1px, transparent 1px),
            radial-gradient(circle, rgba(244,167,185,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px, 14px 14px",
          backgroundPosition: "0 0, 7px 7px",
          pointerEvents: "none",
        }}
      />

      {/* ── Soft blobs ── */}
      <div aria-hidden style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360,
        borderRadius: "50%", background: "radial-gradient(circle, #f4a7b922 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -60, left: -60, width: 280, height: 280,
        borderRadius: "50%", background: "radial-gradient(circle, #c8b6ff1a 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ── Content wrapper ── */}
      <div
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="why-Feedle-grid"
      >
        {/* ════════════════════════════════════════
            LEFT — image
        ════════════════════════════════════════ */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-32px)",
            transition: "opacity 700ms ease, transform 700ms ease",
            position: "relative",
          }}
        >
          {/* Main image */}
          <div
            style={{
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(196,164,132,0.22), 0 4px 16px rgba(196,164,132,0.12)",
              aspectRatio: "4/5",
              position: "relative",
            }}
          >
            <img
              src="images/madeforu.jpeg"
              alt="Hands knitting crochet yarn"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              draggable={false}
            />
            {/* Warm gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg, transparent 50%, rgba(245,230,204,0.35) 100%)",
            }} />
          </div>

          {/* Floating stat card */}
          <div
            style={{
              position: "absolute",
              bottom: 28,
              right: -24,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              borderRadius: 18,
              padding: "16px 22px",
              boxShadow: "0 8px 28px rgba(196,164,132,0.18)",
              border: "1px solid rgba(196,164,132,0.15)",
              minWidth: 150,
            }}
          >
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 28,
              color: "#c4a484", margin: 0, lineHeight: 1 }}>2,400+</p>
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 12,
              color: "#8a6a55", margin: "4px 0 0", lineHeight: 1.4 }}>Happy customers<br/>worldwide</p>
          </div>

          {/* Small accent card top-left */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: -20,
              background: "rgba(255,255,255,0.90)",
              backdropFilter: "blur(10px)",
              borderRadius: 14,
              padding: "12px 16px",
              boxShadow: "0 6px 20px rgba(200,182,255,0.18)",
              border: "1px solid rgba(200,182,255,0.2)",
            }}
          >
            <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 700, fontSize: 13,
              color: "#7c5cbf", margin: 0 }}>✦ 100% Feedle</p>
          </div>
        </div>

        {/* ════════════════════════════════════════
            RIGHT — text + features + trust
        ════════════════════════════════════════ */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(32px)",
            transition: "opacity 700ms ease 100ms, transform 700ms ease 100ms",
          }}
        >
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ height: 2, width: 32, background: "linear-gradient(90deg, #f4a7b9, transparent)", borderRadius: 2 }} />
            <span style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 600, fontSize: 11,
              letterSpacing: "0.12em", textTransform: "uppercase", color: "#d4856a" }}>
              Our Promise
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              color: "#2A2A2A",
              lineHeight: 1.2,
              marginBottom: 14,
            }}
          >
            Crafted with Care,<br />
            <span style={{ color: "#C45E73" }}>Made for You</span>
          </h2>

          {/* Subheading */}
          <p
            style={{
              fontFamily: "'Inter', 'Poppins', sans-serif",
              fontWeight: 400,
              fontSize: 15,
              color: "#4A4A4A",
              lineHeight: 1.7,
              marginBottom: 36,
              maxWidth: 420,
            }}
          >
            Every piece carries the warmth of human hands — made slowly, intentionally,
            and with a love that no machine can replicate.
          </p>

          {/* ── Feature blocks with yarn connector ── */}
          <div style={{ position: "relative" }}>
            {/* Vertical yarn thread connecting blocks */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 25,
                top: 26,
                bottom: 26,
                width: 2,
                background: "linear-gradient(180deg, #f4a7b9 0%, #c8b6ff 50%, #f5e6cc 100%)",
                borderRadius: 2,
                opacity: 0.4,
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FEATURES.map((f, i) => (
                <FeatureBlock key={f.title} feature={f} index={i} visible={visible} />
              ))}
            </div>
          </div>

          {/* ── Trust badges ── */}
          <div
            style={{
              marginTop: 36,
              paddingTop: 28,
              borderTop: "1px solid rgba(196,164,132,0.18)",
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 600ms ease 600ms, transform 600ms ease 600ms",
            }}
          >
            {TRUST_BADGES.map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "8px 14px",
                  borderRadius: 50,
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(196,164,132,0.2)",
                  boxShadow: "0 2px 8px rgba(196,164,132,0.08)",
                }}
              >
                {badge.icon}
                <span style={{
                  fontFamily: "'Poppins',sans-serif",
                  fontWeight: 600,
                  fontSize: 11.5,
                  color: "#7a5c44",
                  whiteSpace: "nowrap",
                }}>
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Responsive grid override ── */}
      <style>{`
        @media (max-width: 768px) {
          .why-Feedle-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}
