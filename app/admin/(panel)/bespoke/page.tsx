"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/components/admin/admin-fetch";
import { StatusBadge } from "@/components/admin/status-badge";

type Bespoke = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  style_description: string;
  has_measurements: boolean;
  status: string;
  created_at: string;
};

export default function AdminBespokePage() {
  const [orders, setOrders] = useState<Bespoke[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<{ orders: Bespoke[] }>("/api/admin/bespoke").then(({ data }) => {
      setOrders(data?.orders ?? []);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Bespoke Orders</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Style</th>
                <th>Measurements</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/bespoke/${o.id}`}>{o.customer_name}</Link>
                  </td>
                  <td>{o.customer_email}</td>
                  <td>{o.customer_phone}</td>
                  <td>{o.style_description}</td>
                  <td>{o.has_measurements ? "Yes" : "No"}</td>
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
