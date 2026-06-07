"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AccountHero } from "@/components/account/account-hero";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";
import { formatNaira, shortOrderId } from "@/lib/customer/format";
import "../account.css";

type OrderRow = {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
};

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="account-page font-barlow">
      <Navbar />
      <AccountHero
        eyebrow="Order History"
        title="My Orders"
        backHref="/account"
        backLabel="Account"
      />

      <section className="account-body">
        <div className="account-body-inner">
          {loading ? (
            <p className="account-loading">Loading orders…</p>
          ) : orders.length === 0 ? (
            <div className="account-empty">
              <p>
                No orders yet.{" "}
                <Link href="/collections" className="account-link">
                  Start shopping
                </Link>
              </p>
            </div>
          ) : (
            <div className="account-orders-panel">
              {orders.map((o) => (
                <Link key={o.id} href={`/account/orders/${o.id}`} className="account-order-row">
                  <div>
                    <p className="account-order-id">{shortOrderId(o.id)}</p>
                    <p className="account-order-date">
                      {new Date(o.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p className="account-order-amount">{formatNaira(Number(o.total_amount))}</p>
                    <span className="account-status">{o.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
      <PageFooter />
    </main>
  );
}
