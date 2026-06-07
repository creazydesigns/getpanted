"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AccountHero } from "@/components/account/account-hero";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";
import { formatNaira, shortOrderId } from "@/lib/customer/format";
import "../../account.css";

type Order = {
  id: string;
  status: string;
  payment_status: string;
  tracking_number?: string;
  total_amount: number;
  shipping_amount?: number;
  items: { name: string; size: string; quantity: number; price: number }[];
  shipping_address: Record<string, string>;
  created_at: string;
};

export default function AccountOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`/api/account/orders/${id}`).then(async (r) => {
      if (r.ok) {
        const d = await r.json();
        setOrder(d.order);
      }
    });
  }, [id]);

  if (!order) {
    return (
      <main className="account-page font-barlow">
        <Navbar />
        <div className="account-loading" style={{ paddingTop: 140 }}>
          Loading order…
        </div>
      </main>
    );
  }

  const placed = new Date(order.created_at).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="account-page font-barlow">
      <Navbar />
      <AccountHero
        eyebrow="Order Detail"
        title={shortOrderId(order.id)}
        subtitle={`Placed ${placed}`}
        backHref="/account/orders"
        backLabel="My Orders"
      />

      <section className="account-body">
        <div className="account-body-inner">
          <p style={{ marginBottom: 24 }}>
            <span className="account-status">{order.status}</span>{" "}
            <span className="account-status">{order.payment_status}</span>
            {order.tracking_number && (
              <span style={{ marginLeft: 12, fontSize: 14, color: "var(--acc-muted)" }}>
                Tracking: <strong style={{ color: "var(--acc-ink)" }}>{order.tracking_number}</strong>
              </span>
            )}
          </p>

          <div className="account-detail-grid">
            <div className="account-detail-card">
              <h2>Items</h2>
              {(order.items ?? []).map((item, i) => (
                <div key={i} className="account-detail-item">
                  <span>
                    {item.name}
                    <br />
                    <span style={{ fontSize: 12, color: "var(--acc-muted)" }}>
                      Size {item.size} · Qty {item.quantity}
                    </span>
                  </span>
                  <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {formatNaira(item.price)}
                  </span>
                </div>
              ))}
              <p className="account-detail-total">
                Total · {formatNaira(Number(order.total_amount))}
              </p>
            </div>

            <div className="account-detail-card">
              <h2>Shipping Address</h2>
              <p className="account-detail-meta">
                {order.shipping_address?.street}
                <br />
                {order.shipping_address?.city}, {order.shipping_address?.state}
                <br />
                {order.shipping_address?.country}
              </p>
            </div>
          </div>
        </div>
      </section>
      <PageFooter />
    </main>
  );
}
