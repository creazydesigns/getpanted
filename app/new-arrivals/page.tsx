"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useShop } from "../context/shop-context";
import { PageFooter } from "../components/page-footer";

interface ArrivalItem {
  id: number;
  name: string;
  price: string;
  tag: string;
  colors: string[];
}

const NEW_ARRIVALS: ArrivalItem[] = [
  { id: 1, name: "Royal Pleat Wide-Leg",  price: "₦45,000", tag: "Just In",  colors: ["#6B2D8B", "#0A0A0A", "#8A8680"] },
  { id: 2, name: "Onyx Power Trousers",   price: "₦38,000", tag: "Limited",  colors: ["#0A0A0A", "#E8E8E8", "#7E7E7E"] },
  { id: 3, name: "Ivory Sovereign Cut",   price: "₦42,000", tag: "Just In",  colors: ["#E8E8E8", "#8A8680"] },
  { id: 4, name: "Sahara High-Waist",     price: "₦36,000", tag: "Top Pick", colors: ["#C4A882", "#0A0A0A", "#6B2D8B"] },
  { id: 5, name: "Emerald Flow Trouser",  price: "₦41,000", tag: "Just In",  colors: ["#153D2E", "#E8E3D8", "#0A0A0A"] },
  { id: 6, name: "Noir Soft Drape",       price: "₦39,000", tag: "Top Pick", colors: ["#101010", "#8A8680"] },
  { id: 7, name: "Rose Gold Panel",       price: "₦44,000", tag: "Limited",  colors: ["#C2878B", "#282828"] },
  { id: 8, name: "Midnight Palazzo",      price: "₦40,000", tag: "Just In",  colors: ["#171923", "#8A8680"] },
];

const FILTERS = ["All", "Wide-Leg", "High-Waist", "Limited", "In Stock", "Under ₦45k"] as const;

export default function NewArrivalsPage() {
  const { addToCart, toggleWishlist, isWishlisted } = useShop();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const filteredItems = useMemo(() => {
    let items = [...NEW_ARRIVALS];
    if (activeFilter === "Limited")       items = items.filter((i) => i.tag === "Limited");
    else if (activeFilter === "Under ₦45k") items = items.filter((i) => Number(i.price.replace(/[^\d]/g, "")) <= 45000);
    items.sort((a, b) => (sortNewestFirst ? b.id - a.id : a.id - b.id));
    return items;
  }, [activeFilter, sortNewestFirst]);

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-14" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10 items-end">
          <div>
            <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Fresh Drop</p>
            <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>
              New Arrivals
            </h1>
            <p className="font-barlow mt-5" style={{ fontSize: "15px", color: "#6B6B6B", maxWidth: "440px", lineHeight: 1.7 }}>
              This week's latest silhouettes — tailored for movement and statement. Built in Lagos with premium fabrics and signature wide-leg confidence.
            </p>
          </div>
          {/* Filter chips */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {FILTERS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => setActiveFilter(chip)}
                className="font-barlow-cond font-bold uppercase transition-all duration-200"
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  padding: "10px 12px",
                  border: `1px solid ${activeFilter === chip ? "#5C2D8F" : "#E0E0E0"}`,
                  color: activeFilter === chip ? "#5C2D8F" : "#6B6B6B",
                  background: activeFilter === chip ? "rgba(92,45,143,0.04)" : "transparent",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT GRID ───────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-14" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Toolbar */}
          <div
            className="flex items-center justify-between mb-10 py-4 font-barlow-cond font-bold uppercase"
            style={{ borderBottom: "1px solid #F0F0F0", fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}
          >
            <p>{filteredItems.length} styles available</p>
            <button
              type="button"
              onClick={() => setSortNewestFirst((p) => !p)}
              className="transition-colors"
              style={{ color: "#5C2D8F" }}
            >
              Sort: {sortNewestFirst ? "Newest First" : "Oldest First"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "2px" }}>
            {filteredItems.map((item) => {
              const wishlisted = isWishlisted(1000 + item.id);
              return (
                <article key={item.id} className="group">
                  <div className="relative mb-0 overflow-hidden" style={{ aspectRatio: "3/4", background: "#F7F7F7" }}>
                    {/* Tag badge */}
                    <span className="absolute top-3 left-3 font-barlow-cond font-bold uppercase text-white" style={{ fontSize: "9px", letterSpacing: "0.15em", padding: "4px 10px", background: "#1A1A1A", zIndex: 1 }}>
                      {item.tag}
                    </span>
                    {/* Placeholder silhouette */}
                    <div className="flex h-full items-center justify-center transition-transform duration-500 group-hover:scale-105">
                      <svg viewBox="0 0 160 320" fill="none" className="w-1/2 opacity-[0.12]">
                        <ellipse cx="80" cy="48" rx="28" ry="28" fill="#5C2D8F" />
                        <path d="M52 76 C40 96 36 160 28 224 C22 272 20 312 26 320 L134 320 C140 312 138 272 132 224 C124 160 120 96 108 76 Z" fill="#5C2D8F" />
                      </svg>
                    </div>
                    {/* Wishlist */}
                    <button
                      type="button"
                      aria-label="Wishlist"
                      onClick={() => toggleWishlist({ id: 1000 + item.id, name: item.name, price: item.price })}
                      className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
                      style={{ background: "rgba(0,0,0,0.5)", color: wishlisted ? "#8B52CC" : "white" }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill={wishlisted ? "#8B52CC" : "none"} stroke="currentColor" strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {/* Add to bag tray */}
                    <button
                      type="button"
                      onClick={() => addToCart({ id: 1000 + item.id, name: item.name, price: item.price })}
                      className="absolute bottom-0 left-0 right-0 font-barlow-cond font-bold uppercase transition-transform duration-300 group-hover:translate-y-0"
                      style={{ fontSize: "10px", letterSpacing: "0.14em", padding: "12px", background: "#5C2D8F", color: "white", transform: "translateY(100%)" }}
                    >
                      Add to Bag
                    </button>
                  </div>
                  <div className="pt-4 pb-3" style={{ background: "#FFFFFF" }}>
                    <h2 className="font-barlow-cond font-bold uppercase" style={{ fontSize: "13px", color: "#1A1A1A", marginBottom: "4px" }}>{item.name}</h2>
                    <div className="flex items-center justify-between">
                      <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B" }}>{item.price}</p>
                      <div className="flex gap-1.5">
                        {item.colors.map((c) => <span key={c} className="w-2.5 h-2.5" style={{ background: c, border: "1px solid #E0E0E0" }} />)}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20 text-center" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Don't See Your Size?</p>
        <h2 className="mx-auto mb-6" style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "#1A1A1A", maxWidth: "420px" }}>We Make It to Measure.</h2>
        <Link
          href="/bespoke"
          className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
          style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
        >
          Book Bespoke
        </Link>
      </section>

      <PageFooter />
    </main>
  );
}
