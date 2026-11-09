"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  EE_SELECTION_COUNT,
  type ExecutivePackageId,
  type ExecutiveStyleOption,
  formatNaira,
  getPackage,
} from "@/lib/executive-edit/constants";

export type SelectionSlot = {
  slug: string;
  name: string;
  colorName: string;
  size: string;
  image: string;
};

type Props = {
  initialPackage: ExecutivePackageId;
};

export function ExecutiveEditCheckoutClient({ initialPackage }: Props) {
  const [packageId, setPackageId] = useState<ExecutivePackageId>(initialPackage);
  const pkg = getPackage(packageId);

  const [slots, setSlots] = useState<(SelectionSlot | null)[]>(
    Array.from({ length: EE_SELECTION_COUNT }, () => null)
  );
  const [activeSlot, setActiveSlot] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filled = useMemo(() => slots.filter(Boolean).length, [slots]);
  const ready = filled === EE_SELECTION_COUNT && slots.every((s) => s?.size);

  const pickStyle = (style: ExecutiveStyleOption) => {
    if (!style.available) return;
    const next = [...slots];
    const existing = next[activeSlot];
    next[activeSlot] = {
      slug: style.slug,
      name: style.name,
      colorName: style.colorName,
      size: existing?.slug === style.slug ? existing.size : "",
      image: style.image,
    };
    setSlots(next);
  };

  const pickSize = (size: string) => {
    const current = slots[activeSlot];
    if (!current) return;
    const next = [...slots];
    next[activeSlot] = { ...current, size };
    setSlots(next);
    if (activeSlot < EE_SELECTION_COUNT - 1) {
      setActiveSlot(activeSlot + 1);
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!ready) {
      setError("Please select five styles and a size for each.");
      return;
    }
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const payload = {
      package: packageId,
      customer_name: `${data.get("firstName")} ${data.get("lastName")}`.toString().trim(),
      customer_email: String(data.get("email") ?? "").trim(),
      customer_phone: String(data.get("phone") ?? "").trim(),
      shipping_address: {
        street: String(data.get("street") ?? ""),
        city: String(data.get("city") ?? ""),
        state: String(data.get("state") ?? ""),
        country: String(data.get("country") ?? "Nigeria"),
      },
      selections: slots.filter(Boolean),
      customer_notes: String(data.get("notes") ?? "") || null,
      amount: pkg.price,
    };

    try {
      const res = await fetch("/api/executive-edit/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Could not start payment");
      if (!json.authorizationUrl) throw new Error("Payment link unavailable");
      window.location.href = json.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setLoading(false);
    }
  };

  const activeStyle = slots[activeSlot]
    ? pkg.styles.find((s) => s.slug === slots[activeSlot]?.slug)
    : null;

  return (
    <div className="ee-checkout">
      <p className="ee-eyebrow">Pre-order</p>
      <h1 className="ee-h2" style={{ marginBottom: "0.5rem" }}>
        Build your Executive Edit
      </h1>
      <p className="ee-body" style={{ marginBottom: "1.5rem" }}>
        Choose your package, pick five pieces with sizes, then complete full payment. Delivery is
        included.
      </p>

      <div className="ee-panel">
        <h2>1. Package</h2>
        <div className="ee-packages" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {(["classic", "signature"] as ExecutivePackageId[]).map((id) => {
            const p = getPackage(id);
            const selected = packageId === id;
            return (
              <button
                key={id}
                type="button"
                className={`ee-package${selected ? " is-selected" : ""}`}
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  borderColor: selected ? "var(--ee-gold)" : undefined,
                }}
                onClick={() => {
                  setPackageId(id);
                  setSlots(Array.from({ length: EE_SELECTION_COUNT }, () => null));
                  setActiveSlot(0);
                }}
              >
                <p className="ee-eyebrow" style={{ marginBottom: 6 }}>
                  {p.shortName}
                </p>
                <p className="ee-package-price" style={{ margin: 0 }}>
                  {p.priceLabel}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="ee-panel">
        <h2>
          2. Your five pieces ({filled}/{EE_SELECTION_COUNT})
        </h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          {slots.map((slot, i) => (
            <button
              key={i}
              type="button"
              className={`ee-chip${activeSlot === i ? " is-active" : ""}`}
              onClick={() => setActiveSlot(i)}
            >
              {slot ? `${i + 1}. ${slot.colorName}${slot.size ? ` / ${slot.size}` : ""}` : `Slot ${i + 1}`}
            </button>
          ))}
        </div>

        <p className="ee-body" style={{ marginBottom: 12, fontSize: 14 }}>
          Editing slot {activeSlot + 1}. Select a colourway, then a size.
        </p>

        <div className="ee-style-grid">
          {getPackage(packageId).styles.map((style) => {
            const selected = slots[activeSlot]?.slug === style.slug;
            return (
              <button
                key={style.slug}
                type="button"
                disabled={!style.available}
                className={`ee-style-row${selected ? " is-selected" : ""}`}
                onClick={() => pickStyle(style)}
                style={{ width: "100%", textAlign: "left", opacity: style.available ? 1 : 0.55 }}
              >
                <div className="ee-style-thumb">
                  <Image src={style.image} alt="" fill className="object-contain object-center" sizes="64px" />
                </div>
                <div>
                  <strong
                    style={{
                      fontFamily: "Barlow Condensed, sans-serif",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      fontSize: 13,
                    }}
                  >
                    {style.colorName}
                  </strong>
                  <p className="ee-body" style={{ fontSize: 13, margin: "2px 0 0" }}>
                    {style.silhouette} leg
                    {!style.available && <span className="ee-coming"> · Coming soon</span>}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {activeStyle && (
          <div style={{ marginTop: 16 }}>
            <p className="ee-eyebrow">Size for {activeStyle.colorName}</p>
            <div className="ee-size-chips">
              {activeStyle.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`ee-chip${slots[activeSlot]?.size === size ? " is-active" : ""}`}
                  onClick={() => pickSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <form className="ee-panel" onSubmit={onSubmit}>
        <h2>3. Your details</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="ee-field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" name="firstName" required autoComplete="given-name" />
          </div>
          <div className="ee-field">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" name="lastName" required autoComplete="family-name" />
          </div>
        </div>
        <div className="ee-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="ee-field">
          <label htmlFor="phone">Phone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div className="ee-field">
          <label htmlFor="street">Delivery address</label>
          <input id="street" name="street" required autoComplete="street-address" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="ee-field">
            <label htmlFor="city">City</label>
            <input id="city" name="city" required autoComplete="address-level2" />
          </div>
          <div className="ee-field">
            <label htmlFor="state">State</label>
            <input id="state" name="state" required autoComplete="address-level1" />
          </div>
        </div>
        <div className="ee-field">
          <label htmlFor="country">Country</label>
          <input id="country" name="country" defaultValue="Nigeria" required autoComplete="country-name" />
        </div>
        <div className="ee-field">
          <label htmlFor="notes">Notes (optional)</label>
          <textarea id="notes" name="notes" placeholder="Colour preferences or delivery notes" />
        </div>

        <h2 style={{ marginTop: 8 }}>4. Summary</h2>
        <div className="ee-summary-row">
          <span>{pkg.name}</span>
          <span>{pkg.priceLabel}</span>
        </div>
        <div className="ee-summary-row">
          <span>Delivery</span>
          <span>Included</span>
        </div>
        {slots.map((slot, i) =>
          slot ? (
            <div className="ee-summary-row" key={`${slot.slug}-${i}`}>
              <span>
                {i + 1}. {slot.colorName}
                {slot.size ? ` · Size ${slot.size}` : " · Size needed"}
              </span>
            </div>
          ) : null
        )}
        <div className="ee-summary-total">
          <span>Total</span>
          <span>{formatNaira(pkg.price)}</span>
        </div>
        <p className="ee-body" style={{ fontSize: 13, marginTop: 12 }}>
          Full payment is required. You will be redirected to Paystack to pay securely. Do not send
          card details over WhatsApp or Instagram.
        </p>

        {error && <p className="ee-error">{error}</p>}

        <button
          type="submit"
          className="btn-hp-dark w-full"
          style={{ marginTop: 16, width: "100%" }}
          disabled={loading || !ready}
        >
          {loading ? "Redirecting to Paystack…" : `Pay ${pkg.priceLabel}`}
        </button>
        <p style={{ marginTop: 12, textAlign: "center" }}>
          <Link href="/executive-edit" className="ee-body" style={{ fontSize: 13, textDecoration: "underline" }}>
            Back to landing page
          </Link>
        </p>
      </form>
    </div>
  );
}
