import type { User } from "@/contexts/AuthContext";
import type { SellerProfile } from "@/contexts/SellerContext";

// ─── Demo user (buyer) ────────────────────────────────────────────────────────

export const DEMO_USER: User = {
  id: "demo-user-001",
  name: "Pradeep Argal",
  email: "baddeep@demo.com",
  avatar: "https://i.pravatar.cc/80?img=47",
  isSeller: false,
};

// ─── Demo seller ──────────────────────────────────────────────────────────────

export const DEMO_SELLER: User = {
  id: "demo-seller-001",
  name: "Naruto Ozamai",
  email: "araara@demo.com",
  avatar: "https://i.pravatar.cc/80?img=32",
  isSeller: true,
};

export const DEMO_SELLER_PROFILE: SellerProfile = {
  id: "demo-seller-001",
  fullName: "Nartuo Ozamai",
  displayName: "YarnByAmara",
  avatar: "https://i.pravatar.cc/80?img=32",
  address: "Accra, Ghana",
  phone: "+233 24 000 1234",
  email: "amara@demo.com",
  workTypes: ["Crochet", "Knitting"],
  otherWork: "",
  createdAt: "2025-01-15T10:00:00.000Z",
};

// ─── Credentials shown on login page ─────────────────────────────────────────

export const DEMO_ACCOUNTS = [
  {
    label: "Demo User",
    description: "Browse & shop as a buyer",
    email: DEMO_USER.email,
    password: "demo1234",
    color: "#c8b6ff",
    icon: "🛍️",
    user: DEMO_USER,
    sellerProfile: null,
  },
  {
    label: "Demo Seller",
    description: "Explore the seller dashboard",
    email: DEMO_SELLER.email,
    password: "demo1234",
    color: "#f4a7b9",
    icon: "🧶",
    user: DEMO_SELLER,
    sellerProfile: DEMO_SELLER_PROFILE,
  },
] as const;
