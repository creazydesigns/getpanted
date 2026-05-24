"use client";

import Link from "next/link";

export const FOOTER_LINKS: Record<string, string> = {
  "New Arrivals":        "/new-arrivals",
  Collections:           "/collections",
  "Minimal Essentials":  "/collections?style=minimal",
  "Statement Pants":     "/collections?style=statement",
  "Made to Order":       "/made-to-order",
  "About GetPanted":     "/about",
  "Size Guide":          "/size-guide",
  "Care Instructions":   "/about",
  "Shipping & Delivery": "/contact",
  "Returns & Exchanges": "/contact",
  "Contact Us":          "/contact",
  FAQs:                  "/contact",
  "Track Order":         "/contact",
  "WhatsApp Support":    "https://wa.me/2348000000000",
};

export function PageFooter() {
  return (
    <footer
      className="px-5 md:px-12"
      style={{ background: "#1A1A1A", paddingTop: "64px", paddingBottom: "32px" }}
    >
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-12">
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-playfair font-bold tracking-[0.18em] uppercase inline-block"
              style={{ fontSize: "20px" }}
            >
              <span style={{ color: "#FFFFFF" }}>Get</span>
              <span style={{ color: "#8B52CC" }}>Panted</span>
            </Link>
            <p className="font-barlow mt-4" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.7 }}>
              GetPanted creates elevated trousers for women who dress with intention.
            </p>
          </div>
          <div className="flex gap-5">
            {[
              { name: "instagram", href: "https://instagram.com/getpanted" },
              { name: "tiktok",    href: "https://tiktok.com/@getpanted" },
              { name: "whatsapp",  href: "https://wa.me/2348000000000" },
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
                {s.name === "whatsapp" && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {[
            { title: "Shop", links: ["New Arrivals", "Collections", "Minimal Essentials", "Statement Pants", "Made to Order"] },
            { title: "Info", links: ["About GetPanted", "Size Guide", "Care Instructions", "Shipping & Delivery", "Returns & Exchanges"] },
            { title: "Help", links: ["Contact Us", "FAQs", "Track Order", "WhatsApp Support"] },
          ].map((col) => (
            <div key={col.title}>
              <p
                className="font-barlow-cond font-bold uppercase mb-5"
                style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#6B6B6B" }}
              >
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => {
                  const href = FOOTER_LINKS[link] ?? "/about";
                  const isExternal = href.startsWith("http");
                  return (
                    <li key={link}>
                      {isExternal ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-barlow transition-colors duration-200 hover:text-white"
                          style={{ fontSize: "14px", color: "#6B6B6B" }}
                        >
                          {link}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="font-barlow transition-colors duration-200 hover:text-white"
                          style={{ fontSize: "14px", color: "#6B6B6B" }}
                        >
                          {link}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B" }}>
            © 2026 GetPanted. Lagos, Nigeria. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
