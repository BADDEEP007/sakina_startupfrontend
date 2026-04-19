import { useLocation } from "wouter";

/**
 * TactileCategories
 *
 * Exact card style from reference image:
 *   - Warm off-white card background (#F5F0EB)
 *   - Large rounded corners on the card (28px)
 *   - Image fills the top portion, also rounded (20px)
 *   - Label sits below the image, left-aligned, semi-bold
 *   - Subtle drop shadow (no inset) — clean, lifted look
 *
 * Layout — ALL viewports use the same infinite marquee loop.
 * The strip is duplicated so it scrolls seamlessly forever.
 * Card width is fixed (220px) so the design is identical on
 * mobile, tablet, and desktop — just more cards visible on wider screens.
 *
 * The section header (h2 + p) sits above the marquee on every viewport.
 */

interface Category {
  id: string;
  name: string;
  image: string;
}

const CATEGORIES: Category[] = [
  {
    id: "sweaters",
    name: "Sweaters",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=85",
  },
  {
    id: "bags",
    name: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=85",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=85",
  },
  {
    id: "hats",
    name: "Hats",
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=500&q=85",
  },
  {
    id: "blankets",
    name: "Blankets",
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=500&q=85",
  },
  {
    id: "custom",
    name: "Custom",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=85",
  },
];

// ─── Single card — matches the reference image exactly ───────────────────────

function TactileCard({ category }: { category: Category }) {
  const [, setLocation] = useLocation();

  return (
    <button
      onClick={() => setLocation(`/marketplace?category=${category.id}`)}
      aria-label={`Browse ${category.name}`}
      className="tactile-card"
      style={{
        /* Fixed width so every viewport sees the same card */
        width: 200,
        flexShrink: 0,
        background: "#F5F0EB",
        borderRadius: 28,
        padding: "12px 12px 16px",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        textAlign: "left",
        /* Clean drop shadow — matches reference */
        boxShadow: "0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        transition: "transform 300ms cubic-bezier(0.4,0,0.2,1), box-shadow 300ms cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Image frame */}
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 20,
          overflow: "hidden",
          background: "#EDE8E3",
        }}
      >
        <img
          src={category.image}
          alt={category.name}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      {/* Label — below image, left-aligned, semi-bold */}
      <span
        style={{
          marginTop: 14,
          fontFamily: "'Inter', 'Poppins', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: "0.01em",
          color: "#2A2A2A",
          paddingLeft: 2,
        }}
      >
        {category.name}
      </span>
    </button>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function TactileCategories() {
  // Duplicate the list so the marquee loops seamlessly
  const looped = [...CATEGORIES, ...CATEGORIES];

  return (
    <section
      id="shop-by-category"
      style={{
        width: "100%",
        background: "#FAF7F4",
        padding: "56px 0 64px",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto 36px",
          padding: "0 24px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            fontSize: "clamp(1.75rem, 3vw, 2rem)",
            color: "#2A2A2A",
            margin: "0 0 8px",
            lineHeight: 1.2,
          }}
        >
          Shop by Category
        </h2>
        <p
          style={{
            fontFamily: "'Inter', 'Poppins', sans-serif",
            fontWeight: 400,
            fontSize: "1.0625rem",
            color: "#4A4A4A",
            margin: 0,
          }}
        >
          Explore our handmade collections.
        </p>
      </div>

      {/* ── Infinite marquee strip ── */}
      {/*
        The outer div clips overflow.
        The inner div is twice as wide (2× CATEGORIES) and animates
        from translateX(0) → translateX(-50%) — at -50% the second
        copy is perfectly aligned with where the first started, so
        the loop is invisible.
      */}
      <div
        style={{
          overflow: "hidden",
          /* Edge fade masks — gives the "peeks off screen" feel */
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div
          className="marquee-track"
          style={{
            display: "flex",
            gap: 20,
            width: "max-content",
            /* animation defined in <style> below */
          }}
        >
          {looped.map((cat, i) => (
            <TactileCard key={`${cat.id}-${i}`} category={cat} />
          ))}
        </div>
      </div>

      {/* ── Keyframe + hover ── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .marquee-track {
          animation: marquee 28s linear infinite;
          padding: 8px 0 16px;
        }

        /* Pause on hover so users can click a card */
        .marquee-track:hover {
          animation-play-state: paused;
        }

        /* Card hover lift */
        .tactile-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06) !important;
        }

        /* Image zoom on card hover */
        .tactile-card:hover img {
          transform: scale(1.06);
        }

        /* Active press */
        .tactile-card:active {
          transform: translateY(-1px) scale(0.98) !important;
        }
      `}</style>
    </section>
  );
}
