"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

const CONTACT_CHANNELS = [
  {
    label: "WhatsApp",
    value: "Message us on WhatsApp",
    href: "https://wa.me/2348000000000",
    note: "Fastest for order questions, sizing help, and delivery updates.",
  },
  {
    label: "Email",
    value: "hello@getpanted.com",
    href: "mailto:hello@getpanted.com",
    note: "For general enquiries, wholesale, and support.",
  },
  {
    label: "Instagram",
    value: "@getpanted",
    href: "https://instagram.com/getpanted",
    note: "New drops, styling notes, and behind-the-scenes updates.",
  },
];

const HELP_TOPICS = [
  {
    title: "Delivery Questions",
    body: "Need help with shipping timelines or tracking? Reach out on WhatsApp or email with your order details.",
  },
  {
    title: "Returns & Exchanges",
    body: "Contact us within the stated return window. Our team will guide you through the next steps based on your order.",
  },
  {
    title: "Size & Fit Help",
    body: "Between sizes or unsure which fit to choose? Share your measurements and we will recommend the best option.",
  },
  {
    title: "Made to Order",
    body: "Missed your size on a sold-out piece? Request made to order and we will confirm availability and timeline.",
  },
];

export default function ContactPage() {
  return (
    <main className="hp-page font-barlow overflow-x-hidden">
      <style>{`
        .contact-channels {
          display: grid;
          grid-template-columns: 1fr;
          border: 1px solid var(--hp-border);
        }
        .contact-channel {
          display: block;
          padding: 32px;
          text-decoration: none;
          border-bottom: 1px solid var(--hp-border);
          transition: background 0.2s ease;
        }
        .contact-channel:last-child { border-bottom: none; }
        .contact-channel:hover { background: var(--hp-soft-2); }
        @media (min-width: 768px) {
          .contact-channels { grid-template-columns: repeat(3, 1fr); }
          .contact-channel {
            border-bottom: none;
            border-right: 1px solid var(--hp-border);
            padding: 40px;
          }
          .contact-channel:last-child { border-right: none; }
        }
      `}</style>

      <StorefrontHeader
        eyebrow="Contact & Help"
        title="We're here to help."
        description="Questions about sizing, delivery, returns, or made-to-order requests? Reach out through any channel below."
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
        narrow
      />

      <section className="hp-section py-16 md:py-24">
        <div className="contact-channels mx-auto max-w-[900px]">
          {CONTACT_CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="contact-channel"
            >
              <p className="hp-eyebrow mb-3">{channel.label}</p>
              <p
                className="font-barlow mb-3"
                style={{ fontSize: "16px", color: "var(--hp-ink)" }}
              >
                {channel.value}
              </p>
              <p className="hp-body-sm">{channel.note}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="hp-section hp-soft-band py-16 md:py-24">
        <div className="mx-auto max-w-[900px]">
          <p className="hp-eyebrow mb-10">Common Help Topics</p>
          <div style={{ borderTop: "1px solid var(--hp-border)" }}>
            {HELP_TOPICS.map((topic) => (
              <div
                key={topic.title}
                className="py-7"
                style={{ borderBottom: "1px solid var(--hp-border)" }}
              >
                <h2
                  className="font-barlow-cond font-bold mb-2"
                  style={{ fontSize: "17px", color: "var(--hp-ink)" }}
                >
                  {topic.title}
                </h2>
                <p className="hp-body-sm" style={{ lineHeight: 1.8 }}>
                  {topic.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-section py-20 text-center">
        <div className="mx-auto max-w-[480px]">
          <p className="hp-eyebrow mb-6">Need Your Measurements?</p>
          <Link href="/size-guide" className="btn-hp-primary">
            View Size Guide
          </Link>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
