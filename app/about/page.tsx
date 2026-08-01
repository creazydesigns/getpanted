"use client";

import Image from "next/image";
import Link from "next/link";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import { useSiteContent } from "@/hooks/use-site-content";
import "../storefront.css";

const BRAND_PILLARS = [
  {
    number: "01",
    title: "Fit That Flatters",
    body: "Designed with real women's bodies in mind, with attention to waist, hip, length, and movement.",
  },
  {
    number: "02",
    title: "Style With Intention",
    body: "From minimal everyday pieces to bold statement trousers, every design has a reason.",
  },
  {
    number: "03",
    title: "Classy, Not Boring",
    body: "We create pants that feel refined, modern, and expressive without losing elegance.",
  },
  {
    number: "04",
    title: "Made to Move With You",
    body: "For work, brunch, events, travel, content days, and everything in between.",
  },
];

const VALUES = [
  {
    title: "Confidence Without Noise",
    body: "GetPanted is bold, but never desperate for attention. Our pieces are designed to speak with presence.",
  },
  {
    title: "Comfort With Structure",
    body: "We believe trousers should look good and feel good. Fit, movement, and ease matter.",
  },
  {
    title: "Intentional Design",
    body: "Every colour, cut, length, and silhouette should have a purpose.",
  },
  {
    title: "Quality Before Quantity",
    body: "We would rather release fewer pieces well than rush many pieces without consistency.",
  },
  {
    title: "Lagos-Born, Woman-Focused",
    body: "Our brand is rooted in the energy of Lagos and shaped around the style needs of modern women.",
  },
];

const BUILDING = [
  {
    title: "The Everyday Pant",
    body: "Pants women can wear repeatedly, style differently, and still feel confident in.",
  },
  {
    title: "The Statement Pant",
    body: "Bold silhouettes and expressive pieces for women who want their outfit to speak.",
  },
  {
    title: "The Fit Standard",
    body: "A sizing and fit approach designed with Nigerian women's bodies, proportions, and style needs in mind.",
  },
  {
    title: "The GetPanted Lifestyle",
    body: "A brand that grows beyond clothing into styling,wardrobe identity, confidence, and how women show up in the world.",
  },
  {
    title: "The Future Space",
    body: "A future physical experience where women can shop, get styled, try new silhouettes, and find trousers that truly feel like them.",
  },
];

export default function AboutPage() {
  const { get } = useSiteContent();
  const aboutImage = get("about.image");

  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <style>{`
        @media (min-width: 1024px) {
          .about-pillars.hp-pillars {
            grid-template-columns: repeat(4, 1fr) !important;
          }
          .about-pillars .hp-pillar:nth-child(2n) {
            border-right: 1px solid var(--hp-border) !important;
          }
          .about-pillars .hp-pillar:last-child {
            border-right: none !important;
          }
        }
      `}</style>

      <StorefrontHeader
        eyebrow="About GetPanted"
        title="Pants for women who show up intentionally."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <section className="hp-section py-10 md:py-14">
        <div className="mx-auto max-w-[1400px]">
          <p className="hp-body max-w-[560px]" style={{ whiteSpace: "pre-line" }}>
            {get("about.brand_story")}
          </p>
          {aboutImage && (
            <div className="relative mt-8 mb-8" style={{ width: "100%", maxWidth: 400, aspectRatio: "4/5" }}>
              <Image src={aboutImage} alt="GetPanted" fill className="object-cover" unoptimized />
            </div>
          )}
          <p className={`hp-body max-w-[560px] ${aboutImage ? "" : "mt-6"}`}>
            Born in Lagos, we design pants that move with real women, fit beautifully, and make everyday dressing feel more expressive.
          </p>
        </div>
      </section>

      <section className="hp-section py-16 md:py-24">
        <div className="mx-auto max-w-[800px]">
          <p className="hp-eyebrow mb-5">The GetPanted Story</p>
          <h2
            className="font-barlow-cond font-bold leading-[1.1] mb-8"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "var(--hp-ink)" }}
          >
            Built around the power of a good pair of pants.
          </h2>
          <div className="hp-body space-y-5" style={{ lineHeight: 1.85 }}>
            <p>GetPanted was created from a simple belief: a good pair of pants can change how a woman feels.</p>
            <p>It can make her feel sharper. Softer. Bolder. More confident. More like herself.</p>
            <p>
              We are a Lagos-born women&apos;s pants brand focused on creating trousers that are stylish, comfortable, and intentionally designed for the way modern women live, work, move, and show up.
            </p>
            <p>
              Our pieces are made for women who want more than basic trousers — women who want pants that feel classy, flattering, expressive, and easy to style.
            </p>
            <p>Some pieces are minimal. Some are bold. Some are soft. Some are dramatic.</p>
            <p>
              But every GetPanted piece is designed with the same intention: to help women look put together without feeling ordinary.
            </p>
            <p>Because pants should not be an afterthought. They should be the piece that brings the whole look together.</p>
          </div>
        </div>
      </section>

      <section className="hp-section hp-soft-band py-16 md:py-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-12">
            <p className="hp-eyebrow mb-3">What We Stand For</p>
            <h2
              className="font-barlow-cond font-bold"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--hp-ink)" }}
            >
              Our Brand Pillars
            </h2>
          </div>
          <div className="hp-pillars about-pillars">
            {BRAND_PILLARS.map((pillar) => (
              <div key={pillar.number} className="hp-pillar">
                <p
                  className="font-barlow-cond font-bold mb-4"
                  style={{ fontSize: "28px", color: "rgba(92,45,143,0.2)", lineHeight: 1 }}
                >
                  {pillar.number}
                </p>
                <h3
                  className="font-barlow-cond font-bold mb-3"
                  style={{
                    fontSize: "16px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--hp-ink)",
                  }}
                >
                  {pillar.title}
                </h3>
                <p className="hp-body-sm">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section py-16 md:py-24">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-12">
            <p className="hp-eyebrow mb-3">What Drives Us</p>
            <h2
              className="font-barlow-cond font-bold"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--hp-ink)" }}
            >
              Our Values
            </h2>
          </div>
          <div style={{ borderTop: "1px solid var(--hp-border)" }}>
            {VALUES.map((v) => (
              <div
                key={v.title}
                className="py-8 md:py-10 md:grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10"
                style={{ borderBottom: "1px solid var(--hp-border)" }}
              >
                <h3
                  className="font-barlow-cond font-bold mb-3 md:mb-0"
                  style={{ fontSize: "18px", color: "var(--hp-ink)" }}
                >
                  {v.title}
                </h3>
                <p className="hp-body-sm" style={{ lineHeight: 1.85 }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section hp-soft-band py-16 md:py-24">
        <div className="mx-auto max-w-[900px]">
          <div className="mb-12">
            <p className="hp-eyebrow mb-3">Where We Are Going</p>
            <h2
              className="font-barlow-cond font-bold"
              style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "var(--hp-ink)" }}
            >
              What We Are Building
            </h2>
          </div>
          <div>
            {BUILDING.map((item, i) => (
              <div
                key={item.title}
                className="pb-8 mb-8"
                style={{
                  borderBottom: i === BUILDING.length - 1 ? "none" : "1px solid var(--hp-border)",
                  marginBottom: i === BUILDING.length - 1 ? 0 : undefined,
                  paddingBottom: i === BUILDING.length - 1 ? 0 : undefined,
                }}
              >
                <h3
                  className="font-barlow-cond font-bold mb-2"
                  style={{ fontSize: "18px", color: "var(--hp-ink)" }}
                >
                  {item.title}
                </h3>
                <p className="hp-body-sm" style={{ lineHeight: 1.8 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section hp-soft-band py-20 md:py-28 text-center">
        <div className="mx-auto max-w-[560px]">
          <p className="hp-eyebrow mb-4">Ready to Get Panted?</p>
          <h2
            className="font-barlow-cond font-bold mb-4"
            style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "var(--hp-ink)" }}
          >
            Step into your presence.
          </h2>
          <p className="hp-body mx-auto mb-8">
            Explore elevated trousers designed to make everyday dressing feel intentional.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/collections" className="btn-hp-primary">
              Shop Collection
            </Link>
            <Link href="/size-guide" className="btn-hp-outline">
              Find Your Size
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
