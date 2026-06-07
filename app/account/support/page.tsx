"use client";

import Link from "next/link";
import { AccountHero } from "@/components/account/account-hero";
import { SupportTicketForm } from "@/components/account/support-ticket-form";
import { CONTACT_CHANNELS, HELP_TOPICS } from "@/lib/support/contact-options";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";
import "../account.css";

export default function AccountSupportPage() {
  return (
    <main className="account-page font-barlow">
      <Navbar />
      <AccountHero
        eyebrow="Support"
        title="Feedback & Queries"
        subtitle="Submit a ticket below and our team will get back to you."
        backHref="/account"
        backLabel="Account"
      />

      <section className="account-body">
        <div className="account-body-inner">
          <div className="account-detail-card account-support-card">
            <h2 className="account-support-form-title font-barlow-cond">Open a Support Ticket</h2>
            <p className="account-support-form-lead font-barlow">
              Your name and email are pulled from your account automatically.
            </p>
            <SupportTicketForm />
          </div>

          <p className="account-support-section-label font-barlow-cond">Other ways to reach us</p>
          <div className="account-support-channels">
            {CONTACT_CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                className="account-support-channel"
              >
                <p className="account-support-channel-label font-barlow-cond">{channel.label}</p>
                <p className="account-support-channel-value">{channel.value}</p>
                <p className="account-support-channel-note font-barlow">{channel.note}</p>
              </a>
            ))}
          </div>

          <p className="account-support-section-label font-barlow-cond">Common help topics</p>
          <div className="account-support-topics">
            {HELP_TOPICS.map((topic) => (
              <div key={topic.title} className="account-support-topic">
                <h3 className="account-support-topic-title">{topic.title}</h3>
                <p className="account-support-topic-body font-barlow">{topic.body}</p>
              </div>
            ))}
          </div>

          <div className="account-support-cta">
            <p className="account-support-section-label font-barlow-cond" style={{ marginBottom: 16 }}>
              Need your measurements?
            </p>
            <Link href="/size-guide" className="account-btn account-btn-primary" style={{ maxWidth: 280 }}>
              View Size Guide
            </Link>
          </div>
        </div>
      </section>
      <PageFooter />
    </main>
  );
}
