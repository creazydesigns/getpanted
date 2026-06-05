"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";
import { formatNaira, shortId } from "@/lib/admin/format";
import { ORDER_STATUSES } from "@/lib/admin/constants";
import { StatusBadge } from "@/components/admin/status-badge";

type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, string>;
  items: { name: string; price: number; size: string; quantity: number; image?: string }[];
  total_amount: number;
  shipping_amount?: number;
  status: string;
  tracking_number?: string;
  admin_notes?: string;
  created_at: string;
};

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useAdminToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [status, setStatus] = useState("");
  const [tracking, setTracking] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ order: Order }>(`/api/admin/orders/${id}`).then(({ data }) => {
      if (data?.order) {
        setOrder(data.order);
        setStatus(data.order.status);
        setTracking(data.order.tracking_number ?? "");
        setNotes(data.order.admin_notes ?? "");
      }
    });
  }, [id]);

  const save = async () => {
    setSaving(true);
    const { data, error } = await adminFetch<{ order: Order }>(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        tracking_number: status === "shipped" ? tracking : tracking || null,
        admin_notes: notes,
      }),
    });
    setSaving(false);
    if (error) toast(error, "error");
    else {
      toast("Order updated");
      if (data?.order) setOrder(data.order);
    }
  };

  if (!order) return <p>Loading…</p>;

  const subtotal = (order.items ?? []).reduce(
    (s, i) => s + Number(i.price) * Number(i.quantity),
    0
  );
  const shipping = Number(order.shipping_amount ?? 0);

  return (
    <div>
      <Link href="/admin/orders" className="admin-btn" style={{ marginBottom: 16 }}>
        ← Back to orders
      </Link>
      <h1 className="admin-page-title">
        {shortId(order.id)} · <StatusBadge status={order.status} />
      </h1>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Customer</h2>
          <p>
            <strong>{order.customer_name}</strong>
            <br />
            {order.customer_email}
            <br />
            {order.customer_phone}
          </p>
          <h2 style={{ fontSize: 15, margin: "16px 0 12px" }}>Shipping address</h2>
          <p style={{ whiteSpace: "pre-line" }}>
            {Object.entries(order.shipping_address ?? {})
              .map(([k, v]) => `${k}: ${v}`)
              .join("\n")}
          </p>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Items</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Size</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {(order.items ?? []).map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.size}</td>
                  <td>{item.quantity}</td>
                  <td>{formatNaira(Number(item.price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: 12 }}>
            Subtotal: {formatNaira(subtotal)}
            <br />
            Shipping: {formatNaira(shipping)}
            <br />
            <strong>Total: {formatNaira(Number(order.total_amount))}</strong>
          </p>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Update order</h2>
        <div className="admin-field">
          <label className="admin-label">Status</label>
          <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        {status === "shipped" && (
          <div className="admin-field">
            <label className="admin-label">Tracking number</label>
            <input
              className="admin-input"
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="Courier tracking ID"
            />
          </div>
        )}
        <div className="admin-field">
          <label className="admin-label">Internal admin notes</label>
          <textarea className="admin-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
