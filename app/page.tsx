"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "./homepage.css";
import { useShop } from "./context/shop-context";
import { useScrollReveal } from "./hooks/use-scroll-reveal";
import { PageFooter } from "./components/page-footer";
import { useSiteContent } from "@/hooks/use-site-content";
import { useProducts } from "@/hooks/use-products";
import type { StoreProduct } from "@/lib/products/types";

// ── Types ────────────────────────────────────────────────────────────────────
interface Category {
  name: string;
  count: string;
  image: string;
}

// ── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { name: "Minimal Essentials", count: "Clean everyday trousers", image: "/images/solid-luxe.png" },
  { name: "Statement Pants",    count: "Bold silhouettes",        image: "/images/gp-onyx-statement.png" },
  { name: "Workwear Trousers",  count: "Polished & professional", image: "/images/gp-ivory-sovereign.png" },
  { name: "Two-Tone Edits",     count: "Intentional colour pairings", image: "/images/gp-sahara-wide.png" },
];

// ── Product Card ──────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: StoreProduct }) {
  const { addToCart, isWishlisted, toggleWishlist } = useShop();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="group cursor-pointer">
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
        <p className="font-barlow hp-body-sm mt-1">
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
  const { get } = useSiteContent();
  const { products, loading: productsLoading } = useProducts();
  const featuredProducts = products.slice(0, 4);

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
              <span style={{ display: "block" }}>{get("homepage.hero_line_1")}</span>
              <span style={{ display: "block" }}>{get("homepage.hero_line_2")}</span>
            </h1>
            <p
              className="font-barlow hp-body animate-fade-up animation-delay-100"
              style={{ maxWidth: "480px", marginTop: "24px" }}
            >
              {get("homepage.hero_tagline")}
            </p>

            <div
              className="flex flex-wrap items-center animate-fade-up animation-delay-200"
              style={{ gap: "12px", marginTop: "32px" }}
            >
              <Link
                href={get("homepage.hero_button_link") || "/collections"}
                className="btn-hero-primary font-barlow-cond uppercase inline-block text-white"
                style={{ fontWeight: 600, letterSpacing: "0.12em", background: "#8B52CC" }}
              >
                {get("homepage.hero_button_label")}
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
              The Latest from GetPanted
            </h2>
            <p className="font-barlow hp-body-md mt-3" style={{ maxWidth: "420px" }}>
              Fresh silhouettes, limited pieces, and elevated trousers designed to move with you.
            </p>
          </div>
          <Link
            href="/new-arrivals"
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
          {productsLoading ? (
            <p className="font-barlow col-span-full text-center py-12" style={{ color: "#6B6B6B" }}>Loading styles…</p>
          ) : (
            featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))
          )}
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
              Designed for the way<br />you enter a room.
            </h2>
            <p
              className="font-barlow hp-body max-w-[420px]"
              style={{ marginTop: "24px" }}
            >
              Born in Lagos, GetPanted is a women&apos;s pants lifestyle brand built around confidence, fit, and intentional style.
            </p>
            <p
              className="font-barlow hp-body max-w-[420px]"
              style={{ marginTop: "16px" }}
            >
              We create elevated trousers that move with real women — from clean everyday silhouettes to bold statement pieces, each pair is made to feel flattering, refined, and never ordinary.
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

      {/* ── PRESENCE COLLECTION ───────────────────────────────────────────── */}
      <section
        className="px-5 md:px-12 py-16 md:py-24"
        style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}
      >
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-[45%_55%] gap-12 md:gap-20 items-center">
          <div data-reveal="left">
            <p
              className="font-barlow-cond font-bold uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F", marginBottom: "24px" }}
            >
              Introducing Our First Drop
            </p>
            <h2
              className="font-barlow-cond font-bold leading-[1]"
              style={{ fontSize: "clamp(48px, 6vw, 80px)", color: "#1A1A1A", marginBottom: "24px" }}
            >
              PRESENCE
            </h2>
            <p className="font-barlow hp-body" style={{ maxWidth: "440px" }}>
              PRESENCE is our debut collection — the first expression of the GetPanted woman. Designed with clean silhouettes, intentional fit, and a refined balance of minimal and bold details, PRESENCE introduces what we believe pants can be: flattering, confident, expressive, and easy to style.
            </p>
            <Link
              href="/collections"
              className="font-barlow-cond font-bold uppercase inline-block transition-opacity duration-200 hover:opacity-60"
              style={{ fontSize: "13px", letterSpacing: "0.15em", color: "#5C2D8F", marginTop: "32px" }}
            >
              Shop PRESENCE →
            </Link>
          </div>
          <div
            data-reveal="right"
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            <Image
              src="/images/gp-lady-white.png"
              alt="PRESENCE collection"
              fill
              className="object-contain object-bottom"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{ gap: "2px" }}>
          {CATEGORIES.map((cat) => (
            <CategoryTile key={cat.name} cat={cat} />
          ))}
        </div>
      </section>

      {/* ── VALUE PROPS STRIP ─────────────────────────────────────────────── */}
      <div className="px-5 md:px-12 py-12" style={{ background: "#F7F7F7" }}>
        <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "2px" }}>
          {[
            { title: "Intentional Fit", body: "Designed with attention to waist, hip, length, and movement." },
            { title: "Limited Pieces", body: "Produced in thoughtful quantities to protect quality and reduce waste." },
            { title: "Made to Order Option", body: "Sold-out pieces may be requested again and produced within the stated timeline." },
            { title: "Quality Checked", body: "Every piece is reviewed before it is packaged and dispatched." },
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
              <p className="font-barlow hp-body-sm">
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
          JOIN THE LIST
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
        <p className="font-barlow hp-body mt-3 mb-8 max-w-lg mx-auto">
          Be the first to know when new GetPanted pieces, limited drops, size restocks, and styling notes go live.
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
                  fontSize: "17px",
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
              <p className="font-barlow hp-body-sm mt-3">You&apos;re already subscribed.</p>
            )}
            {nlStatus === "error" && (
              <p className="font-barlow hp-body-sm mt-3" style={{ color: "#E53935" }}>Something went wrong. Please try again.</p>
            )}
          </>
        )}
      </section>

      <PageFooter />

    </main>
  );
}

