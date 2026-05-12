"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { PageFooter } from "../components/page-footer";

// ── Types ──────────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;

interface FabricOption  { id: string; name: string; texture: string; swatch: string; origin: string; weight: string; price: string; }
interface StyleOption   { id: string; name: string; description: string; }
interface FormData {
  silhouette: string; waistStyle: string; legOpening: string; pleatStyle: string;
  fabric: string; color: string;
  waist: string; hips: string; rise: string; inseam: string; thigh: string;
  firstName: string; lastName: string; email: string; phone: string; notes: string; timeline: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const FABRICS: FabricOption[] = [
  { id: "crepe",   name: "Luxury Crepe",     texture: "Smooth, structured drape",  swatch: "#8A8680", origin: "Italy",   weight: "Medium",        price: "+₦0" },
  { id: "satin",   name: "Duchess Satin",    texture: "High sheen, fluid fall",    swatch: "#5C4A6B", origin: "China",   weight: "Medium-heavy",  price: "+₦4,000" },
  { id: "linen",   name: "Premium Linen",    texture: "Breathable, relaxed",       swatch: "#C4B89A", origin: "Belgium", weight: "Light",         price: "+₦2,000" },
  { id: "brocade", name: "Jacquard Brocade", texture: "Rich woven pattern",        swatch: "#3A2A14", origin: "Nigeria", weight: "Heavy",         price: "+₦8,000" },
  { id: "chiffon", name: "Silk Chiffon",     texture: "Sheer, ethereal flow",      swatch: "#D4C8B8", origin: "India",   weight: "Featherlight",  price: "+₦6,000" },
  { id: "wool",    name: "Fine Wool Blend",  texture: "Tailored, holds shape",     swatch: "#4A3A2A", origin: "UK",      weight: "Medium-heavy",  price: "+₦5,000" },
];

const COLORS: { id: string; name: string; hex: string }[] = [
  { id: "onyx",    name: "Onyx",         hex: "#1a1a1a" },
  { id: "ivory",   name: "Ivory",        hex: "#f0ede6" },
  { id: "caramel", name: "Caramel",      hex: "#c4a882" },
  { id: "wine",    name: "Deep Wine",    hex: "#6b1a2a" },
  { id: "forest",  name: "Forest",       hex: "#1a3a2a" },
  { id: "cobalt",  name: "Cobalt",       hex: "#1a2a5a" },
  { id: "sand",    name: "Sand",         hex: "#d4b896" },
  { id: "slate",   name: "Slate",        hex: "#4a5a6a" },
  { id: "plum",    name: "Plum",         hex: "#6B2D8B" },
  { id: "olive",   name: "Olive",        hex: "#5a5a2a" },
  { id: "blush",   name: "Blush",        hex: "#d4a8a0" },
  { id: "stone",   name: "Stone Grey",   hex: "#8A8680" },
];

const SILHOUETTES: StyleOption[] = [
  { id: "ultra-wide", name: "Ultra Wide",  description: "Maximum drama. Sweeps the floor like a curtain." },
  { id: "wide",       name: "Wide Leg",    description: "Generous and elegant — the GetPanted signature." },
  { id: "palazzo",    name: "Palazzo",     description: "Floor-length, fluid, and impossibly graceful." },
  { id: "flare",      name: "High Flare",  description: "Fitted through the thigh, dramatic from the knee." },
];

const WAIST_STYLES: StyleOption[] = [
  { id: "high-band",  name: "High Band",   description: "Clean, structured waistband. 4–5 inches high." },
  { id: "paper-bag",  name: "Paper Bag",   description: "Gathered at the waist with a self-tie sash." },
  { id: "fold-over",  name: "Fold-Over",   description: "Soft fold for a relaxed, adjustable fit." },
  { id: "contoured",  name: "Contoured",   description: "Shaped to follow the natural hip curve." },
];

const PLEAT_STYLES: StyleOption[] = [
  { id: "double-pleat", name: "Double Pleat", description: "Two sharp pleats for structured volume." },
  { id: "single-pleat", name: "Single Pleat", description: "One deep pleat — clean and purposeful." },
  { id: "no-pleat",     name: "No Pleat",     description: "Flat front. Streamlined and sleek." },
  { id: "box-pleat",    name: "Box Pleat",    description: "Wide, inverted pleat for maximum fullness." },
];

const TIMELINES = [
  { id: "standard", label: "Standard — 3 weeks",  note: "Our usual production time" },
  { id: "express",  label: "Express — 10 days",    note: "+₦10,000 rush fee" },
  { id: "urgent",   label: "Urgent — 5 days",      note: "+₦20,000 rush fee. Contact us first." },
];

const PROCESS_STEPS = [
  { number: "01", title: "Customise", body: "Choose your silhouette, fabric, and every design detail through our guided process." },
  { number: "02", title: "Measure",   body: "Submit your exact measurements. No guesswork — we'll guide you with our measurement tutorial." },
  { number: "03", title: "We Craft",  body: "Our Lagos atelier cuts and sews your trouser by hand. Takes 3–5 working days on average." },
  { number: "04", title: "Delivered", body: "Carefully packaged and shipped to your door, anywhere in Nigeria or internationally." },
];

// ── Step Indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ current }: { current: Step }) {
  const labels = ["Style", "Fabric", "Measurements", "Details"];
  return (
    <div className="flex items-center">
      {labels.map((label, i) => {
        const stepNum = (i + 1) as Step;
        const isActive = stepNum === current;
        const isDone   = stepNum < current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 flex items-center justify-center transition-all duration-300"
                style={{
                  border: `1px solid ${isDone || isActive ? "#5C2D8F" : "#E0E0E0"}`,
                  background: isDone ? "#5C2D8F" : isActive ? "rgba(92,45,143,0.06)" : "transparent",
                }}
              >
                {isDone ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="font-barlow-cond font-bold" style={{ fontSize: "11px", color: isActive ? "#5C2D8F" : "#6B6B6B" }}>{stepNum}</span>
                )}
              </div>
              <span className="font-barlow-cond font-bold uppercase hidden md:block" style={{ fontSize: "9px", letterSpacing: "0.14em", color: isActive ? "#5C2D8F" : isDone ? "#6B6B6B" : "#AAAAAA" }}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className="w-16 md:w-24 h-px mb-3 mx-0.5 transition-colors duration-500" style={{ background: isDone ? "#5C2D8F" : "#E0E0E0" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Option Card ────────────────────────────────────────────────────────────────
function OptionCard({ option, selected, onSelect }: { option: StyleOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="text-left p-5 transition-all duration-200"
      style={{
        border: `1px solid ${selected ? "#5C2D8F" : "#E0E0E0"}`,
        background: selected ? "rgba(92,45,143,0.04)" : "#FFFFFF",
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 style={{ fontSize: "14px", color: selected ? "#5C2D8F" : "#1A1A1A" }}>{option.name}</h4>
        <div
          className="w-4 h-4 flex-shrink-0 mt-0.5 flex items-center justify-center"
          style={{ border: `1px solid ${selected ? "#5C2D8F" : "#E0E0E0"}`, background: selected ? "#5C2D8F" : "transparent" }}
        >
          {selected && (
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
      </div>
      <p className="font-barlow" style={{ fontSize: "12px", color: "#6B6B6B", lineHeight: 1.7 }}>{option.description}</p>
    </button>
  );
}

// ── Measurement Input ──────────────────────────────────────────────────────────
function MeasurementInput({ label, hint, value, onChange, name }: { label: string; hint: string; value: string; onChange: (v: string) => void; name: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-barlow-cond font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>{label}</label>
      <div className="relative">
        <input
          type="number"
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="w-full outline-none font-barlow [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          style={{ border: "1px solid #E0E0E0", padding: "12px 48px 12px 16px", fontSize: "14px", color: "#1A1A1A", background: "#FFFFFF" }}
          onFocus={(e) => (e.target.style.borderColor = "#5C2D8F")}
          onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-barlow-cond font-bold" style={{ fontSize: "11px", color: "#6B6B6B" }}>cm</span>
      </div>
      <p className="font-barlow" style={{ fontSize: "11px", color: "#AAAAAA", fontStyle: "italic" }}>{hint}</p>
    </div>
  );
}

// ── Live Preview ───────────────────────────────────────────────────────────────
function LivePreview({ form }: { form: Partial<FormData> }) {
  const colorHex    = COLORS.find(c => c.id === form.color)?.hex ?? "#1A1A1A";
  const fabricName  = FABRICS.find(f => f.id === form.fabric)?.name ?? "Luxury Crepe";
  const silName     = SILHOUETTES.find(s => s.id === form.silhouette)?.name ?? "Wide Leg";
  const waistName   = WAIST_STYLES.find(w => w.id === form.waistStyle)?.name ?? "High Band";
  const legW = form.silhouette === "ultra-wide" ? 90 : form.silhouette === "palazzo" ? 85 : form.silhouette === "flare" ? 55 : 72;

  return (
    <div className="sticky top-24" style={{ background: "#F7F7F7", border: "1px solid #F0F0F0", padding: "24px" }}>
      <p className="font-barlow-cond font-bold uppercase mb-5" style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#6B6B6B" }}>Live Preview</p>
      <div className="flex justify-center mb-6">
        <svg viewBox="0 0 200 340" fill="none" className="w-40 transition-all duration-500">
          <rect x={100 - 40} y="0" width="80" height={form.waistStyle === "paper-bag" ? 28 : 20} fill={colorHex} opacity="0.95" />
          {form.waistStyle === "paper-bag" && [80, 90, 100, 110, 120].map((cx) => (
            <circle key={cx} cx={cx} cy="10" r="2" fill="rgba(255,255,255,0.3)" />
          ))}
          {form.pleatStyle !== "no-pleat" && (
            <>
              <line x1="92" y1="20" x2="88" y2="100" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
              {form.pleatStyle === "double-pleat" && <line x1="108" y1="20" x2="112" y2="100" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />}
            </>
          )}
          <path d={`M ${100 - 38} 20 L ${100 - legW / 2} 320 L ${100 - 4} 320 L ${100 - 2} 20 Z`} fill={colorHex} opacity="0.92" />
          <path d={`M ${100 + 38} 20 L ${100 + legW / 2} 320 L ${100 + 4} 320 L ${100 + 2} 20 Z`} fill={colorHex} opacity="0.92" />
          <path d={`M ${100 - 6} 20 L ${100 - 2} 180 L ${100 + 2} 180 L ${100 + 6} 20 Z`} fill="rgba(0,0,0,0.15)" />
        </svg>
      </div>
      <div className="space-y-2.5">
        {[
          { label: "Silhouette", value: silName },
          { label: "Fabric",     value: fabricName },
          { label: "Waist",      value: waistName },
          { label: "Colour",     value: COLORS.find(c => c.id === form.color)?.name ?? "Not selected" },
        ].map((item) => (
          <div key={item.label} className="flex justify-between items-center pb-2.5" style={{ borderBottom: "1px solid #F0F0F0" }}>
            <span className="font-barlow-cond font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.14em", color: "#6B6B6B" }}>{item.label}</span>
            <span className="font-barlow" style={{ fontSize: "12px", color: "#1A1A1A" }}>{item.value}</span>
          </div>
        ))}
        <div className="flex justify-between items-center pt-1">
          <span className="font-barlow-cond font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.14em", color: "#6B6B6B" }}>Base Price</span>
          <span className="font-barlow-cond font-bold" style={{ fontSize: "18px", color: "#5C2D8F" }}>
            ₦{(45000 + (FABRICS.find(f => f.id === form.fabric) ? parseInt(FABRICS.find(f => f.id === form.fabric)!.price.replace(/[^\d]/g, "")) : 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── FAQ Item ───────────────────────────────────────────────────────────────────
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-5" style={{ borderBottom: "1px solid #F0F0F0" }}>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-start justify-between gap-4 text-left">
        <span style={{ fontSize: "15px", color: open ? "#5C2D8F" : "#1A1A1A", transition: "color 0.2s" }}>{question}</span>
        <div
          className="w-6 h-6 flex-shrink-0 flex items-center justify-center mt-0.5 transition-all duration-300"
          style={{ border: `1px solid ${open ? "#5C2D8F" : "#E0E0E0"}`, color: open ? "#5C2D8F" : "#6B6B6B", transform: open ? "rotate(45deg)" : "none" }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
      </button>
      {open && (
        <p className="font-barlow mt-4 max-w-2xl" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.8 }}>{answer}</p>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function BespokePage() {
  const [step, setStep]           = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const formTopRef                = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Partial<FormData>>({
    silhouette: "wide", waistStyle: "high-band", pleatStyle: "double-pleat",
    legOpening: "extra-wide", fabric: "crepe", color: "onyx", timeline: "standard",
  });

  const set = (key: keyof FormData) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));
  const scrollToForm = () => setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  const nextStep = () => { if (step < 4) { setStep((s) => (s + 1) as Step); scrollToForm(); } };
  const prevStep = () => { if (step > 1) { setStep((s) => (s - 1) as Step); scrollToForm(); } };
  const handleSubmit = async () => {
    try {
      await fetch("/api/bespoke-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone,
          silhouette:    form.silhouette,
          waistStyle:    form.waistStyle,
          pleatStyle:    form.pleatStyle,
          fabric:        form.fabric,
          color:         form.color,
          measurements: { waist: form.waist, hips: form.hips, rise: form.rise, inseam: form.inseam, thigh: form.thigh },
          timeline:      form.timeline,
          notes:         form.notes || undefined,
        }),
      });
    } catch { /* show confirmation regardless */ }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputStyle = { border: "1px solid #E0E0E0", padding: "12px 16px", fontSize: "14px", color: "#1A1A1A", background: "#FFFFFF", width: "100%", outline: "none", fontFamily: "'Barlow', sans-serif" };

  if (submitted) {
    return (
      <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
          <div className="max-w-[700px] mx-auto">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Order Confirmed</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>Your Bespoke Trouser is Being Crafted.</h1>
          </div>
        </section>
        <div className="px-5 md:px-12 py-16">
          <div className="max-w-[700px] mx-auto" style={{ border: "1px solid #F0F0F0", padding: "48px" }}>
            <p className="font-barlow mb-6" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.8 }}>
              Our atelier team will reach out within 24 hours to confirm your measurements and timeline. Check your inbox at <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{form.email}</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80" style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}>
                Back to Home
              </Link>
              <Link href="/collections" className="font-barlow-cond font-bold uppercase inline-block transition-all hover:bg-[#1A1A1A] hover:text-white" style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "13px 39px", border: "1px solid #1A1A1A", color: "#1A1A1A" }}>
                Browse Collections
              </Link>
            </div>
          </div>
        </div>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      {/* ── PAGE HERO ──────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-16" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center gap-2 font-barlow-cond font-bold uppercase mb-6" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>
            <Link href="/" className="hover:text-[#5C2D8F] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: "#1A1A1A" }}>Bespoke</span>
          </div>
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Custom Tailoring</p>
          <h1 style={{ fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A", maxWidth: "600px" }}>
            <span style={{ display: "block" }}>MADE FOR</span>
            <span style={{ display: "block" }}>EXACTLY YOU.</span>
          </h1>
          <p className="font-barlow mt-6" style={{ fontSize: "15px", color: "#6B6B6B", maxWidth: "440px", lineHeight: 1.7 }}>
            Choose every detail. Submit your measurements. Receive a trouser built around your body — not the other way around.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-16" style={{ background: "#F7F7F7", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1400px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-10" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>How It Works</p>
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: "1px", background: "#E0E0E0" }}>
            {PROCESS_STEPS.map((s) => (
              <div key={s.number} style={{ background: "#FFFFFF", padding: "32px" }}>
                <p className="font-barlow-cond font-bold mb-4" style={{ fontSize: "32px", color: "rgba(92,45,143,0.15)", lineHeight: 1 }}>{s.number}</p>
                <h3 style={{ fontSize: "16px", color: "#1A1A1A", marginBottom: "8px" }}>{s.title}</h3>
                <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.8 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ───────────────────────────────────────────────────────────── */}
      <section style={{ borderBottom: "1px solid #F0F0F0" }}>
        <div ref={formTopRef} className="max-w-[1400px] mx-auto px-5 md:px-12 py-16">
          <div className="flex justify-center mb-14">
            <StepIndicator current={step} />
          </div>

          <div className="grid md:grid-cols-[1fr_320px] gap-12 items-start">
            {/* Form panel */}
            <div>

              {/* STEP 1 */}
              {step === 1 && (
                <div className="space-y-12">
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#5C2D8F" }}>Step 1 of 4</p>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#1A1A1A" }}>Design Your Silhouette</h2>
                    <p className="font-barlow mt-2" style={{ fontSize: "13px", color: "#6B6B6B" }}>Start with the shape. Everything else follows.</p>
                  </div>
                  {[
                    { label: "Silhouette",  options: SILHOUETTES,  key: "silhouette"  as keyof FormData },
                    { label: "Waist Style", options: WAIST_STYLES, key: "waistStyle"  as keyof FormData },
                    { label: "Pleat Style", options: PLEAT_STYLES, key: "pleatStyle"  as keyof FormData },
                  ].map((section) => (
                    <div key={section.label}>
                      <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>{section.label}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {section.options.map((opt) => (
                          <OptionCard key={opt.id} option={opt} selected={form[section.key] === opt.id} onSelect={() => set(section.key)(opt.id)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <div className="space-y-12">
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#5C2D8F" }}>Step 2 of 4</p>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#1A1A1A" }}>Choose Your Fabric</h2>
                    <p className="font-barlow mt-2" style={{ fontSize: "13px", color: "#6B6B6B" }}>The right fabric is what makes a trouser unforgettable.</p>
                  </div>
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Fabric</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FABRICS.map((fab) => (
                        <button
                          key={fab.id}
                          type="button"
                          onClick={() => set("fabric")(fab.id)}
                          className="text-left p-5 flex gap-4 items-start transition-all duration-200"
                          style={{ border: `1px solid ${form.fabric === fab.id ? "#5C2D8F" : "#E0E0E0"}`, background: form.fabric === fab.id ? "rgba(92,45,143,0.04)" : "#FFFFFF" }}
                        >
                          <div className="w-10 h-10 flex-shrink-0 mt-0.5" style={{ background: fab.swatch, border: "1px solid #E0E0E0" }} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <span style={{ fontSize: "14px", color: form.fabric === fab.id ? "#5C2D8F" : "#1A1A1A" }}>{fab.name}</span>
                              <span className="font-barlow-cond font-bold" style={{ fontSize: "10px", color: "#5C2D8F", whiteSpace: "nowrap", marginTop: "2px" }}>{fab.price}</span>
                            </div>
                            <p className="font-barlow" style={{ fontSize: "12px", color: "#6B6B6B" }}>{fab.texture}</p>
                            <p className="font-barlow mt-1" style={{ fontSize: "11px", color: "#AAAAAA" }}>{fab.origin} · {fab.weight}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Colour</p>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-3">
                      {COLORS.map((c) => (
                        <div key={c.id} className="flex flex-col items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => set("color")(c.id)}
                            className="w-9 h-9 transition-all duration-150"
                            style={{
                              background: c.hex,
                              border: `2px solid ${form.color === c.id ? "#5C2D8F" : "transparent"}`,
                              outline: form.color === c.id ? "2px solid rgba(92,45,143,0.3)" : "none",
                              outlineOffset: "2px",
                            }}
                            title={c.name}
                            aria-label={c.name}
                          />
                          <span className="font-barlow hidden sm:block text-center" style={{ fontSize: "8px", color: "#AAAAAA" }}>{c.name}</span>
                        </div>
                      ))}
                    </div>
                    {form.color && (
                      <p className="font-barlow mt-3" style={{ fontSize: "12px", color: "#6B6B6B", fontStyle: "italic" }}>
                        Selected: {COLORS.find(c => c.id === form.color)?.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <div className="space-y-10">
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#5C2D8F" }}>Step 3 of 4</p>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#1A1A1A" }}>Your Measurements</h2>
                    <p className="font-barlow mt-2" style={{ fontSize: "13px", color: "#6B6B6B" }}>All measurements in centimetres. Take them over light clothing.</p>
                  </div>
                  <div className="flex gap-4 p-5" style={{ border: "1px solid #E0E0E0", background: "rgba(92,45,143,0.03)" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5C2D8F" strokeWidth="1.5" className="flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.7 }}>
                      Not sure how to measure? Watch our <a href="#" style={{ color: "#5C2D8F", textDecoration: "underline" }}>2-minute guide</a> before filling this in. Getting these right ensures a perfect fit on the first try.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { key: "waist",  label: "Waist",  hint: "Measure around the narrowest part of your torso" },
                      { key: "hips",   label: "Hips",   hint: "Measure around the fullest part of your hips" },
                      { key: "rise",   label: "Rise",   hint: "From waist to crotch seam, sitting straight" },
                      { key: "inseam", label: "Inseam", hint: "From inner crotch seam to ankle" },
                      { key: "thigh",  label: "Thigh",  hint: "Around the fullest part of one thigh" },
                    ].map((m) => (
                      <MeasurementInput
                        key={m.key} label={m.label} name={m.key} hint={m.hint}
                        value={(form[m.key as keyof FormData] as string) ?? ""}
                        onChange={set(m.key as keyof FormData)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <div className="space-y-10">
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.22em", color: "#5C2D8F" }}>Step 4 of 4</p>
                    <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#1A1A1A" }}>Almost Done.</h2>
                    <p className="font-barlow mt-2" style={{ fontSize: "13px", color: "#6B6B6B" }}>Last step — tell us how to reach you and when you need it.</p>
                  </div>
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Your Details</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {[
                        { key: "firstName", label: "First Name",    placeholder: "Adaeze" },
                        { key: "lastName",  label: "Last Name",     placeholder: "Okonkwo" },
                        { key: "email",     label: "Email Address", placeholder: "you@example.com" },
                        { key: "phone",     label: "Phone Number",  placeholder: "+234 801 234 5678" },
                      ].map((field) => (
                        <div key={field.key} className="flex flex-col gap-1.5">
                          <label className="font-barlow-cond font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>{field.label}</label>
                          <input
                            type={field.key === "email" ? "email" : "text"}
                            value={(form[field.key as keyof FormData] as string) ?? ""}
                            onChange={(e) => set(field.key as keyof FormData)(e.target.value)}
                            placeholder={field.placeholder}
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = "#5C2D8F")}
                            onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Production Timeline</p>
                    <div className="space-y-3">
                      {TIMELINES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => set("timeline")(t.id)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between transition-all duration-200"
                          style={{ border: `1px solid ${form.timeline === t.id ? "#5C2D8F" : "#E0E0E0"}`, background: form.timeline === t.id ? "rgba(92,45,143,0.04)" : "#FFFFFF" }}
                        >
                          <div>
                            <p style={{ fontSize: "14px", color: form.timeline === t.id ? "#5C2D8F" : "#1A1A1A" }}>{t.label}</p>
                            <p className="font-barlow mt-0.5" style={{ fontSize: "12px", color: "#6B6B6B" }}>{t.note}</p>
                          </div>
                          <div className="w-4 h-4 flex items-center justify-center" style={{ border: `1px solid ${form.timeline === t.id ? "#5C2D8F" : "#E0E0E0"}`, background: form.timeline === t.id ? "#5C2D8F" : "transparent" }}>
                            {form.timeline === t.id && <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-barlow-cond font-bold uppercase" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>
                      Additional Notes <span style={{ textTransform: "none", fontStyle: "italic", fontWeight: 400, color: "#AAAAAA" }}>(optional)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={form.notes ?? ""}
                      onChange={(e) => set("notes")(e.target.value)}
                      placeholder="Any specific design requests, lining preferences, occasion details..."
                      className="font-barlow resize-none outline-none leading-relaxed"
                      style={{ ...inputStyle, padding: "12px 16px" }}
                      onFocus={(e) => (e.target.style.borderColor = "#5C2D8F")}
                      onBlur={(e) => (e.target.style.borderColor = "#E0E0E0")}
                    />
                  </div>
                  {/* Order summary */}
                  <div style={{ border: "1px solid #E0E0E0", padding: "24px", background: "rgba(92,45,143,0.02)" }}>
                    <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "10px", letterSpacing: "0.18em", color: "#6B6B6B" }}>Order Summary</p>
                    <div className="space-y-2 mb-4">
                      {[
                        { label: "Silhouette", value: SILHOUETTES.find(s => s.id === form.silhouette)?.name },
                        { label: "Fabric",     value: FABRICS.find(f => f.id === form.fabric)?.name },
                        { label: "Colour",     value: COLORS.find(c => c.id === form.color)?.name },
                        { label: "Timeline",   value: TIMELINES.find(t => t.id === form.timeline)?.label },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between">
                          <span className="font-barlow-cond font-bold uppercase" style={{ fontSize: "11px", letterSpacing: "0.12em", color: "#6B6B6B" }}>{row.label}</span>
                          <span className="font-barlow" style={{ fontSize: "13px", color: "#1A1A1A" }}>{row.value ?? "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-4" style={{ borderTop: "1px solid #F0F0F0" }}>
                      <span className="font-barlow-cond font-bold uppercase" style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}>Estimated Total</span>
                      <span className="font-barlow-cond font-bold" style={{ fontSize: "22px", color: "#5C2D8F" }}>
                        ₦{(45000 + (FABRICS.find(f => f.id === form.fabric) ? parseInt(FABRICS.find(f => f.id === form.fabric)!.price.replace(/[^\d]/g, "")) : 0) + (form.timeline === "express" ? 10000 : form.timeline === "urgent" ? 20000 : 0)).toLocaleString()}
                      </span>
                    </div>
                    <p className="font-barlow mt-2" style={{ fontSize: "11px", color: "#AAAAAA" }}>50% deposit required to begin production. Final price confirmed after measurement review.</p>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex items-center justify-between mt-12 pt-8" style={{ borderTop: "1px solid #F0F0F0" }}>
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center gap-2 font-barlow-cond font-bold uppercase transition-all duration-200"
                  style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B", opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? "none" : "auto" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19 12-14 0M12 5l-7 7 7 7" /></svg>
                  Back
                </button>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80"
                    style={{ fontSize: "11px", letterSpacing: "0.16em", padding: "14px 40px", background: "#5C2D8F" }}
                  >
                    Continue
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m5 12 14 0M12 5l7 7-7 7" /></svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex items-center gap-2 font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80"
                    style={{ fontSize: "11px", letterSpacing: "0.16em", padding: "14px 40px", background: "#5C2D8F" }}
                  >
                    Place Bespoke Order
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                )}
              </div>
            </div>

            {/* Live preview */}
            <div className="hidden md:block">
              <LivePreview form={form} />
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 py-20" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[860px] mx-auto">
          <div className="mb-12">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Common Questions</p>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", color: "#1A1A1A" }}>Bespoke FAQ</h2>
          </div>
          <div style={{ borderTop: "1px solid #F0F0F0" }}>
            {[
              { q: "How accurate do my measurements need to be?", a: "As accurate as possible — but don't stress. Our atelier team reviews every order and will contact you if anything looks off before cutting begins. We'd rather ask than waste fabric." },
              { q: "Can I see fabric samples before ordering?", a: "Yes. Order a physical swatch kit and we'll post it to you within 3 business days. Swatch cost (₦2,000) is refunded on your bespoke order." },
              { q: "What if the trouser doesn't fit?", a: "We offer one free alteration for all bespoke orders within 30 days of delivery. If the issue is on our end (cutting error), we remake it at no charge." },
              { q: "Can I request a design not listed here?", a: "Absolutely. Use the 'Additional Notes' field in Step 4 or email us at bespoke@getpanted.com. We love unusual briefs." },
              { q: "Do you ship internationally?", a: "Yes — to over 40 countries. International express shipping is available. Shipping cost is calculated after your order is confirmed." },
            ].map((faq, i) => <FAQItem key={i} question={faq.q} answer={faq.a} />)}
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
