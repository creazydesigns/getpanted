"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { PageFooter } from "@/app/components/page-footer";
import { StorefrontHeader } from "@/app/components/storefront-header";
import "@/app/storefront.css";

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
    <section className="hp-section py-16 md:py-20 text-center max-w-lg mx-auto">
      {status === "loading" && (
        <>
          <h1
            className="font-barlow-cond font-bold uppercase"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--hp-ink)" }}
          >
            Confirming payment…
          </h1>
          <p className="hp-body mt-4">Please wait while we verify your Paystack payment.</p>
        </>
      )}
      {status === "success" && (
        <>
          <h1
            className="font-barlow-cond font-bold uppercase"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--hp-accent)" }}
          >
            Payment successful ✓
          </h1>
          <p className="hp-body mt-4">Redirecting to your confirmation…</p>
          {orderId && (
            <p className="hp-body-sm mt-2">
              Order <strong>{orderId.slice(0, 8).toUpperCase()}</strong>
            </p>
          )}
        </>
      )}
      {status === "error" && (
        <>
          <h1
            className="font-barlow-cond font-bold uppercase"
            style={{ fontSize: "clamp(28px, 4vw, 40px)", color: "var(--hp-ink)" }}
          >
            Payment issue
          </h1>
          <p className="hp-body mt-4">
            We could not confirm your payment. If you were charged, contact us with your receipt.
          </p>
          <Link href="/checkout" className="btn-hp-primary inline-block mt-8">
            Return to Checkout
          </Link>
        </>
      )}
    </section>
  );
}

export default function CheckoutCompletePage() {
  return (
    <main className="hp-page font-barlow overflow-x-hidden min-h-screen">
      <StorefrontHeader
        eyebrow="Checkout"
        title="Payment"
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Checkout", href: "/checkout" },
          { label: "Complete" },
        ]}
        narrow
      />
      <Suspense
        fallback={
          <section className="hp-section py-16 text-center">
            <p className="hp-body">Loading…</p>
          </section>
        }
      >
        <CompleteInner />
      </Suspense>
      <PageFooter />
    </main>
  );
}
