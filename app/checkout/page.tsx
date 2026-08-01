"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/store/cartStore";
import { useAuth } from "@/app/context/auth-context";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function CheckoutPage() {
  const { user, profile } = useAuth();
  const items = useCartStore((s) => s.items);
  const cartCount = useCartStore(selectCartCount);
  const cartSubtotal = useCartStore(selectCartSubtotal);
  const shipping = cartSubtotal >= 50000 ? 0 : cartCount > 0 ? 3500 : 0;
  const total = cartSubtotal + shipping;

  const defaultFirst =
    profile?.first_name ?? (user?.user_metadata?.first_name as string | undefined) ?? "";
  const defaultLast =
    profile?.last_name ?? (user?.user_metadata?.last_name as string | undefined) ?? "";
  const defaultEmail = user?.email ?? "";
  const defaultPhone = profile?.phone ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") ?? "");
    const lastName = String(data.get("lastName") ?? "");
    const email = String(data.get("email") ?? "");
    const phone = String(data.get("phone") ?? "");
    const street = String(data.get("street") ?? "");
    const city = String(data.get("city") ?? "");
    const state = String(data.get("state") ?? "");
    const country = String(data.get("country") ?? "");
    const notes = String(data.get("notes") ?? "");

    const orderItems = items.map((i) => ({
      product_id: i.id,
      name: i.name,
      price: i.priceRaw,
      size: i.size,
      quantity: i.quantity,
      image: i.image,
    }));

    try {
      const res = await fetch("/api/checkout/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: `${firstName} ${lastName}`.trim(),
          customer_email: email,
          customer_phone: phone,
          shipping_address: { street, city, state, country },
          items: orderItems,
          subtotal: cartSubtotal,
          shipping_amount: shipping,
          total_amount: total,
          customer_notes: notes || null,
        }),
      });

      const json = (await res.json()) as { authorizationUrl?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to start payment");

      if (!json.authorizationUrl) throw new Error("Payment link unavailable");

      window.location.href = json.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <main className="hp-page font-barlow overflow-x-hidden" style={{ minHeight: "100vh" }}>
        <StorefrontHeader
          eyebrow="Checkout"
          title="Your Cart is Empty"
          crumbs={[
            { label: "Home", href: "/" },
            { label: "Checkout" },
          ]}
          narrow
        />
        <section className="hp-section py-20 text-center">
          <p className="hp-body mb-8">Add items to your cart before checking out.</p>
          <Link href="/collections" className="btn-hp-primary">
            Browse Collections
          </Link>
        </section>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="hp-page font-barlow overflow-x-hidden" style={{ minHeight: "100vh" }}>
      <StorefrontHeader
        eyebrow="Final Step"
        title="Checkout"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout" },
        ]}
      />

      <section className="hp-section py-14 md:py-16">
        <div className="max-w-[1200px] mx-auto grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <form onSubmit={onSubmit} className="space-y-8">
            {!user && (
              <p className="hp-body-sm">
                Checking out as a guest.{" "}
                <Link href="/account/login?next=/checkout" style={{ color: "var(--hp-accent)" }}>
                  Sign in
                </Link>{" "}
                to save your details and track orders.
              </p>
            )}

            <fieldset style={{ border: "1px solid var(--hp-border)", padding: "32px" }}>
              <legend
                className="font-barlow-cond font-bold uppercase px-2"
                style={{ fontSize: "13px", letterSpacing: "0.14em", color: "var(--hp-ink)" }}
              >
                Contact Details
              </legend>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <div>
                  <label className="hp-label" htmlFor="firstName">
                    First name
                  </label>
                  <input
                    required
                    id="firstName"
                    name="firstName"
                    className="hp-input"
                    placeholder="First name"
                    defaultValue={defaultFirst}
                  />
                </div>
                <div>
                  <label className="hp-label" htmlFor="lastName">
                    Last name
                  </label>
                  <input
                    required
                    id="lastName"
                    name="lastName"
                    className="hp-input"
                    placeholder="Last name"
                    defaultValue={defaultLast}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="hp-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    required
                    id="email"
                    name="email"
                    type="email"
                    className="hp-input"
                    placeholder="Email address"
                    defaultValue={defaultEmail}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="hp-label" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    required
                    id="phone"
                    name="phone"
                    className="hp-input"
                    placeholder="Phone number"
                    defaultValue={defaultPhone}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset style={{ border: "1px solid var(--hp-border)", padding: "32px" }}>
              <legend
                className="font-barlow-cond font-bold uppercase px-2"
                style={{ fontSize: "13px", letterSpacing: "0.14em", color: "var(--hp-ink)" }}
              >
                Shipping Address
              </legend>
              <div className="grid gap-4 mt-4">
                <div>
                  <label className="hp-label" htmlFor="street">
                    Street
                  </label>
                  <input
                    required
                    id="street"
                    name="street"
                    className="hp-input"
                    placeholder="Street address"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="hp-label" htmlFor="city">
                      City
                    </label>
                    <input required id="city" name="city" className="hp-input" placeholder="City" />
                  </div>
                  <div>
                    <label className="hp-label" htmlFor="state">
                      State
                    </label>
                    <input required id="state" name="state" className="hp-input" placeholder="State" />
                  </div>
                </div>
                <div>
                  <label className="hp-label" htmlFor="country">
                    Country
                  </label>
                  <input
                    required
                    id="country"
                    name="country"
                    className="hp-input"
                    placeholder="Country"
                    defaultValue="Nigeria"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset style={{ border: "1px solid var(--hp-border)", padding: "32px" }}>
              <legend
                className="font-barlow-cond font-bold uppercase px-2"
                style={{ fontSize: "13px", letterSpacing: "0.14em", color: "var(--hp-ink)" }}
              >
                Order Notes{" "}
                <span className="font-normal" style={{ color: "var(--hp-muted)" }}>
                  (Optional)
                </span>
              </legend>
              <div className="mt-4">
                <label className="hp-label" htmlFor="notes">
                  Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Any special instructions or notes..."
                  className="hp-input resize-none"
                />
              </div>
            </fieldset>

            {error && (
              <p className="font-barlow text-[13px]" style={{ color: "#E53935" }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-hp-primary w-full disabled:opacity-50">
              {loading ? "Redirecting to Paystack…" : `Pay ${formatNaira(total)} with Paystack`}
            </button>
            <p className="hp-body-sm text-center">
              Secure payment via Paystack. Card, bank transfer, and USSD accepted.
            </p>
          </form>

          <aside className="h-fit" style={{ border: "1px solid var(--hp-border)", padding: "32px" }}>
            <h2
              className="font-barlow-cond font-bold uppercase mb-6"
              style={{ fontSize: "16px", letterSpacing: "0.1em", color: "var(--hp-ink)" }}
            >
              Order Summary
            </h2>

            <div
              className="space-y-4 mb-6"
              style={{ borderBottom: "1px solid var(--hp-border)", paddingBottom: "24px" }}
            >
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 items-start">
                  {item.image ? (
                    <div
                      className="relative shrink-0"
                      style={{ width: "64px", height: "80px", background: "var(--hp-soft)" }}
                    >
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <div style={{ width: "64px", height: "80px", background: "var(--hp-soft)" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-barlow-cond font-bold uppercase"
                      style={{ fontSize: "13px", color: "var(--hp-ink)", letterSpacing: "0.05em" }}
                    >
                      {item.name}
                    </p>
                    <p className="hp-body-sm mt-0.5" style={{ fontSize: "12px" }}>
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p
                    className="font-barlow-cond font-bold shrink-0"
                    style={{ fontSize: "13px", color: "var(--hp-ink)" }}
                  >
                    {formatNaira(item.priceRaw * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-3 hp-body-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNaira(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span style={{ color: "#4CAF50" }}>Free</span>
                  ) : (
                    formatNaira(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: "11px" }}>Free shipping on orders above ₦50,000</p>
              )}
            </div>

            <div
              className="flex justify-between mt-5 pt-5 font-barlow-cond font-bold"
              style={{ borderTop: "1px solid var(--hp-border)", fontSize: "17px" }}
            >
              <span style={{ color: "var(--hp-ink)" }}>Total</span>
              <span style={{ color: "var(--hp-accent)" }}>{formatNaira(total)}</span>
            </div>
          </aside>
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
