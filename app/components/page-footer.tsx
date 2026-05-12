import Link from "next/link";

const FOOTER_LINKS: Record<string, string> = {
  "New Arrivals":       "/new-arrivals",
  Bestsellers:          "/collections",
  "Solid Luxe":         "/collections",
  Printed:              "/collections",
  "Coord Sets":         "/collections",
  Sale:                 "/collections",
  "About GetPanted":    "/about",
  Sustainability:       "/about",
  "Size Guide":         "/bespoke",
  "Care Instructions":  "/about",
  FAQs:                 "/bespoke",
  "Shipping & Returns": "/checkout",
  "Track Order":        "/checkout",
  "Contact Us":         "/about",
  Wholesale:            "/about",
};

export function PageFooter() {
  return (
    <footer
      className="px-5 md:px-12"
      style={{ background: "#1A1A1A", paddingTop: "64px", paddingBottom: "32px" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="font-playfair font-bold tracking-[0.18em] uppercase"
            style={{ fontSize: "20px" }}
          >
            <span style={{ color: "#FFFFFF" }}>Get</span>
            <span style={{ color: "#8B52CC" }}>Panted</span>
          </Link>
          <div className="flex gap-5">
            {[
              { name: "instagram", href: "https://instagram.com" },
              { name: "tiktok",    href: "https://tiktok.com" },
              { name: "twitter",   href: "https://x.com" },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="transition-colors duration-200 hover:text-white"
                style={{ color: "#6B6B6B" }}
              >
                {s.name === "instagram" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                  </svg>
                )}
                {s.name === "tiktok" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                )}
                {s.name === "twitter" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M4 4l16 16M4 20L20 4" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {[
            { title: "Shop", links: ["New Arrivals", "Bestsellers", "Solid Luxe", "Printed", "Coord Sets", "Sale"] },
            { title: "Info", links: ["About GetPanted", "Sustainability", "Size Guide", "Care Instructions"] },
            { title: "Help", links: ["FAQs", "Shipping & Returns", "Track Order", "Contact Us", "Wholesale"] },
          ].map((col) => (
            <div key={col.title}>
              <p
                className="font-barlow-cond font-bold uppercase mb-5"
                style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#6B6B6B" }}
              >
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={FOOTER_LINKS[link] ?? "/about"}
                      className="font-barlow transition-colors duration-200 hover:text-white"
                      style={{ fontSize: "14px", color: "#6B6B6B" }}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B" }}>
            © 2026 GetPanted. All rights reserved. Lagos, Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
