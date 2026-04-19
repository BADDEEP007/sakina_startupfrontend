import { useState, useRef } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const imgRef = useRef<HTMLDivElement>(null);

  // Touch swipe
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setActive((a) => Math.min(a + 1, images.length - 1));
      else setActive((a) => Math.max(a - 1, 0));
    }
    touchStartX.current = null;
  };

  // Hover zoom
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main image */}
      <div
        ref={imgRef}
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
        onMouseMove={onMouseMove}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          borderRadius: 24,
          overflow: "hidden",
          background: "#fdf4e7",
          cursor: zoomed ? "zoom-in" : "default",
          boxShadow: "0 8px 32px rgba(196,164,132,0.16)",
        }}
      >
        <img
          src={images[active]}
          alt={name}
          loading="lazy"
          draggable={false}
          style={{
            width: "100%", height: "100%", objectFit: "cover", display: "block",
            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
            transform: zoomed ? "scale(1.8)" : "scale(1)",
            transition: zoomed ? "transform 200ms ease" : "transform 300ms ease",
          }}
        />

        {/* Prev / Next arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((a) => Math.max(a - 1, 0))}
              disabled={active === 0}
              aria-label="Previous image"
              style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.88)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                opacity: active === 0 ? 0.3 : 1, transition: "opacity 200ms",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              onClick={() => setActive((a) => Math.min(a + 1, images.length - 1))}
              disabled={active === images.length - 1}
              aria-label="Next image"
              style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.88)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                opacity: active === images.length - 1 ? 0.3 : 1, transition: "opacity 200ms",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators (mobile) */}
        {images.length > 1 && (
          <div style={{
            position: "absolute", bottom: 12, left: "50%", transform: "translateX(-50%)",
            display: "flex", gap: 6,
          }}>
            {images.map((_, i) => (
              <div key={i} style={{
                width: i === active ? 20 : 7, height: 7, borderRadius: 4,
                background: i === active ? "#f4a7b9" : "rgba(255,255,255,0.6)",
                transition: "all 280ms ease",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                flexShrink: 0, width: 72, height: 72, borderRadius: 14,
                overflow: "hidden", border: `2.5px solid ${i === active ? "#f4a7b9" : "transparent"}`,
                padding: 0, cursor: "pointer", background: "none",
                boxShadow: i === active ? "0 4px 12px rgba(244,167,185,0.35)" : "0 2px 6px rgba(196,164,132,0.12)",
                transition: "all 220ms ease",
                transform: i === active ? "scale(1.05)" : "scale(1)",
              }}
            >
              <img src={img} alt={`View ${i + 1}`} loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
