"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/components/admin/admin-fetch";
import { formatNaira, shortId } from "@/lib/admin/format";
import { markAdminSeen } from "@/components/admin/admin-sidebar";

type Stats = {
  totalOrders: number;
  ordersToday: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalProducts: number;
  lowStockAlerts: number;
  pendingBespoke: number;
  newsletterSubscribers: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<
    { id: string; customer_name: string; total_amount: number; status: string; created_at: string }[]
  >([]);
  const [recentBespoke, setRecentBespoke] = useState<
    { id: string; customer_name: string; silhouette: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    markAdminSeen();
    adminFetch<{
      stats: Stats;
      recentOrders: typeof recentOrders;
      recentBespoke: typeof recentBespoke;
    }>("/api/admin/dashboard").then(({ data }) => {
      if (data) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setRecentBespoke(data.recentBespoke);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading…</p>;

  const cards = stats
    ? [
        { label: "Total orders", value: stats.totalOrders },
        { label: "Orders today", value: stats.ordersToday },
        { label: "Total revenue", value: formatNaira(stats.totalRevenue) },
        { label: "Revenue this month", value: formatNaira(stats.revenueThisMonth) },
        { label: "Products in catalogue", value: stats.totalProducts },
        { label: "Low stock alerts", value: stats.lowStockAlerts },
        { label: "Bespoke pending", value: stats.pendingBespoke },
        { label: "Newsletter subscribers", value: stats.newsletterSubscribers },
      ]
    : [];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      <div className="admin-stats">
        {cards.map((c) => (
          <div key={c.label} className="admin-card">
            <div className="admin-stat-label">{c.label}</div>
            <div className="admin-stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 style={{ margin: "0 0 12px", fontSize: 15 }}>Last 5 orders</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="clickable" onClick={() => (window.location.href = `/admin/orders/${o.id}`)}>
                    <td>{shortId(o.id)}</td>
                    <td>{o.customer_name}</td>
                    <td>{formatNaira(Number(o.total_amount))}</td>
                    <td>
                      <span className={`admin-status admin-status-${o.status}`}>{o.status}</span>
                    </td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/orders" className="admin-btn" style={{ marginTop: 12 }}>
            View all orders
          </Link>
        </div>

        <div className="admin-card">
          <h2 style={{ margin: "0 0 12px", fontSize: 15 }}>Last 5 bespoke inquiries</h2>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Style</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBespoke.map((o) => (
                  <tr
                    key={o.id}
                    className="clickable"
                    onClick={() => (window.location.href = `/admin/bespoke/${o.id}`)}
                  >
                    <td>{o.customer_name}</td>
                    <td>{o.silhouette}</td>
                    <td>{new Date(o.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/admin/bespoke" className="admin-btn" style={{ marginTop: 12 }}>
            View all bespoke
          </Link>
        </div>
      </div>
    </div>
  );
}
