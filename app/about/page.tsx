"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";

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
    body: "A brand that grows beyond clothing into styling, wardrobe identity, confidence, and how women show up in the world.",
  },
  {
    title: "The Future Space",
    body: "A future physical experience where women can shop, get styled, try new silhouettes, and find trousers that truly feel like them.",
  },
];

export default function AboutPage() {
  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      <section className="px-5 md:px-12 pt-28 pb-16" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            About GetPanted
          </p>
          <h1 className="font-barlow-cond" style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: 600, lineHeight: 1, letterSpacing: "-0.01em", color: "#1A1A1A", maxWidth: "820px" }}>
            Pants for women who show up intentionally.
          </h1>
          <p className="font-barlow mt-6" style={{ fontSize: "16px", color: "#6B6B6B", maxWidth: "560px", lineHeight: 1.75 }}>
            GetPanted is a women&apos;s pants lifestyle brand creating elevated trousers for modern women who want comfort, confidence, and style in one piece.
          </p>
          <p className="font-barlow mt-4" style={{ fontSize: "16px", color: "#6B6B6B", maxWidth: "560px", lineHeight: 1.75 }}>
            Born in Lagos, we design pants that move with real women, fit beautifully, and make everyday dressing feel more expressive.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[800px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-5" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            The GetPanted Story
          </p>
          <h2 className="font-barlow-cond font-bold leading-[1.1] mb-8" style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#1A1A1A" }}>
            Built around the power of a good pair of pants.
          </h2>
          <div className="font-barlow space-y-5" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.85 }}>
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

      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>What We Stand For</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A" }}>Our Brand Pillars</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "#E0E0E0" }}>
            {BRAND_PILLARS.map((pillar) => (
              <div key={pillar.number} style={{ background: "#FFFFFF", padding: "48px" }}>
                <p className="font-barlow-cond font-bold mb-4" style={{ fontSize: "28px", color: "rgba(92,45,143,0.2)", lineHeight: 1 }}>{pillar.number}</p>
                <h3 style={{ fontSize: "18px", color: "#1A1A1A", marginBottom: "12px" }}>{pillar.title}</h3>
                <p className="font-barlow" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.85 }}>{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>What Drives Us</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A" }}>Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", background: "#F0F0F0" }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ background: "#FFFFFF", padding: "40px" }}>
                <h3 style={{ fontSize: "16px", color: "#1A1A1A", marginBottom: "12px" }}>{v.title}</h3>
                <p className="font-barlow" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.85 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <div className="mb-14">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Where We Are Going</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A" }}>What We Are Building</h2>
          </div>
          <div className="space-y-8">
            {BUILDING.map((item) => (
              <div key={item.title} className="pb-8" style={{ borderBottom: "1px solid #E0E0E0" }}>
                <h3 className="font-barlow-cond font-bold mb-2" style={{ fontSize: "18px", color: "#1A1A1A" }}>{item.title}</h3>
                <p className="font-barlow" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.8 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 py-24 text-center" style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0F0" }}>
        <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Ready to Get Panted?</p>
        <h2 className="mx-auto mb-4 font-barlow-cond font-bold" style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#1A1A1A", maxWidth: "520px" }}>
          Step into your presence.
        </h2>
        <p className="font-barlow mx-auto mb-8" style={{ fontSize: "16px", color: "#6B6B6B", maxWidth: "440px", lineHeight: 1.7 }}>
          Explore elevated trousers designed to make everyday dressing feel intentional.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
            style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
          >
            Shop Collection
          </Link>
          <Link
            href="/size-guide"
            className="font-barlow-cond font-bold uppercase inline-block transition-all hover:bg-[#1A1A1A] hover:text-white"
            style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "15px 47px", border: "1px solid #1A1A1A", color: "#1A1A1A" }}
          >
            Find Your Size
          </Link>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
