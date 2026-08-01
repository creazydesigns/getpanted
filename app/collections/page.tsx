"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import { ProductCard } from "../components/product-card";
import { useSiteContent } from "@/hooks/use-site-content";
import { useProducts } from "@/hooks/use-products";
import type { ProductFilterTag } from "@/lib/products/types";
import "../storefront.css";

type FilterKey = "all" | ProductFilterTag;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Styles" },
  { key: "new", label: "New In" },
  { key: "solid", label: "Solid Luxe" },
];

const SORT_OPTIONS = ["Featured", "Newest First", "Price: Low to High", "Price: High to Low"];

export default function CollectionsPage() {
  const { get } = useSiteContent();
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortBy, setSortBy] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const sortRef = useRef<HTMLDivElement>(null);
  useScrollReveal();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProducts = useMemo(() => {
    const base = products.filter(
      (p) => activeFilter === "all" || p.categories.includes(activeFilter)
    );
    switch (sortBy) {
      case "Newest First":
        return [...base].sort((a, b) => b.sortKey - a.sortKey);
      case "Price: Low to High":
        return [...base].sort((a, b) => a.priceRaw - b.priceRaw);
      case "Price: High to Low":
        return [...base].sort((a, b) => b.priceRaw - a.priceRaw);
      default:
        return base;
    }
  }, [products, activeFilter, sortBy]);

  useEffect(() => {
    setVisibleCount(8);
  }, [activeFilter, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <StorefrontHeader
        eyebrow="Collections"
        title={get("collections.banner_headline")}
        description="Every drop and every silhouette. PRESENCE is our debut collection — explore elevated trousers designed for intentional dressing."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Collections" },
        ]}
      />

      {/* ── PRESENCE EDITORIAL ───────────────────────────────────────────── */}
      <section className="hp-section py-12 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="hp-editorial" data-reveal="fade">
            <div className="absolute inset-0">
              <div className="hp-placeholder absolute inset-0">Editorial Image Placeholder</div>
            </div>
            <p className="hp-editorial-title">PRESENCE</p>
            <div className="hp-editorial-panel">
              <p className="hp-eyebrow mb-3">Introducing Our First Drop</p>
              <p className="hp-body mb-6">
                PRESENCE is our debut collection — the first expression of the GetPanted woman. Clean
                silhouettes, intentional fit, and a refined balance of minimal and bold.
              </p>
              <p className="hp-body-sm mb-6">The debut drop. Not the whole brand — the first chapter.</p>
              <Link href="/collections" className="btn-hp-primary">
                Shop PRESENCE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRODUCT SECTION ──────────────────────────────────────────────── */}
      <section className="hp-section py-14 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className={`hp-chip${activeFilter === f.key ? " is-active" : ""}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <span className="hp-body-sm">
                {visibleProducts.length} of {filteredProducts.length} styles
              </span>
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="hp-chip inline-flex items-center gap-2"
                >
                  {sortBy}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {sortOpen && (
                  <div
                    className="absolute right-0 top-full mt-1 z-30 py-1"
                    style={{ background: "#FFFFFF", border: "1px solid #E8E8E8", minWidth: "200px" }}
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setSortBy(opt);
                          setSortOpen(false);
                        }}
                        className="w-full text-left font-barlow-cond font-bold uppercase transition-colors hover:text-[#5C2D8F]"
                        style={{
                          fontSize: "11px",
                          letterSpacing: "0.1em",
                          padding: "10px 16px",
                          color: "#6B6B6B",
                        }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {loading ? (
              <p className="hp-body col-span-full text-center py-16">Loading collection…</p>
            ) : (
              visibleProducts.map((p) => <ProductCard key={p.id} product={p} quickAdd />)
            )}
          </div>

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <p
                className="font-barlow-cond font-bold uppercase"
                style={{ fontSize: "20px", color: "#6B6B6B" }}
              >
                Nothing here yet
              </p>
              <p className="hp-body-sm mt-2">Try a different filter</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-16">
              {visibleCount < filteredProducts.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="btn-hp-outline"
                >
                  Load More
                </button>
              )}
              <p className="hp-body-sm mt-4">
                Showing {visibleProducts.length} of {filteredProducts.length} styles
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── MADE TO ORDER CTA ────────────────────────────────────────────── */}
      <section className="hp-soft-band">
        <div className="hp-section py-16 md:py-20">
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="hp-eyebrow mb-4">Made to Order</p>
              <h2
                className="font-barlow-cond font-bold uppercase mb-4"
                style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "#1A1A1A", lineHeight: 1.05 }}
              >
                Missed your size? We can make it again.
              </h2>
              <p className="hp-body mb-8 max-w-[420px]">
                Selected sold-out pieces may be available through made-to-order. We confirm availability,
                price, and production timeline before your piece goes into production.
              </p>
              <Link href="/made-to-order" className="btn-hp-primary">
                Request Made to Order
              </Link>
            </div>
            <div
              className="flex items-center justify-center"
              style={{ aspectRatio: "4/3", background: "#FFFFFF", border: "1px solid #E8E8E8" }}
            >
              <div className="text-center">
                <svg
                  viewBox="0 0 120 80"
                  fill="none"
                  className="w-20 mx-auto mb-4"
                  style={{ opacity: 0.15 }}
                >
                  <path
                    d="M10 70 C20 40 40 20 60 10 C80 20 100 40 110 70"
                    stroke="#5C2D8F"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="60" cy="10" r="6" fill="#5C2D8F" />
                </svg>
                <p
                  className="font-barlow-cond font-bold uppercase"
                  style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#6B6B6B" }}
                >
                  Measured. Made. Yours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
