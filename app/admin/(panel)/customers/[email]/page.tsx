"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch } from "@/components/admin/admin-fetch";
import { formatNaira, shortId } from "@/lib/admin/format";
import { StatusBadge } from "@/components/admin/status-badge";

type Order = {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
};

export default function AdminCustomerDetailPage() {
  const { email } = useParams<{ email: string }>();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    adminFetch<{ orders: Order[] }>(`/api/admin/customers/${email}`).then(({ data }) => {
      setOrders(data?.orders ?? []);
    });
  }, [email]);

  const decoded = decodeURIComponent(email);

  return (
    <div>
      <Link href="/admin/customers" className="admin-btn" style={{ marginBottom: 16 }}>
        ← Customers
      </Link>
      <h1 className="admin-page-title">{decoded}</h1>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Total</th>
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
                <td>{formatNaira(Number(o.total_amount))}</td>
                <td>
                  <StatusBadge status={o.status} />
                </td>
                <td>{new Date(o.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
