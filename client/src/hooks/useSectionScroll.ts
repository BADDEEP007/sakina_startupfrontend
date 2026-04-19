import { useEffect, useRef, RefObject } from "react";

/**
 * useSectionScroll
 *
 * Tracks scroll progress (0→1) relative to a section element.
 * Uses IntersectionObserver to gate activation — scroll listener
 * is only active while the section is in the viewport.
 *
 * progress = (scrollY - sectionTop) / sectionHeight  (clamped 0→1)
 *
 * Calls onProgress(progress) via rAF — no React state, zero re-renders.
 */
export function useSectionScroll(
  sectionRef: RefObject<HTMLElement | HTMLDivElement>,
  onProgress: (progress: number, isInView: boolean) => void
) {
  const isInViewRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // ── Intersection Observer ──────────────────────────────────────────────
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        // When leaving, fire a final callback so consumers can freeze
        if (!entry.isIntersecting) {
          onProgress(0, false);
        }
      },
      { threshold: 0, rootMargin: "0px" }
    );
    observer.observe(section);

    // ── Scroll handler ─────────────────────────────────────────────────────
    const handleScroll = () => {
      if (!isInViewRef.current) return;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionHeight = rect.height;
        const scrollY = window.scrollY;

        // progress: 0 when section top hits viewport top, 1 when bottom exits
        const raw = (scrollY - sectionTop + window.innerHeight) /
          (sectionHeight + window.innerHeight);
        const progress = Math.max(0, Math.min(1, raw));

        onProgress(progress, true);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionRef, onProgress]);
}
