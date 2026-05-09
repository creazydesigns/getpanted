"use client";

import Link from "next/link";
import { ThemeToggle } from "../components/theme-toggle";
import { useShop } from "../context/shop-context";

export default function WishlistPage() {
  const { wishlistItems, toggleWishlist, addToCart } = useShop();

  return (
    <main className="min-h-screen bg-[var(--gp-canvas)] text-[var(--gp-fg)] px-8 py-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-light">Your Wishlist</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/collections" className="text-[var(--gp-accent)] hover:text-[var(--gp-accent-hover)]">
              Browse collections
            </Link>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          <section className="rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-10 text-center">
            <p className="mb-4 text-lg">No saved items yet.</p>
            <Link href="/new-arrivals" className="inline-block bg-[var(--gp-accent)] px-6 py-3 text-[11px] uppercase tracking-[0.14em] text-[var(--gp-accent-ink)]">
              Explore new arrivals
            </Link>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {wishlistItems.map((item) => (
              <article key={item.id} className="rounded border border-[rgb(var(--gp-fg-rgb) / 0.1)] p-5">
                <h2 className="mb-1 text-xl">{item.name}</h2>
                <p className="mb-4 text-sm text-[var(--gp-accent)]">{item.price}</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="bg-[var(--gp-accent)] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[var(--gp-accent-ink)] hover:bg-[var(--gp-accent-hover)]"
                  >
                    Add to bag
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(item)}
                    className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[rgb(var(--gp-fg-rgb) / 0.7)] hover:border-[var(--gp-accent)] hover:text-[var(--gp-accent)]"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
