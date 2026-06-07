"use client";

import { useState } from "react";
import Image from "next/image";
import { GeoPhoneInput, isValidPhoneNumber } from "@/components/geo-phone-input";
import "../homepage.css";
import "./waitlist.css";

type FormStatus = "idle" | "success" | "error" | "duplicate";

export default function WaitlistPage() {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [phoneError, setPhoneError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsapp.trim() || !email.trim()) return;
    if (!isValidPhoneNumber(whatsapp)) {
      setPhoneError(true);
      return;
    }
    setPhoneError(false);

    setLoading(true);
    setStatus("idle");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          whatsapp: whatsapp.trim(),
          source: "waitlist",
        }),
      });
      const json = (await res.json()) as { error?: string };

      if (res.status === 409 || json.error === "already_subscribed") {
        setStatus("duplicate");
      } else if (!res.ok) {
        setStatus("error");
      } else {
        setStatus("success");
        setFullName("");
        setWhatsapp("");
        setEmail("");
      }
    } catch {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="font-barlow overflow-x-hidden waitlist-page" style={{ background: "#FFFFFF" }}>
      <div className="waitlist-topbar">
        <span className="waitlist-topbar-label font-barlow-cond font-bold uppercase">
          Coming Soon
        </span>
        <span className="waitlist-topbar-tags font-barlow-cond font-bold uppercase">
          #getpanted <span className="waitlist-topbar-tag-sep">#owntheroom</span>
        </span>
      </div>

      <section className="waitlist-main">
        <h1 className="waitlist-offer font-barlow-cond font-bold uppercase">
          <span className="waitlist-offer-line">10% Discount</span>
          <span className="waitlist-offer-line">on your first Order,</span>
          <span className="waitlist-offer-line waitlist-offer-emphasis">
            IF you join our waitlist today!
          </span>
        </h1>

        <div className="waitlist-form-wrap">
          {status === "success" ? (
            <div className="waitlist-success">
              <p className="waitlist-success-title font-barlow-cond font-bold uppercase">
                You&apos;re in. Your 10% discount is secured. ✓
              </p>
              <p className="font-barlow waitlist-success-body">
                We&apos;ll reach out on WhatsApp and email when we go live.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="waitlist-form">
              <label className="waitlist-field">
                <span className="waitlist-field-label font-barlow-cond font-bold uppercase">
                  Full Name:
                </span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  autoComplete="name"
                  placeholder="Full Name"
                  required
                  className="waitlist-input font-barlow"
                />
              </label>

              <label className="waitlist-field" htmlFor="waitlist-whatsapp">
                <span className="waitlist-field-label font-barlow-cond font-bold uppercase">
                  WhatsApp:
                </span>
                <GeoPhoneInput
                  id="waitlist-whatsapp"
                  value={whatsapp}
                  onChange={(v) => {
                    setWhatsapp(v);
                    setPhoneError(false);
                  }}
                  placeholder="WhatsApp Number"
                  className="waitlist-phone font-barlow"
                />
              </label>

              {phoneError && (
                <p className="font-barlow waitlist-form-note waitlist-form-note--error">
                  Please enter a valid WhatsApp number.
                </p>
              )}

              <label className="waitlist-field">
                <span className="waitlist-field-label font-barlow-cond font-bold uppercase">
                  Email Address:
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="Email Address"
                  required
                  className="waitlist-input font-barlow"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="btn-subscribe waitlist-submit font-barlow-cond font-bold uppercase text-white disabled:opacity-60"
              >
                {loading ? "Securing..." : "Secure Your Discount"}
              </button>

              {status === "duplicate" && (
                <p className="font-barlow waitlist-form-note">
                  You&apos;re already on the list — your discount stands.
                </p>
              )}
              {status === "error" && (
                <p className="font-barlow waitlist-form-note waitlist-form-note--error">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
        </div>

        <div className="waitlist-hero-image">
          <Image
            src="/images/gp-lady-white.png"
            alt="Model in GetPanted wide-leg trousers"
            fill
            className="object-contain hero-img"
            style={{ objectPosition: "center bottom" }}
            priority
            unoptimized
          />
        </div>
      </section>
    </main>
  );
}
