import { useRef, useEffect, useState, useCallback } from "react";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import { useIsMobile } from "@/hooks/useMobile";
import YarnThread from "./YarnThread";
import ScrollYarnBall, { type YarnBallProps } from "./ScrollYarnBall";

/**
 * ScrollCategories
 *
 * Infinite-loop scroll-driven yarn category strip.
 *
 * How the loop works
 * ──────────────────
 * 1. The strip holds [A B C D E F  A B C D E F] — content duplicated once.
 * 2. translateX moves from 0 → -halfWidth as scroll progress goes 0 → 1.
 * 3. When translateX reaches -halfWidth we instantly snap back to 0.
 *    Because the second half is identical to the first, the jump is invisible.
 *
 * Scroll scoping
 * ──────────────
 * useSectionScroll fires ONLY while the section is in the viewport.
 * Outside → animation is frozen at its last position.
 *
 * Mobile
 * ──────
 * On small screens we skip the scroll mapping and render a simple
 * overflow-x scroll container instead.
 */

// ─── Category data ────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  baseColor: string;
  highlightColor: string;
}

const CATEGORIES: Category[] = [
  { id: "sweaters",    name: "Sweaters",    baseColor: "#d4856a", highlightColor: "#f5c4b0" },
  { id: "bags",        name: "Bags",        baseColor: "#b07cc6", highlightColor: "#dfc8f5" },
  { id: "accessories", name: "Accessories", baseColor: "#c4a45a", highlightColor: "#f5e6cc" },
  { id: "hats",        name: "Hats",        baseColor: "#e07a8a", highlightColor: "#f4c4cc" },
  { id: "blankets",    name: "Blankets",    baseColor: "#6aab8e", highlightColor: "#b8e0cc" },
  { id: "custom",      name: "Custom",      baseColor: "#7a8ec4", highlightColor: "#c0ccf0" },
];

// Ball width + gap in px — used to compute strip width
const BALL_WIDTH = 72;
const BALL_GAP   = 80; // gap between ball centers
const ITEM_SLOT  = BALL_WIDTH + BALL_GAP; // 152px per item

// ─── Component ────────────────────────────────────────────────────────────────

export default function ScrollCategories() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const stripRef    = useRef<HTMLDivElement>(null);
  const isMobile    = useIsMobile();

  // Width of ONE copy of the category list (half the full strip)
  const halfWidth = CATEGORIES.length * ITEM_SLOT;

  // Current translateX — stored in a ref to avoid re-renders on every frame
  const translateXRef = useRef(0);
  // Whether we're currently in view
  const inViewRef = useRef(false);

  // We need one state tick to show/hide the strip on first entry
  const [isVisible, setIsVisible] = useState(false);

  // ── Scroll callback (no state, direct DOM mutation via ref) ───────────────
  const handleProgress = useCallback(
    (progress: number, inView: boolean) => {
      inViewRef.current = inView;

      if (!inView) {
        setIsVisible(false);
        return;
      }

      setIsVisible(true);

      // Map progress 0→1 to translateX 0→-halfWidth
      let tx = -(progress * halfWidth);

      // Seamless loop: once we've moved a full half-width, snap back to 0
      // modulo keeps it in [0, halfWidth)
      tx = -(Math.abs(tx) % halfWidth);

      translateXRef.current = tx;

      if (stripRef.current) {
        stripRef.current.style.transform = `translateX(${tx}px)`;
      }
    },
    [halfWidth]
  );

  useSectionScroll(sectionRef as React.RefObject<HTMLElement>, handleProgress);

  // ── Container width for the SVG thread ────────────────────────────────────
  const [containerWidth, setContainerWidth] = useState(0);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const handleClick = (id: string) => {
    console.log("navigate →", id);
  };

  // ── Mobile: simple horizontal scroll ──────────────────────────────────────
  if (isMobile) {
    return (
      <section className="relative w-full py-20 bg-gradient-to-b from-white/50 to-background" id="scroll-categories">
        <div className="container mx-auto px-4 mb-10 text-center">
          <h2 className="text-4xl font-playfair font-bold text-foreground mb-3">
            Shop by Category
          </h2>
          <p className="text-foreground/60 font-quicksand text-base">
            Explore our handmade collections.
          </p>
        </div>
        <div className="overflow-x-auto pb-4 px-6">
          <div className="flex gap-10 w-max mx-auto items-center py-6">
            {CATEGORIES.map((cat) => (
              <ScrollYarnBall
                key={cat.id}
                id={cat.id}
                name={cat.name}
                baseColor={cat.baseColor}
                highlightColor={cat.highlightColor}
                onClick={() => handleClick(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // ── Desktop: scroll-driven infinite loop ──────────────────────────────────
  return (
    <section
      ref={sectionRef}
      className="relative w-full py-28 bg-gradient-to-b from-white/50 to-background overflow-hidden"
      id="scroll-categories"
    >
      {/* Title */}
      <div className="container mx-auto px-4 mb-14 text-center">
        <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-foreground mb-3">
          Shop by Category
        </h2>
        <p className="text-foreground/60 font-quicksand text-lg max-w-xl mx-auto">
          Scroll to travel along the thread of creativity.
        </p>
      </div>

      {/* ── Yarn stage ── */}
      <div className="relative w-full h-52 overflow-hidden">

        {/* Static thread — full container width, no transform */}
        <YarnThread width={containerWidth} />

        {/* Left / right fade masks */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-20" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-20" />

        {/* Scrolling strip — [A B C D E F A B C D E F] */}
        {isVisible && (
          <div
            ref={stripRef}
            className="absolute top-1/2 left-0 flex items-center"
            style={{
              // initial position; JS will update via direct style mutation
              transform: "translateX(0px)",
              willChange: "transform",
              // strip is 2× halfWidth wide
              width: halfWidth * 2,
              marginTop: -36, // half of ball (72/2) to center on thread
              gap: 0,
            }}
          >
            {/* Render two copies for seamless loop */}
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center flex-shrink-0"
                style={{ width: halfWidth }}
                aria-hidden={copy === 1}
              >
                {CATEGORIES.map((cat) => (
                  <div
                    key={`${copy}-${cat.id}`}
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{ width: ITEM_SLOT }}
                  >
                    <ScrollYarnBall
                      id={cat.id}
                      name={cat.name}
                      baseColor={cat.baseColor}
                      highlightColor={cat.highlightColor}
                      onClick={() => handleClick(cat.id)}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll hint */}
      <p className="mt-10 text-center text-xs font-quicksand text-foreground/40 tracking-widest uppercase">
        ↓ Scroll to explore
      </p>
    </section>
  );
}
