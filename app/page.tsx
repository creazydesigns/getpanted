"use client";

import Image from "next/image";
import Link from "next/link";
import "./homepage.css";
import { useScrollReveal } from "./hooks/use-scroll-reveal";
import { PageFooter } from "./components/page-footer";
import { ProductCard } from "./components/product-card";
import { useSiteContent } from "@/hooks/use-site-content";
import { useProducts } from "@/hooks/use-products";

const STYLE_CATEGORIES = [
  { name: "Minimal", href: "/collections?style=minimal", icon: "pants" },
  { name: "Statement", href: "/collections?style=statement", icon: "flare" },
  { name: "Workwear", href: "/collections?style=workwear", icon: "bag" },
  { name: "Two-Tone", href: "/collections?style=two-tone", icon: "split" },
] as const;

const TEXT_CATEGORIES = [
  { label: "Collection", href: "/collections" },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Made to Order", href: "/made-to-order" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const PILLARS = [
  {
    title: "Intentional Fit",
    body: "Designed with attention to waist, hip, length, and movement.",
    icon: "fit",
  },
  {
    title: "Limited Pieces",
    body: "Produced in thoughtful quantities to protect quality.",
    icon: "limited",
  },
  {
    title: "Made to Order",
    body: "Sold-out pieces may be requested and produced again.",
    icon: "order",
  },
  {
    title: "Quality Checked",
    body: "Every piece is reviewed before it is packaged.",
    icon: "quality",
  },
  {
    title: "Secure Shopping",
    body: "Encrypted checkout and trusted payment partners.",
    icon: "lock",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The fit is everything. I finally have trousers that feel intentional from the first wear — polished without trying too hard.",
    name: "Adaora O.",
    role: "Lagos",
  },
  {
    quote:
      "GetPanted changed how I dress for work. Clean lines, real presence, and pieces I reach for every week.",
    name: "Chioma E.",
    role: "Abuja",
  },
];

function CategoryIcon({ type }: { type: string }) {
  const stroke = "currentColor";
  if (type === "flare") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M8 3h8l2 18H6L8 3z" />
        <path d="M9 10h6" />
      </svg>
    );
  }
  if (type === "bag") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <path d="M6 8h12l1 13H5L6 8z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
    );
  }
  if (type === "split") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
        <rect x="4" y="4" width="16" height="16" />
        <path d="M12 4v16" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.4">
      <path d="M9 3h6l1 4H8L9 3z" />
      <path d="M8 7l-2 14h12l-2-14" />
    </svg>
  );
}

function PillarIcon({ type }: { type: string }) {
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.4 };
  switch (type) {
    case "fit":
      return (
        <svg {...props}>
          <circle cx="12" cy="8" r="3" />
          <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
        </svg>
      );
    case "limited":
      return (
        <svg {...props}>
          <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
        </svg>
      );
    case "order":
      return (
        <svg {...props}>
          <path d="M6 2h12v4H6z" />
          <path d="M6 6l-2 14h16l-2-14" />
          <path d="M10 10h4" />
        </svg>
      );
    case "quality":
      return (
        <svg {...props}>
          <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7-6.3-4.6L5.7 21l2.3-7-6-4.6h7.6z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <rect x="5" y="11" width="14" height="10" rx="1" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
        </svg>
      );
  }
}

export default function HomePage() {
  useScrollReveal();
  const { get } = useSiteContent();
  const { products, loading: productsLoading } = useProducts();
  const featuredProducts = products.slice(0, 8);

  const heroLine1 = get("homepage.hero_line_1") || "The Art of";
  const heroLine2 = get("homepage.hero_line_2") || "Effortless Elegance";
  const heroTagline =
    get("homepage.hero_tagline") ||
    "Elevated trousers made for confidence, comfort, and style — from clean everyday silhouettes to bold statement pieces.";
  const heroTaglineMatch = heroTagline.match(/^(.*?[—–-])\s*(.+)$/s);
  const heroTaglineLine1 = heroTaglineMatch?.[1]?.trim() || heroTagline;
  const heroTaglineLine2 = heroTaglineMatch?.[2]?.trim() || "";
  const heroCtaLabel = get("homepage.hero_button_label") || "Shop All";
  const heroCtaLink = get("homepage.hero_button_link") || "/collections";

  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="hp-hero">
        <div className="hp-hero-copy">
          <h1 className="hp-hero-title animate-fade-up">
            <span>{heroLine1}</span>
            <span>{heroLine2}</span>
          </h1>
          <p className="hp-hero-sub animate-fade-up animation-delay-100">
            <span>{heroTaglineLine1}</span>
            {heroTaglineLine2 ? <span>{heroTaglineLine2}</span> : null}
          </p>
          <div className="mt-8 animate-fade-up animation-delay-200">
            <Link href={heroCtaLink} className="btn-hp-dark">
              {heroCtaLabel}
            </Link>
          </div>
        </div>

        <div className="hp-hero-visual">
          <div className="hp-hero-media">
            <Image
              src="/images/gp-hero-full.png"
              alt="Model in GetPanted full-length wide-leg trousers"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 55vw"
              quality={90}
              className="hp-hero-img"
            />
            {/* Anchored to the photo frame so tags sit on the figure, not the crop box */}
            <Link href="/collections" className="hp-look-tag hp-look-tag--waist">
              Pleated Waist
            </Link>
            <Link href="/collections" className="hp-look-tag hp-look-tag--leg">
              Wide-Leg Trouser
            </Link>
            <Link href="/collections" className="hp-look-tag hp-look-tag--hem">
              Full-Length Fit
            </Link>
          </div>
        </div>
      </section>

      {/* ── PRESENCE BANNER ──────────────────────────────────────────────── */}
      <section className="hp-presence-banner" aria-label="PRESENCE collection">
        <Image
          src="/images/gp-hero-banner.jpg"
          alt="GetPanted women in wide-leg pleated trousers"
          width={4480}
          height={6720}
          sizes="100vw"
          quality={90}
          className="hp-presence-banner-img"
        />
        <h2 className="hp-presence-banner-headline" data-reveal="fade">
          <span>Re-imagine</span>
          <span>Yourself</span>
        </h2>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <section className="hp-section py-14 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="hp-cat-grid" data-reveal="up">
            {STYLE_CATEGORIES.map((cat) => (
              <Link key={cat.name} href={cat.href} className="hp-cat-tile">
                <span className="hp-cat-icon">
                  <CategoryIcon type={cat.icon} />
                </span>
                <span className="hp-cat-label">{cat.name}</span>
              </Link>
            ))}
          </div>
          <nav className="hp-cat-row" aria-label="Shop categories">
            {TEXT_CATEGORIES.map((item) => (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      <section className="hp-section pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <p className="hp-eyebrow mb-3">New Arrivals</p>
              <h2
                className="font-barlow-cond font-bold"
                style={{ fontSize: "clamp(28px, 3.5vw, 40px)", color: "#1A1A1A" }}
              >
                New Arrivals — PRESENCE
              </h2>
            </div>
            <Link
              href="/new-arrivals"
              className="font-barlow-cond font-bold uppercase inline-flex items-center gap-2 transition-opacity hover:opacity-60"
              style={{ fontSize: "12px", letterSpacing: "0.14em", color: "#1A1A1A" }}
            >
              Filter &amp; Sort
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
            {productsLoading ? (
              <p className="font-barlow col-span-full text-center py-16" style={{ color: "#6B6B6B" }}>
                Loading styles…
              </p>
            ) : featuredProducts.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`ph-${i}`} data-reveal="up" data-delay={String(i + 1)}>
                  <div className="hp-product-media">
                    <div className="hp-placeholder absolute inset-0">Product Placeholder</div>
                  </div>
                  <div className="pt-4">
                    <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "14px" }}>
                      Coming Soon
                    </p>
                    <p className="hp-body-sm mt-1">Elevated trousers</p>
                  </div>
                </div>
              ))
            ) : (
              featuredProducts.map((p, i) => (
                <div key={p.id} data-reveal="up" data-delay={String((i % 4) + 1)}>
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ── PRESENCE EDITORIAL ───────────────────────────────────────────── */}
      <section className="hp-section pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto">
          <div className="hp-editorial" data-reveal="fade">
            <div
              className="hp-editorial-photo"
              role="img"
              aria-label="PRESENCE debut collection — side-buckle trousers"
            />
            <p className="hp-editorial-title">PRESENCE</p>
            <div className="hp-editorial-panel">
              <p className="hp-eyebrow mb-3">Debut Collection</p>
              <p className="hp-body mb-6">
                PRESENCE is our first expression of the GetPanted woman — clean silhouettes, intentional
                fit, and a refined balance of minimal and bold.
              </p>
              <Link href="/collections" className="btn-hp-primary">
                Shop PRESENCE
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUE PILLARS ────────────────────────────────────────────────── */}
      <section className="hp-section py-4 md:py-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="hp-pillars">
            {PILLARS.map((item, i) => (
              <div key={item.title} className="hp-pillar" data-reveal="up" data-delay={String(i + 1)}>
                <div className="flex justify-center mb-4" style={{ color: "#1A1A1A" }}>
                  <PillarIcon type={item.icon} />
                </div>
                <p
                  className="font-barlow-cond font-bold uppercase mb-2"
                  style={{ fontSize: "13px", letterSpacing: "0.12em", color: "#1A1A1A" }}
                >
                  {item.title}
                </p>
                <p className="hp-body-sm">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="hp-section py-16 md:py-24">
        <div className="max-w-[1400px] mx-auto">
          <h2
            className="font-barlow-cond font-bold text-center mb-12 md:mb-16"
            style={{ fontSize: "clamp(24px, 3vw, 36px)", color: "#1A1A1A" }}
          >
            What Our Clients Are Saying
          </h2>
          <div className="hp-quotes">
            <div className="hp-quote-card" data-reveal="left">
              <p className="hp-body" style={{ fontSize: "17px", flex: 1 }}>
                “{TESTIMONIALS[0].quote}”
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: "#E8E8E8" }}
                  aria-hidden
                />
                <div>
                  <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em" }}>
                    {TESTIMONIALS[0].name}
                  </p>
                  <p className="hp-body-sm">{TESTIMONIALS[0].role}</p>
                </div>
              </div>
            </div>

            <div className="hp-quote-feature" data-reveal="up">
              <div className="hp-placeholder absolute inset-0">Portrait Placeholder</div>
              <div className="hp-quote-overlay">
                <p className="font-barlow" style={{ fontSize: "15px", lineHeight: 1.65 }}>
                  “Trousers that move with you — refined, flattering, and made to be noticed.”
                </p>
                <p
                  className="font-barlow-cond font-bold uppercase mt-4"
                  style={{ fontSize: "11px", letterSpacing: "0.14em", opacity: 0.7 }}
                >
                  GetPanted Client
                </p>
              </div>
            </div>

            <div className="hp-quote-card" data-reveal="right">
              <p className="hp-body" style={{ fontSize: "17px", flex: 1 }}>
                “{TESTIMONIALS[1].quote}”
              </p>
              <div className="mt-8 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: "#E8E8E8" }}
                  aria-hidden
                />
                <div>
                  <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em" }}>
                    {TESTIMONIALS[1].name}
                  </p>
                  <p className="hp-body-sm">{TESTIMONIALS[1].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DARK CTA ─────────────────────────────────────────────────────── */}
      <section className="hp-dark-cta">
        <div className="px-6 md:px-12 py-14 md:py-20" data-reveal="left">
          <h2 className="hp-dark-cta-title">
            The World&apos;s Most
            <br />
            Coveted Wardrobe.
          </h2>
        </div>
        <div className="hp-dark-cta-media" data-reveal="up">
          <div className="hp-placeholder absolute inset-0" style={{ background: "#2a2a2a", color: "#888" }}>
            Feature Image Placeholder
          </div>
        </div>
        <div className="px-6 md:px-12 py-14 md:py-20 flex flex-col justify-center gap-6" data-reveal="right">
          <p className="font-barlow" style={{ fontSize: "16px", lineHeight: 1.7, color: "rgba(255,255,255,0.7)", maxWidth: "36ch" }}>
            Discover elevated trousers designed in Lagos for women who enter every room with intention.
          </p>
          <div>
            <Link href="/collections" className="btn-hp-light">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
