"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

const ENTRIES = [
  {
    title: "New Arrivals",
    subtitle: "The latest from GetPanted",
    href: "/new-arrivals",
  },
  {
    title: "Collections",
    subtitle: "All drops including PRESENCE",
    href: "/collections",
  },
  {
    title: "Made to Order",
    subtitle: "Request sold-out pieces again",
    href: "/made-to-order",
  },
];

const QUICK_LINKS = [
  { label: "About GetPanted", href: "/about" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Contact Us", href: "/contact" },
  { label: "Made to Order", href: "/made-to-order" },
];

export default function ShopPage() {
  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <StorefrontHeader
        eyebrow="Shop"
        title="Find Your Signature Pair"
        description="Browse new arrivals, explore collections, or request a sold-out piece through made to order."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
      />

      {/* ── SHOP ENTRIES ─────────────────────────────────────────────────── */}
      <section className="hp-section py-14 md:py-16">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          {ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group flex flex-col justify-between transition-colors"
              style={{
                background: "#F7F7F7",
                border: "1px solid #E8E8E8",
                padding: "40px 32px",
                minHeight: "220px",
                textDecoration: "none",
              }}
            >
              <div>
                <p className="hp-eyebrow mb-4">{entry.subtitle}</p>
                <h2
                  className="font-barlow-cond font-bold uppercase"
                  style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "#1A1A1A", lineHeight: 1.05 }}
                >
                  {entry.title}
                </h2>
              </div>
              <div className="flex items-center justify-between mt-10">
                <span
                  className="font-barlow-cond font-bold uppercase transition-colors group-hover:text-[#5C2D8F]"
                  style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}
                >
                  Enter
                </span>
                <span
                  className="w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:border-[#5C2D8F] group-hover:text-[#5C2D8F]"
                  style={{ border: "1px solid #E8E8E8", color: "#6B6B6B" }}
                  aria-hidden
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m5 12 14 0M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ──────────────────────────────────────────────────── */}
      <section className="hp-section pb-16 md:pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-2 pt-8" style={{ borderTop: "1px solid #E8E8E8" }}>
            {QUICK_LINKS.map((link) => (
              <Link key={link.href + link.label} href={link.href} className="hp-chip">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
