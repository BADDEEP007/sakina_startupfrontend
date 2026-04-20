import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconHome = ({ a }: { a: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#fff" : "#6B6B6B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" /><path d="M9 21V12h6v9" />
  </svg>
);

const IconExplore = ({ a }: { a: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#fff" : "#6B6B6B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);

const IconCart = ({ a, badge }: { a: boolean; badge: number }) => (
  <div style={{ position: "relative", display: "inline-flex" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#fff" : "#6B6B6B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
    {badge > 0 && (
      <span style={{ position: "absolute", top: -6, right: -8, minWidth: 16, height: 16, borderRadius: 8, background: "#C45E73", color: "#fff", fontFamily: "'Inter',sans-serif", fontWeight: 700, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", border: "1.5px solid #fff" }}>
        {badge > 99 ? "99+" : badge}
      </span>
    )}
  </div>
);

const IconOrders = ({ a }: { a: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#fff" : "#6B6B6B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" />
  </svg>
);

const IconProfile = ({ a }: { a: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a ? "#fff" : "#6B6B6B"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

export default function MobileBottomNav() {
  const [location, setLocation] = useLocation();
  const { totalItems, openDrawer } = useCart();
  const { isLoggedIn } = useAuth();

  const isActive = (href: string) =>
    href === "/" ? location === "/" : location.startsWith(href);

  const items = [
    { id: "home",    label: "Home",    href: "/",            icon: (a: boolean) => <IconHome a={a} /> },
    { id: "explore", label: "Explore", href: "/marketplace", icon: (a: boolean) => <IconExplore a={a} /> },
    { id: "cart",    label: "Cart",    href: "/cart",        icon: (a: boolean) => <IconCart a={a} badge={totalItems} />, onTap: () => openDrawer() },
    { id: "orders",  label: "Orders",  href: "/orders",      icon: (a: boolean) => <IconOrders a={a} /> },
    { id: "profile", label: "Profile", href: isLoggedIn ? "/profile" : "/login", icon: (a: boolean) => <IconProfile a={a} /> },
  ];

  return (
    <>
      {/* Spacer so page content isn't hidden behind the bar */}
      <div className="block md:hidden" style={{ height: 72 }} aria-hidden />

      <nav
        className="block md:hidden"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
          background: "#FDFAF7",
          borderTop: "1px solid rgba(42,42,42,0.07)",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: 64, padding: "0 8px" }}>
          {items.map((item) => {
            const active = isActive(item.href);
            return (
              <button
                key={item.id}
                onClick={() => { if (item.onTap) item.onTap(); else setLocation(item.href); }}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                  justifyContent: "flex-end", gap: 4, paddingBottom: 10,
                  background: "none", border: "none", cursor: "pointer",
                  transform: active ? "translateY(-8px)" : "translateY(0)",
                  transition: "transform 280ms cubic-bezier(0.34,1.56,0.64,1)",
                }}
              >
                {/* Icon pill */}
                <div style={{
                  width: active ? 52 : 36, height: 36,
                  borderRadius: active ? 18 : 10,
                  background: active ? "#C45E73" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: active ? "0 4px 14px rgba(196,94,115,0.40)" : "none",
                  transition: "width 280ms cubic-bezier(0.34,1.56,0.64,1), border-radius 280ms ease, background 200ms ease",
                }}>
                  {item.icon(active)}
                </div>
                {/* Label */}
                <span style={{
                  fontFamily: "'Inter','Poppins',sans-serif",
                  fontWeight: active ? 600 : 400, fontSize: 10,
                  color: active ? "#C45E73" : "#8A8A8A",
                  transition: "color 200ms ease", lineHeight: 1,
                }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
