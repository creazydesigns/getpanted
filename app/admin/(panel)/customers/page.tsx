"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/components/admin/admin-fetch";
import { formatNaira } from "@/lib/admin/format";

type Customer = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_count: number;
  total_spent: number;
  last_order_at: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    adminFetch<{ customers: Customer[] }>(`/api/admin/customers${params}`).then(({ data }) => {
      setCustomers(data?.customers ?? []);
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h1 className="admin-page-title">Customers</h1>
      <div className="admin-toolbar">
        <input
          className="admin-input"
          style={{ maxWidth: 240 }}
          placeholder="Search name or email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button type="button" className="admin-btn" onClick={load}>
          Search
        </button>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Last order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.customer_email}>
                  <td>
                    <Link href={`/admin/customers/${encodeURIComponent(c.customer_email)}`}>
                      {c.customer_name}
                    </Link>
                  </td>
                  <td>{c.customer_email}</td>
                  <td>{c.customer_phone}</td>
                  <td>{c.order_count}</td>
                  <td>{formatNaira(c.total_spent)}</td>
                  <td>{new Date(c.last_order_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
