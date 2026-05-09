"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useShop } from "../context/shop-context";

// ── Types ─────────────────────────────────────────────────────────────────────
type FilterKey = "all" | "solid" | "printed" | "coords" | "denim" | "new";

interface Product {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  image?: string;
  category: FilterKey[];
  colors: string[];
  badge?: string;
  isNew?: boolean;
  sizes: string[];
}

interface Collection {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  itemCount: number;
  accentColor: string;
  bg: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const COLLECTIONS: Collection[] = [
  {
    id: "solid-luxe",
    title: "Solid Luxe",
    subtitle: "The foundation of power dressing",
    description: "Clean lines, rich fabrics, zero distractions. These are the trousers that do the talking.",
    itemCount: 24,
    accentColor: "#c9a96e",
    bg: "from-[#1a1410] via-[#2a1e12] to-[#1a1410]",
  },
  {
    id: "printed",
    title: "Printed",
    subtitle: "Bold patterns for bold women",
    description: "From abstract geometry to fluid florals — print trousers that refuse to whisper.",
    itemCount: 18,
    accentColor: "#8b6b9e",
    bg: "from-[#140f1a] via-[#1e1428] to-[#140f1a]",
  },
  {
    id: "coord-sets",
    title: "Coord Sets",
    subtitle: "Top + bottom, perfectly matched",
    description: "Effortless two-piece sets designed to be worn together or styled apart.",
    itemCount: 12,
    accentColor: "#4a7c6f",
    bg: "from-[#0f1a16] via-[#14241e] to-[#0f1a16]",
  },
  {
    id: "denim",
    title: "Denim Edit",
    subtitle: "Wide-leg denim reimagined",
    description: "Dark-wash, fluid, and impossibly wide. Denim like you've never worn it before.",
    itemCount: 9,
    accentColor: "#4a6080",
    bg: "from-[#0f1420] via-[#14202e] to-[#0f1420]",
  },
];

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Styles" },
  { key: "new", label: "New In" },
  { key: "solid", label: "Solid Luxe" },
  { key: "printed", label: "Printed" },
  { key: "coords", label: "Coord Sets" },
  { key: "denim", label: "Denim Edit" },
];

const SORT_OPTIONS = [
  "Featured",
  "Newest First",
  "Price: Low to High",
  "Price: High to Low",
  "Bestsellers",
];

const PRODUCTS: Product[] = [
  { id: 1,  name: "Royal Pleat",    price: "₦45,000", image: "/images/gp-royal-pleat.png",     category: ["solid"],          colors: ["#6B2D8B"],            badge: "Bestseller", isNew: false, sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 2,  name: "Onyx Statement", price: "₦38,000", image: "/images/gp-onyx-statement.png",  category: ["solid","new"],    colors: ["#1a1a1a"],            badge: "New",        isNew: true,  sizes: ["XS","S","M","L","XL","2XL","3XL"] },
  { id: 3,  name: "Ivory Sovereign",price: "₦42,000", image: "/images/gp-ivory-sovereign.png", category: ["solid","new"],    colors: ["#f5f0e8"],            badge: "New",        isNew: true,  sizes: ["S","M","L","XL"] },
  { id: 4,  name: "Sahara Wide",    price: "₦36,000", image: "/images/gp-sahara-wide.png",     category: ["solid","new"],    colors: ["#c4a882"],            badge: "New",        isNew: true,  sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 5,  name: "Petal Pleat",    price: "₦40,000", image: "/images/gp-petal-pleat.png",     category: ["solid","new"],    colors: ["#f4a7b9"],            badge: "New",        isNew: true,  sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 6,  name: "Eden Wide",      price: "₦40,000", image: "/images/gp-eden-wide.png",       category: ["solid","new"],    colors: ["#4CAF50"],            badge: "New",        isNew: true,  sizes: ["S","M","L","XL","2XL"] },
  { id: 7,  name: "Solar Statement",price: "₦38,000", image: "/images/gp-solar-statement.png", category: ["solid","new"],    colors: ["#FFC107"],            badge: "New",        isNew: true,  sizes: ["XS","S","M","L","XL"] },
  { id: 8,  name: "Nude Palazzo",   price: "₦44,000", image: "/images/gp-nude-palazzo.png",    category: ["solid"],          colors: ["#d4b896"],            badge: undefined,    isNew: false, sizes: ["S","M","L","XL","2XL"] },
  { id: 9,  name: "Cacao Wide",     price: "₦44,000", image: "/images/gp-cacao-wide.png",      category: ["solid"],          colors: ["#3E1C0D"],            badge: undefined,    isNew: false, sizes: ["XS","S","M","L","XL"] },
  { id: 10, name: "Lagos Dot",         price: "₦40,000",                                          category: ["printed"],        colors: ["#ffffff","#1a1a1a"],  badge: "Bestseller", isNew: false, sizes: ["S","M","L","XL","2XL"] },
  { id: 11, name: "Stripe & Pleat Set",price: "₦58,000",                                          category: ["printed","coords"],colors: ["#1a1a1a","#ffffff"], badge: "Set",        isNew: false, sizes: ["XS","S","M","L","XL"] },
  { id: 12, name: "Caramel Geo Set",   price: "₦62,000",                                          category: ["printed","coords"],colors: ["#c4a882","#3a2a10"], badge: "Set",        isNew: false, sizes: ["S","M","L","XL","2XL"] },
  { id: 13, name: "Midnight Ink Print",price: "₦44,000",                                          category: ["printed","new"],  colors: ["#1a1a2e","#f5f0e8"],  badge: "New",        isNew: true,  sizes: ["XS","S","M","L","XL","2XL","3XL"] },
  { id: 14, name: "Pleated Coord — Taupe", price: "₦55,000",                                      category: ["coords","solid"], colors: ["#b8a898","#1a1a1a"],  badge: undefined,    isNew: false, sizes: ["S","M","L","XL"] },
  { id: 15, name: "Amber Wrap Set",    price: "₦60,000",                                          category: ["coords","solid","new"], colors: ["#c4882a","#1a1a1a"], badge: "New",   isNew: true,  sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 16, name: "Dark Wash Drama",   price: "₦48,000",                                          category: ["denim"],          colors: ["#1a2030","#2a3040"],  badge: "Bestseller", isNew: false, sizes: ["XS","S","M","L","XL","2XL"] },
  { id: 17, name: "Indigo Wide",       price: "₦46,000", originalPrice: "₦54,000",                category: ["denim","new"],    colors: ["#2a3a5a","#1a2030"],  badge: "Sale",       isNew: true,  sizes: ["S","M","L","XL","2XL"] },
];

const FOOTER_LINK_HREFS: Record<string, string> = {
  "New Arrivals": "/new-arrivals",
  "Bestsellers": "/collections",
  "Solid Luxe": "/collections",
  Printed: "/collections",
  "Coord Sets": "/collections",
  "About GetPanted": "/about",
  Sustainability: "/about",
  "Size Guide": "/bespoke",
  "Care Instructions": "/about",
  FAQs: "/bespoke",
  "Shipping & Returns": "/checkout",
  "Track Order": "/checkout",
  "Contact Us": "/about",
};

// ── Navbar ─────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlistCount, openMiniCart } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[var(--gp-header)] backdrop-blur-md border-b border-[rgb(var(--gp-fg-rgb) / 0.08)]" : "bg-transparent"
    }`}>
      <div className="max-w-[1400px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-cormorant text-2xl font-light tracking-[0.18em] uppercase text-[var(--gp-fg)]">
          Get<span className="text-[var(--gp-accent)]">Panted</span>
        </Link>
        <ul className="hidden md:flex gap-8 list-none">
          {[
            { label: "About", href: "/about" },
            { label: "New Arrivals", href: "/new-arrivals" },
            { label: "Collections", href: "/collections" },
            { label: "Bespoke", href: "/bespoke" },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
                  item.label === "Collections"
                    ? "text-[var(--gp-accent)]"
                    : "text-[rgb(var(--gp-fg-rgb) / 0.55)] hover:text-[var(--gp-accent)]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          <ThemeToggle />
          <Link href="/collections" aria-label="Search products" className="text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-[var(--gp-accent)] rounded-full text-[var(--gp-accent-ink)] text-[9px] font-medium flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            aria-label="Cart"
            onClick={openMiniCart}
            className="relative text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-[var(--gp-accent)] rounded-full text-[var(--gp-accent-ink)] text-[9px] font-medium flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── Collection Feature Card ────────────────────────────────────────────────────
function CollectionCard({ collection, index }: { collection: Collection; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden cursor-pointer group ${
        index === 0 ? "md:col-span-2 md:row-span-2" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${collection.bg} transition-transform duration-700 ${hovered ? "scale-[1.04]" : "scale-100"}`} />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] transition-opacity duration-500"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${collection.accentColor} 0px, ${collection.accentColor} 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, ${collection.accentColor} 0px, ${collection.accentColor} 1px, transparent 1px, transparent 48px)`,
        }}
      />

      {/* Silhouette illustration */}
      <div className={`absolute ${index === 0 ? "right-12 bottom-0 w-48 opacity-[0.12]" : "right-6 bottom-0 w-28 opacity-[0.10]"} transition-all duration-500 ${hovered ? "opacity-[0.18] translate-y-[-8px]" : ""}`}>
        <svg viewBox="0 0 160 320" fill="none">
          <ellipse cx="80" cy="44" rx="28" ry="28" fill={collection.accentColor}/>
          <path d="M52 72 C40 96 36 156 28 220 C22 268 20 310 24 320 L136 320 C140 310 138 268 132 220 C124 156 120 96 108 72 Z" fill={collection.accentColor}/>
          <path d="M52 72 C58 88 62 118 60 148 L100 148 C98 118 102 88 108 72 Z" fill="rgba(0,0,0,0.25)"/>
        </svg>
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col justify-between ${index === 0 ? "min-h-[480px] p-10" : "min-h-[220px] p-7"}`}>
        <div>
          <p className="text-[9px] tracking-[0.22em] uppercase mb-2" style={{ color: collection.accentColor }}>
            {collection.itemCount} styles
          </p>
          <h3 className={`font-cormorant font-light leading-tight text-[var(--gp-fg)] ${index === 0 ? "text-[clamp(36px,5vw,56px)]" : "text-2xl"}`}>
            {collection.title}
          </h3>
          {index === 0 && (
            <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.4)] font-light leading-relaxed max-w-xs mt-3">
              {collection.description}
            </p>
          )}
        </div>

        <div className={`flex items-center justify-between ${index !== 0 ? "mt-auto pt-4" : "mt-8"}`}>
          <p className="text-[11px] italic font-cormorant text-[rgb(var(--gp-fg-rgb) / 0.4)]">
            {collection.subtitle}
          </p>
          <div
            className="w-9 h-9 border flex items-center justify-center transition-all duration-300"
            style={{
              borderColor: hovered ? collection.accentColor : "rgb(var(--gp-fg-rgb) / 0.2)",
              color: hovered ? collection.accentColor : "rgb(var(--gp-fg-rgb) / 0.4)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m5 12 14 0M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Hover border glow */}
      <div
        className="absolute inset-0 border transition-all duration-500 pointer-events-none"
        style={{ borderColor: hovered ? `${collection.accentColor}40` : "rgb(var(--gp-fg-rgb) / 0.07)" }}
      />
    </div>
  );
}

// ── Product Card ───────────────────────────────────────────────────────────────
function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "list" }) {
  const [hovered, setHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);

  if (viewMode === "list") {
    return (
      <div className="group flex gap-6 border-b border-[rgb(var(--gp-fg-rgb) / 0.07)] py-6 hover:bg-[rgb(var(--gp-fg-rgb) / 0.015)] transition-colors px-2">
        {/* Thumb */}
        <div className="w-28 h-36 flex-shrink-0 bg-[var(--gp-card)] relative overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 80 140" fill="none" className="w-10 opacity-20">
                <ellipse cx="40" cy="22" rx="14" ry="14" fill="var(--gp-accent)"/>
                <path d="M26 36 C20 48 18 78 14 110 C11 130 10 138 12 140 L68 140 C70 138 69 130 66 110 C62 78 60 48 54 36 Z" fill="var(--gp-accent)"/>
              </svg>
            </div>
          )}
          {product.badge && (
            <span className="absolute top-2 left-2 bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] text-[8px] font-medium tracking-[0.12em] uppercase px-1.5 py-0.5">
              {product.badge}
            </span>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-cormorant text-xl font-light text-[var(--gp-fg)] mb-1">{product.name}</h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[var(--gp-accent)] text-sm font-light">{product.price}</span>
              {product.originalPrice && (
                <span className="text-[rgb(var(--gp-fg-rgb) / 0.3)] text-sm line-through font-light">{product.originalPrice}</span>
              )}
            </div>
            <div className="flex gap-1.5 mb-3">
              {product.colors.map((c, i) => (
                <span key={i} className="w-3 h-3 rounded-full border border-[rgb(var(--gp-fg-rgb) / 0.15)]" style={{ background: c }}/>
              ))}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((s) => (
              <span key={s} className="text-[10px] border border-[rgb(var(--gp-fg-rgb) / 0.12)] px-2 py-1 text-[rgb(var(--gp-fg-rgb) / 0.35)] tracking-wider">
                {s}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <button
            type="button"
            onClick={() => toggleWishlist({ id: product.id, name: product.name, price: product.price })}
            className="text-[rgb(var(--gp-fg-rgb) / 0.3)] hover:text-[var(--gp-accent)] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "#c9a96e" : "none"} stroke={wishlisted ? "#c9a96e" : "currentColor"} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price })}
            className="bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] text-[10px] font-medium tracking-[0.12em] uppercase px-5 py-2.5 hover:bg-[var(--gp-accent-hover)] transition-colors whitespace-nowrap"
          >
            Add to Bag
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[var(--gp-card)] overflow-hidden mb-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          >
            <svg viewBox="0 0 160 280" fill="none" className="w-1/2 opacity-[0.15]">
              <ellipse cx="80" cy="44" rx="28" ry="28" fill="var(--gp-accent)"/>
              <path d="M52 72 C42 92 38 152 32 208 C26 254 22 278 26 280 L134 280 C138 278 134 254 128 208 C122 152 118 92 108 72 Z" fill="var(--gp-accent)"/>
              <path d="M52 72 C58 88 62 118 60 148 L100 148 C98 118 102 88 108 72 Z" fill="rgb(var(--gp-ink-rgb) / 0.3)"/>
            </svg>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[9px] font-medium tracking-[0.14em] uppercase px-2.5 py-1 ${
            product.badge === "Sale"
              ? "bg-[#8b2020] text-[var(--gp-fg)]"
              : "bg-[var(--gp-accent)] text-[var(--gp-accent-ink)]"
          }`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          aria-label="Wishlist"
          type="button"
          onClick={() => toggleWishlist({ id: product.id, name: product.name, price: product.price })}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgb(var(--gp-ink-rgb) / 0.65)] transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? "#c9a96e" : "none"} stroke={wishlisted ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.6)"} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        {/* Size quick-select + Add to bag */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-[rgb(var(--gp-ink-rgb) / 0.94)] px-4 py-4 transition-transform duration-300"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
        >
          <div className="flex gap-1.5 flex-wrap mb-3">
            {product.sizes.slice(0, 5).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s === selectedSize ? null : s)}
                className="text-[9px] border px-2 py-1 tracking-wider transition-colors duration-150"
                style={{
                  borderColor: selectedSize === s ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.15)",
                  color: selectedSize === s ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.45)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                ...(selectedSize ? { size: selectedSize } : {}),
              })
            }
            className="w-full bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] text-[10px] font-medium tracking-[0.14em] uppercase py-2.5 hover:bg-[var(--gp-accent-hover)] transition-colors"
          >
            {selectedSize ? `Add ${selectedSize} to Bag` : "Add to Bag"}
          </button>
        </div>
      </div>

      {/* Info */}
      <h3 className="font-cormorant text-lg font-light text-[var(--gp-fg)] mb-1.5">{product.name}</h3>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--gp-accent)] font-light">{product.price}</span>
          {product.originalPrice && (
            <span className="text-xs text-[rgb(var(--gp-fg-rgb) / 0.28)] line-through font-light">{product.originalPrice}</span>
          )}
        </div>
        <div className="flex gap-1.5">
          {product.colors.map((c, i) => (
            <span key={i} className="w-2.5 h-2.5 rounded-full border border-[rgb(var(--gp-fg-rgb) / 0.15)]" style={{ background: c }}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CollectionsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [sortBy, setSortBy] = useState("Featured");
  const [sortOpen, setSortOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [gridCols, setGridCols] = useState<3 | 4>(4);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredProducts = useMemo(() => {
    const base = PRODUCTS.filter((p) =>
      activeFilter === "all" ? true : p.category.includes(activeFilter)
    );

    const getPrice = (price: string) => Number(price.replace(/[^\d]/g, ""));

    switch (sortBy) {
      case "Newest First":
        return [...base].sort((a, b) => b.id - a.id);
      case "Price: Low to High":
        return [...base].sort((a, b) => getPrice(a.price) - getPrice(b.price));
      case "Price: High to Low":
        return [...base].sort((a, b) => getPrice(b.price) - getPrice(a.price));
      default:
        return base;
    }
  }, [activeFilter, sortBy]);

  useEffect(() => {
    setVisibleCount(8);
  }, [activeFilter, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  return (
    <main className="bg-[var(--gp-canvas)] text-[var(--gp-fg)] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── Page Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-8 overflow-hidden border-b border-[rgb(var(--gp-fg-rgb) / 0.07)]">
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 56px)",
          }}
        />
        {/* Ghost text */}
        <p
          className="absolute left-8 top-1/2 -translate-y-1/2 font-cormorant text-[clamp(80px,14vw,200px)] font-light text-[rgba(201,169,110,0.04)] leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          Collections
        </p>
        <div className="relative z-10 max-w-[1400px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.3)] mb-8">
            <Link href="/" className="hover:text-[var(--gp-accent)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[rgb(var(--gp-fg-rgb) / 0.55)]">Collections</span>
          </div>
          <p className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-5">
            <span className="block w-8 h-px bg-[var(--gp-accent)]" />
            SS 2026
          </p>
          <h1 className="font-cormorant text-[clamp(48px,7vw,88px)] font-light leading-[0.95]">
            All <em className="italic text-[var(--gp-accent)]">Collections</em>
          </h1>
          <p className="text-[14px] text-[rgb(var(--gp-fg-rgb) / 0.38)] font-light mt-4 max-w-md leading-relaxed">
            Every trouser in our range. Filter by style, sort by mood, and find the pair that becomes your signature.
          </p>
        </div>
      </section>

      {/* ── Collection Feature Grid ───────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-cormorant text-[clamp(28px,3vw,38px)] font-light text-[var(--gp-fg)]">
            Shop by <em className="italic text-[var(--gp-accent)]">Collection</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px]">
          {COLLECTIONS.map((col, i) => (
            <CollectionCard key={col.id} collection={col} index={i} />
          ))}
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="border-t border-[rgb(var(--gp-fg-rgb) / 0.08)] my-4" />
      </div>

      {/* ── All Products ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-12">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10">
          {/* Filters */}
          <div className="flex gap-1 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => {
                  setActiveFilter(f.key);
                  setFiltersOpen(false);
                }}
                className="text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-all duration-200"
                style={{
                  borderColor: activeFilter === f.key ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.12)",
                  color: activeFilter === f.key ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.45)",
                  background: activeFilter === f.key ? "rgba(201,169,110,0.06)" : "transparent",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Result count */}
            <span className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.3)] tracking-wider hidden md:block">
              {visibleProducts.length} of {filteredProducts.length} styles
            </span>

            {/* Sort */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.45)] border border-[rgb(var(--gp-fg-rgb) / 0.12)] px-4 py-2 hover:border-[rgb(var(--gp-fg-rgb) / 0.25)] transition-colors"
              >
                {sortBy}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-200 ${sortOpen ? "rotate-180" : ""}`}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {sortOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[var(--gp-elevated)] border border-[rgb(var(--gp-fg-rgb) / 0.1)] z-30 min-w-[180px] py-1">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setSortOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-[11px] tracking-[0.1em] text-[rgb(var(--gp-fg-rgb) / 0.5)] hover:text-[var(--gp-accent)] hover:bg-[rgba(201,169,110,0.05)] transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="hidden md:flex items-center gap-1 border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-0.5">
              {/* Grid 4 */}
              <button
                onClick={() => { setViewMode("grid"); setGridCols(4); }}
                className={`p-1.5 transition-colors ${viewMode === "grid" && gridCols === 4 ? "bg-[rgba(201,169,110,0.12)] text-[var(--gp-accent)]" : "text-[rgb(var(--gp-fg-rgb) / 0.3)] hover:text-[rgb(var(--gp-fg-rgb) / 0.6)]"}`}
                aria-label="4-column grid"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="3.5" height="3.5"/><rect x="4.5" y="0" width="3.5" height="3.5"/>
                  <rect x="9" y="0" width="3.5" height="3.5"/><rect x="13.5" y="0" width="2.5" height="3.5"/>
                  <rect x="0" y="4.5" width="3.5" height="3.5"/><rect x="4.5" y="4.5" width="3.5" height="3.5"/>
                  <rect x="9" y="4.5" width="3.5" height="3.5"/><rect x="13.5" y="4.5" width="2.5" height="3.5"/>
                  <rect x="0" y="9" width="3.5" height="3.5"/><rect x="4.5" y="9" width="3.5" height="3.5"/>
                  <rect x="9" y="9" width="3.5" height="3.5"/><rect x="13.5" y="9" width="2.5" height="3.5"/>
                </svg>
              </button>
              {/* Grid 3 */}
              <button
                onClick={() => { setViewMode("grid"); setGridCols(3); }}
                className={`p-1.5 transition-colors ${viewMode === "grid" && gridCols === 3 ? "bg-[rgba(201,169,110,0.12)] text-[var(--gp-accent)]" : "text-[rgb(var(--gp-fg-rgb) / 0.3)] hover:text-[rgb(var(--gp-fg-rgb) / 0.6)]"}`}
                aria-label="3-column grid"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="4.5" height="4.5"/><rect x="5.75" y="0" width="4.5" height="4.5"/><rect x="11.5" y="0" width="4.5" height="4.5"/>
                  <rect x="0" y="5.75" width="4.5" height="4.5"/><rect x="5.75" y="5.75" width="4.5" height="4.5"/><rect x="11.5" y="5.75" width="4.5" height="4.5"/>
                  <rect x="0" y="11.5" width="4.5" height="4.5"/><rect x="5.75" y="11.5" width="4.5" height="4.5"/><rect x="11.5" y="11.5" width="4.5" height="4.5"/>
                </svg>
              </button>
              {/* List */}
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-[rgba(201,169,110,0.12)] text-[var(--gp-accent)]" : "text-[rgb(var(--gp-fg-rgb) / 0.3)] hover:text-[rgb(var(--gp-fg-rgb) / 0.6)]"}`}
                aria-label="List view"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="1" width="16" height="2.5"/><rect x="0" y="6.75" width="16" height="2.5"/><rect x="0" y="12.5" width="16" height="2.5"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid / List */}
        {viewMode === "grid" ? (
          <div className={`grid gap-6 ${gridCols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3"}`}>
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="grid" />
            ))}
          </div>
        ) : (
          <div className="border-t border-[rgb(var(--gp-fg-rgb) / 0.07)]">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} viewMode="list" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-24">
            <p className="font-cormorant text-3xl font-light text-[rgb(var(--gp-fg-rgb) / 0.25)] mb-3">Nothing here yet</p>
            <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.2)] tracking-wider">Try a different filter</p>
          </div>
        )}

        {/* Load more */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-16">
            {visibleCount < filteredProducts.length && (
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="border border-[rgb(var(--gp-fg-rgb) / 0.14)] text-[rgb(var(--gp-fg-rgb) / 0.45)] text-[11px] tracking-[0.16em] uppercase px-12 py-4 hover:border-[var(--gp-accent)] hover:text-[var(--gp-accent)] transition-colors duration-200"
              >
                Load More
              </button>
            )}
            <p className="text-[10px] text-[rgb(var(--gp-fg-rgb) / 0.2)] tracking-widest mt-4">
              Showing {visibleProducts.length} of {filteredProducts.length} styles
            </p>
          </div>
        )}
      </section>

      {/* ── Custom Tailoring CTA ──────────────────────────────────────────── */}
      <section className="mx-8 mb-20 border border-[rgb(var(--gp-fg-rgb) / 0.07)] grid md:grid-cols-2 overflow-hidden">
        <div className="bg-gradient-to-br from-[#1a1410] to-[#2d1f14] min-h-[280px] flex items-center justify-center relative">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 40px)",
            }}
          />
          <div className="relative z-10 text-center px-8">
            <svg viewBox="0 0 120 80" fill="none" className="w-24 mx-auto opacity-30 mb-4">
              <path d="M10 70 C20 40 40 20 60 10 C80 20 100 40 110 70" stroke="var(--gp-accent)" strokeWidth="1.5" fill="none"/>
              <circle cx="60" cy="10" r="6" fill="var(--gp-accent)"/>
              <line x1="60" y1="16" x2="60" y2="70" stroke="var(--gp-accent)" strokeWidth="1" strokeDasharray="3 3"/>
            </svg>
            <p className="font-cormorant text-xl italic text-[rgba(201,169,110,0.5)]">Measured. Made. Yours.</p>
          </div>
        </div>
        <div className="p-12 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[rgb(var(--gp-fg-rgb) / 0.07)]">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-4">Custom Tailoring</p>
          <h2 className="font-cormorant text-[clamp(28px,3vw,40px)] font-light leading-tight text-[var(--gp-fg)] mb-4">
            Don't see your size?<br />
            <em className="italic text-[var(--gp-accent)]">We'll make it.</em>
          </h2>
          <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.38)] font-light leading-[1.9] mb-7 max-w-sm">
            Every body is different. Our custom tailoring service creates trousers built exactly to your measurements — same premium fabrics, zero compromise.
          </p>
          <Link
            href="/bespoke"
            className="inline-flex items-center gap-2 bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-8 py-3.5 text-[11px] font-medium tracking-[0.16em] uppercase self-start hover:bg-[var(--gp-accent-hover)] transition-colors"
          >
            Start Custom Order
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m5 12 14 0M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-[var(--gp-deep)] border-t border-[rgb(var(--gp-fg-rgb) / 0.07)] px-8 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            <div>
              <p className="font-cormorant text-xl font-light tracking-[0.18em] uppercase text-[var(--gp-fg)] mb-4">
                Get<span className="text-[var(--gp-accent)]">Panted</span>
              </p>
              <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.28)] leading-[1.9] font-light max-w-[210px]">
                High-waisted, wide-leg trousers for the bold, unapologetic woman. Lagos-made. World-ready.
              </p>
            </div>
            {[
              { title: "Shop", links: ["New Arrivals", "Bestsellers", "Solid Luxe", "Printed", "Coord Sets"] },
              { title: "Info",  links: ["About GetPanted", "Sustainability", "Size Guide", "Care Instructions"] },
              { title: "Help",  links: ["FAQs", "Shipping & Returns", "Track Order", "Contact Us"] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.35)] mb-5">{col.title}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href={FOOTER_LINK_HREFS[link] ?? "/about"} className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.42)] hover:text-[var(--gp-accent)] transition-colors font-light">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-[rgb(var(--gp-fg-rgb) / 0.06)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.18)] font-light">© 2026 GetPanted. All rights reserved.</p>
            <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.18)] font-light">Lagos, Nigeria · NGN (₦) · Privacy · Terms</p>
          </div>
        </div>
      </footer>

      {/* ── Global styles ─────────────────────────────────────────────────── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </main>
  );
}
