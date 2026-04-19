import { useState } from "react";
import "./CategoryItem.css";

/**
 * CategoryItem Component - Yarn Ball Category
 * 
 * Design Philosophy:
 * - Soft, textured yarn ball with pastel colors
 * - Suspended by thin curved wool string
 * - Gentle swinging animation (pendulum-like)
 * - Interactive hover effects: scale up, pause swing, increase shadow
 * - Smooth, performance-optimized animations
 * - Accessible with clear labels and clickable areas
 */

interface CategoryItemProps {
  id: string;
  name: string;
  color: string;
  delay: number;
  onClick?: () => void;
}

export default function CategoryItem({
  id,
  name,
  color,
  delay,
  onClick,
}: CategoryItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex flex-col items-center group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Category: ${name}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      {/* String Container */}
      <div className="relative w-full flex justify-center mb-2">
        {/* Curved String SVG */}
        <svg
          width="80"
          height="40"
          viewBox="0 0 80 40"
          className="absolute top-0"
          style={{
            opacity: isHovered ? 0.8 : 1,
            transition: "opacity 300ms ease-out",
          }}
        >
          {/* Curved line representing wool string */}
          <path
            d="M 40 0 Q 35 15, 40 40"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            className="text-foreground/40"
          />
        </svg>

        {/* Yarn Ball Container with Swing Animation */}
        <div
          className={`relative w-24 h-24 flex items-center justify-center transition-all duration-300 ${
            isHovered ? "scale-110" : "scale-100"
          }`}
          style={{
            animation: isHovered
              ? "none"
              : `swing ${2.5 + delay * 0.3}s ease-in-out infinite`,
            transformOrigin: "top center",
          }}
        >
          {/* Yarn Ball - Textured Circle */}
          <div
            className={`relative w-20 h-20 rounded-full shadow-md transition-all duration-300 ${
              isHovered ? "shadow-lg" : "shadow-md"
            }`}
            style={{
              background: color,
              backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.1), transparent 50%)
              `,
            }}
          >
            {/* Yarn Texture Overlay */}
            <div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(255, 255, 255, 0.5) 2px,
                    rgba(255, 255, 255, 0.5) 4px
                  ),
                  repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 0, 0, 0.1) 2px,
                    rgba(0, 0, 0, 0.1) 4px
                  )
                `,
              }}
            />

            {/* Yarn Strands Detail */}
            <div className="absolute inset-2 rounded-full border border-white/20 opacity-50" />
          </div>

          {/* Hover Indicator - Subtle Glow */}
          {isHovered && (
            <div
              className="absolute inset-0 rounded-full animate-pulse"
              style={{
                background: `radial-gradient(circle, ${color}40, transparent 70%)`,
              }}
            />
          )}
        </div>
      </div>

      {/* Category Name */}
      <p className="mt-6 text-center font-poppins font-semibold text-foreground/80 text-sm transition-colors duration-300 group-hover:text-accent">
        {name}
      </p>

      {/* Hover Underline */}
      <div className="mt-2 h-0.5 w-0 bg-gradient-to-r from-transparent via-accent to-transparent group-hover:w-12 transition-all duration-300" />
    </div>
  );
}
