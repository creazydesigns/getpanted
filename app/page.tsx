"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import "./homepage.css";
import { useShop } from "./context/shop-context";
import { useScrollReveal } from "./hooks/use-scroll-reveal";

// ── Types ────────────────────────────────────────────────────────────────────
interface Product {
  id: number;
  name: string;
  price: string;
  badge?: string;
  colors: string[];
  image?: string;
}

interface Category {
  name: string;
  count: string;
  bg: string;
  image: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: "Royal Pleat",    price: "₦45,000", badge: "Bestseller", colors: ["#6B2D8B"], image: "/images/gp-royal-pleat.png" },
  { id: 2, name: "Onyx Statement", price: "₦38,000", badge: "New",        colors: ["#1a1a1a"], image: "/images/gp-onyx-statement.png" },
  { id: 3, name: "Ivory Sovereign",price: "₦42,000", badge: "New",        colors: ["#f5f0e8"], image: "/images/gp-ivory-sovereign.png" },
  { id: 4, name: "Sahara Wide",    price: "₦36,000", badge: "New",        colors: ["#c4a882"], image: "/images/gp-sahara-wide.png" },
];

const CATEGORIES: Category[] = [
  {
    name: "Solid Luxe",
    count: "24 styles",
    bg: "from-[#1a1410] to-[#2d1f14]",
    image: "/images/solid-luxe.png",
  },
  {
    name: "Printed",
    count: "18 styles",
    bg: "from-[#0f1a14] to-[#1a2d1f]",
    // Photo by josue rosales on Unsplash (free) — woman in bold striped pants
    image: "https://images.unsplash.com/photo-1760031033670-e062ac87aac9?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Coord Sets",
    count: "12 styles",
    bg: "from-[#14101a] to-[#1f1428]",
    // Photo by Toa Heftiba on Unsplash (free) — woman in coordinated black top + pink wide-leg pants
    image: "https://images.unsplash.com/photo-1600713392444-db5a5bc85ef5?w=700&auto=format&fit=crop&q=80",
  },
];

const MARQUEE_ITEMS = [
  "High-waisted silhouettes",
  "Wide-leg perfection",
  "Lagos-made luxury",
  "Tailored to you",
  "Statement bottoms",
  "Pleated & proud",
];

const FOOTER_LINK_HREFS: Record<string, string> = {
  "New Arrivals": "/new-arrivals",
  "Bestsellers": "/collections",
  "Solid Luxe": "/collections",
  "Printed": "/collections",
  "Coord Sets": "/collections",
  Sale: "/collections",
  "About GetPanted": "/about",
  Sustainability: "/about",
  "Size Guide": "/bespoke",
  "Care Instructions": "/about",
  FAQs: "/bespoke",
  "Shipping & Returns": "/checkout",
  "Track Order": "/checkout",
  "Contact Us": "/about",
  Wholesale: "/about",
};

// ── Sub-components ────────────────────────────────────────────────────────────


function MarqueeBanner() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="border-t border-b border-[rgb(var(--gp-fg-rgb) / 0.08)] bg-[var(--gp-marquee)] overflow-hidden py-3.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-9 text-[11px] tracking-[0.2em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.28)]">
            {item}
            <span className="w-1 h-1 rounded-full bg-[var(--gp-accent)] inline-block flex-shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      data-reveal="up"
      data-delay={delay > 0 ? String(delay) : undefined}
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-[var(--gp-card)] overflow-hidden mb-4">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-500"
            style={{ transform: hovered ? "scale(1.04)" : "scale(1)" }}
          >
            <svg viewBox="0 0 160 320" fill="none" className="w-1/2 opacity-[0.15]">
              <ellipse cx="80" cy="48" rx="28" ry="28" fill="var(--gp-accent)" />
              <path d="M52 76 C40 96 36 160 28 224 C22 272 20 312 26 320 L134 320 C140 312 138 272 132 224 C124 160 120 96 108 76 Z" fill="var(--gp-accent)" />
            </svg>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] text-[9px] font-medium tracking-[0.14em] uppercase px-2.5 py-1">
            {product.badge}
          </span>
        )}

        {/* Add to bag overlay */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-[rgb(var(--gp-ink-rgb) / 0.92)] px-4 py-3.5 transition-transform duration-300"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
        >
          <button
            type="button"
            onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })}
            className="w-full bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] text-[10px] font-medium tracking-[0.14em] uppercase py-2.5 hover:bg-[var(--gp-accent-hover)] transition-colors"
          >
            Add to Bag
          </button>
        </div>

        {/* Wishlist icon */}
        <button
          aria-label="Add to wishlist"
          type="button"
          onClick={() => toggleWishlist({ id: product.id, name: product.name, price: product.price, image: product.image })}
          className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgb(var(--gp-ink-rgb) / 0.6)] transition-all duration-200 opacity-0 group-hover:opacity-100 ${
            wishlisted ? "text-[var(--gp-accent)]" : "text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)]"
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? "#c9a96e" : "none"} stroke="currentColor" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <h3 className="font-cormorant text-lg font-normal text-[var(--gp-fg)] mb-1.5">{product.name}</h3>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--gp-accent)] font-light">{product.price}</span>
        <div className="flex gap-1.5">
          {product.colors.map((c, i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full border border-[rgb(var(--gp-fg-rgb) / 0.15)]"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CategoryCard({ cat, delay = 0 }: { cat: Category; delay?: number }) {
  return (
    <Link
      data-reveal="scale"
      data-delay={delay > 0 ? String(delay) : undefined}
      href="/collections"
      className="relative aspect-[4/5] overflow-hidden cursor-pointer group block"
    >
      {/* Photo */}
      <Image
        src={cat.image}
        alt={cat.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.06]"
      />
      {/* Gradient scrim — dark at bottom, lighter at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[10px] tracking-[0.18em] uppercase text-[var(--gp-accent)] mb-1">{cat.count}</p>
        <h3 className="font-cormorant text-2xl font-light text-white">{cat.name}</h3>
      </div>
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-8 h-8 border border-[var(--gp-accent)] flex items-center justify-center bg-black/30">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gp-accent)" strokeWidth="2">
            <path d="m5 12 14 0M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  useScrollReveal();

  return (
    <main className="home-page-root bg-[var(--gp-canvas)] text-[var(--gp-fg)] min-h-screen overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-screen pt-16">
        {/* Text side */}
        <div className="flex flex-col justify-center px-8 md:px-12 py-20 md:py-0 order-2 md:order-1">
          <p className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-6 animate-fade-up">
            <span className="block w-8 h-px bg-[var(--gp-accent)]" />
            New Collection — SS 2026
          </p>
          <h1 className="font-cormorant text-[clamp(56px,7vw,88px)] font-light leading-[1.0] mb-6 animate-fade-up animation-delay-100">
            Wide.<br />
            <em className="italic text-[var(--gp-accent)]">Proud.</em><br />
            Yours.
          </h1>
          <p className="text-sm text-[rgb(var(--gp-fg-rgb) / 0.45)] leading-[1.85] max-w-sm mb-10 font-light animate-fade-up animation-delay-200">
            High-waisted, wide-leg trousers crafted for the woman who commands the room before she speaks. Every pleat, intentional.
          </p>
          <div className="flex items-center gap-5 animate-fade-up animation-delay-300">
            <Link
              href="/collections"
              className="bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-8 py-3.5 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors duration-200 inline-block"
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.5)] hover:text-[var(--gp-fg)] transition-colors duration-200"
            >
              View Lookbook
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="m5 12 14 0M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Visual side */}
        <div className="relative bg-[var(--gp-elevated)] order-1 md:order-2 min-h-[60vw] md:min-h-0 overflow-hidden">
          <Image
            src="/images/gp-lady-white.png"
            alt="Model in wide-leg trousers"
            fill
            className="object-cover object-top hero-img"
            priority
          />

          {/* Floating product tag */}
          <div className="hero-tag absolute bottom-10 right-8 bg-[rgb(var(--gp-ink-rgb) / 0.88)] border border-[rgba(201,169,110,0.22)] px-5 py-4 min-w-[160px]">
            <p className="text-[9px] tracking-[0.18em] uppercase text-[var(--gp-accent)] mb-1">Featured Piece</p>
            <p className="font-cormorant text-base font-normal text-[var(--gp-fg)] mb-0.5">The Royal Pleat</p>
            <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.45)] font-light">₦45,000</p>
          </div>

          {/* Decorative corner accent */}
          <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-[rgba(201,169,110,0.3)]" />
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────────────────────── */}
      <MarqueeBanner />

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-20">
        <div data-reveal="up" className="flex items-end justify-between mb-12">
          <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light leading-tight">
            New <em className="italic text-[var(--gp-accent)]">Arrivals</em>
          </h2>
          <Link
            href="/collections"
            className="hidden md:flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[var(--gp-accent)] border-b border-[rgba(201,169,110,0.35)] pb-0.5 hover:border-[var(--gp-accent)] transition-colors"
          >
            View all
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m5 12 14 0M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-7">
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i + 1} />
          ))}
        </div>
      </section>

      {/* ── Editorial Banner ──────────────────────────────────────────────── */}
      <div id="bespoke" className="mx-8 mb-20 grid md:grid-cols-2 border border-[rgb(var(--gp-fg-rgb) / 0.07)]">
        <div data-reveal="left" className="relative min-h-[420px] overflow-hidden">
          <Image
            src="/images/wide-pant-sneakers.png"
            alt="GetPanted editorial"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* Copy */}
        <div data-reveal="right" className="p-14 flex flex-col justify-center border-t md:border-t-0 md:border-l border-[rgb(var(--gp-fg-rgb) / 0.07)]">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-5">The GetPanted Story</p>
          <h2 className="font-cormorant text-[clamp(32px,3vw,44px)] font-light leading-[1.15] mb-5 text-[var(--gp-fg)]">
            Trousers that tell<br />
            <em className="italic text-[var(--gp-accent)]">your story</em>
          </h2>
          <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.4)] leading-[1.9] font-light mb-8 max-w-sm">
            Born in Lagos, GetPanted is a celebration of the bold African woman. Each trouser is designed with generous proportions, impeccable tailoring, and the unapologetic confidence you deserve.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-[var(--gp-accent)] self-start border-b border-[rgba(201,169,110,0.35)] pb-0.5 hover:border-[var(--gp-accent)] transition-colors"
          >
            Our story
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m5 12 14 0M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Categories ────────────────────────────────────────────────────── */}
      <section id="collections" className="max-w-[1400px] mx-auto px-8 mb-20">
        <div data-reveal="up" className="flex items-end justify-between mb-12">
          <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light">
            Shop by <em className="italic text-[var(--gp-accent)]">Style</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {CATEGORIES.map((cat, i) => (
            <CategoryCard key={cat.name} cat={cat} delay={i + 1} />
          ))}
        </div>
      </section>

      {/* ── Promise Strip ─────────────────────────────────────────────────── */}
      <div className="border-t border-b border-[rgb(var(--gp-fg-rgb) / 0.07)] grid grid-cols-2 md:grid-cols-4 mb-20">
        {[
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            ),
            title: "Free Shipping",
            body: "On all orders above ₦30,000",
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            ),
            title: "Custom Tailoring",
            body: "Made to your exact measurements",
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M20 12V22H4V12" /><path d="M22 7H2v5h20V7z" /><path d="M12 22V7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            ),
            title: "Easy Returns",
            body: "14-day no-hassle return policy",
          },
          {
            icon: (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
            title: "Quality Assured",
            body: "Premium fabrics, lasting wear",
          },
        ].map((item, i) => (
          <div
            key={i}
            data-reveal="up"
            data-delay={String(i + 1)}
            className="flex gap-4 items-start p-8 border-r border-[rgb(var(--gp-fg-rgb) / 0.07)] last:border-r-0"
          >
            <span className="text-[var(--gp-accent)] mt-0.5 flex-shrink-0">{item.icon}</span>
            <div>
              <p className="text-[13px] font-medium text-[var(--gp-fg)] mb-1 tracking-[0.03em]">{item.title}</p>
              <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.32)] leading-[1.7] font-light">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section data-reveal="up" className="max-w-[640px] mx-auto px-8 text-center mb-24">
        <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-4">Join the Clan</p>
        <h2 className="font-cormorant text-[clamp(32px,4vw,44px)] font-light mb-4 text-[var(--gp-fg)]">
          Style drops, first.
        </h2>
        <p className="text-sm text-[rgb(var(--gp-fg-rgb) / 0.35)] mb-8 font-light leading-relaxed">
          Be the first to know about new collections, exclusive launches, and styling tips from the GetPanted team.
        </p>
        <div className="flex gap-0 border border-[rgb(var(--gp-fg-rgb) / 0.15)] overflow-hidden">
          <input
            type="email"
            placeholder="your@email.com"
            className="flex-1 bg-transparent px-5 py-3.5 text-sm text-[var(--gp-fg)] placeholder:text-[rgb(var(--gp-fg-rgb) / 0.25)] outline-none font-light"
          />
          <a
            href="mailto:hello@getpanted.com?subject=Newsletter%20Signup"
            className="bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-6 text-[10px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors whitespace-nowrap inline-flex items-center"
          >
            Subscribe
          </a>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer id="about" className="bg-[var(--gp-deep)] border-t border-[rgb(var(--gp-fg-rgb) / 0.07)] px-8 pt-16 pb-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">
            {/* Brand column */}
            <div>
              <p className="font-cormorant text-xl font-light tracking-[0.18em] uppercase text-[var(--gp-fg)] mb-4">
                Get<span className="text-[var(--gp-accent)]">Panted</span>
              </p>
              <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.28)] leading-[1.9] font-light mb-6 max-w-[210px]">
                High-waisted, wide-leg trousers for the bold, unapologetic woman. Lagos-made. World-ready.
              </p>
              <div className="flex gap-4">
                {[
                  { name: "instagram", href: "https://instagram.com" },
                  { name: "tiktok", href: "https://tiktok.com" },
                  { name: "twitter", href: "https://x.com" },
                ].map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noreferrer" aria-label={s.name} className="text-[rgb(var(--gp-fg-rgb) / 0.3)] hover:text-[var(--gp-accent)] transition-colors text-[11px] uppercase tracking-[0.1em]">
                    {s.name === "instagram" && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="4" />
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

            {/* Link columns */}
            {[
              { title: "Shop", links: ["New Arrivals", "Bestsellers", "Solid Luxe", "Printed", "Coord Sets", "Sale"] },
              { title: "Info", links: ["About GetPanted", "Sustainability", "Size Guide", "Care Instructions"] },
              { title: "Help", links: ["FAQs", "Shipping & Returns", "Track Order", "Contact Us", "Wholesale"] },
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

          {/* Bottom bar */}
          <div className="border-t border-[rgb(var(--gp-fg-rgb) / 0.06)] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.18)] font-light">
              © 2026 GetPanted. All rights reserved.
            </p>
            <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.18)] font-light">
              Lagos, Nigeria &nbsp;·&nbsp; NGN (₦) &nbsp;·&nbsp; Privacy &nbsp;·&nbsp; Terms
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
