import { ShoppingCart, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSeller } from "@/contexts/SellerContext";
import ProfileDropdown from "@/components/ProfileDropdown";

/** Desktop-only sticky navbar. Hidden on mobile — mobile uses MobileBottomNav. */
export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { totalItems, openDrawer } = useCart();
  const { isLoggedIn, isSeller, logout } = useAuth();
  const { openPanel } = useSeller();

  const navLinks = [
    { label: "Home",    href: "/" },
    { label: "Shop",    href: "/marketplace" },
    { label: "About",   href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    /* md:flex — visible only on tablet+ */
    <nav
      className="sticky top-0 z-50 w-full hidden md:block"
      style={{
        background: "#F5F1ED",
        borderBottom: "1px solid rgba(42,42,42,0.08)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm" style={{ background: "#C45E73" }}>
            <span className="text-white font-playfair text-lg font-bold">✦</span>
          </div>
          <div>
            <p className="text-lg font-playfair font-bold leading-tight" style={{ color: "#2A2A2A" }}>Feedle</p>
            <p className="text-xs font-poppins" style={{ color: "#4A4A4A" }}>with Love</p>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              className="text-sm font-poppins transition-colors duration-300 relative group no-underline"
              style={{ color: "#4A4A4A" }}>
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" style={{ background: "#C45E73" }} />
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {isLoggedIn && (
            isSeller ? (
              <button onClick={openPanel}
                className="text-sm font-poppins font-semibold px-4 py-2 rounded-full"
                style={{ background: "#C45E73", color: "#fff", border: "none", boxShadow: "0 3px 10px rgba(196,94,115,0.3)" }}>
                Seller Dashboard
              </button>
            ) : (
              <button onClick={() => setLocation("/seller/onboarding")}
                className="text-sm font-poppins font-semibold px-4 py-2 rounded-full border"
                style={{ borderColor: "#C45E73", color: "#C45E73" }}>
                Become a Seller
              </button>
            )
          )}
          <ProfileDropdown />
          {isLoggedIn && (
            <button onClick={() => setLocation("/orders")}
              className="text-sm font-poppins px-3 py-2 rounded-full"
              style={{ color: "#4A4A4A", background: "none", border: "none", cursor: "pointer" }}>
              My Orders
            </button>
          )}
          {isLoggedIn && (
            <button onClick={() => { logout(); setLocation("/"); }} title="Log out"
              className="p-2 rounded-full" style={{ color: "#4A4A4A", background: "none", border: "none", cursor: "pointer" }}>
              <LogOut size={18} />
            </button>
          )}
          <button className="p-2 rounded-full relative" style={{ color: "#4A4A4A" }}
            aria-label="Cart" onClick={openDrawer}>
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-white font-poppins font-bold"
                style={{ fontSize: 10, padding: "0 4px", background: "#C45E73" }}>
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
