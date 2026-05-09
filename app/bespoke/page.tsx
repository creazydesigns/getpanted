"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useShop } from "../context/shop-context";

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

interface FabricOption {
  id: string;
  name: string;
  texture: string;
  swatch: string;
  origin: string;
  weight: string;
  price: string;
}

interface StyleOption {
  id: string;
  name: string;
  description: string;
}

interface FormData {
  // Step 1 – Style
  silhouette: string;
  waistStyle: string;
  legOpening: string;
  pleatStyle: string;
  // Step 2 – Fabric
  fabric: string;
  color: string;
  // Step 3 – Measurements
  waist: string;
  hips: string;
  rise: string;
  inseam: string;
  thigh: string;
  // Step 4 – Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes: string;
  timeline: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FABRICS: FabricOption[] = [
  { id: "crepe",    name: "Luxury Crepe",    texture: "Smooth, structured drape", swatch: "#2a2420", origin: "Italy",  weight: "Medium",      price: "+₦0" },
  { id: "satin",    name: "Duchess Satin",   texture: "High sheen, fluid fall",   swatch: "#1a1a2a", origin: "China",  weight: "Medium-heavy", price: "+₦4,000" },
  { id: "linen",    name: "Premium Linen",   texture: "Breathable, relaxed",      swatch: "#c4b89a", origin: "Belgium",weight: "Light",        price: "+₦2,000" },
  { id: "brocade",  name: "Jacquard Brocade",texture: "Rich woven pattern",       swatch: "#3a2a14", origin: "Nigeria",weight: "Heavy",        price: "+₦8,000" },
  { id: "chiffon",  name: "Silk Chiffon",    texture: "Sheer, ethereal flow",     swatch: "#d4c8b8", origin: "India",  weight: "Featherlight", price: "+₦6,000" },
  { id: "wool",     name: "Fine Wool Blend", texture: "Tailored, holds shape",    swatch: "#4a3a2a", origin: "UK",     weight: "Medium-heavy", price: "+₦5,000" },
];

const COLORS: { id: string; name: string; hex: string }[] = [
  { id: "onyx",    name: "Onyx",        hex: "#1a1a1a" },
  { id: "ivory",   name: "Ivory",       hex: "#f5f0e8" },
  { id: "caramel", name: "Caramel",     hex: "#c4a882" },
  { id: "wine",    name: "Deep Wine",   hex: "#6b1a2a" },
  { id: "forest",  name: "Forest",      hex: "#1a3a2a" },
  { id: "cobalt",  name: "Cobalt",      hex: "#1a2a5a" },
  { id: "sand",    name: "Sand",        hex: "#d4b896" },
  { id: "slate",   name: "Slate",       hex: "#4a5a6a" },
  { id: "gold",    name: "Antique Gold",hex: "#c9a96e" },
  { id: "plum",    name: "Plum",        hex: "#6B2D8B" },
  { id: "olive",   name: "Olive",       hex: "#5a5a2a" },
  { id: "blush",   name: "Blush",       hex: "#d4a8a0" },
];

const SILHOUETTES: StyleOption[] = [
  { id: "ultra-wide", name: "Ultra Wide",  description: "Maximum drama. Sweeps the floor like a curtain." },
  { id: "wide",       name: "Wide Leg",    description: "Generous and elegant — the GetPanted signature." },
  { id: "palazzo",    name: "Palazzo",     description: "Floor-length, fluid, and impossibly graceful." },
  { id: "flare",      name: "High Flare",  description: "Fitted through the thigh, dramatic from the knee." },
];

const WAIST_STYLES: StyleOption[] = [
  { id: "high-band",   name: "High Band",    description: "Clean, structured waistband. 4–5 inches high." },
  { id: "paper-bag",   name: "Paper Bag",    description: "Gathered at the waist with a self-tie sash." },
  { id: "fold-over",   name: "Fold-Over",    description: "Soft fold for a relaxed, adjustable fit." },
  { id: "contoured",   name: "Contoured",    description: "Shaped to follow the natural hip curve." },
];

const PLEAT_STYLES: StyleOption[] = [
  { id: "double-pleat", name: "Double Pleat", description: "Two sharp pleats for structured volume." },
  { id: "single-pleat", name: "Single Pleat", description: "One deep pleat — clean and purposeful." },
  { id: "no-pleat",     name: "No Pleat",     description: "Flat front. Streamlined and sleek." },
  { id: "box-pleat",    name: "Box Pleat",    description: "Wide, inverted pleat for maximum fullness." },
];

const TIMELINES = [
  { id: "standard", label: "Standard — 3 weeks",   note: "Our usual production time" },
  { id: "express",  label: "Express — 10 days",     note: "+₦10,000 rush fee" },
  { id: "urgent",   label: "Urgent — 5 days",       note: "+₦20,000 rush fee. Contact us first." },
];

const PROCESS_STEPS = [
  { number: "01", title: "Customise",   body: "Choose your silhouette, fabric, and every design detail through our guided process." },
  { number: "02", title: "Measure",     body: "Submit your exact measurements. No guesswork — we'll guide you with our measurement tutorial." },
  { number: "03", title: "We Craft",    body: "Our Lagos atelier cuts and sews your trouser by hand. Takes 3–5 working days on average." },
  { number: "04", title: "Delivered",   body: "Carefully packaged and shipped to your door, anywhere in Nigeria or internationally." },
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
            { label: "About",        href: "/about" },
            { label: "New Arrivals",  href: "/new-arrivals" },
            { label: "Collections",  href: "/collections" },
            { label: "Bespoke",      href: "/bespoke" },
          ].map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`text-[11px] tracking-[0.14em] uppercase transition-colors duration-200 ${
                  item.label === "Bespoke"
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

// ── Step Indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: Step; total: number }) {
  const labels = ["Style", "Fabric", "Measurements", "Details"];
  return (
    <div className="flex items-center gap-0">
      {labels.map((label, i) => {
        const stepNum = (i + 1) as Step;
        const isActive = stepNum === current;
        const isDone   = stepNum < current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                isDone   ? "bg-[var(--gp-accent)] border-[var(--gp-accent)]" :
                isActive ? "border-[var(--gp-accent)] bg-[rgba(201,169,110,0.08)]" :
                           "border-[rgb(var(--gp-fg-rgb) / 0.15)] bg-transparent"
              }`}>
                {isDone ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                ) : (
                  <span className={`text-[11px] font-medium ${isActive ? "text-[var(--gp-accent)]" : "text-[rgb(var(--gp-fg-rgb) / 0.25)]"}`}>
                    {stepNum}
                  </span>
                )}
              </div>
              <span className={`text-[9px] tracking-[0.14em] uppercase hidden md:block ${
                isActive ? "text-[var(--gp-accent)]" : isDone ? "text-[rgb(var(--gp-fg-rgb) / 0.45)]" : "text-[rgb(var(--gp-fg-rgb) / 0.2)]"
              }`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`w-16 md:w-24 h-px mb-3 transition-colors duration-500 ${isDone ? "bg-[var(--gp-accent)]" : "bg-[rgb(var(--gp-fg-rgb) / 0.1)]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Option Card ────────────────────────────────────────────────────────────────
function OptionCard({
  option, selected, onSelect,
}: {
  option: StyleOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="text-left border p-5 transition-all duration-200 group"
      style={{
        borderColor: selected ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.10)",
        background:  selected ? "rgba(201,169,110,0.06)" : "transparent",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-cormorant text-lg font-light transition-colors ${selected ? "text-[var(--gp-accent)]" : "text-[var(--gp-fg)] group-hover:text-[rgb(var(--gp-fg-rgb) / 0.9)]"}`}>
          {option.name}
        </h4>
        <div className={`w-4 h-4 rounded-full border flex-shrink-0 mt-0.5 transition-all duration-200 ${
          selected ? "border-[var(--gp-accent)] bg-[var(--gp-accent)]" : "border-[rgb(var(--gp-fg-rgb) / 0.2)]"
        }`}>
          {selected && (
            <div className="w-full h-full rounded-full flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.38)] font-light leading-relaxed">{option.description}</p>
    </button>
  );
}

// ── Measurement Input ──────────────────────────────────────────────────────────
function MeasurementInput({
  label, hint, value, onChange, name,
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void; name: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)]">{label}</label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent border border-[rgb(var(--gp-fg-rgb) / 0.12)] px-4 py-3 text-sm text-[var(--gp-fg)] placeholder:text-[rgb(var(--gp-fg-rgb) / 0.2)] outline-none focus:border-[var(--gp-accent)] transition-colors pr-12 font-light [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.3)] tracking-wider">cm</span>
      </div>
      <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.25)] font-light italic">{hint}</p>
    </div>
  );
}

// ── Live Preview Silhouette ────────────────────────────────────────────────────
function LivePreview({ form }: { form: Partial<FormData> }) {
  const colorHex = COLORS.find(c => c.id === form.color)?.hex ?? "#2a2420";
  const fabricName = FABRICS.find(f => f.id === form.fabric)?.name ?? "Luxury Crepe";
  const silhouetteName = SILHOUETTES.find(s => s.id === form.silhouette)?.name ?? "Wide Leg";
  const waistName = WAIST_STYLES.find(w => w.id === form.waistStyle)?.name ?? "High Band";

  // Adjust trouser width based on silhouette
  const legW = form.silhouette === "ultra-wide" ? 90 :
               form.silhouette === "palazzo"     ? 85 :
               form.silhouette === "flare"        ? 55 : 72;

  return (
    <div className="sticky top-24 bg-[var(--gp-deep)] border border-[rgb(var(--gp-fg-rgb) / 0.07)] p-6">
      <p className="text-[9px] tracking-[0.2em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.3)] mb-5">Live Preview</p>

      {/* SVG Trouser Illustration */}
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 200 340" fill="none" className="w-44 transition-all duration-500">
          {/* Waistband */}
          <rect x={100 - 40} y="0" width="80" height={form.waistStyle === "paper-bag" ? 28 : 20} rx="2" fill={colorHex} opacity="0.95"/>

          {/* Waist gather dots for paper-bag */}
          {form.waistStyle === "paper-bag" && (
            <>
              <circle cx="80" cy="10" r="2" fill="rgba(255,255,255,0.15)"/>
              <circle cx="90" cy="8" r="2" fill="rgba(255,255,255,0.15)"/>
              <circle cx="100" cy="10" r="2" fill="rgba(255,255,255,0.15)"/>
              <circle cx="110" cy="8" r="2" fill="rgba(255,255,255,0.15)"/>
              <circle cx="120" cy="10" r="2" fill="rgba(255,255,255,0.15)"/>
            </>
          )}

          {/* Pleat lines */}
          {form.pleatStyle !== "no-pleat" && (
            <>
              <line x1="92" y1="20" x2={88} y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
              {form.pleatStyle === "double-pleat" && (
                <line x1="108" y1="20" x2={112} y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
              )}
              {form.pleatStyle === "box-pleat" && (
                <line x1="95" y1="20" x2={90} y2="100" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5"/>
              )}
            </>
          )}

          {/* Left leg */}
          <path
            d={`M ${100 - 38} 20 L ${100 - legW / 2} 320 L ${100 - 4} 320 L ${100 - 2} 20 Z`}
            fill={colorHex}
            opacity="0.92"
          />
          {/* Right leg */}
          <path
            d={`M ${100 + 38} 20 L ${100 + legW / 2} 320 L ${100 + 4} 320 L ${100 + 2} 20 Z`}
            fill={colorHex}
            opacity="0.92"
          />
          {/* Centre shadow */}
          <path
            d={`M ${100 - 6} 20 L ${100 - 2} 180 L ${100 + 2} 180 L ${100 + 6} 20 Z`}
            fill="rgba(0,0,0,0.2)"
          />
          {/* Flare effect */}
          {form.silhouette === "flare" && (
            <>
              <path d={`M ${100 - 22} 180 L ${100 - legW / 2} 320 L ${100 - 4} 320 L ${100 - 16} 180 Z`} fill={colorHex} opacity="0.15"/>
              <path d={`M ${100 + 22} 180 L ${100 + legW / 2} 320 L ${100 + 4} 320 L ${100 + 16} 180 Z`} fill={colorHex} opacity="0.15"/>
            </>
          )}
          {/* Sheen overlay for satin */}
          {form.fabric === "satin" && (
            <path
              d={`M ${100 - 20} 20 L ${100 - legW / 2 + 10} 320 L ${100 - legW / 2 + 20} 320 L ${100 - 10} 20 Z`}
              fill="rgba(255,255,255,0.06)"
            />
          )}
        </svg>
      </div>

      {/* Summary pills */}
      <div className="space-y-2.5">
        {[
          { label: "Silhouette", value: silhouetteName },
          { label: "Fabric",     value: fabricName },
          { label: "Waist",      value: waistName },
          { label: "Colour",     value: COLORS.find(c => c.id === form.color)?.name ?? "Not selected" },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center border-b border-[rgb(var(--gp-fg-rgb) / 0.05)] pb-2.5">
            <span className="text-[10px] tracking-[0.14em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.3)]">{item.label}</span>
            <span className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.6)] font-light">{item.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1">
          <span className="text-[10px] tracking-[0.14em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.3)]">Base Price</span>
          <span className="font-cormorant text-lg text-[var(--gp-accent)] font-light">
            ₦{(45000 + (FABRICS.find(f => f.id === form.fabric) ? parseInt(FABRICS.find(f => f.id === form.fabric)!.price.replace(/[^\d]/g,"")) : 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BespokePage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const formTopRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Partial<FormData>>({
    silhouette: "wide",
    waistStyle: "high-band",
    pleatStyle: "double-pleat",
    legOpening: "extra-wide",
    fabric: "crepe",
    color: "onyx",
    timeline: "standard",
  });

  const set = (key: keyof FormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const scrollToForm = () => {
    setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };

  const nextStep = () => {
    if (step < 4) { setStep((s) => (s + 1) as Step); scrollToForm(); }
  };
  const prevStep = () => {
    if (step > 1) { setStep((s) => (s - 1) as Step); scrollToForm(); }
  };

  const handleSubmit = () => {
    // In production: POST to your API here
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="bg-[var(--gp-canvas)] text-[var(--gp-fg)] min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-8 py-32">
          <div className="text-center max-w-lg">
            <div className="w-16 h-16 rounded-full border border-[var(--gp-accent)] flex items-center justify-center mx-auto mb-8">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gp-accent)" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-5">Order Received</p>
            <h2 className="font-cormorant text-[clamp(36px,5vw,56px)] font-light leading-tight mb-5 text-[var(--gp-fg)]">
              Your bespoke trouser<br />
              <em className="italic text-[var(--gp-accent)]">is being crafted.</em>
            </h2>
            <p className="text-[14px] text-[rgb(var(--gp-fg-rgb) / 0.4)] font-light leading-relaxed mb-10">
              We've received your order and our atelier team will reach out within 24 hours to confirm your measurements and timeline. Check your inbox at <span className="text-[rgb(var(--gp-fg-rgb) / 0.6)]">{form.email}</span>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-8 py-3.5 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors">
                Back to Home
              </Link>
              <Link href="/collections" className="border border-[rgb(var(--gp-fg-rgb) / 0.15)] text-[rgb(var(--gp-fg-rgb) / 0.5)] px-8 py-3.5 text-[11px] font-medium tracking-[0.16em] uppercase hover:border-[var(--gp-accent)] hover:text-[var(--gp-accent)] transition-colors">
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
          .font-cormorant { font-family: 'Cormorant Garamond', serif; }
          body { font-family: 'DM Sans', sans-serif; }
        `}</style>
      </main>
    );
  }

  return (
    <main className="bg-[var(--gp-canvas)] text-[var(--gp-fg)] min-h-screen overflow-x-hidden">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-8 border-b border-[rgb(var(--gp-fg-rgb) / 0.07)] overflow-hidden">
        {/* Diagonal texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(135deg, #c9a96e 0px, #c9a96e 1px, transparent 1px, transparent 48px)",
          }}
        />
        {/* Ghost word */}
        <p
          className="absolute right-0 top-1/2 -translate-y-1/2 font-cormorant text-[clamp(100px,16vw,220px)] font-light text-[rgba(201,169,110,0.04)] leading-none select-none pointer-events-none"
          aria-hidden="true"
        >
          Bespoke
        </p>
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.3)] mb-8">
            <Link href="/" className="hover:text-[var(--gp-accent)] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[rgb(var(--gp-fg-rgb) / 0.55)]">Bespoke</span>
          </div>
          <p className="flex items-center gap-3 text-[11px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-5">
            <span className="block w-8 h-px bg-[var(--gp-accent)]" />
            Custom Tailoring
          </p>
          <h1 className="font-cormorant text-[clamp(52px,8vw,96px)] font-light leading-[0.95] mb-6">
            Made for<br />
            <em className="italic text-[var(--gp-accent)]">exactly</em><br />
            you.
          </h1>
          <p className="text-[14px] text-[rgb(var(--gp-fg-rgb) / 0.4)] font-light leading-relaxed max-w-md">
            Choose every detail. Submit your measurements. Receive a trouser built around your body — not the other way around.
          </p>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section className="max-w-[1400px] mx-auto px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgb(var(--gp-fg-rgb) / 0.07)]">
          {PROCESS_STEPS.map((s) => (
            <div key={s.number} className="bg-[var(--gp-canvas)] p-8 group hover:bg-[#0e0e0e] transition-colors">
              <p className="font-cormorant text-4xl font-light text-[rgba(201,169,110,0.2)] mb-4 group-hover:text-[rgba(201,169,110,0.35)] transition-colors">
                {s.number}
              </p>
              <h3 className="font-cormorant text-xl font-light text-[var(--gp-fg)] mb-2">{s.title}</h3>
              <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.35)] leading-[1.85] font-light">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Order Form ──────────────────────────────────────────────────────── */}
      <section className="border-t border-[rgb(var(--gp-fg-rgb) / 0.07)]">
        <div ref={formTopRef} className="max-w-[1400px] mx-auto px-8 py-16">
          {/* Step indicator */}
          <div className="flex justify-center mb-14">
            <StepIndicator current={step} total={4} />
          </div>

          <div className="grid md:grid-cols-[1fr_320px] gap-12 items-start">
            {/* ── Form Panel ────────────────────────────────────────────── */}
            <div>

              {/* STEP 1 – Style ─────────────────────────────────────────── */}
              {step === 1 && (
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-2">Step 1 of 4</p>
                    <h2 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light text-[var(--gp-fg)]">
                      Design your <em className="italic text-[var(--gp-accent)]">silhouette</em>
                    </h2>
                    <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.35)] mt-2 font-light">
                      Start with the shape. Everything else follows.
                    </p>
                  </div>

                  {/* Silhouette */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Silhouette</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {SILHOUETTES.map((opt) => (
                        <OptionCard
                          key={opt.id} option={opt}
                          selected={form.silhouette === opt.id}
                          onSelect={() => set("silhouette")(opt.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Waist Style */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Waist Style</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {WAIST_STYLES.map((opt) => (
                        <OptionCard
                          key={opt.id} option={opt}
                          selected={form.waistStyle === opt.id}
                          onSelect={() => set("waistStyle")(opt.id)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Pleat Style */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Pleat Style</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {PLEAT_STYLES.map((opt) => (
                        <OptionCard
                          key={opt.id} option={opt}
                          selected={form.pleatStyle === opt.id}
                          onSelect={() => set("pleatStyle")(opt.id)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2 – Fabric ────────────────────────────────────────── */}
              {step === 2 && (
                <div className="space-y-12">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-2">Step 2 of 4</p>
                    <h2 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light text-[var(--gp-fg)]">
                      Choose your <em className="italic text-[var(--gp-accent)]">fabric</em>
                    </h2>
                    <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.35)] mt-2 font-light">
                      The right fabric is what makes a trouser unforgettable.
                    </p>
                  </div>

                  {/* Fabrics */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Fabric</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FABRICS.map((fab) => (
                        <button
                          key={fab.id}
                          onClick={() => set("fabric")(fab.id)}
                          className="text-left border p-5 transition-all duration-200 flex gap-4 items-start group"
                          style={{
                            borderColor: form.fabric === fab.id ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.10)",
                            background:  form.fabric === fab.id ? "rgba(201,169,110,0.06)" : "transparent",
                          }}
                        >
                          {/* Swatch */}
                          <div
                            className="w-10 h-10 flex-shrink-0 border border-[rgba(255,255,255,0.1)] mt-0.5"
                            style={{ background: fab.swatch }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={`font-cormorant text-lg font-light ${form.fabric === fab.id ? "text-[var(--gp-accent)]" : "text-[var(--gp-fg)]"}`}>
                                {fab.name}
                              </h4>
                              <span className="text-[10px] text-[var(--gp-accent)] whitespace-nowrap mt-1">{fab.price}</span>
                            </div>
                            <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.35)] mb-1">{fab.texture}</p>
                            <div className="flex gap-4">
                              <span className="text-[10px] text-[rgb(var(--gp-fg-rgb) / 0.25)]">From {fab.origin}</span>
                              <span className="text-[10px] text-[rgb(var(--gp-fg-rgb) / 0.25)]">{fab.weight}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colour */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Colour</p>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-3">
                      {COLORS.map((c) => (
                        <div key={c.id} className="flex flex-col items-center gap-1.5">
                          <button
                            onClick={() => set("color")(c.id)}
                            className="w-9 h-9 rounded-full border-2 transition-all duration-150"
                            style={{
                              background: c.hex,
                              borderColor: form.color === c.id ? "#c9a96e" : "transparent",
                              outline: form.color === c.id ? "2px solid rgba(201,169,110,0.3)" : "none",
                              outlineOffset: "2px",
                            }}
                            aria-label={c.name}
                            title={c.name}
                          />
                          <span className="text-[8px] text-[rgb(var(--gp-fg-rgb) / 0.25)] text-center leading-tight hidden sm:block">{c.name}</span>
                        </div>
                      ))}
                    </div>
                    {form.color && (
                      <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.45)] mt-3 font-cormorant italic">
                        Selected: {COLORS.find(c => c.id === form.color)?.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 – Measurements ─────────────────────────────────── */}
              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-2">Step 3 of 4</p>
                    <h2 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light text-[var(--gp-fg)]">
                      Your <em className="italic text-[var(--gp-accent)]">measurements</em>
                    </h2>
                    <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.35)] mt-2 font-light">
                      All measurements in centimetres. Take them over light clothing for best results.
                    </p>
                  </div>

                  {/* Measurement guide callout */}
                  <div className="border border-[rgba(201,169,110,0.2)] bg-[rgba(201,169,110,0.04)] p-5 flex gap-4">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gp-accent)" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <div>
                      <p className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.55)] font-light leading-relaxed">
                        Not sure how to measure? Watch our{" "}
                        <a href="/bespoke#measurement-guide" className="text-[var(--gp-accent)] underline underline-offset-2">2-minute measurement guide</a>{" "}
                        before filling this in. Getting these right ensures a perfect fit on the first try.
                      </p>
                    </div>
                  </div>

                  {/* Measurement diagram */}
                  <div id="measurement-guide" className="flex justify-center">
                    <svg viewBox="0 0 200 320" fill="none" className="w-40 opacity-60">
                      {/* Body outline */}
                      <ellipse cx="100" cy="44" rx="26" ry="26" stroke="rgb(var(--gp-fg-rgb) / 0.2)" strokeWidth="1"/>
                      <path d="M74 70 C60 90 56 130 52 200 C48 255 46 300 50 316 L150 316 C154 300 152 255 148 200 C144 130 140 90 126 70 Z" stroke="rgb(var(--gp-fg-rgb) / 0.2)" strokeWidth="1" fill="rgb(var(--gp-fg-rgb) / 0.03)"/>
                      {/* Waist line */}
                      <line x1="56" y1="120" x2="144" y2="120" stroke="var(--gp-accent)" strokeWidth="0.8" strokeDasharray="3 2"/>
                      <text x="148" y="123" fontSize="7" fill="var(--gp-accent)" fontFamily="sans-serif">Waist</text>
                      {/* Hip line */}
                      <line x1="52" y1="150" x2="148" y2="150" stroke="rgba(201,169,110,0.5)" strokeWidth="0.8" strokeDasharray="3 2"/>
                      <text x="152" y="153" fontSize="7" fill="rgba(201,169,110,0.5)" fontFamily="sans-serif">Hips</text>
                      {/* Inseam */}
                      <line x1="98" y1="170" x2="98" y2="316" stroke="rgba(201,169,110,0.4)" strokeWidth="0.8" strokeDasharray="3 2"/>
                      <text x="102" y="250" fontSize="7" fill="rgba(201,169,110,0.4)" fontFamily="sans-serif">Inseam</text>
                    </svg>
                  </div>

                  {/* Input grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <MeasurementInput
                      label="Waist" name="waist"
                      hint="Measure around the narrowest part of your torso"
                      value={form.waist ?? ""} onChange={set("waist")}
                    />
                    <MeasurementInput
                      label="Hips" name="hips"
                      hint="Measure around the fullest part of your hips"
                      value={form.hips ?? ""} onChange={set("hips")}
                    />
                    <MeasurementInput
                      label="Rise" name="rise"
                      hint="From waist to crotch seam, sitting straight"
                      value={form.rise ?? ""} onChange={set("rise")}
                    />
                    <MeasurementInput
                      label="Inseam" name="inseam"
                      hint="From inner crotch seam to ankle"
                      value={form.inseam ?? ""} onChange={set("inseam")}
                    />
                    <MeasurementInput
                      label="Thigh" name="thigh"
                      hint="Around the fullest part of one thigh"
                      value={form.thigh ?? ""} onChange={set("thigh")}
                    />
                  </div>
                </div>
              )}

              {/* STEP 4 – Details ──────────────────────────────────────── */}
              {step === 4 && (
                <div className="space-y-10">
                  <div>
                    <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-2">Step 4 of 4</p>
                    <h2 className="font-cormorant text-[clamp(32px,4vw,48px)] font-light text-[var(--gp-fg)]">
                      Almost <em className="italic text-[var(--gp-accent)]">done.</em>
                    </h2>
                    <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.35)] mt-2 font-light">
                      Last step — tell us how to reach you and when you need it.
                    </p>
                  </div>

                  {/* Contact fields */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Your Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { key: "firstName" as keyof FormData, label: "First Name",    placeholder: "Adaeze" },
                        { key: "lastName"  as keyof FormData, label: "Last Name",     placeholder: "Okonkwo" },
                        { key: "email"     as keyof FormData, label: "Email Address", placeholder: "you@example.com" },
                        { key: "phone"     as keyof FormData, label: "Phone Number",  placeholder: "+234 801 234 5678" },
                      ].map((field) => (
                        <div key={field.key} className="flex flex-col gap-1.5">
                          <label className="text-[10px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)]">
                            {field.label}
                          </label>
                          <input
                            type={field.key === "email" ? "email" : "text"}
                            value={(form[field.key] as string) ?? ""}
                            onChange={(e) => set(field.key)(e.target.value)}
                            placeholder={field.placeholder}
                            className="bg-transparent border border-[rgb(var(--gp-fg-rgb) / 0.12)] px-4 py-3 text-sm text-[var(--gp-fg)] placeholder:text-[rgb(var(--gp-fg-rgb) / 0.2)] outline-none focus:border-[var(--gp-accent)] transition-colors font-light"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-[11px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)] mb-4">Production Timeline</p>
                    <div className="space-y-3">
                      {TIMELINES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => set("timeline")(t.id)}
                          className="w-full text-left border px-5 py-4 flex items-center justify-between transition-all duration-200"
                          style={{
                            borderColor: form.timeline === t.id ? "#c9a96e" : "rgb(var(--gp-fg-rgb) / 0.10)",
                            background:  form.timeline === t.id ? "rgba(201,169,110,0.06)" : "transparent",
                          }}
                        >
                          <div>
                            <p className={`text-[13px] font-light ${form.timeline === t.id ? "text-[var(--gp-accent)]" : "text-[var(--gp-fg)]"}`}>
                              {t.label}
                            </p>
                            <p className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.3)] mt-0.5">{t.note}</p>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex-shrink-0 transition-all duration-200 ${
                            form.timeline === t.id ? "border-[var(--gp-accent)] bg-[var(--gp-accent)]" : "border-[rgb(var(--gp-fg-rgb) / 0.2)]"
                          }`}>
                            {form.timeline === t.id && (
                              <div className="w-full h-full rounded-full flex items-center justify-center">
                                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3">
                                  <polyline points="20 6 9 17 4 12"/>
                                </svg>
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] tracking-[0.16em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.4)]">
                      Additional Notes <span className="normal-case italic text-[rgb(var(--gp-fg-rgb) / 0.2)]">(optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.notes ?? ""}
                      onChange={(e) => set("notes")(e.target.value)}
                      placeholder="Any specific design requests, lining preferences, occasion details..."
                      className="bg-transparent border border-[rgb(var(--gp-fg-rgb) / 0.12)] px-4 py-3 text-sm text-[var(--gp-fg)] placeholder:text-[rgb(var(--gp-fg-rgb) / 0.2)] outline-none focus:border-[var(--gp-accent)] transition-colors font-light resize-none leading-relaxed"
                    />
                  </div>

                  {/* Order summary */}
                  <div className="border border-[rgba(201,169,110,0.2)] p-6 bg-[rgba(201,169,110,0.03)]">
                    <p className="text-[10px] tracking-[0.18em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.35)] mb-4">Order Summary</p>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Silhouette", value: SILHOUETTES.find(s => s.id === form.silhouette)?.name },
                        { label: "Fabric",     value: FABRICS.find(f => f.id === form.fabric)?.name },
                        { label: "Colour",     value: COLORS.find(c => c.id === form.color)?.name },
                        { label: "Waist",      value: WAIST_STYLES.find(w => w.id === form.waistStyle)?.name },
                        { label: "Pleat",      value: PLEAT_STYLES.find(p => p.id === form.pleatStyle)?.name },
                        { label: "Timeline",   value: TIMELINES.find(t => t.id === form.timeline)?.label },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between">
                          <span className="text-[11px] text-[rgb(var(--gp-fg-rgb) / 0.3)] tracking-wider">{row.label}</span>
                          <span className="text-[12px] text-[rgb(var(--gp-fg-rgb) / 0.55)] font-light">{row.value ?? "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[rgb(var(--gp-fg-rgb) / 0.08)] pt-4 flex justify-between items-center">
                      <span className="text-[11px] tracking-[0.14em] uppercase text-[rgb(var(--gp-fg-rgb) / 0.35)]">Estimated Total</span>
                      <span className="font-cormorant text-2xl text-[var(--gp-accent)] font-light">
                        ₦{(
                          45000 +
                          (FABRICS.find(f => f.id === form.fabric) ? parseInt(FABRICS.find(f => f.id === form.fabric)!.price.replace(/[^\d]/g,"")) : 0) +
                          (form.timeline === "express" ? 10000 : form.timeline === "urgent" ? 20000 : 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-[rgb(var(--gp-fg-rgb) / 0.2)] mt-2">
                      Final price confirmed after measurement review. 50% deposit required to begin production.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-[rgb(var(--gp-fg-rgb) / 0.07)]">
                <button
                  onClick={prevStep}
                  className={`flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase transition-all duration-200 ${
                    step === 1
                      ? "opacity-0 pointer-events-none"
                      : "text-[rgb(var(--gp-fg-rgb) / 0.4)] hover:text-[var(--gp-fg)]"
                  }`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="m19 12-14 0M12 5l-7 7 7 7"/>
                  </svg>
                  Back
                </button>

                {step < 4 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-10 py-3.5 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors"
                  >
                    Continue
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="m5 12 14 0M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-[var(--gp-accent)] text-[var(--gp-accent-ink)] px-10 py-3.5 text-[11px] font-medium tracking-[0.16em] uppercase hover:bg-[var(--gp-accent-hover)] transition-colors"
                  >
                    Place Bespoke Order
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* ── Live Preview Panel ─────────────────────────────────────── */}
            <div className="hidden md:block">
              <LivePreview form={form} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="border-t border-[rgb(var(--gp-fg-rgb) / 0.07)] bg-[var(--gp-deep)] py-20 px-8">
        <div className="max-w-[860px] mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gp-accent)] mb-3">Common Questions</p>
            <h2 className="font-cormorant text-[clamp(32px,4vw,44px)] font-light text-[var(--gp-fg)]">
              Bespoke <em className="italic text-[var(--gp-accent)]">FAQ</em>
            </h2>
          </div>
          <div className="divide-y divide-[rgb(var(--gp-fg-rgb) / 0.07)]">
            {[
              {
                q: "How accurate do my measurements need to be?",
                a: "As accurate as possible — but don't stress. Our atelier team reviews every order and will contact you if anything looks off before cutting begins. We'd rather ask than waste fabric.",
              },
              {
                q: "Can I see fabric samples before ordering?",
                a: "Yes. Order a physical swatch kit from our swatches page and we'll post it to you within 3 business days. Swatch cost (₦2,000) is refunded on your bespoke order.",
              },
              {
                q: "What if the trouser doesn't fit?",
                a: "We offer one free alteration for all bespoke orders within 30 days of delivery. If the issue is on our end (cutting error), we remake it at no charge.",
              },
              {
                q: "Can I request a design not listed here?",
                a: "Absolutely. Use the 'Additional Notes' field in Step 4 or email us at bespoke@getpanted.com. We love unusual briefs.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes — to over 40 countries. International express shipping is available. Shipping cost is calculated at checkout after your order is confirmed.",
              },
            ].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
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

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        .font-cormorant { font-family: 'Cormorant Garamond', serif; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>
    </main>
  );
}

// ── FAQ Accordion Item ─────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 text-left group"
      >
        <span className={`font-cormorant text-lg font-light leading-snug transition-colors ${open ? "text-[var(--gp-accent)]" : "text-[rgb(var(--gp-fg-rgb) / 0.7)] group-hover:text-[var(--gp-fg)]"}`}>
          {question}
        </span>
        <div className={`w-6 h-6 border flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300 ${
          open ? "border-[var(--gp-accent)] text-[var(--gp-accent)] rotate-45" : "border-[rgb(var(--gp-fg-rgb) / 0.15)] text-[rgb(var(--gp-fg-rgb) / 0.4)]"
        }`}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </button>
      {open && (
        <p className="text-[13px] text-[rgb(var(--gp-fg-rgb) / 0.4)] font-light leading-relaxed mt-4 max-w-2xl">
          {answer}
        </p>
      )}
    </div>
  );
}
