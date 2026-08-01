"use client";

import { useState } from "react";
import Link from "next/link";

export const FOOTER_LINKS: Record<string, string> = {
  "New Arrivals": "/new-arrivals",
  Collections: "/collections",
  "Minimal Essentials": "/collections?style=minimal",
  "Statement Pants": "/collections?style=statement",
  "Made to Order": "/made-to-order",
  "About GetPanted": "/about",
  "Size Guide": "/size-guide",
  "Care Instructions": "/about",
  "Shipping & Delivery": "/contact",
  "Returns & Exchanges": "/contact",
  "Contact Us": "/contact",
  FAQs: "/contact",
  "Track Order": "/contact",
  "WhatsApp Support": "https://wa.me/2348000000000",
  Instagram: "https://instagram.com/getpanted",
  Facebook: "https://facebook.com/getpanted",
  TikTok: "https://tiktok.com/@getpanted",
};

function FooterLink({ label }: { label: string }) {
  const href = FOOTER_LINKS[label] ?? "/about";
  const isExternal = href.startsWith("http");
  const className =
    "font-barlow transition-colors duration-200 hover:text-[#5C2D8F]";
  const style = { fontSize: "14px", color: "#6B6B6B" };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className} style={style}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className} style={style}>
      {label}
    </Link>
  );
}

export function PageFooter() {
  const [nlEmail, setNlEmail] = useState("");
  const [nlLoading, setNlLoading] = useState(false);
  const [nlStatus, setNlStatus] = useState<"idle" | "success" | "error" | "duplicate">("idle");

  const handleSubscribe = async () => {
    if (!nlEmail.trim()) return;
    setNlLoading(true);
    setNlStatus("idle");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: nlEmail, source: "newsletter" }),
      });
      const json = (await res.json()) as { error?: string };
      if (res.status === 409 || json.error === "already_subscribed") setNlStatus("duplicate");
      else if (!res.ok) setNlStatus("error");
      else {
        setNlStatus("success");
        setNlEmail("");
      }
    } catch {
      setNlStatus("error");
    } finally {
      setNlLoading(false);
    }
  };

  return (
    <footer
      className="relative overflow-hidden px-5 md:px-12"
      style={{ background: "#FFFFFF", paddingTop: "72px", paddingBottom: "40px", borderTop: "1px solid #E8E8E8" }}
    >
      <div className="max-w-[1400px] mx-auto relative z-[1]">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-12 mb-16">
          <div className="max-w-xs">
            <Link
              href="/"
              className="font-playfair font-bold tracking-[0.18em] uppercase inline-block"
              style={{ fontSize: "22px" }}
            >
              <span style={{ color: "#1A1A1A" }}>Get</span>
              <span style={{ color: "#5C2D8F" }}>Panted</span>
            </Link>
            <p className="font-barlow mt-5" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.7 }}>
              Elevated trousers for women who dress with intention — born in Lagos.
            </p>

            <div className="mt-8">
              <p
                className="font-barlow-cond font-bold uppercase mb-3"
                style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#1A1A1A" }}
              >
                Newsletter
              </p>
              {nlStatus === "success" ? (
                <p className="font-barlow" style={{ fontSize: "14px", color: "#5C2D8F" }}>
                  You&apos;re on the list.
                </p>
              ) : (
                <div className="flex">
                  <input
                    type="email"
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="Email"
                    className="font-barlow outline-none flex-1 min-w-0"
                    style={{
                      border: "1px solid #E0E0E0",
                      borderRight: "none",
                      padding: "12px 14px",
                      fontSize: "14px",
                      color: "#1A1A1A",
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleSubscribe}
                    disabled={nlLoading}
                    className="font-barlow-cond font-bold uppercase text-white disabled:opacity-60"
                    style={{
                      background: "#5C2D8F",
                      padding: "12px 16px",
                      fontSize: "11px",
                      letterSpacing: "0.12em",
                    }}
                  >
                    {nlLoading ? "..." : "Join"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 flex-1 lg:max-w-3xl">
            {[
              {
                title: "Shop",
                links: ["New Arrivals", "Collections", "Minimal Essentials", "Statement Pants", "Made to Order"],
              },
              {
                title: "Collections",
                links: ["Minimal Essentials", "Statement Pants", "Made to Order", "Size Guide"],
              },
              {
                title: "Info",
                links: ["About GetPanted", "Care Instructions", "Shipping & Delivery", "Returns & Exchanges"],
              },
              {
                title: "Help",
                links: ["Contact Us", "FAQs", "Track Order", "WhatsApp Support"],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className="font-barlow-cond font-bold uppercase mb-5"
                  style={{ fontSize: "11px", letterSpacing: "0.18em", color: "#1A1A1A" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-3 list-none">
                  {col.links.map((link) => (
                    <li key={`${col.title}-${link}`}>
                      <FooterLink label={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid #E8E8E8" }}
        >
          <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B" }}>
            © 2026 GetPanted. Lagos, Nigeria. All rights reserved.
          </p>
          <div className="flex gap-5">
            {["Instagram", "Facebook", "TikTok"].map((s) => (
              <FooterLink key={s} label={s} />
            ))}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div
        className="pointer-events-none select-none absolute bottom-0 left-0 right-0 overflow-hidden"
        aria-hidden
        style={{ height: "140px" }}
      >
        <p
          className="font-playfair font-bold uppercase text-center leading-none"
          style={{
            fontSize: "clamp(64px, 18vw, 180px)",
            letterSpacing: "0.12em",
            color: "#1A1A1A",
            opacity: 0.04,
            transform: "translateY(28%)",
          }}
        >
          GetPanted
        </p>
      </div>
    </footer>
  );
}
