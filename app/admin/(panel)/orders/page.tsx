"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/components/admin/admin-fetch";
import { formatNaira, shortId } from "@/lib/admin/format";
import { StatusBadge } from "@/components/admin/status-badge";
import { ORDER_STATUSES } from "@/lib/admin/constants";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: { name: string; quantity: number }[];
  total_amount: number;
  shipping_address: Record<string, string>;
  status: string;
  created_at: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("date_desc");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams({ sort });
    if (status !== "all") params.set("status", status);
    if (q) params.set("q", q);
    adminFetch<{ orders: Order[] }>(`/api/admin/orders?${params}`).then(({ data }) => {
      setOrders(data?.orders ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, [status, sort]);

  return (
    <div>
      <h1 className="admin-page-title">Orders</h1>
      <div className="admin-toolbar">
        <input
          className="admin-input"
          style={{ maxWidth: 220 }}
          placeholder="Search name or ID…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button type="button" className="admin-btn" onClick={load}>
          Search
        </button>
        <select className="admin-select" style={{ width: 160 }} value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className="admin-select" style={{ width: 160 }} value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="date_desc">Newest first</option>
          <option value="date_asc">Oldest first</option>
          <option value="status">By status</option>
        </select>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Total</th>
                <th>Shipping</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/orders/${o.id}`}>{shortId(o.id)}</Link>
                  </td>
                  <td>{o.customer_name}</td>
                  <td>{o.customer_email}</td>
                  <td>{o.customer_phone}</td>
                  <td>
                    {(o.items ?? [])
                      .map((i) => `${i.name} ×${i.quantity}`)
                      .join(", ")
                      .slice(0, 60)}
                  </td>
                  <td>{formatNaira(Number(o.total_amount))}</td>
                  <td>
                    {typeof o.shipping_address === "object"
                      ? [o.shipping_address.city, o.shipping_address.state].filter(Boolean).join(", ")
                      : "—"}
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
