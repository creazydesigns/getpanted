"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import { ProductCard } from "../components/product-card";
import { useProducts } from "@/hooks/use-products";
import "../storefront.css";

type FilterKey = "all" | "new" | "limited";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "new", label: "New In" },
  { key: "limited", label: "Limited" },
];

export default function NewArrivalsPage() {
  const { products, loading } = useProducts();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const hasNewCategory = useMemo(
    () => products.some((p) => p.categories.includes("new")),
    [products]
  );

  const filteredItems = useMemo(() => {
    const base = hasNewCategory
      ? products.filter((p) => p.categories.includes("new"))
      : [...products];

    let items = base;
    if (activeFilter === "new") {
      const byCategory = products.filter((p) => p.categories.includes("new"));
      const byBadge = products.filter(
        (p) =>
          p.badge?.toLowerCase().includes("new") ||
          p.badge?.toLowerCase().includes("just")
      );
      items = byCategory.length > 0 ? byCategory : byBadge.length > 0 ? byBadge : base;
    } else if (activeFilter === "limited") {
      items = products.filter((p) => p.badge?.toLowerCase().includes("limited"));
    }

    return [...items].sort((a, b) =>
      sortNewestFirst ? b.sortKey - a.sortKey : a.sortKey - b.sortKey
    );
  }, [products, activeFilter, sortNewestFirst, hasNewCategory]);

  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <StorefrontHeader
        eyebrow="New Arrivals"
        title="The Latest from GetPanted"
        description="Fresh silhouettes, limited pieces, and elevated trousers designed to move with you."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "New Arrivals" },
        ]}
        actions={
          <div className="flex flex-wrap gap-2">
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
        }
      />

      {/* ── PRODUCT GRID ─────────────────────────────────────────────────── */}
      <section className="hp-section py-14 md:py-16">
        <div className="max-w-[1400px] mx-auto">
          <div
            className="flex items-center justify-between mb-10 py-4"
            style={{ borderBottom: "1px solid #E8E8E8" }}
          >
            <p className="hp-body-sm">
              {loading ? "Loading…" : `${filteredItems.length} styles available`}
            </p>
            <button
              type="button"
              onClick={() => setSortNewestFirst((p) => !p)}
              className="font-barlow-cond font-bold uppercase transition-colors"
              style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#5C2D8F" }}
            >
              Sort: {sortNewestFirst ? "Newest First" : "Oldest First"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10">
            {loading ? (
              <p className="hp-body col-span-full text-center py-16">Loading new arrivals…</p>
            ) : filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-24">
                <p
                  className="font-barlow-cond font-bold uppercase"
                  style={{ fontSize: "20px", color: "#6B6B6B" }}
                >
                  Nothing here yet
                </p>
                <p className="hp-body-sm mt-2">Try a different filter</p>
              </div>
            ) : (
              filteredItems.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>
      </section>

      {/* ── MADE TO ORDER CTA ────────────────────────────────────────────── */}
      <section className="hp-soft-band">
        <div className="hp-section py-16 md:py-20 text-center">
          <p className="hp-eyebrow mb-4">Sold Out in Your Size?</p>
          <h2
            className="font-barlow-cond font-bold uppercase mx-auto mb-6"
            style={{
              fontSize: "clamp(28px, 3vw, 44px)",
              color: "#1A1A1A",
              maxWidth: "480px",
              lineHeight: 1.05,
            }}
          >
            Request made to order.
          </h2>
          <Link href="/made-to-order" className="btn-hp-primary">
            Made to Order
          </Link>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
