"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";

const ENTRIES = [
  { title: "New Arrivals",  subtitle: "Fresh drops every week",       href: "/new-arrivals", icon: "→" },
  { title: "Collections",  subtitle: "Shop every line and filter",    href: "/collections",  icon: "→" },
  { title: "Bespoke",      subtitle: "Made-to-measure in Lagos",      href: "/bespoke",      icon: "→" },
];

export default function ShopPage() {
  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-14" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Shop</p>
          <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>
            Find Your Signature Pair
          </h1>
          <p className="font-barlow mt-5" style={{ fontSize: "15px", color: "#6B6B6B", maxWidth: "480px", lineHeight: 1.7 }}>
            Browse new drops, full collections, or go bespoke. Everything ships from Lagos with the same wide-leg confidence.
          </p>
        </div>
      </section>

      {/* ── SHOP ENTRIES ───────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-16" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px", background: "#F0F0F0" }}>
          {ENTRIES.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group flex flex-col justify-between"
              style={{ background: "#FFFFFF", padding: "56px 48px", minHeight: "260px", transition: "background 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFAFA")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
            >
              <div>
                <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#5C2D8F" }}>{entry.subtitle}</p>
                <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "#1A1A1A" }}>{entry.title}</h2>
              </div>
              <div className="flex items-center justify-between mt-8">
                <span className="font-barlow-cond font-bold uppercase transition-colors group-hover:text-[#5C2D8F]" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>
                  Enter
                </span>
                <div
                  className="w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#5C2D8F] group-hover:text-white"
                  style={{ border: "1px solid #E0E0E0", color: "#6B6B6B" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m5 12 14 0M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── QUICK LINKS ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pb-20" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-3 pt-8" style={{ borderTop: "1px solid #F0F0F0" }}>
            {[
              { label: "About GetPanted", href: "/about" },
              { label: "Size Guide",      href: "/bespoke" },
              { label: "Care Guide",      href: "/about" },
              { label: "Contact Us",      href: "/about" },
            ].map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="font-barlow-cond font-bold uppercase transition-all duration-200 hover:border-[#5C2D8F] hover:text-[#5C2D8F]"
                style={{ fontSize: "11px", letterSpacing: "0.14em", padding: "10px 20px", border: "1px solid #E0E0E0", color: "#6B6B6B" }}
              >
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
