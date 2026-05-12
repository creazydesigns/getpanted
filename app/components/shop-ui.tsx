"use client";

import Link from "next/link";
import { useShop } from "../context/shop-context";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export function ToastStack() {
  const { toasts, dismissToast } = useShop();

  return (
    <div className="fixed right-4 top-20 z-[100] flex w-[min(92vw,360px)] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: "#1A1A1A",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#FFFFFF",
            fontSize: "13px",
            fontFamily: "'Barlow', sans-serif",
          }}
        >
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="ml-3 transition-colors hover:text-[#8B52CC]"
            style={{ color: "rgba(255,255,255,0.55)" }}
            aria-label="Dismiss notification"
          >
            ✕
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
      {/* Backdrop */}
      <button
        type="button"
        onClick={closeMiniCart}
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.35)" }}
        aria-label="Close cart"
      />

      {/* Drawer */}
      <aside
        className="absolute right-0 top-0 h-full flex flex-col"
        style={{
          width: "min(92vw, 400px)",
          background: "#FFFFFF",
          borderLeft: "1px solid #F0F0F0",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #F0F0F0" }}
        >
          <p
            className="font-barlow-cond font-bold uppercase"
            style={{ fontSize: "14px", letterSpacing: "0.15em", color: "#1A1A1A" }}
          >
            Cart ({cartCount})
          </p>
          <button
            type="button"
            onClick={closeMiniCart}
            className="font-barlow-cond font-bold uppercase transition-colors hover:text-[#5C2D8F]"
            style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}
          >
            Close
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ gap: "0" }}>
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#E0E0E0" strokeWidth="1.5" className="mb-4">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p
                className="font-barlow-cond font-bold uppercase"
                style={{ fontSize: "13px", letterSpacing: "0.14em", color: "#6B6B6B" }}
              >
                Your cart is empty
              </p>
              <Link
                href="/collections"
                onClick={closeMiniCart}
                className="font-barlow-cond font-bold uppercase text-white mt-6 inline-block transition-opacity hover:opacity-80"
                style={{ fontSize: "11px", letterSpacing: "0.14em", padding: "12px 28px", background: "#5C2D8F" }}
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            <div className="space-y-0">
              {cartItems.map((item) => (
                <article
                  key={`${item.id}-${item.size ?? "default"}`}
                  className="py-4"
                  style={{ borderBottom: "1px solid #F0F0F0" }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p
                        className="font-barlow-cond font-bold uppercase"
                        style={{ fontSize: "13px", color: "#1A1A1A", letterSpacing: "0.05em" }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="font-barlow mt-1"
                        style={{ fontSize: "12px", color: "#6B6B6B" }}
                      >
                        {item.size ? `Size ${item.size} · ` : ""}{item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.size)}
                      className="font-barlow-cond font-bold uppercase transition-colors hover:text-[#1A1A1A] mt-0.5"
                      style={{ fontSize: "10px", letterSpacing: "0.12em", color: "#6B6B6B" }}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size)}
                      className="flex items-center justify-center transition-colors hover:border-[#5C2D8F] hover:text-[#5C2D8F]"
                      style={{ width: "28px", height: "28px", border: "1px solid #E0E0E0", color: "#1A1A1A", fontSize: "14px" }}
                    >
                      −
                    </button>
                    <span
                      className="font-barlow-cond font-bold text-center"
                      style={{ width: "24px", fontSize: "13px", color: "#1A1A1A" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size)}
                      className="flex items-center justify-center transition-colors hover:border-[#5C2D8F] hover:text-[#5C2D8F]"
                      style={{ width: "28px", height: "28px", border: "1px solid #E0E0E0", color: "#1A1A1A", fontSize: "14px" }}
                    >
                      +
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-5" style={{ borderTop: "1px solid #F0F0F0" }}>
            <div
              className="flex justify-between items-center mb-5"
            >
              <span
                className="font-barlow-cond font-bold uppercase"
                style={{ fontSize: "11px", letterSpacing: "0.16em", color: "#6B6B6B" }}
              >
                Subtotal
              </span>
              <span
                className="font-barlow-cond font-bold"
                style={{ fontSize: "16px", color: "#5C2D8F" }}
              >
                {formatNaira(cartSubtotal)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/cart"
                onClick={closeMiniCart}
                className="font-barlow-cond font-bold uppercase text-center transition-all hover:bg-[#1A1A1A] hover:text-white"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  padding: "13px",
                  border: "1px solid #1A1A1A",
                  color: "#1A1A1A",
                }}
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={closeMiniCart}
                className="font-barlow-cond font-bold uppercase text-center text-white transition-opacity hover:opacity-80"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  padding: "13px",
                  background: "#5C2D8F",
                }}
              >
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
