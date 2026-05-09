"use client";

import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useShop } from "../context/shop-context";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function CartPage() {
  const { cartItems, cartCount, cartSubtotal, removeFromCart, updateCartQuantity } = useShop();
  const shipping = cartCount > 0 ? 3500 : 0;
  const total = cartSubtotal + shipping;

  return (
    <main className="min-h-screen bg-[var(--gp-canvas)] text-[var(--gp-fg)] px-8 py-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-light">Your Cart</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/collections" className="text-[var(--gp-accent)] hover:text-[var(--gp-accent-hover)]">
              Continue shopping
            </Link>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <section className="rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-10 text-center">
            <p className="mb-4 text-lg">Your cart is empty.</p>
            <Link href="/new-arrivals" className="inline-block bg-[var(--gp-accent)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent-ink)]">
              Shop new arrivals
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
            <section className="rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)]">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size ?? "default"}`} className="flex items-center justify-between border-b border-[rgb(var(--gp-fg-rgb) / 0.08)] p-5 last:border-b-0">
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-sm text-[rgb(var(--gp-fg-rgb) / 0.5)]">
                      {item.size ? `Size ${item.size} · ` : ""}
                      {item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size)}
                      className="h-8 w-8 border border-[rgb(var(--gp-fg-rgb) / 0.2)]"
                    >
                      -
                    </button>
                    <span className="w-6 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size)}
                      className="h-8 w-8 border border-[rgb(var(--gp-fg-rgb) / 0.2)]"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="ml-4 text-sm text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </section>

            <aside className="h-fit rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-6">
              <h2 className="mb-4 text-xl">Order Summary</h2>
              <div className="space-y-2 text-sm text-[rgb(var(--gp-fg-rgb) / 0.7)]">
                <p className="flex justify-between"><span>Items ({cartCount})</span><span>{formatNaira(cartSubtotal)}</span></p>
                <p className="flex justify-between"><span>Shipping</span><span>{formatNaira(shipping)}</span></p>
              </div>
              <p className="mt-4 flex justify-between border-t border-[rgb(var(--gp-fg-rgb) / 0.1)] pt-4 text-lg">
                <span>Total</span>
                <span className="text-[var(--gp-accent)]">{formatNaira(total)}</span>
              </p>
              <Link href="/checkout" className="mt-6 block bg-[var(--gp-accent)] px-5 py-3 text-center text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent-ink)] hover:bg-[var(--gp-accent-hover)]">
                Proceed to checkout
              </Link>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
