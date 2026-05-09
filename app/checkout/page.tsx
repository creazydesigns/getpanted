"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useShop } from "../context/shop-context";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function CheckoutPage() {
  const { cartCount, cartSubtotal, placeOrder } = useShop();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const shipping = cartCount > 0 ? 3500 : 0;
  const total = cartSubtotal + shipping;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const order = placeOrder({
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      address: String(formData.get("address") ?? ""),
    });
    setOrderId(order.id);
    setPlaced(true);
  };

  if (cartCount === 0 && !placed) {
    return (
      <main className="min-h-screen bg-[var(--gp-canvas)] px-8 py-10 text-[var(--gp-fg)]">
        <div className="mx-auto flex max-w-[700px] flex-col items-end gap-4">
          <ThemeToggle />
          <div className="w-full rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-8 text-center">
          <h1 className="mb-3 text-3xl font-light">Checkout</h1>
          <p className="mb-6 text-[rgb(var(--gp-fg-rgb) / 0.6)]">Your cart is empty. Add items before checkout.</p>
          <Link href="/cart" className="inline-block bg-[var(--gp-accent)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent-ink)]">
            Go to cart
          </Link>
        </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--gp-canvas)] px-8 py-10 text-[var(--gp-fg)]">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-light">Checkout</h1>
          <ThemeToggle />
        </div>

        {placed ? (
          <section className="rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-8">
            <p className="mb-3 text-xl text-[var(--gp-accent)]">Order placed successfully.</p>
            <p className="mb-6 text-[rgb(var(--gp-fg-rgb) / 0.7)]">
              Thanks for your order. Ref: <span className="text-[var(--gp-accent)]">{orderId ?? "pending"}</span>. We&apos;ll email confirmation and tracking details shortly.
            </p>
            <Link href="/" className="inline-block bg-[var(--gp-accent)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent-ink)]">
              Back to home
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <form onSubmit={onSubmit} className="rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-6">
              <h2 className="mb-4 text-xl">Delivery Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <input required name="firstName" placeholder="First name" className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] bg-transparent px-4 py-3 outline-none" />
                <input required name="lastName" placeholder="Last name" className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] bg-transparent px-4 py-3 outline-none" />
                <input required name="email" type="email" placeholder="Email" className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] bg-transparent px-4 py-3 outline-none md:col-span-2" />
                <input required name="phone" placeholder="Phone" className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] bg-transparent px-4 py-3 outline-none md:col-span-2" />
                <input required name="address" placeholder="Address" className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] bg-transparent px-4 py-3 outline-none md:col-span-2" />
              </div>
              <button type="submit" className="mt-6 bg-[var(--gp-accent)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent-ink)] hover:bg-[var(--gp-accent-hover)]">
                Place order
              </button>
            </form>

            <aside className="h-fit rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-6">
              <h2 className="mb-4 text-xl">Summary</h2>
              <div className="space-y-2 text-sm text-[rgb(var(--gp-fg-rgb) / 0.7)]">
                <p className="flex justify-between"><span>Items ({cartCount})</span><span>{formatNaira(cartSubtotal)}</span></p>
                <p className="flex justify-between"><span>Shipping</span><span>{formatNaira(shipping)}</span></p>
              </div>
              <p className="mt-4 flex justify-between border-t border-[rgb(var(--gp-fg-rgb) / 0.1)] pt-4 text-lg">
                <span>Total</span>
                <span className="text-[var(--gp-accent)]">{formatNaira(total)}</span>
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
