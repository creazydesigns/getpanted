"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";

function CompleteInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    if (!reference) {
      setStatus("error");
      return;
    }

    fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error);
        const firstName = json.order?.customer_name?.split(" ")[0] ?? "Customer";
        setOrderId(json.order?.id ?? "");
        clearCart();

        if (!json.alreadyPaid) {
          fetch("/api/send-order-confirmation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerEmail: json.order.customer_email,
              customerName: json.order.customer_name,
              orderId: json.order.id,
              items: (json.order.items ?? []).map(
                (i: { name: string; size: string; quantity: number; price: number }) => ({
                  name: i.name,
                  size: i.size,
                  quantity: i.quantity,
                  price: `₦${Number(i.price).toLocaleString()}`,
                })
              ),
              totalAmount: `₦${Number(json.order.total_amount).toLocaleString()}`,
              shippingAddress: json.order.shipping_address,
            }),
          }).catch(() => {});
        }

        setStatus("success");
        setTimeout(() => {
          router.replace(
            `/order-confirmation?id=${json.order.id}&name=${encodeURIComponent(firstName)}`
          );
        }, 1500);
      })
      .catch(() => setStatus("error"));
  }, [searchParams, clearCart, router]);

  return (
    <section className="px-5 md:px-12 pt-28 pb-20 text-center max-w-lg mx-auto">
      {status === "loading" && (
        <>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Confirming payment…</h1>
          <p style={{ color: "#6b6b6b", marginTop: 12 }}>Please wait while we verify your Paystack payment.</p>
        </>
      )}
      {status === "success" && (
        <>
          <h1 style={{ fontSize: 28, fontWeight: 600, color: "#5C2D8F" }}>Payment successful ✓</h1>
          <p style={{ color: "#6b6b6b", marginTop: 12 }}>Redirecting to your confirmation…</p>
          {orderId && (
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Order <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
        </>
      )}
      {status === "error" && (
        <>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Payment issue</h1>
          <p style={{ color: "#6b6b6b", marginTop: 12 }}>
            We could not confirm your payment. If you were charged, contact us with your receipt.
          </p>
          <Link
            href="/checkout"
            className="inline-block mt-8 font-barlow-cond font-bold uppercase text-white"
            style={{ padding: "14px 32px", background: "#5C2D8F", fontSize: 13, letterSpacing: "0.12em" }}
          >
            Return to Checkout
          </Link>
        </>
      )}
    </section>
  );
}

export default function CheckoutCompletePage() {
  return (
    <main className="font-barlow min-h-screen" style={{ background: "#fff" }}>
      <Navbar />
      <Suspense fallback={<section className="pt-28 text-center">Loading…</section>}>
        <CompleteInner />
      </Suspense>
      <PageFooter />
    </main>
  );
}
