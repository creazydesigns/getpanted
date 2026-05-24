"use client";

import Link from "next/link";
import { PageFooter } from "../components/page-footer";

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
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF" }}>

      <section className="px-5 md:px-12 pt-28 pb-16" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            Contact & Help
          </p>
          <h1 className="font-barlow-cond font-bold" style={{ fontSize: "clamp(40px, 6vw, 72px)", lineHeight: 1, color: "#1A1A1A" }}>
            We&apos;re here to help.
          </h1>
          <p className="font-barlow mt-6" style={{ fontSize: "16px", color: "#6B6B6B", lineHeight: 1.75, maxWidth: "520px" }}>
            Questions about sizing, delivery, returns, or made-to-order requests? Reach out through any channel below.
          </p>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {CONTACT_CHANNELS.map((channel) => (
            <a
              key={channel.label}
              href={channel.href}
              target={channel.href.startsWith("http") ? "_blank" : undefined}
              rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
              className="block transition-colors hover:border-[#5C2D8F]"
              style={{ border: "1px solid #E0E0E0", padding: "32px", background: "#FFFFFF" }}
            >
              <p className="font-barlow-cond font-bold uppercase mb-2" style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#5C2D8F" }}>
                {channel.label}
              </p>
              <p style={{ fontSize: "16px", color: "#1A1A1A", marginBottom: "12px" }}>{channel.value}</p>
              <p className="font-barlow" style={{ fontSize: "13px", color: "#6B6B6B", lineHeight: 1.7 }}>{channel.note}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24" style={{ background: "#F7F7F7", borderTop: "1px solid #F0F0F0" }}>
        <div className="max-w-[900px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-10" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>
            Common Help Topics
          </p>
          <div className="space-y-6">
            {HELP_TOPICS.map((topic) => (
              <div key={topic.title} className="pb-6" style={{ borderBottom: "1px solid #E0E0E0" }}>
                <h2 style={{ fontSize: "17px", color: "#1A1A1A", marginBottom: "8px" }}>{topic.title}</h2>
                <p className="font-barlow" style={{ fontSize: "14px", color: "#6B6B6B", lineHeight: 1.8 }}>{topic.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 py-20 text-center" style={{ background: "#FFFFFF", borderTop: "1px solid #F0F0F0" }}>
        <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Need Your Measurements?</p>
        <Link
          href="/size-guide"
          className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
          style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
        >
          View Size Guide
        </Link>
      </section>

      <PageFooter />
    </main>
  );
}
