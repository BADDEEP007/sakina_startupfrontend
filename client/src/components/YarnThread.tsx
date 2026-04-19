/**
 * YarnThread
 *
 * A full-width SVG wool thread that spans the container.
 * Pure presentational — receives no scroll state.
 * The thread is static; the parent translates the whole strip.
 */
export default function YarnThread({ width }: { width: number }) {
  if (width === 0) return null;

  // Build a gently undulating path across the full strip width
  const h = 50; // vertical center (out of 100 viewBox units)
  const amp = 3; // wave amplitude
  const freq = 0.008;
  const step = 8;

  let d = "";
  for (let x = 0; x <= width; x += step) {
    const y = h + Math.sin(x * freq) * amp;
    d += x === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  }

  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${width} 100`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="tg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#c8a898" stopOpacity="0.9" />
          <stop offset="45%"  stopColor="#a07060" stopOpacity="1"   />
          <stop offset="100%" stopColor="#8a5c4c" stopOpacity="0.8" />
        </linearGradient>
        <filter id="ts" x="-5%" y="-50%" width="110%" height="200%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#00000030" />
        </filter>
      </defs>

      {/* soft shadow */}
      <path d={d} stroke="#00000018" strokeWidth="5" fill="none" />
      {/* main cord */}
      <path d={d} stroke="url(#tg)" strokeWidth="3.5" fill="none"
            strokeLinecap="round" filter="url(#ts)" />
      {/* highlight */}
      <path d={d} stroke="rgba(255,255,255,0.35)" strokeWidth="1.2"
            fill="none" strokeLinecap="round" />
    </svg>
  );
}
