// ─── Footer ───────────────────────────────────────────────────────────────────
// Warm dark-brown background, 4-column grid, crochet dot texture overlay.

// ─── Social icons ─────────────────────────────────────────────────────────────

const IconInstagram = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const IconPinterest = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.48-.25 1.04.52 1.88 1.54 1.88 1.85 0 3.09-2.37 3.09-5.17 0-2.14-1.44-3.64-3.5-3.64-2.38 0-3.78 1.79-3.78 3.63 0 .72.28 1.49.62 1.91.07.08.08.15.06.24-.06.26-.2.84-.23.96-.04.15-.13.18-.3.11-1.12-.52-1.82-2.17-1.82-3.49 0-2.84 2.06-5.44 5.94-5.44 3.12 0 5.54 2.22 5.54 5.19 0 3.1-1.95 5.59-4.65 5.59-.91 0-1.76-.47-2.05-1.03l-.56 2.08c-.2.78-.75 1.75-1.12 2.34.84.26 1.74.4 2.67.4 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
  </svg>
);

const IconTikTok = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const IconYoutube = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

// ─── FooterColumn ─────────────────────────────────────────────────────────────

interface FooterColumnProps {
  heading: string;
  links: { label: string; href: string }[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#f4a7b9",
          marginBottom: 20,
        }}
      >
        {heading}
      </h4>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="footer-link"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 400,
                fontSize: 13.5,
                color: "rgba(245,230,204,0.72)",
                textDecoration: "none",
                transition: "color 220ms ease",
                display: "inline-block",
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Social button ────────────────────────────────────────────────────────────

function SocialBtn({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="social-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: "rgba(245,230,204,0.08)",
        border: "1px solid rgba(245,230,204,0.12)",
        color: "rgba(245,230,204,0.7)",
        textDecoration: "none",
        transition: "transform 240ms cubic-bezier(0.34,1.56,0.64,1), background 220ms ease, color 220ms ease",
      }}
    >
      {children}
    </a>
  );
}

// ─── Main Footer ──────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        background: "#2f1f1a",
        overflow: "hidden",
      }}
    >
      {/* Crochet dot texture */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(245,230,204,0.045) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Warm glow blobs */}
      <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 340, height: 340,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(244,167,185,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: -80, left: -60, width: 260, height: 260,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(200,182,255,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Yarn thread divider at top */}
      <div style={{ position: "relative", height: 3, overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, #f4a7b9 25%, #c8b6ff 50%, #c4a484 75%, transparent 100%)",
          opacity: 0.6,
        }} />
        {/* Subtle wave on the divider */}
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          viewBox="0 0 1200 3" preserveAspectRatio="none">
          <path d="M0 1.5 Q150 0 300 1.5 Q450 3 600 1.5 Q750 0 900 1.5 Q1050 3 1200 1.5"
            stroke="rgba(245,230,204,0.25)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      {/* ── Main grid ── */}
      <div
        className="footer-grid"
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "64px 32px 48px",
          display: "grid",
          gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
          gap: "48px 40px",
        }}
      >
        {/* ── Column 1: Brand ── */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "linear-gradient(135deg, #f4a7b9 0%, #c4a484 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(244,167,185,0.3)",
              flexShrink: 0,
            }}>
              <span style={{ color: "#fff", fontSize: 18, lineHeight: 1 }}>✦</span>
            </div>
            <div>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 16,
                color: "#f5e6cc", margin: 0, lineHeight: 1.1 }}>Feedle</p>
              <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 10.5,
                color: "rgba(245,230,204,0.5)", margin: 0, letterSpacing: "0.08em" }}>with Love</p>
            </div>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 13,
            color: "rgba(245,230,204,0.6)", lineHeight: 1.75, marginBottom: 24, maxWidth: 240,
          }}>
            A marketplace for handcrafted crochet pieces — made slowly, with care, by real people who love their craft.
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 10 }}>
            <SocialBtn href="#" label="Instagram"><IconInstagram /></SocialBtn>
            <SocialBtn href="#" label="Pinterest"><IconPinterest /></SocialBtn>
            <SocialBtn href="#" label="TikTok"><IconTikTok /></SocialBtn>
            <SocialBtn href="#" label="YouTube"><IconYoutube /></SocialBtn>
          </div>
        </div>

        {/* ── Column 2: Shop ── */}
        <FooterColumn
          heading="Shop"
          links={[
            { label: "All Products",   href: "#" },
            { label: "New Arrivals",   href: "#" },
            { label: "Seasonal Picks", href: "#" },
            { label: "Best Sellers",   href: "#" },
          ]}
        />

        {/* ── Column 3: Company ── */}
        <FooterColumn
          heading="Company"
          links={[
            { label: "About Us",        href: "#" },
            { label: "Our Story",       href: "#" },
            { label: "Become a Seller", href: "#" },
            { label: "Careers",         href: "#" },
          ]}
        />

        {/* ── Column 4: Support ── */}
        <FooterColumn
          heading="Support"
          links={[
            { label: "Contact Us",        href: "#" },
            { label: "FAQs",              href: "#" },
            { label: "Shipping & Returns",href: "#" },
            { label: "Privacy Policy",    href: "#" },
          ]}
        />
      </div>

      {/* ── Bottom bar ── */}
      <div
        style={{
          position: "relative",
          borderTop: "1px solid rgba(245,230,204,0.08)",
        }}
      >
        <div
          className="footer-bottom"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "18px 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 400, fontSize: 12,
            color: "rgba(245,230,204,0.38)", margin: 0 }}>
            © 2026 Handmade with Love. All rights reserved.
          </p>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontWeight: 500, fontSize: 12,
            color: "rgba(245,230,204,0.38)", margin: 0 }}>
            Made with love&nbsp;•&nbsp;Handmade marketplace
          </p>
        </div>
      </div>

      {/* ── Hover styles ── */}
      <style>{`
        .footer-link:hover { color: #f4a7b9 !important; }
        .social-btn:hover  { transform: scale(1.15) !important; background: rgba(244,167,185,0.15) !important; color: #f4a7b9 !important; }

        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 36px 24px !important;
          }
        }
        @media (max-width: 480px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .footer-grid > div:first-child {
            align-items: center;
            display: flex;
            flex-direction: column;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 6px !important;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
