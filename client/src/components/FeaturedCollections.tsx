import { useState, useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "@/hooks/useMobile";

/**
 * FeaturedCollections
 *
 * Rotating 3-card carousel with depth effect.
 *
 * Layout (desktop):
 *   [ prev ]  [ ACTIVE ]  [ next ]
 *
 * Mechanics:
 * - State holds `activeIndex` (0-based, wraps infinitely)
 * - Each card's visual role is derived from its offset to activeIndex
 * - Framer Motion is NOT used — pure CSS transitions + transform
 *   to keep the bundle lean and avoid spring-physics quirks
 * - Auto-advance every 5s, paused on hover
 * - Touch swipe on mobile
 */

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Collection {
  id: string;
  title: string;
  description: string;
  tag: string;
  image: string;
  accent: string; // gradient overlay start color
}

const COLLECTIONS: Collection[] = [
  {
    id: "hot-deals",
    title: "Hot Deals",
    description: "Limited-time offers on our most-loved handmade pieces.",
    tag: "🔥 Up to 40% off",
    // Macro crochet amigurumi / patterned thread keychains
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=90",
    accent: "#c0392b",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh off the hook — the latest additions to our collection.",
    tag: "✨ Just dropped",
    // High-res close-up of intricate macrame wall hanging
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=90",
    accent: "#8e44ad",
  },
  {
    id: "seasonal-picks",
    title: "Seasonal Picks",
    description: "Cozy textures and warm tones curated for the season.",
    tag: "🍂 Editor's choice",
    // Chunky knit blanket — rich textile texture
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=800&q=90",
    accent: "#d35400",
  },
  {
    id: "best-sellers",
    title: "Best Sellers",
    description: "The pieces our community keeps coming back for.",
    tag: "⭐ Community favourites",
    // Detailed crochet sweater / complex knit pattern
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=90",
    accent: "#27ae60",
  },
  {
    id: "limited-edition",
    title: "Limited Edition",
    description: "One-of-a-kind designs made in very small batches.",
    tag: "💎 Rare finds",
    // Colorful thread-art / hand-embroidered textile
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=90",
    accent: "#2980b9",
  },
];

const TOTAL = COLLECTIONS.length;
const AUTO_INTERVAL = 5000; // ms

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Wrap index into [0, TOTAL) */
function wrap(n: number) {
  return ((n % TOTAL) + TOTAL) % TOTAL;
}

/**
 * Returns the visual slot for a card given the active index.
 * slot  0 → active (center)
 * slot  1 → next (right)
 * slot -1 → prev (left)
 * slot ±2 → far side (hidden / barely visible)
 */
function getSlot(cardIndex: number, activeIndex: number): number {
  let offset = cardIndex - activeIndex;
  // Wrap to [-2, 2] range for a 5-card set
  if (offset > Math.floor(TOTAL / 2)) offset -= TOTAL;
  if (offset < -Math.floor(TOTAL / 2)) offset += TOTAL;
  return offset;
}

// ─── Per-slot visual config ───────────────────────────────────────────────────

interface SlotStyle {
  translateX: string;
  scale: number;
  opacity: number;
  zIndex: number;
  blur: string;
  pointerEvents: "auto" | "none";
}

function slotStyle(slot: number): SlotStyle {
  switch (slot) {
    case 0:
      return { translateX: "0%",    scale: 1,    opacity: 1,    zIndex: 30, blur: "0px",   pointerEvents: "auto" };
    case 1:
      return { translateX: "62%",   scale: 0.88, opacity: 0.75, zIndex: 20, blur: "1px",   pointerEvents: "auto" };
    case -1:
      return { translateX: "-62%",  scale: 0.88, opacity: 0.75, zIndex: 20, blur: "1px",   pointerEvents: "auto" };
    case 2:
      return { translateX: "110%",  scale: 0.76, opacity: 0.35, zIndex: 10, blur: "2px",   pointerEvents: "none" };
    case -2:
      return { translateX: "-110%", scale: 0.76, opacity: 0.35, zIndex: 10, blur: "2px",   pointerEvents: "none" };
    default:
      return { translateX: "0%",    scale: 0,    opacity: 0,    zIndex: 0,  blur: "0px",   pointerEvents: "none" };
  }
}

// ─── CollectionCard ───────────────────────────────────────────────────────────

interface CardProps {
  collection: Collection;
  slot: number;
  onClick: () => void;
}

function CollectionCard({ collection, slot, onClick }: CardProps) {
  const s = slotStyle(slot);
  const isActive = slot === 0;

  return (
    <div
      onClick={slot !== 0 ? onClick : undefined}
      style={{
        position: "absolute",
        width: "100%",
        maxWidth: 420,
        left: "50%",
        top: 0,
        bottom: 0,
        marginLeft: "-210px", // half of maxWidth
        transform: `translateX(${s.translateX}) scale(${s.scale})`,
        opacity: s.opacity,
        filter: s.blur !== "0px" ? `blur(${s.blur})` : undefined,
        zIndex: s.zIndex,
        pointerEvents: s.pointerEvents,
        transition:
          "transform 600ms cubic-bezier(0.4,0,0.2,1), opacity 600ms ease, filter 600ms ease",
        cursor: slot !== 0 ? "pointer" : "default",
        willChange: "transform, opacity",
      }}
    >
      {/* Card shell */}
      <div
        className="relative w-full h-full rounded-3xl overflow-hidden select-none"
        style={{
          boxShadow: isActive
            ? "0 24px 60px rgba(0,0,0,0.22), 0 8px 20px rgba(0,0,0,0.12)"
            : "0 8px 24px rgba(0,0,0,0.12)",
          transition: "box-shadow 600ms ease",
        }}
      >
        {/* Background image with subtle parallax via scale */}
        <div
          className="absolute inset-0"
          style={{
            transform: isActive ? "scale(1.04)" : "scale(1)",
            transition: "transform 600ms cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <img
            src={collection.image}
            alt={collection.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        </div>

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              160deg,
              ${collection.accent}22 0%,
              rgba(0,0,0,0.08) 30%,
              rgba(0,0,0,0.65) 100%
            )`,
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-7">
          {/* Tag pill */}
          <span
            className="inline-block self-start mb-3 px-3 py-1 rounded-full text-xs font-poppins font-semibold text-white"
            style={{ background: `${collection.accent}cc` }}
          >
            {collection.tag}
          </span>

          <h3 className="font-playfair text-white text-3xl font-bold leading-tight mb-2" style={{ fontFamily: "'Playfair Display',Georgia,serif", color: "#fff" }}>
            {collection.title}
          </h3>

          <p className="font-quicksand text-white/80 text-sm leading-relaxed mb-5 line-clamp-2">
            {collection.description}
          </p>

          {/* CTA */}
          {isActive && (
            <button
              className="self-start px-6 py-2.5 rounded-full font-poppins font-semibold text-sm text-white
                         border border-white/50 backdrop-blur-sm
                         hover:bg-white hover:text-foreground
                         transition-all duration-300"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              Explore →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function FeaturedCollections() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const isMobile = useIsMobile();

  // Touch swipe state
  const touchStartX = useRef<number | null>(null);

  const next = useCallback(() => setActive((a) => wrap(a + 1)), []);
  const prev = useCallback(() => setActive((a) => wrap(a - 1)), []);

  // Auto-advance
  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTO_INTERVAL);
    return () => clearInterval(id);
  }, [paused, next]);

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full py-24 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #faf8f3 0%, #f5f0e8 50%, #faf8f3 100%)",
      }}
      id="featured-collections"
    >
      {/* ── Header ── */}
      <div className="container mx-auto px-4 text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-accent" />
          <span className="text-xs font-poppins font-semibold tracking-widest uppercase text-accent">
            Curated for you
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-accent" />
        </div>
        <h2 className="font-playfair text-4xl sm:text-5xl font-bold mb-3" style={{ color: "#2A2A2A" }}>
          Featured Collections
        </h2>
        <p className="font-poppins text-foreground/60 text-lg max-w-lg mx-auto" style={{ fontFamily: "'Inter','Poppins',sans-serif", color: "#4A4A4A" }}>
          Handpicked stories woven with care — find the one that speaks to you.
        </p>
      </div>

      {/* ── Carousel — NO edge fades ── */}
      <div
        className="relative mx-auto"
        style={{ maxWidth: 900, height: isMobile ? 420 : 500 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >

        {/* Cards */}
        {COLLECTIONS.map((col, i) => (
          <CollectionCard
            key={col.id}
            collection={col}
            slot={getSlot(i, active)}
            onClick={() => setActive(i)}
          />
        ))}

        {/* Arrow buttons */}
        {!isMobile && (
          <>
            <button
              onClick={prev}
              aria-label="Previous collection"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50
                         w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm
                         shadow-md flex items-center justify-center
                         hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next collection"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50
                         w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm
                         shadow-md flex items-center justify-center
                         hover:bg-white hover:shadow-lg transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Progress dots + bar ── */}
      <div className="mt-10 flex flex-col items-center gap-4">
        {/* Dots */}
        <div className="flex items-center gap-2.5">
          {COLLECTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to collection ${i + 1}`}
              style={{
                width: i === active ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === active ? "#C45E73" : "rgba(196,94,115,0.25)",
                transition: "all 400ms cubic-bezier(0.4,0,0.2,1)",
              }}
            />
          ))}
        </div>

        {/* Auto-progress bar */}
        {!paused && (
          <div className="w-32 h-0.5 rounded-full bg-accent/20 overflow-hidden">
            <div
              key={active} // re-mount on change to restart animation
              className="h-full rounded-full bg-accent"
              style={{
                animation: `progressBar ${AUTO_INTERVAL}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>

      {/* Progress bar keyframe */}
      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
}
