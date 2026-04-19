import { useState, useEffect } from "react";

/**
 * useScrollTransform Hook
 * 
 * Tracks vertical scroll position and converts it to horizontal translation
 * for scroll-based yarn thread animation.
 * 
 * Returns:
 * - scrollX: Horizontal translation value (in pixels or percentage)
 * - scrollProgress: Normalized scroll progress (0-1)
 * - scrollY: Raw vertical scroll position
 */

interface ScrollTransformResult {
  scrollX: number;
  scrollProgress: number;
  scrollY: number;
}

export function useScrollTransform(
  multiplier: number = 0.5
): ScrollTransformResult {
  const [scrollData, setScrollData] = useState<ScrollTransformResult>({
    scrollX: 0,
    scrollProgress: 0,
    scrollY: 0,
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;

      // Calculate scroll progress (0-1)
      const scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

      // Convert vertical scroll to horizontal translation
      // Multiplier controls sensitivity (higher = more movement)
      const scrollX = -scrollY * multiplier;

      setScrollData({
        scrollX,
        scrollProgress,
        scrollY,
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [multiplier]);

  return scrollData;
}
