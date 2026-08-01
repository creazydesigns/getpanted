"use client";

import { useState } from "react";
import Link from "next/link";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import { useSiteContent } from "@/hooks/use-site-content";
import "../storefront.css";

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
  const { get } = useSiteContent();
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

  if (submitted) {
    return (
      <main className="hp-page font-barlow overflow-x-hidden" style={{ minHeight: "100vh" }}>
        <StorefrontHeader
          eyebrow="Request Received"
          title="Your made-to-order request is in."
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Made to Order", href: "/made-to-order" },
            { label: "Confirmed" },
          ]}
          narrow
        />
        <section className="hp-section py-16 md:py-20">
          <div
            className="mx-auto max-w-[700px] p-10 md:p-12"
            style={{ border: "1px solid var(--hp-border)" }}
          >
            <p className="hp-body mb-8">
              Our team will reach out within 24 hours to confirm availability, price, and production timeline. Check your inbox at{" "}
              <span style={{ color: "var(--hp-ink)", fontWeight: 600 }}>{form.email}</span>.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/" className="btn-hp-primary">
                Back to Home
              </Link>
              <Link href="/collections" className="btn-hp-outline">
                Browse Collections
              </Link>
            </div>
          </div>
        </section>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <StorefrontHeader
        eyebrow="Made to Order"
        title="Missed your size? We can make it again."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Made to Order" },
        ]}
        narrow
      />

      <section className="hp-section py-8 md:py-10">
        <div className="mx-auto max-w-[900px]">
          <p className="hp-body max-w-[640px]" style={{ whiteSpace: "pre-line" }}>
            {get("bespoke.intro")}
          </p>
          <p className="hp-body-sm mt-4" style={{ color: "var(--hp-accent)", fontWeight: 600 }}>
            {get("bespoke.turnaround")} · {get("bespoke.starting_price")}
          </p>
          <p className="hp-body max-w-[640px] mt-4">
            Made-to-order means your selected style is produced after your order is confirmed. This helps us maintain quality, reduce unnecessary waste, and keep our drops intentional.
          </p>
        </div>
      </section>

      <section className="hp-section hp-soft-band py-16 md:py-20">
        <div className="mx-auto max-w-[900px]">
          <p className="hp-eyebrow mb-10">How It Works</p>
          <ol className="space-y-0">
            {PROCESS_STEPS.map((step, i) => (
              <li
                key={step}
                className="flex gap-5 py-5"
                style={{
                  borderBottom:
                    i === PROCESS_STEPS.length - 1 ? "none" : "1px solid var(--hp-border)",
                }}
              >
                <span
                  className="font-barlow-cond font-bold flex-shrink-0"
                  style={{ fontSize: "14px", color: "var(--hp-accent)", width: "28px" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="hp-body" style={{ fontSize: "15px" }}>
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-section py-16 md:py-24">
        <div className="mx-auto max-w-[640px]">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="hp-label" htmlFor="mto-style">
                Style
              </label>
              <select
                id="mto-style"
                value={form.style}
                onChange={(e) => set("style")(e.target.value)}
                className="hp-input"
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="hp-label" htmlFor="mto-color">
                  Colour
                </label>
                <input
                  id="mto-color"
                  type="text"
                  value={form.color}
                  onChange={(e) => set("color")(e.target.value)}
                  placeholder="e.g. Onyx, Ivory"
                  className="hp-input"
                  required
                />
              </div>
              <div>
                <label className="hp-label" htmlFor="mto-size">
                  Size
                </label>
                <select
                  id="mto-size"
                  value={form.size}
                  onChange={(e) => set("size")(e.target.value)}
                  className="hp-input"
                  required
                >
                  <option value="">Select size</option>
                  {SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {(
                [
                  { key: "firstName" as const, label: "First Name" },
                  { key: "lastName" as const, label: "Last Name" },
                  { key: "email" as const, label: "Email Address" },
                  { key: "phone" as const, label: "Phone Number" },
                ] as const
              ).map((field) => (
                <div key={field.key}>
                  <label className="hp-label" htmlFor={`mto-${field.key}`}>
                    {field.label}
                  </label>
                  <input
                    id={`mto-${field.key}`}
                    type={field.key === "email" ? "email" : "text"}
                    value={form[field.key]}
                    onChange={(e) => set(field.key)(e.target.value)}
                    className="hp-input"
                    required
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="hp-label" htmlFor="mto-notes">
                Additional Notes{" "}
                <span
                  style={{
                    textTransform: "none",
                    fontStyle: "italic",
                    fontWeight: 400,
                    color: "var(--hp-muted)",
                    letterSpacing: 0,
                  }}
                >
                  (optional)
                </span>
              </label>
              <textarea
                id="mto-notes"
                rows={4}
                value={form.notes}
                onChange={(e) => set("notes")(e.target.value)}
                placeholder="Any specific requests or occasion details..."
                className="hp-input resize-none leading-relaxed"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-hp-primary disabled:opacity-60">
              {loading ? "Submitting..." : "Request Made to Order"}
            </button>
          </form>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
