"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, selectCartCount, selectCartSubtotal } from "@/store/cartStore";
import { PageFooter } from "../components/page-footer";
import { Navbar } from "../components/navbar";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #E0E0E0",
  padding: "14px 16px",
  fontSize: "14px",
  background: "#FFFFFF",
  color: "#1A1A1A",
  outline: "none",
  fontFamily: "'Barlow', sans-serif",
};

export default function CheckoutPage() {
  const router   = useRouter();
  const items    = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const cartCount    = useCartStore(selectCartCount);
  const cartSubtotal = useCartStore(selectCartSubtotal);
  const shipping     = cartSubtotal >= 50000 ? 0 : cartCount > 0 ? 3500 : 0;
  const total        = cartSubtotal + shipping;

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = new FormData(e.currentTarget);
    const firstName = String(data.get("firstName") ?? "");
    const lastName  = String(data.get("lastName")  ?? "");
    const email     = String(data.get("email")     ?? "");
    const phone     = String(data.get("phone")     ?? "");
    const street    = String(data.get("street")    ?? "");
    const city      = String(data.get("city")      ?? "");
    const state     = String(data.get("state")     ?? "");
    const country   = String(data.get("country")   ?? "");
    const notes     = String(data.get("notes")     ?? "");

    const orderItems = items.map((i) => ({
      product_id: i.id,
      name:       i.name,
      price:      i.priceRaw,
      size:       i.size,
      quantity:   i.quantity,
      image:      i.image,
    }));

    try {
      // 1. Save order to Supabase via API
      const res = await fetch("/api/orders", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name:    `${firstName} ${lastName}`.trim(),
          customer_email:   email,
          customer_phone:   phone,
          shipping_address: { street, city, state, country },
          items:            orderItems,
          total_amount:     total,
          notes,
        }),
      });

      const json = await res.json() as { orderId?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Failed to place order");

      const orderId = json.orderId!;

      // 2. Send confirmation email (fire-and-forget)
      fetch("/api/send-order-confirmation", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: email,
          customerName:  `${firstName} ${lastName}`,
          orderId,
          items: orderItems.map((i) => ({
            name:     i.name,
            size:     i.size,
            quantity: i.quantity,
            price:    formatNaira(i.price),
          })),
          totalAmount:     formatNaira(total),
          shippingAddress: { street, city, state, country },
        }),
      }).catch(() => {});

      // 3. Clear cart & navigate
      clearCart();
      router.push(`/order-confirmation?id=${orderId}&name=${encodeURIComponent(firstName)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <Navbar />
        <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
          <div className="max-w-[700px] mx-auto">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Checkout</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>Your Cart is Empty</h1>
          </div>
        </section>
        <div className="px-5 md:px-12 py-20 text-center">
          <p className="font-barlow mb-8" style={{ fontSize: "15px", color: "#6B6B6B" }}>Add items to your cart before checking out.</p>
          <Link href="/collections" className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80" style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}>
            Browse Collections
          </Link>
        </div>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
      <Navbar />

      {/* Header */}
      <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1200px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Final Step</p>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>Checkout</h1>
        </div>
      </section>

      <div className="px-5 md:px-12 py-14">
        <div className="max-w-[1200px] mx-auto grid gap-10 md:grid-cols-[1.4fr_1fr]">

          {/* ── Left: Customer form ─────────────────────────────────────────── */}
          <form onSubmit={onSubmit} className="space-y-8">
            {/* Contact */}
            <fieldset style={{ border: "1px solid #F0F0F0", padding: "32px" }}>
              <legend className="font-barlow-cond font-bold uppercase px-2" style={{ fontSize: "13px", letterSpacing: "0.14em", color: "#1A1A1A" }}>
                Contact Details
              </legend>
              <div className="grid gap-4 md:grid-cols-2 mt-4">
                <input required name="firstName" placeholder="First name" style={inputStyle} />
                <input required name="lastName"  placeholder="Last name"  style={inputStyle} />
                <input required name="email" type="email" placeholder="Email address" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
                <input required name="phone" placeholder="Phone number"  style={{ ...inputStyle, gridColumn: "1 / -1" }} />
              </div>
            </fieldset>

            {/* Shipping */}
            <fieldset style={{ border: "1px solid #F0F0F0", padding: "32px" }}>
              <legend className="font-barlow-cond font-bold uppercase px-2" style={{ fontSize: "13px", letterSpacing: "0.14em", color: "#1A1A1A" }}>
                Shipping Address
              </legend>
              <div className="grid gap-4 mt-4">
                <input required name="street"  placeholder="Street address" style={inputStyle} />
                <div className="grid gap-4 md:grid-cols-2">
                  <input required name="city"    placeholder="City"    style={inputStyle} />
                  <input required name="state"   placeholder="State"   style={inputStyle} />
                </div>
                <input required name="country" placeholder="Country" defaultValue="Nigeria" style={inputStyle} />
              </div>
            </fieldset>

            {/* Notes */}
            <fieldset style={{ border: "1px solid #F0F0F0", padding: "32px" }}>
              <legend className="font-barlow-cond font-bold uppercase px-2" style={{ fontSize: "13px", letterSpacing: "0.14em", color: "#1A1A1A" }}>
                Order Notes <span className="font-normal" style={{ color: "#6B6B6B" }}>(Optional)</span>
              </legend>
              <textarea
                name="notes"
                rows={3}
                placeholder="Any special instructions or notes..."
                className="mt-4 w-full resize-none"
                style={{ ...inputStyle, padding: "14px 16px" }}
              />
            </fieldset>

            {error && (
              <p className="font-barlow text-[13px]" style={{ color: "#E53935" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-barlow-cond font-bold uppercase text-white transition-opacity hover:opacity-80 disabled:opacity-50"
              style={{ fontSize: "14px", letterSpacing: "0.15em", padding: "18px", background: "#5C2D8F" }}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>

          {/* ── Right: Order summary ─────────────────────────────────────────── */}
          <aside className="h-fit" style={{ border: "1px solid #F0F0F0", padding: "32px" }}>
            <h2 className="font-barlow-cond font-bold uppercase mb-6" style={{ fontSize: "16px", letterSpacing: "0.1em", color: "#1A1A1A" }}>
              Order Summary
            </h2>

            {/* Items */}
            <div className="space-y-4 mb-6" style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "24px" }}>
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4 items-start">
                  {item.image ? (
                    <div className="relative shrink-0" style={{ width: "64px", height: "80px", background: "#F7F7F7" }}>
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                    </div>
                  ) : (
                    <div style={{ width: "64px", height: "80px", background: "#F7F7F7" }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "13px", color: "#1A1A1A", letterSpacing: "0.05em" }}>
                      {item.name}
                    </p>
                    <p className="font-barlow mt-0.5" style={{ fontSize: "12px", color: "#6B6B6B" }}>
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-barlow-cond font-bold shrink-0" style={{ fontSize: "13px", color: "#1A1A1A" }}>
                    {formatNaira(item.priceRaw * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-3 font-barlow" style={{ fontSize: "14px", color: "#6B6B6B" }}>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatNaira(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span style={{ color: "#4CAF50" }}>Free</span> : formatNaira(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: "11px", color: "#6B6B6B" }}>Free shipping on orders above ₦50,000</p>
              )}
            </div>

            <div
              className="flex justify-between mt-5 pt-5 font-barlow-cond font-bold"
              style={{ borderTop: "1px solid #F0F0F0", fontSize: "17px" }}
            >
              <span style={{ color: "#1A1A1A" }}>Total</span>
              <span style={{ color: "#5C2D8F" }}>{formatNaira(total)}</span>
            </div>
          </aside>
        </div>
      </div>

      <PageFooter />
    </main>
  );
}
