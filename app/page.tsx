"use client";

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
  image: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: "Royal Pleat",     price: "₦45,000", badge: "Bestseller", colors: ["#6B2D8B"], image: "/images/gp-royal-pleat.png" },
  { id: 2, name: "Onyx Statement",  price: "₦38,000", badge: "New",        colors: ["#1a1a1a"], image: "/images/gp-onyx-statement.png" },
  { id: 3, name: "Ivory Sovereign", price: "₦42,000", badge: "New",        colors: ["#f5f0e8"], image: "/images/gp-ivory-sovereign.png" },
  { id: 4, name: "Sahara Wide",     price: "₦36,000", badge: "New",        colors: ["#c4a882"], image: "/images/gp-sahara-wide.png" },
];

const CATEGORIES: Category[] = [
  { name: "Solid Luxe", count: "24 styles", image: "/images/solid-luxe.png" },
  {
    name: "Printed",
    count: "18 styles",
    image: "https://images.unsplash.com/photo-1760031033670-e062ac87aac9?w=700&auto=format&fit=crop&q=80",
  },
  {
    name: "Coord Sets",
    count: "12 styles",
    image: "https://images.unsplash.com/photo-1600713392444-db5a5bc85ef5?w=700&auto=format&fit=crop&q=80",
  },
];

const MARQUEE_TEXT =
  "WIDE-LEG PERFECTION · LAGOS-MADE LUXURY · DRESS THE POWER · OWN THE ROOM · HIGH-WAISTED SILHOUETTES · ";

const FOOTER_LINKS: Record<string, string> = {
  "New Arrivals":      "/new-arrivals",
  Bestsellers:         "/collections",
  "Solid Luxe":        "/collections",
  Printed:             "/collections",
  "Coord Sets":        "/collections",
  Sale:                "/collections",
  "About GetPanted":   "/about",
  Sustainability:      "/about",
  "Size Guide":        "/bespoke",
  "Care Instructions": "/about",
  FAQs:                "/bespoke",
  "Shipping & Returns":"/checkout",
  "Track Order":       "/checkout",
  "Contact Us":        "/about",
  Wholesale:           "/about",
};

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      data-reveal="up"
      data-delay={delay > 0 ? String(delay) : undefined}
      className="group cursor-pointer"
    >
      {/* Image container */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            priority
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "var(--deep-onyx)" }}
          >
            <svg viewBox="0 0 160 320" fill="none" className="w-1/2 opacity-10">
              <ellipse cx="80" cy="48" rx="28" ry="28" fill="var(--reign-purple)" />
              <path
                d="M52 76 C40 96 36 160 28 224 C22 272 20 312 26 320 L134 320 C140 312 138 272 132 224 C124 160 120 96 108 76 Z"
                fill="var(--reign-purple)"
              />
            </svg>
          </div>
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className="absolute top-4 left-4 font-barlow-cond font-bold text-[10px] tracking-[0.2em] uppercase text-white px-[10px] py-1"
            style={{ background: "var(--midnight)" }}
          >
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          aria-label="Toggle wishlist"
          onClick={() =>
            toggleWishlist({
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
            })
          }
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-black/50 transition-all duration-300 opacity-0 group-hover:opacity-100"
          style={{ color: wishlisted ? "var(--reign-purple)" : "white" }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wishlisted ? "var(--reign-purple)" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-barlow-cond font-bold text-base tracking-[0.05em] uppercase leading-tight"
            style={{ color: "var(--hp-fg)" }}
          >
            {product.name}
          </h3>
          <button
            type="button"
            onClick={() =>
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
              })
            }
            className="font-barlow-cond font-bold text-[12px] tracking-[0.15em] uppercase whitespace-nowrap flex-shrink-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{ color: "var(--reign-purple)" }}
          >
            Add to Bag
          </button>
        </div>
        <p className="font-barlow text-[15px] mt-1" style={{ color: "var(--stone-grey)" }}>
          {product.price}
        </p>
      </div>
    </div>
  );
}

// ── Category Tile ─────────────────────────────────────────────────────────────
function CategoryTile({ cat }: { cat: Category }) {
  return (
    <Link
      href="/collections"
      className="relative overflow-hidden block group"
      style={{ height: "480px" }}
    >
      <Image
        src={cat.image}
        alt={cat.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover object-top transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
      />
      {/* Base overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.30)" }}
      />
      {/* Hover overlay increment */}
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: "rgba(0,0,0,0.20)" }}
      />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3
          className="font-playfair font-bold text-white leading-tight"
          style={{ fontSize: "28px" }}
        >
          {cat.name}
        </h3>
        <p
          className="font-barlow-cond font-bold tracking-[0.2em] uppercase mt-1"
          style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}
        >
          {cat.count}
        </p>
        <span className="text-white text-xl mt-3 inline-block transition-opacity duration-300 opacity-0 group-hover:opacity-100">
          →
        </span>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  useScrollReveal();

  return (
    <main className="font-barlow overflow-x-hidden">

      {/* ── SECTION 2: HERO ─────────────────────────────────────────────── */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "100vh", background: "var(--midnight)" }}
      >
        {/* Full-bleed image */}
        <Image
          src="/images/gp-lady-white.png"
          alt="Model in wide-leg trousers"
          fill
          className="object-cover object-top hero-img"
          priority
        />
        {/* Cinematic gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Hero content — bottom left */}
        <div className="absolute bottom-10 md:bottom-20 left-5 md:left-12 right-5 md:right-auto md:max-w-[680px]">
          <p
            className="font-barlow-cond font-bold text-[11px] tracking-[0.25em] uppercase mb-5 animate-fade-up"
            style={{ color: "var(--power-gold)" }}
          >
            NEW COLLECTION — SS 2026
          </p>
          <h1
            className="font-playfair font-black text-white leading-[1.0] mb-8 animate-fade-up animation-delay-100"
            style={{
              fontSize: "clamp(52px, 7vw, 96px)",
              letterSpacing: "-1.5px",
            }}
          >
            Dress the Power.<br />
            Own the Room.
          </h1>
          <div className="flex flex-wrap items-center gap-4 animate-fade-up animation-delay-200">
            <Link
              href="/collections"
              className="btn-hp-primary font-barlow-cond font-bold text-[13px] tracking-[0.15em] uppercase text-white inline-block"
              style={{ padding: "14px 36px" }}
            >
              Shop Now
            </Link>
            <Link
              href="/about"
              className="btn-hp-outline font-barlow-cond font-bold text-[13px] tracking-[0.15em] uppercase text-white inline-block"
              style={{ padding: "14px 36px" }}
            >
              View Lookbook
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2">
          <p
            className="font-barlow-cond font-bold text-[10px] tracking-[0.3em] uppercase"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            SCROLL
          </p>
          <div
            className="w-px"
            style={{ height: "40px", background: "rgba(255,255,255,0.25)" }}
          />
        </div>
      </section>

      {/* ── SECTION 3: MARQUEE TICKER ────────────────────────────────────── */}
      <div
        className="overflow-hidden"
        style={{ background: "var(--reign-purple)", height: "44px" }}
      >
        <div className="animate-marquee-ticker">
          {[0, 1].map((i) => (
            <span
              key={i}
              className="font-barlow-cond font-bold text-[13px] tracking-[0.2em] uppercase text-white"
              aria-hidden={i > 0 ? "true" : undefined}
            >
              {MARQUEE_TEXT.repeat(5)}
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTION 4: NEW ARRIVALS ──────────────────────────────────────── */}
      <section style={{ background: "var(--hp-paper)" }}>
        {/* Section header */}
        <div
          className="flex items-end justify-between px-5 md:px-12 pt-16 md:pt-20 pb-8 md:pb-12"
        >
          <div>
            <p
              className="font-barlow-cond font-bold text-[11px] tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--stone-grey)" }}
            >
              NEW ARRIVALS
            </p>
            <h2
              className="font-playfair font-bold"
              style={{
                color: "var(--hp-fg)",
                fontSize: "clamp(28px, 3vw, 42px)",
              }}
            >
              The Latest
            </h2>
          </div>
          <Link
            href="/collections"
            className="font-barlow-cond font-bold text-[13px] tracking-[0.15em] uppercase transition-opacity duration-200 hover:opacity-60"
            style={{ color: "var(--reign-purple)" }}
          >
            View all →
          </Link>
        </div>
        {/* Product grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 px-5 md:px-12 pb-16 md:pb-20"
          style={{ gap: "2px" }}
        >
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i + 1} />
          ))}
        </div>
      </section>

      {/* ── SECTION 5: BRAND STORY ───────────────────────────────────────── */}
      <section
        className="px-5 md:px-12 py-16 md:py-24"
        style={{ background: "var(--hp-paper-alt)" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 md:gap-20 items-center max-w-[1400px] mx-auto">
          {/* Left — copy */}
          <div data-reveal="left">
            <p
              className="font-barlow-cond font-bold text-[11px] tracking-[0.25em] uppercase mb-6"
              style={{ color: "var(--stone-grey)" }}
            >
              THE GETPANTED STORY
            </p>
            <h2
              className="font-playfair font-bold leading-[1.15]"
              style={{
                color: "var(--hp-fg)",
                fontSize: "clamp(32px, 4vw, 56px)",
              }}
            >
              Trousers that tell<br />your story.
            </h2>
            <p
              className="font-barlow leading-[1.8] mt-6 max-w-[420px]"
              style={{ color: "var(--stone-grey)", fontSize: "16px" }}
            >
              Born in Lagos, GetPanted is a celebration of the bold African woman.
              Each trouser is designed with generous proportions, impeccable tailoring,
              and the unapologetic confidence you deserve.
            </p>
            <Link
              href="/about"
              className="font-barlow-cond font-bold text-[13px] tracking-[0.15em] uppercase mt-8 inline-block transition-opacity duration-200 hover:opacity-60"
              style={{ color: "var(--reign-purple)" }}
            >
              Our Story →
            </Link>
          </div>
          {/* Right — editorial image */}
          <div
            data-reveal="right"
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src="/images/wide-pant-sneakers.png"
              alt="GetPanted editorial"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 6: SHOP BY STYLE ─────────────────────────────────────── */}
      <section
        className="px-5 md:px-12 pb-16 md:pb-24"
        style={{ background: "var(--hp-paper)" }}
      >
        <p
          className="font-barlow-cond font-bold text-[11px] tracking-[0.25em] uppercase pt-14 md:pt-16 mb-8"
          style={{ color: "var(--stone-grey)" }}
        >
          SHOP BY STYLE
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px" }}>
          {CATEGORIES.map((cat) => (
            <CategoryTile key={cat.name} cat={cat} />
          ))}
        </div>
      </section>

      {/* ── SECTION 7: VALUE PROPS ───────────────────────────────────────── */}
      <div
        className="px-5 md:px-12 py-12"
        style={{ background: "var(--midnight)" }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "2px" }}>
          {[
            { title: "Free Shipping",    body: "On all orders above ₦30,000" },
            { title: "Custom Tailoring", body: "Made to your exact measurements" },
            { title: "Easy Returns",     body: "14-day no-hassle return policy" },
            { title: "Quality Assured",  body: "Premium fabrics, lasting wear" },
          ].map((item, i) => (
            <div
              key={i}
              data-reveal="up"
              data-delay={String(i + 1)}
              className="text-center px-4 py-10"
            >
              <p
                className="font-barlow-cond font-bold text-[14px] tracking-[0.15em] uppercase text-white mb-2"
              >
                {item.title}
              </p>
              <p
                className="font-barlow text-[13px] leading-[1.6]"
                style={{ color: "var(--stone-grey)" }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── SECTION 8: NEWSLETTER ────────────────────────────────────────── */}
      <section
        className="text-center px-5 md:px-12 py-16 md:py-24"
        style={{ background: "var(--hp-paper)" }}
      >
        <p
          className="font-barlow-cond font-bold text-[11px] tracking-[0.25em] uppercase"
          style={{ color: "var(--stone-grey)" }}
        >
          JOIN THE CLAN
        </p>
        <h2
          className="font-playfair font-bold mt-4 mb-3"
          style={{
            color: "var(--hp-fg)",
            fontSize: "clamp(28px, 3vw, 42px)",
          }}
        >
          Style drops, first.
        </h2>
        <p
          className="font-barlow text-base leading-relaxed mt-3 mb-8 max-w-lg mx-auto"
          style={{ color: "var(--stone-grey)" }}
        >
          Be the first to know about new collections, exclusive launches, and styling
          tips from the GetPanted team.
        </p>
        <div className="flex flex-col sm:flex-row max-w-md mx-auto">
          <input
            type="email"
            placeholder="your@email.com"
            className="font-barlow outline-none flex-1 placeholder:text-[var(--stone-grey)]"
            style={{
              border: "1px solid #D8D4CC",
              padding: "14px 20px",
              fontSize: "15px",
              background: "white",
              color: "var(--midnight)",
            }}
          />
          <a
            href="mailto:hello@getpanted.com?subject=Newsletter%20Signup"
            className="btn-subscribe font-barlow-cond font-bold text-[13px] tracking-[0.15em] uppercase text-white inline-flex items-center justify-center whitespace-nowrap"
            style={{ padding: "14px 32px" }}
          >
            Subscribe
          </a>
        </div>
      </section>

      {/* ── SECTION 9: FOOTER ────────────────────────────────────────────── */}
      <footer
        className="px-5 md:px-12"
        style={{
          background: "var(--midnight)",
          paddingTop: "64px",
          paddingBottom: "32px",
        }}
      >
        <div className="max-w-[1400px] mx-auto">

          {/* Top row: logo + socials */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="font-playfair font-bold text-xl tracking-[0.18em] uppercase"
            >
              <span className="text-white">Get</span>
              <span style={{ color: "var(--reign-purple)" }}>Panted</span>
            </Link>
            <div className="flex gap-5">
              {[
                { name: "instagram", href: "https://instagram.com" },
                { name: "tiktok",    href: "https://tiktok.com" },
                { name: "twitter",   href: "https://x.com" },
              ].map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  className="transition-colors duration-200 hover:text-white"
                  style={{ color: "var(--stone-grey)" }}
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
                  {s.name === "twitter" && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M4 4l16 16M4 20L20 4" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Middle: link columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {[
              {
                title: "Shop",
                links: ["New Arrivals", "Bestsellers", "Solid Luxe", "Printed", "Coord Sets", "Sale"],
              },
              {
                title: "Info",
                links: ["About GetPanted", "Sustainability", "Size Guide", "Care Instructions"],
              },
              {
                title: "Help",
                links: ["FAQs", "Shipping & Returns", "Track Order", "Contact Us", "Wholesale"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className="font-barlow-cond font-bold text-[11px] tracking-[0.2em] uppercase mb-5"
                  style={{ color: "var(--stone-grey)" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={FOOTER_LINKS[link] ?? "/about"}
                        className="font-barlow text-[14px] transition-colors duration-200 hover:text-white"
                        style={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div
            className="pt-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <p
              className="font-barlow text-[13px]"
              style={{ color: "var(--stone-grey)" }}
            >
              © 2026 GetPanted. All rights reserved. Lagos, Nigeria.
            </p>
          </div>

        </div>
      </footer>

    </main>
  );
}
