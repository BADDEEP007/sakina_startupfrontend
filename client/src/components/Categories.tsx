import CategoryItem from "./CategoryItem";

/**
 * Categories Section Component
 * 
 * Design Philosophy:
 * - Centered horizontal layout of yarn-ball categories
 * - Even spacing with responsive wrapping
 * - Soft, cozy aesthetic matching brand identity
 * - Clean, minimal design without clutter
 * - Smooth transitions and interactions
 * 
 * Features:
 * - 5-7 yarn balls with different pastel colors
 * - Each ball swings with slight delay variation
 * - Hover effects: scale, shadow, color change
 * - Responsive grid that wraps on smaller screens
 * - Accessible keyboard navigation
 */

interface Category {
  id: string;
  name: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "sweaters",
    name: "Sweaters",
    color: "linear-gradient(135deg, #F5E6D3 0%, #E8D5CE 100%)",
  },
  {
    id: "bags",
    name: "Bags",
    color: "linear-gradient(135deg, #E8D5CE 0%, #D4A574 100%)",
  },
  {
    id: "accessories",
    name: "Accessories",
    color: "linear-gradient(135deg, #E5D9E8 0%, #D8BFD8 100%)",
  },
  {
    id: "hats",
    name: "Hats",
    color: "linear-gradient(135deg, #D9E8D5 0%, #C9D9D2 100%)",
  },
  {
    id: "blankets",
    name: "Blankets",
    color: "linear-gradient(135deg, #F5D76E 0%, #E8C547 100%)",
  },
  {
    id: "custom",
    name: "Custom",
    color: "linear-gradient(135deg, #E8D5CE 0%, #D9C9C0 100%)",
  },
];

export default function Categories() {
  const handleCategoryClick = (categoryId: string) => {
    console.log(`Navigating to category: ${categoryId}`);
    // TODO: Implement navigation to category page
    // router.push(`/shop/${categoryId}`);
  };

  return (
    <section
      className="w-full py-20 bg-gradient-to-b from-background to-white/50"
      id="categories"
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-playfair font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-foreground/60 font-quicksand text-lg max-w-2xl mx-auto">
            Explore our handcrafted collections, each crafted with care and attention to detail.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 lg:gap-16">
          {categories.map((category, index) => (
            <CategoryItem
              key={category.id}
              id={category.id}
              name={category.name}
              color={category.color}
              delay={index}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>

        {/* Decorative Bottom Element */}
        <div className="mt-20 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        </div>
      </div>
    </section>
  );
}
