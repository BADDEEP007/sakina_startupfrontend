import { useRef } from "react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/useMobile";

/**
 * TECHNICAL HANDOFF: Shop by Category Section
 * 
 * Verbatim Text (H2): "Shop by Category"
 * Verbatim Text (P): "Explore our handcrafted collections."
 * 
 * Category Grid/Scroll: For mobile, horizontal-scrolling list (flex overflow-x-auto)
 * of four (4) distinct, organically shaped squircle tiles.
 * 
 * Tiles (Left to Right):
 * 1. "Sweaters" (Intricate, close-up knit weave)
 * 2. "Bags" (Close-up of a woven tote)
 * 3. "Accessories" (A collection of pins, patches, and keychains)
 * 4. "Hats" (Detailed shot of woven hats)
 * 
 * Design Tokens:
 * - Background: #F5F1ED (textured off-white)
 * - Border Radius: ~16px (squircle)
 * - Typography: Playfair (H2), Poppins (body)
 * - Colors: #2A2A2A (dark), #4A4A4A (medium)
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
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
  },
  {
    id: "bags",
    name: "Bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
  },
  {
    id: "accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&q=80",
  },
  {
    id: "hats",
    name: "Hats",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80",
  },
];

export default function MobileCategories() {
  const isMobile = useIsMobile();
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (!isMobile) return null;

  const handleCategoryClick = (categoryId: string) => {
    setLocation(`/marketplace?category=${categoryId}`);
  };

  return (
    <section
      className="w-full py-8 px-4"
      style={{
        background: "#F5F1ED",
      }}
    >
      {/* Section Title - H2 */}
      <h2
        className="text-2xl font-playfair font-bold mb-2 px-2"
        style={{ color: "#2A2A2A" }}
      >
        Shop by Category
      </h2>

      {/* Subtitle - Body */}
      <p
        className="text-base font-poppins mb-6 px-2"
        style={{ color: "#4A4A4A" }}
      >
        Explore our handcrafted collections.
      </p>

      {/* Horizontal Scrollable Cards - Squircle Tiles */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className="flex-shrink-0 snap-center transition-all duration-200 active:scale-95"
            style={{
              width: "140px",
              height: "140px",
            }}
          >
            {/* Squircle Card Container */}
            <div
              className="relative w-full h-full overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
              style={{
                borderRadius: "16px", // Squircle effect
              }}
            >
              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay Gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }}
              />

              {/* Category Name - Positioned at bottom */}
              <div className="absolute inset-0 flex items-end justify-center pb-3">
                <span
                  className="text-white font-poppins font-bold text-sm"
                  style={{
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {category.name}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
