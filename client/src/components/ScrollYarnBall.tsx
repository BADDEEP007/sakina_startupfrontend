import { useState } from "react";

/**
 * ScrollYarnBall
 *
 * A single yarn-ball category item.
 * Positioned by the parent via absolute left offset.
 * Rich pastel colors with radial gradient + crochet texture overlay.
 */

export interface YarnBallProps {
  id: string;
  name: string;
  /** solid base color hex */
  baseColor: string;
  /** lighter center color hex */
  highlightColor: string;
  onClick?: () => void;
}

export default function ScrollYarnBall({
  name,
  baseColor,
  highlightColor,
  onClick,
}: YarnBallProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Shop ${name}`}
      className="flex flex-col items-center gap-3 focus:outline-none group"
      style={{
        transform: hovered ? "scale(1.08)" : "scale(1)",
        transition: "transform 280ms cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Ball */}
      <div
        className="relative rounded-full"
        style={{
          width: 72,
          height: 72,
          background: `radial-gradient(circle at 35% 32%, ${highlightColor} 0%, ${baseColor} 65%)`,
          boxShadow: hovered
            ? `0 8px 24px ${baseColor}88, 0 2px 6px ${baseColor}55`
            : `0 4px 14px ${baseColor}66, 0 1px 4px ${baseColor}44`,
          transition: "box-shadow 280ms ease",
        }}
      >
        {/* crochet texture — diagonal cross-hatch */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent 0px, transparent 3px,
                rgba(255,255,255,0.18) 3px, rgba(255,255,255,0.18) 4px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0px, transparent 3px,
                rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
              )
            `,
          }}
        />
        {/* inner ring for depth */}
        <div
          className="absolute rounded-full border"
          style={{
            inset: 8,
            borderColor: "rgba(255,255,255,0.25)",
          }}
        />
        {/* top-left specular */}
        <div
          className="absolute rounded-full"
          style={{
            width: 22,
            height: 14,
            top: 10,
            left: 12,
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.45) 0%, transparent 80%)",
            transform: "rotate(-20deg)",
          }}
        />
      </div>

      {/* Label */}
      <span
        className="font-poppins font-semibold text-sm whitespace-nowrap transition-colors duration-200"
        style={{ color: hovered ? baseColor : "#5a4a42" }}
      >
        {name}
      </span>
    </button>
  );
}
