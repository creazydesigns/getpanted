"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useShop } from "../context/shop-context";
import { useScrollReveal } from "../hooks/use-scroll-reveal";
import { PageFooter } from "../components/page-footer";

type FilterKey = "all" | "solid" | "new";

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string;
  category: FilterKey[];
  colors: string[];
  badge?: string;
  sizes: string[];
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all",   label: "All Styles" },
  { key: "new",   label: "New In" },
  { key: "solid", label: "Solid Luxe" },
];

const SORT_OPTIONS = ["Featured", "Newest First", "Price: Low to High", "Price: High to Low"];

const PRODUCTS: Product[] = [
  { id: 1,  name: "Royal Pleat",       price: "₦45,000", image: "/images/gp-royal-pleat.png",       category: ["solid"],       colors: ["#6B2D8B"],  badge: "Bestseller", sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 2,  name: "Onyx Statement",    price: "₦38,000", image: "/images/gp-onyx-statement.png",    category: ["solid","new"], colors: ["#1a1a1a"],  badge: "New",        sizes: ["XS","S","M","L","XL","2XL","3XL"] },
  { id: 3,  name: "Ivory Sovereign",   price: "₦42,000", image: "/images/gp-ivory-sovereign.png",   category: ["solid","new"], colors: ["#E8E8E8"],  badge: "New",        sizes: ["S","M","L","XL"] },
  { id: 4,  name: "Sahara Wide",       price: "₦36,000", image: "/images/gp-sahara-wide.png",       category: ["solid","new"], colors: ["#c4a882"],  badge: "New",        sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 5,  name: "Petal Pleat",       price: "₦40,000", image: "/images/gp-petal-pleat.png",       category: ["solid","new"], colors: ["#f4a7b9"],  badge: "New",        sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 6,  name: "Eden Wide",         price: "₦40,000", image: "/images/gp-eden-wide.png",         category: ["solid","new"], colors: ["#4CAF50"],  badge: "New",        sizes: ["S","M","L","XL","2XL"] },
  { id: 7,  name: "Solar Statement",   price: "₦38,000", image: "/images/gp-solar-statement.png",   category: ["solid","new"], colors: ["#FFC107"],  badge: "New",        sizes: ["XS","S","M","L","XL"] },
  { id: 8,  name: "Nude Palazzo",      price: "₦44,000", image: "/images/gp-nude-palazzo.png",      category: ["solid"],       colors: ["#d4b896"],  sizes: ["S","M","L","XL","2XL"] },
  { id: 9,  name: "Cacao Wide",        price: "₦44,000", image: "/images/gp-cacao-wide.png",        category: ["solid"],       colors: ["#3E1C0D"],  sizes: ["XS","S","M","L","XL"] },
  { id: 10, name: "Blush Ultra Wide",  price: "₦41,000", image: "/images/gp-blush-ultra-wide.png",  category: ["solid","new"], colors: ["#f2b8c6"],  badge: "New",        sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 11, name: "Lemon Luxe",        price: "₦39,000", image: "/images/gp-lemon-luxe.png",        category: ["solid","new"], colors: ["#f5e642"],  badge: "New",        sizes: ["S","M","L","XL","2XL"] },
  { id: 12, name: "Peach Sovereign",   price: "₦43,000", image: "/images/gp-peach-sovereign.png",   category: ["solid","new"], colors: ["#f4a07a"],  badge: "New",        sizes: ["XS","S","M","L","XL"] },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      data-reveal="up"
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/products/${product.id}`} className="block">
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4", background: "#F7F7F7" }}>
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 font-barlow-cond font-bold uppercase text-white px-2.5 py-1" style={{ fontSize: "10px", letterSpacing: "0.15em", background: "#1A1A1A" }}>
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={() => toggleWishlist({ id: product.id, name: product.name, price: product.price })}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
          style={{ background: "rgba(0,0,0,0.5)", color: wishlisted ? "#8B52CC" : "white" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill={wishlisted ? "#8B52CC" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
        {/* Size + Add to bag tray */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 py-4 transition-transform duration-300"
          style={{ background: "rgba(10,10,10,0.94)", transform: hovered ? "translateY(0)" : "translateY(100%)" }}
        >
          <div className="flex gap-1.5 flex-wrap mb-3">
            {product.sizes.slice(0, 5).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                className="font-barlow-cond font-bold uppercase px-2 py-1 transition-colors"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  border: `1px solid ${selectedSize === s ? "#8B52CC" : "rgba(255,255,255,0.2)"}`,
                  color: selectedSize === s ? "#8B52CC" : "rgba(255,255,255,0.5)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, ...(selectedSize ? { size: selectedSize } : {}) })}
            className="w-full font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80"
            style={{ fontSize: "11px", letterSpacing: "0.14em", padding: "10px", background: "#5C2D8F" }}
          >
            {selectedSize ? `Add ${selectedSize} to Bag` : "Add to Bag"}
          </button>
        </div>
      </div>
      <div className="pt-4 pb-2" style={{ background: "#FFFFFF" }}>
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-barlow-cond font-bold uppercase" style={{ fontSize: "14px", color: "#1A1A1A" }}>{product.name}</h3>
          <div className="flex gap-1.5 flex-shrink-0">
            {product.colors.map((c, i) => <span key={i} className="w-2.5 h-2.5" style={{ background: c, border: "1px solid #E0E0E0" }} />)}
          </div>
        </div>
        <p className="font-barlow mt-1" style={{ fontSize: "14px", color: "#6B6B6B" }}>{product.price}</p>
      </div>
      </Link>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
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
    const base = PRODUCTS.filter((p) => activeFilter === "all" || p.category.includes(activeFilter));
    const getPrice = (price: string) => Number(price.replace(/[^\d]/g, ""));
    switch (sortBy) {
      case "Newest First":       return [...base].sort((a, b) => b.id - a.id);
      case "Price: Low to High": return [...base].sort((a, b) => getPrice(a.price) - getPrice(b.price));
      case "Price: High to Low": return [...base].sort((a, b) => getPrice(b.price) - getPrice(a.price));
      default: return base;
    }
  }, [activeFilter, sortBy]);

  useEffect(() => { setVisibleCount(8); }, [activeFilter, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-14" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 font-barlow-cond font-bold uppercase mb-6" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>
            <Link href="/" className="hover:text-[#5C2D8F] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#1A1A1A" }}>Collections</span>
          </div>
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>SS 2026</p>
          <h1 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>
            All Collections
          </h1>
          <p className="font-barlow mt-5" style={{ fontSize: "15px", color: "#6B6B6B", maxWidth: "440px", lineHeight: 1.7 }}>
            Every trouser in our range. Filter by style and find the pair that becomes your signature.
          </p>
        </div>
      </section>

      {/* ── PRODUCT SECTION ────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-14" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setActiveFilter(f.key)}
                  className="font-barlow-cond font-bold uppercase transition-all duration-200"
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    padding: "8px 20px",
                    border: `1px solid ${activeFilter === f.key ? "#5C2D8F" : "#E0E0E0"}`,
                    color: activeFilter === f.key ? "#5C2D8F" : "#6B6B6B",
                    background: activeFilter === f.key ? "rgba(92,45,143,0.05)" : "transparent",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {/* Right controls */}
            <div className="flex items-center gap-5">
              <span className="font-barlow-cond" style={{ fontSize: "11px", color: "#6B6B6B" }}>
                {visibleProducts.length} of {filteredProducts.length} styles
              </span>
              <div className="relative" ref={sortRef}>
                <button
                  type="button"
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 font-barlow-cond font-bold uppercase transition-colors hover:border-[#5C2D8F]"
                  style={{ fontSize: "11px", letterSpacing: "0.12em", padding: "8px 16px", border: "1px solid #E0E0E0", color: "#6B6B6B" }}
                >
                  {sortBy}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1 z-30 py-1" style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", minWidth: "200px" }}>
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setSortBy(opt); setSortOpen(false); }}
                        className="w-full text-left font-barlow-cond font-bold uppercase transition-colors hover:text-[#5C2D8F]"
                        style={{ fontSize: "11px", letterSpacing: "0.1em", padding: "10px 16px", color: "#6B6B6B" }}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "2px" }}>
            {visibleProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-24">
              <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "20px", color: "#6B6B6B" }}>Nothing here yet</p>
              <p className="font-barlow mt-2" style={{ fontSize: "13px", color: "#6B6B6B" }}>Try a different filter</p>
            </div>
          )}

          {filteredProducts.length > 0 && (
            <div className="text-center mt-16">
              {visibleCount < filteredProducts.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="font-barlow-cond font-bold uppercase transition-all duration-200 hover:bg-[#1A1A1A] hover:text-white"
                  style={{ fontSize: "11px", letterSpacing: "0.16em", padding: "14px 48px", border: "1px solid #1A1A1A", color: "#1A1A1A" }}
                >
                  Load More
                </button>
              )}
              <p className="font-barlow mt-4" style={{ fontSize: "12px", color: "#6B6B6B" }}>
                Showing {visibleProducts.length} of {filteredProducts.length} styles
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── BESPOKE CTA ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Custom Tailoring</p>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "#1A1A1A", marginBottom: "16px" }}>
              Don't See Your Size? We'll Make It.
            </h2>
            <p className="font-barlow mb-8" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.8, maxWidth: "420px" }}>
              Every body is different. Our custom tailoring creates trousers built exactly to your measurements — same premium fabrics, zero compromise.
            </p>
            <Link
              href="/bespoke"
              className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
              style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
            >
              Start Custom Order
            </Link>
          </div>
          <div className="flex items-center justify-center" style={{ aspectRatio: "4/3", background: "#FFFFFF", borderTop: "4px solid #5C2D8F" }}>
            <div className="text-center">
              <svg viewBox="0 0 120 80" fill="none" className="w-20 mx-auto mb-4" style={{ opacity: 0.15 }}>
                <path d="M10 70 C20 40 40 20 60 10 C80 20 100 40 110 70" stroke="#5C2D8F" strokeWidth="2" fill="none"/>
                <circle cx="60" cy="10" r="6" fill="#5C2D8F"/>
              </svg>
              <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#6B6B6B" }}>Measured. Made. Yours.</p>
            </div>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
