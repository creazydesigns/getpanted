"use client";

import Link from "next/link";
import { useShop } from "../context/shop-context";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export function ToastStack() {
  const { toasts, dismissToast } = useShop();

  return (
    <div className="fixed right-4 top-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center justify-between border border-[rgb(var(--gp-fg-rgb) / 0.18)] bg-[var(--gp-elevated)] px-4 py-3 text-sm text-[var(--gp-fg)] shadow-lg"
        >
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="ml-3 text-[rgb(var(--gp-fg-rgb) / 0.65)] hover:text-[var(--gp-accent)]"
            aria-label="Dismiss notification"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

export function MiniCartDrawer() {
  const {
    miniCartOpen,
    closeMiniCart,
    cartItems,
    cartCount,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
  } = useShop();

  if (!miniCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[95]">
      <button
        type="button"
        onClick={closeMiniCart}
        className="absolute inset-0 bg-black/55"
        aria-label="Close mini cart overlay"
      />
      <aside className="absolute right-0 top-0 h-full w-[min(92vw,420px)] border-l border-[rgb(var(--gp-fg-rgb) / 0.12)] bg-[var(--gp-canvas)] p-5 text-[var(--gp-fg)]">
        <div className="mb-4 flex items-center justify-between border-b border-[rgb(var(--gp-fg-rgb) / 0.1)] pb-4">
          <p className="text-lg">Cart ({cartCount})</p>
          <button type="button" onClick={closeMiniCart} className="text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)]">
            Close
          </button>
        </div>

        <div className="max-h-[62vh] space-y-4 overflow-auto pr-1">
          {cartItems.length === 0 ? (
            <p className="text-sm text-[rgb(var(--gp-fg-rgb) / 0.6)]">No items in your cart yet.</p>
          ) : (
            cartItems.map((item) => (
              <article
                key={`${item.id}-${item.size ?? "default"}`}
                className="border border-[rgb(var(--gp-fg-rgb) / 0.08)] p-3"
              >
                <p className="text-sm">{item.name}</p>
                <p className="mb-2 text-xs text-[rgb(var(--gp-fg-rgb) / 0.55)]">
                  {item.size ? `Size ${item.size} · ` : ""}
                  {item.price}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size)}
                    className="h-7 w-7 border border-[rgb(var(--gp-fg-rgb) / 0.2)] text-xs"
                  >
                    -
                  </button>
                  <span className="w-5 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size)}
                    className="h-7 w-7 border border-[rgb(var(--gp-fg-rgb) / 0.2)] text-xs"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="ml-auto text-xs text-[rgb(var(--gp-fg-rgb) / 0.6)] hover:text-[var(--gp-accent)]"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-5 border-t border-[rgb(var(--gp-fg-rgb) / 0.1)] pt-4">
          <p className="mb-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <span className="text-[var(--gp-accent)]">{formatNaira(cartSubtotal)}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/cart"
              onClick={closeMiniCart}
              className="border border-[rgb(var(--gp-fg-rgb) / 0.2)] px-3 py-2 text-center text-[10px] uppercase tracking-[0.12em] text-[rgb(var(--gp-fg-rgb) / 0.75)]"
            >
              View cart
            </Link>
            <Link
              href="/checkout"
              onClick={closeMiniCart}
              className="bg-[var(--gp-accent)] px-3 py-2 text-center text-[10px] uppercase tracking-[0.12em] text-[var(--gp-accent-ink)]"
            >
              Checkout
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}
