"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useShop } from "../context/shop-context";
import { PageFooter } from "../components/page-footer";

function formatNaira(value: number) {
  return `₦${value.toLocaleString()}`;
}

const inputStyle = {
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
  const { cartCount, cartSubtotal, placeOrder } = useShop();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const shipping = cartCount > 0 ? 3500 : 0;
  const total = cartSubtotal + shipping;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const order = placeOrder({
      firstName: String(data.get("firstName") ?? ""),
      lastName:  String(data.get("lastName")  ?? ""),
      email:     String(data.get("email")     ?? ""),
      phone:     String(data.get("phone")     ?? ""),
      address:   String(data.get("address")   ?? ""),
    });
    setOrderId(order.id);
    setPlaced(true);
  };

  if (cartCount === 0 && !placed) {
    return (
      <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
          <div className="max-w-[700px] mx-auto">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Checkout</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>Your Cart is Empty</h1>
          </div>
        </section>
        <div className="px-5 md:px-12 py-20 text-center">
          <p className="font-barlow mb-8" style={{ fontSize: "15px", color: "#6B6B6B" }}>Add items to your cart before checking out.</p>
          <Link href="/cart" className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80" style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}>
            Go to Cart
          </Link>
        </div>
        <PageFooter />
      </main>
    );
  }

  if (placed) {
    return (
      <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>
        <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
          <div className="max-w-[700px] mx-auto">
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Order Confirmed</p>
            <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>Order Placed!</h1>
          </div>
        </section>
        <div className="px-5 md:px-12 py-16">
          <div className="max-w-[700px] mx-auto" style={{ border: "1px solid #F0F0F0", padding: "48px" }}>
            <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "14px", color: "#5C2D8F" }}>Thank you for your order.</p>
            <p className="font-barlow mb-2" style={{ fontSize: "15px", color: "#6B6B6B", lineHeight: 1.7 }}>
              Your reference: <span className="font-bold" style={{ color: "#1A1A1A" }}>{orderId ?? "pending"}</span>
            </p>
            <p className="font-barlow mb-10" style={{ fontSize: "14px", color: "#6B6B6B" }}>We'll send confirmation and tracking details to your email shortly.</p>
            <Link href="/" className="font-barlow-cond font-bold uppercase text-white inline-block transition-opacity hover:opacity-80" style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "14px 40px", background: "#5C2D8F" }}>
              Back to Home
            </Link>
          </div>
        </div>
        <PageFooter />
      </main>
    );
  }

  return (
    <main className="font-barlow overflow-x-hidden" style={{ background: "#FFFFFF", minHeight: "100vh" }}>

      {/* ── PAGE HEADER ────────────────────────────────────────────────────── */}
      <section className="px-5 md:px-12 pt-28 pb-10" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0F0F0" }}>
        <div className="max-w-[1100px] mx-auto">
          <p className="font-barlow-cond font-bold uppercase mb-3" style={{ fontSize: "11px", letterSpacing: "0.25em", color: "#5C2D8F" }}>Final Step</p>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 600, lineHeight: 0.95, color: "#1A1A1A" }}>Checkout</h1>
        </div>
      </section>

      <div className="px-5 md:px-12 py-14">
        <div className="max-w-[1100px] mx-auto grid gap-8 md:grid-cols-[1.5fr_1fr]">

          {/* Delivery form */}
          <form onSubmit={onSubmit} style={{ border: "1px solid #F0F0F0", padding: "40px" }}>
            <h2 style={{ fontSize: "20px", color: "#1A1A1A", marginBottom: "24px" }}>Delivery Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input required name="firstName" placeholder="First name" style={inputStyle} />
              <input required name="lastName"  placeholder="Last name"  style={inputStyle} />
              <input required name="email" type="email" placeholder="Email address" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
              <input required name="phone" placeholder="Phone number" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
              <input required name="address" placeholder="Delivery address" style={{ ...inputStyle, gridColumn: "1 / -1" }} />
            </div>
            <button
              type="submit"
              className="font-barlow-cond font-bold uppercase text-white mt-8 transition-opacity hover:opacity-80"
              style={{ fontSize: "13px", letterSpacing: "0.15em", padding: "16px 48px", background: "#5C2D8F" }}
            >
              Place Order
            </button>
          </form>

          {/* Summary */}
          <aside className="h-fit" style={{ border: "1px solid #F0F0F0", padding: "32px" }}>
            <h2 style={{ fontSize: "20px", color: "#1A1A1A", marginBottom: "20px" }}>Summary</h2>
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
          </aside>
        </div>
      </div>

      <PageFooter />
    </main>
  );
}
