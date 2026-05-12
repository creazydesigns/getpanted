"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { PageFooter } from "../components/page-footer";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TeamMember { name: string; role: string; bio: string; initials: string; }
interface Milestone  { year: string; event: string; }
interface Value      { title: string; body: string; icon: React.ReactNode; }

// ── Data ──────────────────────────────────────────────────────────────────────
const TEAM: TeamMember[] = [
  { name: "Adaeze Okonkwo", role: "Founder & Creative Director", initials: "AO", bio: "Born and raised in Lagos, Adaeze built GetPanted from a dream of seeing African women dressed in clothes that truly match their power." },
  { name: "Chisom Eze",     role: "Head of Design",              initials: "CE", bio: "With a background in textile engineering and 8 years at top Lagos ateliers, Chisom brings structural brilliance to every silhouette." },
  { name: "Ngozi Balogun",  role: "Head of Operations",          initials: "NB", bio: "Ngozi ensures every order — from cut to courier — meets the GetPanted standard of excellence, on time, every time." },
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
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
  },
  {
    title: "Made for Every Body",
    body: "Our trousers come in sizes 6 to 26. High waists, wide legs — designed to flatter and celebrate every curve, every frame.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  },
  {
    title: "Lagos Craftsmanship",
    body: "Every piece is cut and sewn in our Lagos studio by skilled local artisans. We are proudly Nigerian — and the world knows it.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
  },
  {
    title: "Sustainable Fabrics",
    body: "We source premium, responsibly produced fabrics and are on a journey toward a fully circular production model by 2028.",
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38" /></svg>,
  },
];

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center" style={{ borderRight: "1px solid #F0F0F0" }}>
      <p className="font-barlow-cond font-bold" style={{ fontSize: "clamp(40px, 5vw, 60px)", color: "#5C2D8F", lineHeight: 1 }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p className="font-barlow-cond font-bold uppercase mt-2" style={{ fontSize: "11px", letterSpacing: "0.2em", color: "#6B6B6B" }}>{label}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { value: 12000, suffix: "+", label: "Women Dressed" },
    { value: 7,     suffix: " yrs", label: "In the Making" },
    { value: 15,    suffix: "+", label: "Countries Shipping" },
    { value: 300,   suffix: "+", label: "Unique Styles" },
  ];

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      {/* ── PAGE HERO ──────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-16" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            About GetPanted
          </p>
          <h1 className="font-barlow-cond" style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 600, lineHeight: 0.95, letterSpacing: "-0.01em", color: "#1A1A1A", maxWidth: "700px" }}>
            <span style={{ display: "block" }}>DRESSED IN</span>
            <span style={{ display: "block" }}>CONFIDENCE.</span>
          </h1>
          <p className="font-barlow mt-6" style={{ fontSize: "16px", color: "#6B6B6B", maxWidth: "480px", lineHeight: 1.7 }}>
            Born in Lagos. Built for the bold. GetPanted is the fashion brand for women who dress with intention.
          </p>
        </div>
      </section>

      {/* ── ORIGIN STORY ───────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
          {/* Image placeholder */}
          <div className="relative" style={{ aspectRatio: "4/5", background: "#F7F7F7" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <svg viewBox="0 0 160 280" fill="none" className="w-1/3 opacity-10">
                <ellipse cx="80" cy="44" rx="28" ry="28" fill="#5C2D8F" />
                <path d="M52 72 C42 92 38 152 32 208 C26 254 22 278 26 280 L134 280 C138 278 134 254 128 208 C122 152 118 92 108 72 Z" fill="#5C2D8F" />
              </svg>
              <p className="font-barlow-cond uppercase mt-4" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#6B6B6B" }}>Founder image</p>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="font-barlow-cond font-bold uppercase mb-5" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>How It Started</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A", marginBottom: "24px" }}>
              One Woman.<br />One Trouser.<br />One Movement.
            </h2>
            <div className="font-barlow space-y-5" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.85 }}>
              <p>GetPanted was born in 2019 from a simple frustration: Adaeze Okonkwo, our founder, could not find trousers that fit her the way she knew she deserved. Everything was either too tight at the waist, too narrow at the hips, or too timid to match the energy she carried into every room.</p>
              <p>So she made her own. From a studio apartment in Yaba, Lagos, with one sewing machine and a vision too large for the room, she drafted the first GetPanted pattern. Twelve pairs. Twelve women. All of them transformed.</p>
              <p>Word spread the way it always does in Lagos — fast, loud, and unstoppable. Today, GetPanted dresses women across three continents, and every trouser still carries that original intention: to make you feel like the most powerful version of yourself.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────────── */}
      <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0", borderBottom: "1px solid #F0F0F0" }}>
        {stats.map((s, i) => (
          <div key={s.label} style={{ borderRight: i < stats.length - 1 ? "1px solid #F0F0F0" : "none" }}>
            <StatItem {...s} start={statsVisible} />
          </div>
        ))}
      </div>

      {/* ── VALUES ─────────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>What Drives Us</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A" }}>Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "1px", background: "#F0F0F0" }}>
            {VALUES.map((v) => (
              <div key={v.title} className="group" style={{ background: "#FFFFFF", padding: "48px" }}>
                <span className="block mb-5" style={{ color: "#5C2D8F" }}>{v.icon}</span>
                <h3 style={{ fontSize: "18px", color: "#1A1A1A", marginBottom: "12px" }}>{v.title}</h3>
                <p className="font-barlow" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.85 }}>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ───────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[800px] mx-auto">
          <div className="mb-14">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Where We've Been</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A" }}>The Journey</h2>
          </div>
          <div className="relative">
            <div className="absolute left-[72px] top-0 bottom-0 w-px" style={{ background: "#E0E0E0" }} />
            {MILESTONES.map((m) => (
              <div key={m.year} className="relative flex gap-8 pb-10">
                <div className="flex-shrink-0 w-[72px] text-right">
                  <span className="font-barlow-cond font-bold" style={{ fontSize: "13px", color: "#5C2D8F" }}>{m.year}</span>
                </div>
                <div className="absolute left-[72px] top-[6px] w-2 h-2 -translate-x-1/2" style={{ background: "#5C2D8F" }} />
                <p className="font-barlow pt-0.5" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.8, paddingLeft: "16px" }}>{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ───────────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20 md:py-28" style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-14">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>The People</p>
            <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", color: "#1A1A1A" }}>Behind the Pleat</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "2px", background: "#F0F0F0" }}>
            {TEAM.map((member) => (
              <div key={member.name} style={{ background: "#FFFFFF", padding: "40px" }}>
                <div className="flex items-center justify-center mb-6" style={{ width: "72px", height: "72px", background: "#F7F7F7" }}>
                  <span className="font-barlow-cond font-bold" style={{ fontSize: "20px", color: "#5C2D8F" }}>{member.initials}</span>
                </div>
                <h3 style={{ fontSize: "16px", color: "#1A1A1A", marginBottom: "4px" }}>{member.name}</h3>
                <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#5C2D8F" }}>{member.role}</p>
                <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.8 }}>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS ──────────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-16" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase text-center mb-10" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#6B6B6B" }}>As Seen In</p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {["Vogue Africa", "Guardian Life", "TW Magazine", "Pulse Nigeria", "ThisDay Style"].map((pub) => (
              <span key={pub} className="font-barlow-cond font-bold uppercase transition-colors duration-200 cursor-default hover:text-[#1A1A1A]" style={{ fontSize: "14px", letterSpacing: "0.1em", color: "#6B6B6B" }}>
                {pub}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-24 text-center" style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0F0" }}>
        <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Ready to Get Panted?</p>
        <h2 className="mx-auto mb-8" style={{ fontSize: "clamp(32px, 4vw, 52px)", color: "#1A1A1A", maxWidth: "480px" }}>
          Find Your Perfect Trouser.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
            style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
          >
            Shop Collection
          </Link>
          <Link
            href="/bespoke"
            className="font-barlow-cond font-bold uppercase inline-block transition-all hover:bg-[#1A1A1A] hover:text-white"
            style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "15px 47px", border: "1px solid #1A1A1A", color: "#1A1A1A" }}
          >
            Custom Order
          </Link>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
