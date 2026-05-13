"use client";

import Image from "next/image";
import Link from "next/link";
import { useShop } from "../context/shop-context";
import { PageFooter } from "../components/page-footer";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

export default function CartPage() {
  const { cartItems, cartCount, cartSubtotal, removeFromCart, updateCartQuantity } = useShop();
  const shipping = cartCount > 0 ? 3500 : 0;
  const total = cartSubtotal + shipping;

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1100px] mx-auto flex items-end justify-between gap-4">
          <div>
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Your Bag</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>
              Your Cart {cartCount > 0 && <span style={{ color: "#6B6B6B" }}>({cartCount})</span>}
            </h1>
          </div>
          <Link
            href="/collections"
            className="font-barlow-cond font-bold uppercase transition-colors hover:text-[#5C2D8F]"
            style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}
          >
            ← Continue Shopping
          </Link>
        </div>
      </section>

      <div className="px-5 md:px-12 py-14" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1100px] mx-auto">

          {cartItems.length === 0 ? (
            <div className="text-center py-24" style={{ borderTop: "1px solid #F0F0F0" }}>
              <p className="font-barlow-cond font-bold uppercase mb-4" style={{ fontSize: "20px", color: "#6B6B6B" }}>Your cart is empty</p>
              <p className="font-barlow mb-8" style={{ fontSize: "14px", color: "#6B6B6B" }}>Add some pieces to get started.</p>
              <Link
                href="/new-arrivals"
                className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80"
                style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}
              >
                Shop New Arrivals
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-[1.5fr_1fr]">
              {/* Cart items */}
              <section style={{ border: "1px solid #F0F0F0" }}>
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.size ?? "default"}`}
                    className="flex items-center justify-between gap-4"
                    style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0" }}
                  >
                    {/* Product image */}
                    <div className="shrink-0" style={{ background: "#F7F7F7" }}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={80}
                          height={100}
                          className="object-cover object-top"
                        />
                      ) : (
                        <div style={{ width: 80, height: 100, background: "#F0F0F0" }} />
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-barlow-cond font-bold uppercase" style={{ fontSize: "14px", color: "#1A1A1A" }}>{item.name}</p>
                      <p className="font-barlow mt-1" style={{ fontSize: "13px", color: "#6B6B6B" }}>
                        {item.size ? `Size ${item.size} · ` : ""}{item.price}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size)}
                        className="font-barlow-cond font-bold flex items-center justify-center transition-colors hover:border-[#5C2D8F] hover:text-[#5C2D8F]"
                        style={{ width: "32px", height: "32px", border: "1px solid #E0E0E0", color: "#6B6B6B", fontSize: "16px" }}
                      >
                        −
                      </button>
                      <span className="font-barlow-cond font-bold text-center" style={{ width: "24px", fontSize: "14px", color: "#1A1A1A" }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size)}
                        className="font-barlow-cond font-bold flex items-center justify-center transition-colors hover:border-[#5C2D8F] hover:text-[#5C2D8F]"
                        style={{ width: "32px", height: "32px", border: "1px solid #E0E0E0", color: "#6B6B6B", fontSize: "16px" }}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="font-barlow-cond font-bold uppercase ml-4 transition-colors hover:text-[#1A1A1A]"
                        style={{ fontSize: "10px", letterSpacing: "0.14em", color: "#6B6B6B" }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </section>

              {/* Order summary */}
              <aside className="h-fit" style={{ border: "1px solid #F0F0F0", padding: "32px" }}>
                <h2 style={{ fontSize: "20px", color: "#1A1A1A", marginBottom: "20px" }}>Order Summary</h2>
                <div className="space-y-3 font-barlow" style={{ fontSize: "14px", color: "#6B6B6B" }}>
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
                  style={{ borderTop: "1px solid #F0F0F0", fontSize: "16px" }}
                >
                  <span style={{ color: "#1A1A1A" }}>Total</span>
                  <span style={{ color: "#5C2D8F" }}>{formatNaira(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="block w-full text-center font-barlow-cond font-bold uppercase text-white mt-6 transition-opacity hover:opacity-80"
                  style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px", background: "#5C2D8F" }}
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/collections"
                  className="block w-full text-center font-barlow-cond font-bold uppercase mt-3 transition-colors hover:text-[#5C2D8F]"
                  style={{ fontSize: "11px", letterSpacing: "0.14em", color: "#6B6B6B" }}
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </div>

      <PageFooter />
    </main>
  );
}
