"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Navbar } from "../components/navbar";
import { PageFooter } from "../components/page-footer";

function OrderContent() {
  const params  = useSearchParams();
  const orderId = params.get("id")   ?? "—";
  const name    = params.get("name") ?? "there";

  return (
    <main style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section className="px-5 md:px-12 pt-28 pb-12" style={{ borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[700px] mx-auto text-center">
          {/* Check icon */}
          <div
            className="mx-auto mb-8 flex items-center justify-center"
            style={{ width: "72px", height: "72px", background: "#5C2D8F" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            Order Confirmed
          </p>
          <h1
            className="font-barlow-cond font-bold uppercase"
            style={{ fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-0.01em", lineHeight: 0.95, color: "#1A1A1A", marginBottom: "16px" }}
          >
            Thank You, {name}.
          </h1>
          <p className="font-barlow" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.7 }}>
            Your order has been received and is being prepared with care.
          </p>
        </div>
      </section>

      {/* Order details */}
      <section className="px-5 md:px-12 py-16">
        <div className="max-w-[560px] mx-auto">
          {/* Order ID card */}
          <div
            className="mb-8"
            style={{ background: "#F7F7F7", padding: "24px 28px", borderLeft: "3px solid #5C2D8F" }}
          >
            <div className="flex items-center justify-between">
              <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}>
                Order Reference
              </p>
              <p className="font-barlow-cond font-bold" style={{ fontSize: "15px", color: "#1A1A1A" }}>
                {orderId}
              </p>
            </div>
          </div>

          {/* Summary points */}
          <div className="space-y-5 mb-12">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2D8F" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.35 2 2 0 0 1 3.6 1H6.6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.59 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                ),
                label: "Confirmation Email",
                text:  "We've sent an order confirmation to your email address.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2D8F" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" /><path d="M16 8h4l3 5v3h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                label: "Estimated Delivery",
                text:  "5–7 business days from order confirmation.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5C2D8F" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                label: "Order Updates",
                text:  "We'll email you when your order ships with tracking information.",
              },
            ].map(({ icon, label, text }) => (
              <div key={label} className="flex gap-4 items-start">
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div>
                  <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "12px", letterSpacing: "0.1em", color: "#1A1A1A", marginBottom: "4px" }}>
                    {label}
                  </p>
                  <p className="font-barlow" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.6 }}>
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/collections"
              className="flex-1 font-barlow-cond font-bold uppercase text-white text-center transition-opacity hover:opacity-80"
              style={{ fontSize: "13px", letterSpacing: "0.14em", padding: "16px 32px", background: "#5C2D8F" }}
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 font-barlow-cond font-bold uppercase text-center transition-all hover:bg-[#1A1A1A] hover:text-white"
              style={{ fontSize: "13px", letterSpacing: "0.14em", padding: "16px 32px", border: "1px solid #1A1A1A", color: "#1A1A1A" }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#FFFFFF" }} />}>
      <OrderContent />
    </Suspense>
  );
}
