"use client";

import { useState } from "react";
import Link from "next/link";
import { PageFooter } from "../components/page-footer";

const STYLES = [
  "Royal Pleat Wide-Leg",
  "Onyx Statement",
  "Ivory Sovereign",
  "Sahara Wide",
  "Other — specify in notes",
];

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

const PROCESS_STEPS = [
  "Choose your preferred style, colour, and size.",
  "We confirm availability, price, and production timeline.",
  "You pay the required deposit to confirm your order.",
  "Your piece goes into production.",
  "We quality-check, package, and dispatch when ready.",
];

export default function MadeToOrderPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    style: STYLES[0],
    color: "",
    size: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    notes: "",
  });

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/bespoke-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email,
          customerPhone: form.phone,
          silhouette: form.style,
          color: form.color,
          measurements: { size: form.size },
          notes: form.notes || undefined,
          timeline: "made-to-order",
        }),
      });
    } catch {
      /* show confirmation regardless */
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(false);
  };

  const inputStyle = {
    border: "1px solid #E0E0E0",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#1A1A1A",
    background: "#FFFFFF",
    width: "100%",
    outline: "none",
    fontFamily: "'Barlow', sans-serif",
  };

  if (submitted) {
    return (
      <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <section className="px-5 md:px-12 pt-28 pb-10" style={{ borderBottom: "1px solid #F0F0F0" }}>
          <div className="max-w-[700px] mx-auto">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
              Request Received
            </p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 600, lineHeight: 1.05, color: "#1A1A1A" }}>
              Your made-to-order request is in.
            </h1>
          </div>
        </section>
        <div className="px-5 md:px-12 py-16">
          <div className="max-w-[700px] mx-auto" style={{ border: "1px solid #F0F0F0", padding: "48px" }}>
            <p className="font-barlow mb-6" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.8 }}>
              Our team will reach out within 24 hours to confirm availability, price, and production timeline. Check your inbox at{" "}
              <span style={{ color: "#1A1A1A", fontWeight: 600 }}>{form.email}</span>.
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
      <section className="px-5 md:px-12 pt-28 pb-16" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            Made to Order
          </p>
          <h1 className="font-barlow-cond font-bold" style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, color: "#1A1A1A" }}>
            Missed your size? We can make it again.
          </h1>
          <p className="font-barlow mt-6" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.75 }}>
            Some GetPanted pieces are produced in limited quantities. When a style sells out, selected pieces may be available through made-to-order.
          </p>
          <p className="font-barlow mt-4" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.75 }}>
            Made-to-order means your selected style is produced after your order is confirmed. This helps us maintain quality, reduce unnecessary waste, and keep our drops intentional.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16" style={{ background: "#F7F7F7", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-8" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            How It Works
          </p>
          <ol className="space-y-5">
            {PROCESS_STEPS.map((step, i) => (
              <li key={step} className="flex gap-4">
                <span className="font-barlow-cond font-bold flex-shrink-0" style={{ fontSize: "14px", color: "#5C2D8F", width: "24px" }}>
                  {i + 1}.
                </span>
                <p className="font-barlow" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7 }}>{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24">
        <div className="max-w-[640px] mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Style</p>
              <select value={form.style} onChange={(e) => set("style")(e.target.value)} style={inputStyle}>
                {STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="font-barlow-cond font-bold uppercase block mb-2" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Colour</label>
                <input type="text" value={form.color} onChange={(e) => set("color")(e.target.value)} placeholder="e.g. Onyx, Ivory" style={inputStyle} required />
              </div>
              <div>
                <label className="font-barlow-cond font-bold uppercase block mb-2" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>Size</label>
                <select value={form.size} onChange={(e) => set("size")(e.target.value)} style={inputStyle} required>
                  <option value="">Select size</option>
                  {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { key: "firstName" as const, label: "First Name" },
                { key: "lastName" as const, label: "Last Name" },
                { key: "email" as const, label: "Email Address" },
                { key: "phone" as const, label: "Phone Number" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="font-barlow-cond font-bold uppercase block mb-2" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>{field.label}</label>
                  <input
                    type={field.key === "email" ? "email" : "text"}
                    value={form[field.key]}
                    onChange={(e) => set(field.key)(e.target.value)}
                    style={inputStyle}
                    required
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="font-barlow-cond font-bold uppercase block mb-2" style={{ fontSize: "10px", letterSpacing: "0.16em", color: "#6B6B6B" }}>
                Additional Notes <span style={{ textTransform: "none", fontStyle: "italic", fontWeight: 400, color: "#AAAAAA" }}>(optional)</span>
              </label>
              <textarea
                rows={4}
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Any specific requests or occasion details..."
                className="font-barlow resize-none outline-none leading-relaxed"
                style={{ ...inputStyle, padding: "12px 16px" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80 disabled:opacity-60"
              style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
            >
              {loading ? "Submitting..." : "Request Made to Order"}
            </button>
          </form>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
