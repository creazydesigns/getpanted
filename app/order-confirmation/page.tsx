"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

function OrderContent() {
  const params = useSearchParams();
  const orderId = params.get("id") ?? "—";
  const name = params.get("name") ?? "there";

  return (
    <main className="hp-page font-barlow overflow-x-hidden min-h-screen">
      <StorefrontHeader
        eyebrow="Order Confirmed"
        title={`Thank You, ${name}.`}
        description="Your order has been received and is being prepared with care."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Confirmation" },
        ]}
        narrow
      />

      <section className="hp-section py-16 md:py-20">
        <div className="max-w-[560px] mx-auto">
          <div
            className="mx-auto mb-10 flex items-center justify-center"
            style={{ width: "72px", height: "72px", background: "var(--hp-accent)" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>

          <div
            className="mb-8"
            style={{
              background: "var(--hp-soft-2)",
              padding: "24px 28px",
              borderLeft: "3px solid var(--hp-accent)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="hp-eyebrow" style={{ marginBottom: 0 }}>
                Order Reference
              </p>
              <p
                className="font-barlow-cond font-bold"
                style={{ fontSize: "15px", color: "var(--hp-ink)" }}
              >
                {orderId}
              </p>
            </div>
          </div>

          <div className="space-y-5 mb-12">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hp-accent)" strokeWidth="1.5">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.35 2 2 0 0 1 3.6 1H6.6a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.59 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                ),
                label: "Confirmation Email",
                text: "We've sent an order confirmation to your email address.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hp-accent)" strokeWidth="1.5">
                    <rect x="1" y="3" width="15" height="13" />
                    <path d="M16 8h4l3 5v3h-7V8z" />
                    <circle cx="5.5" cy="18.5" r="2.5" />
                    <circle cx="18.5" cy="18.5" r="2.5" />
                  </svg>
                ),
                label: "Estimated Delivery",
                text: "5–7 business days from order confirmation.",
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--hp-accent)" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                ),
                label: "Order Updates",
                text: "We'll email you when your order ships with tracking information.",
              },
            ].map(({ icon, label, text }) => (
              <div key={label} className="flex gap-4 items-start">
                <div className="shrink-0 mt-0.5">{icon}</div>
                <div>
                  <p
                    className="font-barlow-cond font-bold uppercase mb-1"
                    style={{ fontSize: "12px", letterSpacing: "0.1em", color: "var(--hp-ink)" }}
                  >
                    {label}
                  </p>
                  <p className="hp-body-sm">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/collections" className="btn-hp-primary flex-1 text-center">
              Continue Shopping
            </Link>
            <Link href="/" className="btn-hp-outline flex-1 text-center">
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
    <Suspense fallback={<div className="hp-page font-barlow min-h-screen" />}>
      <OrderContent />
    </Suspense>
  );
}
