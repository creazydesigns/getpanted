"use client";

import { useState } from "react";
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
  { id: 1, name: "Royal Pleat",     price: "₦45,000", badge: "Bestseller", colors: ["#5C2D8F"], image: "/images/gp-royal-pleat.png" },
  { id: 2, name: "Onyx Statement",  price: "₦38,000", badge: "New",        colors: ["#1A1A1A"], image: "/images/gp-onyx-statement.png" },
  { id: 3, name: "Ivory Sovereign", price: "₦42,000", badge: "New",        colors: ["#E8E8E8"], image: "/images/gp-ivory-sovereign.png" },
  { id: 4, name: "Sahara Wide",     price: "₦36,000", badge: "New",        colors: ["#8A8680"], image: "/images/gp-sahara-wide.png" },
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
  "New Arrivals":       "/new-arrivals",
  Bestsellers:          "/collections",
  "Solid Luxe":         "/collections",
  Printed:              "/collections",
  "Coord Sets":         "/collections",
  Sale:                 "/collections",
  "About GetPanted":    "/about",
  Sustainability:       "/about",
  "Size Guide":         "/bespoke",
  "Care Instructions":  "/about",
  FAQs:                 "/bespoke",
  "Shipping & Returns": "/checkout",
  "Track Order":        "/checkout",
  "Contact Us":         "/about",
  Wholesale:            "/about",
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
            style={{ background: "#F7F7F7" }}
          >
            <svg viewBox="0 0 160 320" fill="none" className="w-1/2 opacity-10">
              <ellipse cx="80" cy="48" rx="28" ry="28" fill="#5C2D8F" />
              <path
                d="M52 76 C40 96 36 160 28 224 C22 272 20 312 26 320 L134 320 C140 312 138 272 132 224 C124 160 120 96 108 76 Z"
                fill="#5C2D8F"
              />
            </svg>
          </div>
        )}

        {/* Badge — black only, never purple */}
        {product.badge && (
          <span
            className="absolute top-4 left-4 font-barlow-cond font-bold text-[10px] tracking-[0.2em] uppercase text-white px-[10px] py-1"
            style={{ background: "#1A1A1A" }}
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
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: "rgba(0,0,0,0.5)",
            color: wishlisted ? "#5C2D8F" : "white",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#5C2D8F" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="pt-4 pb-2" style={{ background: "#FFFFFF" }}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className="font-barlow-cond font-bold text-[14px] tracking-[0.05em] uppercase leading-tight"
            style={{ color: "#1A1A1A" }}
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
            style={{ color: "#5C2D8F" }}
          >
            Add to Bag
          </button>
        </div>
        <p className="font-barlow text-[14px] mt-1" style={{ color: "#6B6B6B" }}>
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
      {/* Dark overlay only — no purple */}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.35)" }} />
      <div
        className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{ background: "rgba(0,0,0,0.15)" }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <h3 className="font-barlow-cond font-bold text-white leading-tight" style={{ fontSize: "28px" }}>
          {cat.name}
        </h3>
        <p
          className="font-barlow-cond font-bold tracking-[0.2em] uppercase mt-1"
          style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)" }}
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

  // Newsletter state
  const [nlEmail,   setNlEmail]   = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlStatus,  setNlStatus]  = useState<"idle" | "success" | "error" | "duplicate">("idle");

  const handleSubscribe = async () => {
    if (!nlEmail.trim()) return;
    setNlLoading(true);
    setNlStatus("idle");
    try {
      const res  = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: nlEmail }) });
      const json = await res.json() as { error?: string };
      if (res.status === 409 || json.error === "already_subscribed") { setNlStatus("duplicate"); }
      else if (!res.ok) { setNlStatus("error"); }
      else { setNlStatus("success"); setNlEmail(""); }
    } catch { setNlStatus("error"); }
    finally { setNlLoading(false); }
  };

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF" }}>
        <div
          className="flex flex-col md:grid md:h-screen"
          style={{ gridTemplateColumns: "60% 40%" }}
        >
          {/* Left: text — order-2 on mobile (image shows first), order-1 on desktop */}
          <div
            className="flex flex-col justify-center pt-8 pb-10 md:pt-0 md:pb-0 order-2 md:order-1"
            style={{
              paddingLeft: "clamp(24px, 5.5vw, 80px)",
              paddingRight: "clamp(16px, 2vw, 40px)",
            }}
          >
            <h1 className="hero-headline font-barlow-cond uppercase animate-fade-up">
              <span style={{ display: "block" }}>DRESS THE POWER</span>
              <span style={{ display: "block" }}>OWN THE ROOM.</span>
            </h1>

            <div
              className="flex flex-wrap items-center animate-fade-up animation-delay-100"
              style={{ gap: "12px", marginTop: "32px" }}
            >
              <Link
                href="/collections"
                className="btn-hero-primary font-barlow-cond uppercase inline-block text-white"
                style={{ fontWeight: 600, letterSpacing: "0.12em", background: "#8B52CC" }}
              >
                SHOP NOW
              </Link>
              <Link
                href="/collections"
                className="btn-hero-secondary font-barlow-cond uppercase inline-block"
                style={{
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  border: "2px solid #8B52CC",
                  color: "#8B52CC",
                  background: "transparent",
                }}
              >
                VIEW COLLECTIONS
              </Link>
            </div>
          </div>

          {/* Right: image — order-1 on mobile (shows first), order-2 on desktop */}
          <div
            className="relative overflow-hidden hero-right-col order-1 md:order-2 hero-img-col"
            style={{ background: "#FFFFFF" }}
          >
            <Image
              src="/images/gp-lady-white.png"
              alt="Model in wide-leg trousers"
              fill
              className="object-contain"
              style={{ objectPosition: "center bottom" }}
              priority
              unoptimized
            />
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ──────────────────────────────────────────────────── */}
      <section style={{ background: "#FFFFFF" }}>
        <div className="flex items-end justify-between px-5 md:px-12 pt-16 md:pt-20 pb-8 md:pb-12">
          <div>
            <p
              className="font-barlow-cond font-bold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "#5C2D8F",
                marginBottom: "12px",
              }}
            >
              NEW ARRIVALS
            </p>
            <h2
              className="font-barlow-cond font-bold"
              style={{
                fontSize: "clamp(28px, 3vw, 40px)",
                color: "#1A1A1A",
              }}
            >
              The Latest
            </h2>
          </div>
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase transition-opacity duration-200 hover:opacity-60"
            style={{
              fontSize: "13px",
              letterSpacing: "0.15em",
              color: "#5C2D8F",
            }}
          >
            View all →
          </Link>
        </div>
        <div
          className="grid grid-cols-2 md:grid-cols-4 px-5 md:px-12 pb-16 md:pb-20"
          style={{ gap: "2px" }}
        >
          {PRODUCTS.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i + 1} />
          ))}
        </div>
      </section>

      {/* ── BRAND STORY ──────────────────────────────────────────────────── */}
      <section
        className="px-5 md:px-12 py-16 md:py-24"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #F0F0F0",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-12 md:gap-20 items-center max-w-[1400px] mx-auto">
          {/* Copy */}
          <div data-reveal="left">
            <p
              className="font-barlow-cond font-bold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                color: "#5C2D8F",
                marginBottom: "24px",
              }}
            >
              THE GETPANTED STORY
            </p>
            <h2
              className="font-barlow-cond font-bold leading-[1.15]"
              style={{
                fontSize: "clamp(32px, 4vw, 56px)",
                color: "#1A1A1A",
              }}
            >
              Trousers that tell<br />your story.
            </h2>
            <p
              className="font-barlow leading-[1.8] max-w-[420px]"
              style={{
                fontSize: "16px",
                color: "#6B6B6B",
                marginTop: "24px",
              }}
            >
              Born in Lagos, GetPanted is a celebration of the bold African woman.
              Each trouser is designed with generous proportions, impeccable tailoring,
              and the unapologetic confidence you deserve.
            </p>
            <Link
              href="/about"
              className="font-barlow-cond font-bold uppercase inline-block transition-opacity duration-200 hover:opacity-60"
              style={{
                fontSize: "13px",
                letterSpacing: "0.15em",
                color: "#5C2D8F",
                marginTop: "32px",
              }}
            >
              Our Story →
            </Link>
          </div>
          {/* Image */}
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

      {/* ── SHOP BY STYLE ─────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pb-16 md:pb-24" style={{ background: "#FFFFFF" }}>
        <p
          className="font-barlow-cond font-bold uppercase pt-14 md:pt-16 mb-8"
          style={{
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#5C2D8F",
          }}
        >
          SHOP BY STYLE
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px" }}>
          {CATEGORIES.map((cat) => (
            <CategoryTile key={cat.name} cat={cat} />
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS STRIP ─────────────────────────────────────────────── */}
      <div className="px-5 md:px-12 py-12" style={{ background: "#F7F7F7" }}>
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
                className="font-barlow-cond font-bold uppercase mb-2"
                style={{ fontSize: "14px", letterSpacing: "0.15em", color: "#1A1A1A" }}
              >
                {item.title}
              </p>
              <p
                className="font-barlow leading-[1.6]"
                style={{ fontSize: "13px", color: "#6B6B6B" }}
              >
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── NEWSLETTER ────────────────────────────────────────────────────── */}
      <section className="text-center px-5 md:px-12 py-16 md:py-24" style={{ background: "#FFFFFF" }}>
        <p
          className="font-barlow-cond font-bold uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}
        >
          JOIN THE CLAN
        </p>
        <h2
          className="font-barlow-cond font-bold mt-4 mb-3"
          style={{
            fontSize: "clamp(28px, 3vw, 42px)",
            color: "#1A1A1A",
          }}
        >
          Style drops, first.
        </h2>
        <p
          className="font-barlow leading-relaxed mt-3 mb-8 max-w-lg mx-auto"
          style={{ fontSize: "16px", color: "#6B6B6B" }}
        >
          Be the first to know about new collections, exclusive launches, and styling
          tips from the GetPanted team.
        </p>
        {nlStatus === "success" ? (
          <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "14px", letterSpacing: "0.1em", color: "#5C2D8F" }}>
            You&apos;re in. Check your inbox. ✓
          </p>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto">
              <input
                type="email"
                value={nlEmail}
                onChange={(e) => setNlEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                placeholder="your@email.com"
                className="font-barlow outline-none flex-1"
                style={{
                  border: "1px solid #E0E0E0",
                  borderRight: "none",
                  padding: "14px 20px",
                  fontSize: "15px",
                  background: "#FFFFFF",
                  color: "#1A1A1A",
                }}
              />
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={nlLoading}
                className="btn-subscribe font-barlow-cond font-bold uppercase text-white inline-flex items-center justify-center whitespace-nowrap disabled:opacity-60"
                style={{ padding: "14px 32px", fontSize: "13px", letterSpacing: "0.15em" }}
              >
                {nlLoading ? "..." : "Subscribe"}
              </button>
            </div>
            {nlStatus === "duplicate" && (
              <p className="font-barlow mt-3" style={{ fontSize: "13px", color: "#6B6B6B" }}>You&apos;re already subscribed.</p>
            )}
            {nlStatus === "error" && (
              <p className="font-barlow mt-3" style={{ fontSize: "13px", color: "#E53935" }}>Something went wrong. Please try again.</p>
            )}
          </>
        )}
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="px-5 md:px-12"
        style={{
          background: "#1A1A1A",
          paddingTop: "64px",
          paddingBottom: "32px",
        }}
      >
        <div className="max-w-[1400px] mx-auto">

          {/* Top row: logo + socials */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              className="font-barlow-cond font-bold tracking-[0.18em] uppercase"
              style={{ fontSize: "20px" }}
            >
              <span style={{ color: "#FFFFFF" }}>Get</span>
              <span style={{ color: "#8B52CC" }}>Panted</span>
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
                  style={{ color: "#6B6B6B" }}
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

          {/* Link columns */}
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
                  className="font-barlow-cond font-bold uppercase mb-5"
                  style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#6B6B6B" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link
                        href={FOOTER_LINKS[link] ?? "/about"}
                        className="font-barlow transition-colors duration-200 hover:text-white"
                        style={{ fontSize: "14px", color: "#6B6B6B" }}
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
          <div className="pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <p
              className="font-barlow"
              style={{ fontSize: "13px", color: "#6B6B6B" }}
            >
              © 2026 GetPanted. All rights reserved. Lagos, Nigeria.
            </p>
          </div>

        </div>
      </footer>

    </main>
  );
}

