"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageFooter } from "@/app/components/page-footer";
import { EE_CONTACT, EE_PREORDER, formatNaira } from "@/lib/executive-edit/constants";
import "../executive-edit.css";
import "@/app/storefront.css";

type OrderSummary = {
  id: string;
  package: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  selections?: { colorName?: string; name?: string; size?: string }[];
};

function CompleteInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<OrderSummary | null>(null);

  useEffect(() => {
    const reference = searchParams.get("reference") ?? searchParams.get("trxref");
    if (!reference) {
      setStatus("error");
      return;
    }

    fetch("/api/executive-edit/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference }),
    })
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error);
        setOrder(json.order);
        setStatus("success");
      })
      .catch(() => setStatus("error"));
  }, [searchParams]);

  return (
    <div className="ee-checkout">
      {status === "loading" && (
        <>
          <p className="ee-eyebrow">Payment</p>
          <h1 className="ee-h2">Confirming your pre-order…</h1>
          <p className="ee-body" style={{ marginTop: 12 }}>
            Please wait while we verify your Paystack payment.
          </p>
        </>
      )}

      {status === "success" && order && (
        <>
          <p className="ee-eyebrow">Confirmed</p>
          <h1 className="ee-h2">Your Executive Edit is secured</h1>
          <p className="ee-body" style={{ marginTop: 12 }}>
            Thank you, {order.customer_name.split(" ")[0]}. Full payment received. We will update
            you by email as production progresses. Delivery from the {EE_PREORDER.deliveryLabel}.
          </p>
          <div className="ee-panel" style={{ marginTop: 24 }}>
            <div className="ee-summary-row">
              <span>Reference</span>
              <span>{order.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="ee-summary-row">
              <span>Package</span>
              <span style={{ textTransform: "capitalize" }}>{order.package}</span>
            </div>
            <div className="ee-summary-row">
              <span>Amount paid</span>
              <span>{formatNaira(Number(order.amount))}</span>
            </div>
            <div className="ee-summary-row">
              <span>Email</span>
              <span>{order.customer_email}</span>
            </div>
            {(order.selections ?? []).map((s, i) => (
              <div className="ee-summary-row" key={i}>
                <span>
                  {i + 1}. {s.colorName ?? s.name}
                  {s.size ? ` · Size ${s.size}` : ""}
                </span>
              </div>
            ))}
          </div>
          <p className="ee-body" style={{ fontSize: 14, marginTop: 16 }}>
            Questions?{" "}
            <a href={EE_CONTACT.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            or Instagram {EE_CONTACT.instagramHandle}.
          </p>
          <Link href="/executive-edit" className="btn-hp-dark" style={{ display: "inline-block", marginTop: 24 }}>
            Back to The Executive Edit
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <p className="ee-eyebrow">Payment</p>
          <h1 className="ee-h2">We could not confirm payment</h1>
          <p className="ee-body" style={{ marginTop: 12 }}>
            If you were charged, contact us on WhatsApp with your Paystack receipt and we will
            sort it out.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link href="/executive-edit/checkout" className="btn-hp-dark">
              Return to checkout
            </Link>
            <a
              href={EE_CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hp-outline"
            >
              WhatsApp us
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default function ExecutiveEditCompletePage() {
  return (
    <main className="ee-page font-barlow overflow-x-hidden min-h-screen">
      <Suspense
        fallback={
          <div className="ee-checkout">
            <p className="ee-body">Loading…</p>
          </div>
        }
      >
        <CompleteInner />
      </Suspense>
      <PageFooter />
    </main>
  );
}
