import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TactileCategories from "@/components/TactileCategories";
import FeaturedCollections from "@/components/FeaturedCollections";
import WhyFeedle from "@/components/WhyFeedle";
import DualCTA from "@/components/DualCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="w-full bg-background">
      <Navbar />
      <Hero />
      <TactileCategories />
      <FeaturedCollections />
      <WhyFeedle />
      <DualCTA />
      <Footer />
    </div>
  );
}
