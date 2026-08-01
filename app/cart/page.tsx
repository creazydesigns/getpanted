"use client";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "../context/shop-context";
import { PageFooter } from "../components/page-footer";
import { StorefrontHeader } from "../components/storefront-header";
import "../storefront.css";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function CartPage() {
  const { cartItems, cartCount, cartSubtotal, removeFromCart, updateCartQuantity } = useShop();
  const shipping = cartCount > 0 ? 3500 : 0;
  const total = cartSubtotal + shipping;

  return (
    <main className="hp-page font-barlow overflow-x-hidden" style={{ minHeight: "100vh" }}>
      <StorefrontHeader
        eyebrow="Your Bag"
        title={
          <>
            Your Cart{" "}
            {cartCount > 0 && <span style={{ color: "var(--hp-muted)" }}>({cartCount})</span>}
          </>
        }
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Cart" },
        ]}
        actions={
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase transition-colors hover:text-[var(--hp-accent)]"
            style={{ fontSize: "11px", letterSpacing: "0.14em", color: "var(--hp-muted)" }}
          >
            ← Continue Shopping
          </Link>
        }
      />

      <section className="hp-section py-14 md:py-16">
        <div className="max-w-[1100px] mx-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-24" style={{ borderTop: "1px solid var(--hp-border)" }}>
              <p
                className="font-barlow-cond font-bold uppercase mb-4"
                style={{ fontSize: "20px", color: "var(--hp-muted)" }}
              >
                Your cart is empty
              </p>
              <p className="hp-body mb-8">Add some pieces to get started.</p>
              <Link href="/new-arrivals" className="btn-hp-primary">
                Shop New Arrivals
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
              <section style={{ borderTop: "1px solid var(--hp-border)" }}>
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size ?? "default"}`}
                    className="flex items-center justify-between gap-4"
                    style={{ padding: "24px 0", borderBottom: "1px solid var(--hp-border)" }}
                  >
                    <div className="shrink-0 relative" style={{ width: 80, height: 100, background: "var(--hp-soft)" }}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-top"
                          sizes="80px"
                        />
                      ) : (
                        <div className="hp-placeholder absolute inset-0" style={{ fontSize: "8px" }}>
                          Item
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-barlow-cond font-bold uppercase"
                        style={{ fontSize: "14px", color: "var(--hp-ink)" }}
                      >
                        {item.name}
                      </p>
                      <p className="hp-body-sm mt-1">
                        {item.size ? `Size ${item.size} · ` : ""}
                        {item.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size)}
                        className="font-barlow-cond font-bold flex items-center justify-center transition-colors hover:border-[var(--hp-accent)] hover:text-[var(--hp-accent)]"
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "1px solid var(--hp-border)",
                          color: "var(--hp-muted)",
                          fontSize: "16px",
                        }}
                      >
                        −
                      </button>
                      <span
                        className="font-barlow-cond font-bold text-center"
                        style={{ width: "24px", fontSize: "14px", color: "var(--hp-ink)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size)}
                        className="font-barlow-cond font-bold flex items-center justify-center transition-colors hover:border-[var(--hp-accent)] hover:text-[var(--hp-accent)]"
                        style={{
                          width: "32px",
                          height: "32px",
                          border: "1px solid var(--hp-border)",
                          color: "var(--hp-muted)",
                          fontSize: "16px",
                        }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="font-barlow-cond font-bold uppercase ml-4 transition-colors hover:text-[var(--hp-ink)]"
                        style={{ fontSize: "10px", letterSpacing: "0.14em", color: "var(--hp-muted)" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              <aside
                className="h-fit"
                style={{ border: "1px solid var(--hp-border)", padding: "32px" }}
              >
                <h2
                  className="font-barlow-cond font-bold uppercase mb-5"
                  style={{ fontSize: "16px", letterSpacing: "0.1em", color: "var(--hp-ink)" }}
                >
                  Order Summary
                </h2>
                <div className="space-y-3 hp-body-sm">
                  <div className="flex justify-between">
                    <span>Items ({cartCount})</span>
                    <span>{formatNaira(cartSubtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatNaira(shipping)}</span>
                  </div>
                </div>
                <div
                  className="flex justify-between mt-5 pt-5 font-barlow-cond font-bold"
                  style={{ borderTop: "1px solid var(--hp-border)", fontSize: "16px" }}
                >
                  <span style={{ color: "var(--hp-ink)" }}>Total</span>
                  <span style={{ color: "var(--hp-accent)" }}>{formatNaira(total)}</span>
                </div>
                <Link href="/checkout" className="btn-hp-primary w-full mt-6">
                  Proceed to Checkout
                </Link>
                <Link
                  href="/collections"
                  className="block w-full text-center font-barlow-cond font-bold uppercase mt-3 transition-colors hover:text-[var(--hp-accent)]"
                  style={{ fontSize: "11px", letterSpacing: "0.14em", color: "var(--hp-muted)" }}
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>

      <PageFooter />
    </main>
  );
}
