export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  seller: string;
  sellerRating: number;
  original_price: number;
  category: string;
  artType: "Crochet" | "Knitted" | "Feedle fabric";
  size: "Small" | "Medium" | "Large" | "Custom";
  availableSizes: string[];
  availableColors: { name: string; hex: string }[];
  stock: number;
  images: string[];
  gallery: string[];
  isNew?: boolean;
  description: string;
  materials: string;
  careInstructions: string;
  deliveryInfo: string;
  reviews: Review[];
}


export const CATEGORIES = ["All", "Sweaters", "Bags", "Hats", "Blankets", "Accessories"];
export const ART_TYPES: Product["artType"][] = ["Crochet", "Knitted", "Feedle fabric"];
export const SIZES: Product["size"][] = ["Small", "Medium", "Large", "Custom"];
