"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useShop } from "../context/shop-context";

interface ArrivalItem {
  id: number;
  name: string;
  price: string;
  tag: string;
  colors: string[];
}

const NEW_ARRIVALS: ArrivalItem[] = [
  { id: 1, name: "Royal Pleat Wide-Leg", price: "₦45,000", tag: "Just In", colors: ["#6B2D8B", "#0A0A0A", "#C9A96E"] },
  { id: 2, name: "Onyx Power Trousers", price: "₦38,000", tag: "Limited", colors: ["#0A0A0A", "#F5F0E8", "#7E7E7E"] },
  { id: 3, name: "Ivory Sovereign Cut", price: "₦42,000", tag: "Just In", colors: ["#F5F0E8", "#C9A96E", "#A4A4A4"] },
  { id: 4, name: "Sahara High-Waist", price: "₦36,000", tag: "Top Pick", colors: ["#C4A882", "#0A0A0A", "#6B2D8B"] },
  { id: 5, name: "Emerald Flow Trouser", price: "₦41,000", tag: "Just In", colors: ["#153D2E", "#E8E3D8", "#0A0A0A"] },
  { id: 6, name: "Noir Soft Drape", price: "₦39,000", tag: "Top Pick", colors: ["#101010", "#D4B27D", "#8F8F8F"] },
  { id: 7, name: "Rose Gold Panel", price: "₦44,000", tag: "Limited", colors: ["#C2878B", "#282828", "#E8D4B7"] },
  { id: 8, name: "Midnight Palazzo", price: "₦40,000", tag: "Just In", colors: ["#171923", "#C9A96E", "#EDEDED"] },
];

const FILTERS = ["All", "Wide-Leg", "High-Waist", "Limited", "In Stock", "Under ₦45k"] as const;

export default function NewArrivalsPage() {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const filteredItems = useMemo(() => {
    let items = [...NEW_ARRIVALS];

    if (activeFilter === "Limited") {
      items = items.filter((item) => item.tag === "Limited");
    } else if (activeFilter === "Under ₦45k") {
      items = items.filter((item) => Number(item.price.replace(/[^\d]/g, "")) <= 45000);
    } else if (activeFilter === "Wide-Leg" || activeFilter === "High-Waist") {
      // Placeholder products are trouser cuts; keep all visible for these style buckets.
      items = items;
    } else if (activeFilter === "In Stock") {
      items = items;
    }

    items.sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id));
    return items;
  }, [activeFilter, sortNewestFirst]);

  return (
    <main className="min-h-screen bg-[var(--gp-canvas)] text-[var(--gp-fg)]">

      <section className="mx-auto grid w-full max-w-[1400px] gap-10 px-8 pb-10 pt-24 md:grid-cols-[1.1fr_0.9fr] md:items-end">
        <div>
          <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-[var(--gp-accent)]">Fresh Drop</p>
          <h1 className="mb-5 text-[clamp(38px,6vw,72px)] leading-[1.02]">
            New <em className="text-[var(--gp-accent)] not-italic">Arrivals</em>
          </h1>
          <p className="max-w-xl text-sm leading-8 text-[rgb(var(--gp-fg-rgb) / 0.52)]">
            This week&apos;s latest silhouettes are tailored for movement and statement. Built in Lagos with premium fabrics and
            signature wide-leg confidence.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-[11px] uppercase tracking-[0.14em]">
          {FILTERS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className="border border-[rgb(var(--gp-fg-rgb) / 0.16)] px-4 py-3 text-[rgb(var(--gp-fg-rgb) / 0.66)] transition-colors hover:border-[var(--gp-accent)] hover:text-[var(--gp-accent)]"
              style={{
                borderColor: activeFilter === chip ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.16)",
                color: activeFilter === chip ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.66)",
              }}
            >
              {chip}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1400px] px-8 pb-20">
        <div className="mb-8 flex items-center justify-between border-y border-[rgb(var(--gp-fg-rgb) / 0.08)] py-4 text-[11px] uppercase tracking-[0.14em] text-[rgb(var(--gp-fg-rgb) / 0.45)]">
          <p>{filteredItems.length} styles available</p>
          <button
            type="button"
            onClick={() => setSortNewestFirst((prev) => !prev)}
            className="text-[var(--gp-accent)] hover:text-[#e0c08a] transition-colors"
          >
            Sort: {sortNewestFirst ? "newest first" : "oldest first"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
          {filteredItems.map((item) => (
            <article key={item.id} className="group">
              <div className="relative mb-4 aspect-[3/4] overflow-hidden bg-[var(--gp-card)]">
                <div className="absolute left-3 top-3 bg-[var(--gp-accent)] px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-[var(--gp-accent-ink)]">
                  {item.tag}
                </div>
                <div className="flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <svg viewBox="0 0 160 320" fill="none" className="w-1/2 opacity-[0.16]">
                    <ellipse cx="80" cy="48" rx="28" ry="28" fill="var(--gp-accent)" />
                    <path d="M52 76 C40 96 36 160 28 224 C22 272 20 312 26 320 L134 320 C140 312 138 272 132 224 C124 160 120 96 108 76 Z" fill="var(--gp-accent)" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => addToCart({ id: 1000 + item.id, name: item.name, price: item.price })}
                  className="absolute bottom-0 left-0 right-0 translate-y-full bg-[rgb(var(--gp-ink-rgb) / 0.92)] px-4 py-3 text-[10px] uppercase tracking-[0.14em] text-[var(--gp-accent)] transition-transform duration-300 group-hover:translate-y-0"
                >
                  Add to bag
                </button>
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  onClick={() => toggleWishlist({ id: 1000 + item.id, name: item.name, price: item.price })}
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center bg-[rgb(var(--gp-ink-rgb) / 0.6)] text-[rgb(var(--gp-fg-rgb) / 0.65)] hover:text-[var(--gp-accent)]"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={isWishlisted(1000 + item.id) ? "#c9a96e" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
              <h2 className="mb-1 text-base text-[var(--gp-fg)]">{item.name}</h2>
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--gp-accent)]">{item.price}</p>
                <div className="flex gap-1.5">
                  {item.colors.map((color) => (
                    <span
                      key={`${item.id}-${color}`}
                      className="h-2.5 w-2.5 rounded-full border border-[rgb(var(--gp-fg-rgb) / 0.16)]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
