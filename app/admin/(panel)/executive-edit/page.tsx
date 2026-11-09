"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/components/admin/admin-fetch";
import { StatusBadge } from "@/components/admin/status-badge";

type EEOrder = {
  id: string;
  package: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  payment_status: string;
  status: string;
  created_at: string;
  selections?: unknown[];
};

export default function AdminExecutiveEditPage() {
  const [orders, setOrders] = useState<EEOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<{ orders: EEOrder[] }>("/api/admin/executive-edit").then(({ data }) => {
      setOrders(data?.orders ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Executive Edit</h1>
      <p className="admin-page-sub">Pre-orders for The Executive Edit boxes.</p>
      {loading ? (
        <p className="admin-empty">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="admin-empty">No Executive Edit pre-orders yet.</p>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Package</th>
                <th>Amount</th>
                <th>Pieces</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/executive-edit/${o.id}`}>{o.customer_name}</Link>
                    <div style={{ fontSize: 12, color: "#71717a" }}>{o.customer_email}</div>
                  </td>
                  <td style={{ textTransform: "capitalize" }}>{o.package}</td>
                  <td>₦{Number(o.amount).toLocaleString()}</td>
                  <td>{Array.isArray(o.selections) ? o.selections.length : "—"}</td>
                  <td>
                    <StatusBadge status={o.payment_status} />
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>{new Date(o.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
