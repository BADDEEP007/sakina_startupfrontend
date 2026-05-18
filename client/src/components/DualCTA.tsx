import { useEffect, useRef, useState } from "react";

// ─── Fade-in on scroll ────────────────────────────────────────────────────────

function useFadeIn() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface PanelProps {
  image: string;
  overlayFrom: string;
  overlayTo: string;
  eyebrow: string;
  heading: string;
  subtext: string;
  buttonLabel: string;
  buttonColor: string;
  buttonTextColor: string;
  visible: boolean;
  delay: number;
}

function Panel({
  image,
  overlayFrom,
  overlayTo,
  eyebrow,
  heading,
  subtext,
  buttonLabel,
  buttonColor,
  buttonTextColor,
  visible,
  delay,
}: PanelProps) {
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        flex: 1,
        minHeight: 520,
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image with subtle zoom on hover */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: hovered ? "scale(1.04)" : "scale(1)",
          transition: "transform 700ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <img
          src={image}
          alt=""
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Pastel gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(160deg, ${overlayFrom} 0%, ${overlayTo} 100%)`,
        }}
      />

      {/* Crochet dot texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "52px 48px",
        }}
      >
        {/* Eyebrow */}
        <span
          style={{
            display: "inline-block",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.85)",
            marginBottom: 14,
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            padding: "5px 12px",
            borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.2)",
            alignSelf: "flex-start",
          }}
        >
          {eyebrow}
        </span>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: "clamp(24px, 3vw, 36px)",
            color: "#fff",
            lineHeight: 1.2,
            marginBottom: 14,
            textShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
        >
          {heading}
        </h2>

        {/* Subtext */}
        <p
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: 14.5,
            color: "rgba(255,255,255,0.82)",
            lineHeight: 1.65,
            marginBottom: 32,
            maxWidth: 340,
            textShadow: "0 1px 6px rgba(0,0,0,0.12)",
          }}
        >
          {subtext}
        </p>

        {/* CTA Button */}
        <button
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            alignSelf: "flex-start",
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 700,
            fontSize: 14,
            color: buttonTextColor,
            background: buttonColor,
            border: "none",
            borderRadius: 50,
            padding: "14px 34px",
            cursor: "pointer",
            transform: btnHovered ? "scale(1.06)" : "scale(1)",
            boxShadow: btnHovered
              ? "0 12px 32px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.12)"
              : "0 6px 20px rgba(0,0,0,0.16)",
            transition: "transform 260ms cubic-bezier(0.34,1.56,0.64,1), box-shadow 260ms ease",
            letterSpacing: "0.02em",
          }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DualCTA() {
  const { ref, visible } = useFadeIn();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      id="dual-cta"
      style={{
        width: "100%",
        background: "linear-gradient(180deg, #fdf8f2 0%, #fef4f7 100%)",
        padding: "80px 24px",
      }}
    >
      {/* Section label */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 40,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 600ms ease, transform 600ms ease",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 10 }}>
          <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, transparent, #c4a484)" }} />
          <span style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 11,
            letterSpacing: "0.14em", textTransform: "uppercase", color: "#c4a484",
          }}>
            What would you like to do?
          </span>
          <div style={{ height: 1, width: 40, background: "linear-gradient(90deg, #c4a484, transparent)" }} />
        </div>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700,
          fontSize: "clamp(26px, 3.5vw, 40px)", color: "#2A2A2A", margin: 0,
        }}>
          Your Next Step Starts Here
        </h2>
      </div>

      {/* Two panels */}
      <div
        className="dual-cta-grid"
        style={{
          display: "flex",
          gap: 20,
          maxWidth: 1160,
          margin: "0 auto",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(196,164,132,0.18), 0 8px 24px rgba(196,164,132,0.10)",
        }}
      >
        {/* LEFT — Buyer */}
        <Panel
          image="https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=900&q=85"
          overlayFrom="rgba(245,230,204,0.55)"
          overlayTo="rgba(196,164,132,0.72)"
          eyebrow="For shoppers"
          heading={"Find Something\nMade Just for You"}
          subtext="Discover one-of-a-kind handcrafted pieces crafted with care — no two are ever the same."
          buttonLabel="Shop Now"
          buttonColor="#fff"
          buttonTextColor="#7a5c44"
          visible={visible}
          delay={0}
        />

        {/* Divider */}
        <div
          style={{
            width: 1,
            background: "rgba(255,255,255,0.3)",
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        />

        {/* RIGHT — Seller */}
        <Panel
          image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85"
          overlayFrom="rgba(200,182,255,0.45)"
          overlayTo="rgba(244,167,185,0.68)"
          eyebrow="For creators"
          heading={"Turn Your Craft\ninto a Business"}
          subtext="Join a community of artisans and reach customers who truly value handcrafted work."
          buttonLabel="Join as Seller"
          buttonColor="#fff"
          buttonTextColor="#6b4fa0"
          visible={visible}
          delay={120}
        />
      </div>

      {/* Responsive stack */}
      <style>{`
        @media (max-width: 680px) {
          .dual-cta-grid {
            flex-direction: column !important;
            border-radius: 20px !important;
          }
          .dual-cta-grid > div[style*="width: 1px"] {
            width: 100% !important;
            height: 1px !important;
            align-self: auto !important;
          }
        }
      `}</style>
    </section>
  );
}
