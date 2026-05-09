"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useShop } from "../context/shop-context";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TeamMember {
  name: string;
  role: string;
  bio: string;
  initials: string;
}

interface Milestone {
  year: string;
  event: string;
}

interface Value {
  title: string;
  body: string;
  icon: React.ReactNode;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const TEAM: TeamMember[] = [
  {
    name: "Adaeze Okonkwo",
    role: "Founder & Creative Director",
    bio: "Born and raised in Lagos, Adaeze built GetPanted from a dream of seeing African women dressed in clothes that truly match their power.",
    initials: "AO",
  },
  {
    name: "Chisom Eze",
    role: "Head of Design",
    bio: "With a background in textile engineering and 8 years at top Lagos ateliers, Chisom brings structural brilliance to every silhouette.",
    initials: "CE",
  },
  {
    name: "Ngozi Balogun",
    role: "Head of Operations",
    bio: "Ngozi ensures every order — from cut to courier — meets the GetPanted standard of excellence, on time, every time.",
    initials: "NB",
  },
];

const MILESTONES: Milestone[] = [
  { year: "2019", event: "GetPanted founded in a small Lagos studio with just 12 designs." },
  { year: "2020", event: "First viral look — the Royal Pleat trouser — sells out in 48 hours." },
  { year: "2021", event: "Opened flagship showroom in Victoria Island, Lagos." },
  { year: "2022", event: "Launched custom tailoring — made-to-measure for every body." },
  { year: "2023", event: "Expanded shipping to 15 African countries." },
  { year: "2024", event: "Named one of Nigeria's Top 10 Fashion Brands by Vogue Africa." },
  { year: "2026", event: "Now serving women across three continents. Still growing." },
];

const VALUES: Value[] = [
  {
    title: "Bold by Design",
    body: "We don't do subtle. Every trouser is built to make a statement — in the boardroom, at a party, or just running errands in style.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Made for Every Body",
    body: "Our trousers come in sizes 6 to 26. High waists, wide legs — designed to flatter and celebrate every curve, every frame.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Lagos Craftsmanship",
    body: "Every piece is cut and sewn in our Lagos studio by skilled local artisans. We are proudly Nigerian — and the world knows it.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: "Sustainable Fabrics",
    body: "We source premium, responsibly produced fabrics and are on a journey toward a fully circular production model by 2028.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
        <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" />
      </svg>
    ),
  },
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

// ── Navbar (reuse pattern from homepage) ──────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount, wishlistCount, openMiniCart } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[var(--gp-header)] backdrop-blur-md border-b border-[rgb(var(--gp-fg-rgb) / 0.08)]"
          : "bg-transparent"
      }`}
    >
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
                  item.label === "About"
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
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </Link>
          <Link href="/wishlist" aria-label="Wishlist" className="relative text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)] transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
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
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
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

// ── Counter animation hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration: number = 1800, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

// ── Stats section with animated counters ──────────────────────────────────────
function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 12000, suffix: "+", label: "Women dressed" },
    { value: 7, suffix: " yrs", label: "In the making" },
    { value: 15, suffix: "+", label: "Countries shipping" },
    { value: 300, suffix: "+", label: "Unique styles" },
  ];

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[rgb(var(--gp-fg-rgb) / 0.08)]"
    >
      {stats.map((s) => {
        const count = useCountUp(s.value, 1800, visible);
        return (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-14 px-6 border-r border-[rgb(var(--gp-fg-rgb) / 0.08)] last:border-r-0 text-center"
          >
            <p className="font-cormorant text-[clamp(40px,5vw,64px)] font-light text-[var(--gp-accent)] leading-none mb-2">
              {count.toLocaleString()}{s.suffix}
            </p>
            <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.35)]">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── Timeline ──────────────────────────────────────────────────────────────────
function Timeline() {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-[80px] md:left-1/2 top-0 bottom-0 w-px bg-[rgba(201,169,110,0.15)] -translate-x-1/2" />

      <div className="space-y-0">
        {MILESTONES.map((m, i) => (
          <div
            key={m.year}
            className={`relative flex items-start gap-8 py-8 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } flex-row`}
          >
            {/* Content */}
            <div
              className={`flex-1 ${
                i % 2 === 0 ? "md:text-right md:pr-12" : "md:text-left md:pl-12"
              } pl-24 md:pl-0`}
            >
              <p className="font-cormorant text-[13px] italic text-[rgb(var(--gp-fg-rgb) / 0.35)] mb-1">{m.year}</p>
              <p className="text-[14px] text-[rgb(var(--gp-fg-rgb) / 0.65)] font-light leading-relaxed max-w-xs md:ml-auto">
                {m.event}
              </p>
            </div>

            {/* Dot */}
            <div className="absolute left-[80px] md:left-1/2 top-9 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--gp-accent)] border-2 border-[#0a0a0a] z-10" />

            {/* Empty right/left side for desktop alternation */}
            <div className="hidden md:block flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <main className="bg-[var(--gp-canvas)] text-[var(--gp-fg)] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[70vh] flex items-end pb-20 pt-32 px-8 overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 60px)",
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

        {/* Large background text */}
        <p
          className="absolute right-8 top-1/2 -translate-y-1/2 font-cormorant text-[clamp(120px,18vw,260px)] font-light text-[rgba(201,169,110,0.04)] leading-none select-none pointer-events-none whitespace-nowrap"
          aria-hidden="true"
        >
          Our Story
        </p>

        <div className="relative z-10 max-w-[1400px] mx-auto w-full">
          <p className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-6">
            <span className="block w-8 h-px bg-[var(--gp-accent)]" />
            About GetPanted
          </p>
          <h1 className="font-cormorant text-[clamp(52px,8vw,100px)] font-light leading-[0.95] max-w-4xl">
            Dressed in<br />
            <em className="italic text-[var(--gp-accent)]">confidence,</em><br />
            made in Lagos.
          </h1>
        </div>
      </section>

      {/* ── Origin story ──────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-20 grid md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Visual */}
        <div className="relative">
          <div className="aspect-[4/5] bg-gradient-to-br from-[#1a1410] to-[#2d1f14] relative overflow-hidden">
            {/* Replace with actual founder image */}
            {/* <Image src="/images/founder.jpg" alt="Founder" fill className="object-cover object-top" /> */}
            <div className="w-full h-full flex items-center justify-center">
              <svg viewBox="0 0 160 280" fill="none" className="w-1/3 opacity-20">
                <ellipse cx="80" cy="44" rx="28" ry="28" fill="var(--gp-accent)" />
                <path d="M52 72 C42 92 38 152 32 208 C26 254 22 278 26 280 L134 280 C138 278 134 254 128 208 C122 152 118 92 108 72 Z" fill="var(--gp-accent)" />
              </svg>
              <p className="absolute text-[10px] tracking-[0.2em] uppercase text-[rgba(201,169,110,0.3)] bottom-8 text-center">
                Founder image
              </p>
            </div>
          </div>
          {/* Offset accent box */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-[rgba(201,169,110,0.2)] hidden md:block" />
          <div className="absolute -top-6 -left-6 w-20 h-20 border border-[rgba(201,169,110,0.12)] hidden md:block" />
        </div>

        {/* Text */}
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-5">How It Started</p>
          <h2 className="font-cormorant text-[clamp(36px,4vw,50px)] font-light leading-[1.1] mb-6 text-[var(--gp-fg)]">
            One woman.<br />One trouser.<br />
            <em className="italic text-[var(--gp-accent)]">One movement.</em>
          </h2>
          <div className="space-y-5 text-[14px] text-[rgb(var(--gp-fg-rgb) / 0.45)] font-light leading-[1.95]">
            <p>
              GetPanted was born in 2019 from a simple frustration: Adaeze Okonkwo, our founder, could not find trousers that fit her the way she knew she deserved to be fitted. Everything was either too tight at the waist, too narrow at the hips, or too timid to match the energy she carried into every room.
            </p>
            <p>
              So she made her own. From a studio apartment in Yaba, Lagos, with one sewing machine and a vision too large for the room, she drafted the first GetPanted pattern. Twelve pairs. Twelve women. All of them transformed.
            </p>
            <p>
              Word spread the way it always does in Lagos — fast, loud, and unstoppable. Within six months, she had a waiting list. Within a year, she had a brand. Today, GetPanted dresses women across three continents, and every single trouser still carries that original intention: to make you feel like the most powerful version of yourself the moment you pull them on.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <StatsSection />

      {/* ── Values ────────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-4">What Drives Us</p>
          <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light text-[var(--gp-fg)]">
            Our <em className="italic text-[var(--gp-accent)]">values</em>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgb(var(--gp-fg-rgb) / 0.07)]">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-[var(--gp-canvas)] p-10 group hover:bg-[var(--gp-marquee)] transition-colors duration-300">
              <span className="text-[var(--gp-accent)] mb-5 block group-hover:scale-110 transition-transform duration-300 origin-left">
                {v.icon}
              </span>
              <h3 className="font-cormorant text-2xl font-light text-[var(--gp-fg)] mb-3">{v.title}</h3>
              <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.38)] font-light leading-[1.9]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Timeline ──────────────────────────────────────────────────────── */}
      <section className="max-w-[900px] mx-auto px-8 pb-24">
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-4">Where We've Been</p>
          <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light text-[var(--gp-fg)]">
            The <em className="italic text-[var(--gp-accent)]">journey</em>
          </h2>
        </div>
        <Timeline />
      </section>

      {/* ── Team ──────────────────────────────────────────────────────────── */}
      <section className="bg-[var(--gp-deep)] border-t border-[rgb(var(--gp-fg-rgb) / 0.07)] py-24 px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-4">The People</p>
            <h2 className="font-cormorant text-[clamp(36px,4vw,52px)] font-light text-[var(--gp-fg)]">
              Behind the <em className="italic text-[var(--gp-accent)]">pleat</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEAM.map((member) => (
              <div key={member.name} className="group">
                {/* Photo placeholder */}
                <div className="aspect-[4/5] bg-gradient-to-br from-[#161210] to-[#241a12] relative overflow-hidden mb-6">
                  {/* Replace with: <Image src={member.image} alt={member.name} fill className="object-cover object-top" /> */}
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.2)] flex items-center justify-center">
                      <span className="font-cormorant text-2xl text-[var(--gp-accent)] font-light">{member.initials}</span>
                    </div>
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[rgb(var(--gp-ink-rgb) / 0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-center justify-center">
                    <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.7)] text-center px-8 font-light leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </div>
                <h3 className="font-cormorant text-xl font-light text-[var(--gp-fg)] mb-1">{member.name}</h3>
                <p className="text-[11px] tracking-[0.12em] uppercase text-[var(--gp-accent)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Press / As Seen In ────────────────────────────────────────────── */}
      <section className="border-t border-[rgb(var(--gp-fg-rgb) / 0.07)] py-16 px-8">
        <div className="max-w-[1400px] mx-auto">
          <p className="text-center text-[10px] tracking-[0.22em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.25)] mb-10">
            As Seen In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {["Vogue Africa", "Guardian Life", "TW Magazine", "Pulse Nigeria", "ThisDay Style"].map((pub) => (
              <span
                key={pub}
                className="font-cormorant text-[clamp(16px,2vw,22px)] font-light text-[rgb(var(--gp-fg-rgb) / 0.18)] tracking-[0.06em] hover:text-[rgb(var(--gp-fg-rgb) / 0.45)] transition-colors duration-300 cursor-default"
              >
                {pub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="relative py-28 px-8 overflow-hidden border-t border-[rgb(var(--gp-fg-rgb) / 0.07)]">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 50px)",
          }}
        />
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-6">Ready to Get Panted?</p>
          <h2 className="font-cormorant text-[clamp(40px,5vw,64px)] font-light leading-[1.05] text-[var(--gp-fg)] mb-8">
            Find your perfect<br />
            <em className="italic text-[var(--gp-accent)]">trouser.</em>
          </h2>
          <div className="flex items-center justify-center gap-5">
            <Link
              href="/collections"
              className="bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-10 py-4 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors duration-200"
            >
              Shop Collection
            </Link>
            <Link
              href="/bespoke"
              className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] text-[var(--gp-fg)] px-10 py-4 text-[11px] font-medium tracking-[0.16em] uppercase hover:border-[var(--gp-accent)] hover:text-[var(--gp-accent)] transition-colors duration-200"
            >
              Custom Order
            </Link>
          </div>
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
              { title: "Info", links: ["About GetPanted", "Sustainability", "Size Guide", "Care Instructions"] },
              { title: "Help", links: ["FAQs", "Shipping & Returns", "Track Order", "Contact Us"] },
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

        .font-cormorant {
          font-family: 'Cormorant Garamond', serif;
        }

        body {
          font-family: 'DM Sans', sans-serif;
        }
      `}</style>
    </main>
  );
}
