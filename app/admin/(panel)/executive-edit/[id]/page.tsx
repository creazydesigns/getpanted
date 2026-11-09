"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";
import { StatusBadge } from "@/components/admin/status-badge";
import { shortId } from "@/lib/admin/format";

const EE_STATUSES = ["pending", "confirmed", "in_production", "shipped", "delivered", "cancelled"];

type Selection = {
  slug?: string;
  name?: string;
  colorName?: string;
  size?: string;
};

type EEOrder = {
  id: string;
  package: string;
  amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: Record<string, string>;
  selections: Selection[];
  customer_notes?: string;
  payment_status: string;
  paystack_reference?: string;
  status: string;
  admin_notes?: string;
  created_at: string;
};

export default function AdminExecutiveEditDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useAdminToast();
  const [order, setOrder] = useState<EEOrder | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminFetch<{ order: EEOrder }>(`/api/admin/executive-edit/${id}`).then(({ data }) => {
      if (data?.order) {
        setOrder(data.order);
        setStatus(data.order.status);
        setNotes(data.order.admin_notes ?? "");
      }
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async () => {
    setSaving(true);
    const { error } = await adminFetch(`/api/admin/executive-edit/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, admin_notes: notes }),
    });
    setSaving(false);
    if (error) toast(error, "error");
    else {
      toast("Updated");
      load();
    }
  };

  if (!order) return <p>Loading…</p>;

  const addr = order.shipping_address ?? {};

  return (
    <div>
      <Link href="/admin/executive-edit" className="admin-btn" style={{ marginBottom: 16 }}>
        ← Executive Edit orders
      </Link>
      <h1 className="admin-page-title">
        {shortId(order.id, "EE")} · <StatusBadge status={status} />
      </h1>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 style={{ fontSize: 15 }}>Customer</h2>
          <p>
            {order.customer_name}
            <br />
            {order.customer_email}
            <br />
            {order.customer_phone}
          </p>
        </div>
        <div className="admin-card">
          <h2 style={{ fontSize: 15 }}>Order</h2>
          <p>
            Package: <span style={{ textTransform: "capitalize" }}>{order.package}</span>
            <br />
            Amount: ₦{Number(order.amount).toLocaleString()}
            <br />
            Payment: <StatusBadge status={order.payment_status} />
            <br />
            Paystack: {order.paystack_reference ?? "—"}
            <br />
            Placed: {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
        <div className="admin-card">
          <h2 style={{ fontSize: 15 }}>Delivery</h2>
          <p>
            {addr.street}
            <br />
            {[addr.city, addr.state, addr.country].filter(Boolean).join(", ")}
          </p>
          {order.customer_notes && (
            <p style={{ marginTop: 8, fontSize: 13 }}>
              Notes: {order.customer_notes}
            </p>
          )}
        </div>
        <div className="admin-card">
          <h2 style={{ fontSize: 15 }}>Selections</h2>
          <ol style={{ margin: 0, paddingLeft: 18 }}>
            {(order.selections ?? []).map((s, i) => (
              <li key={i}>
                {s.colorName ?? s.name ?? s.slug}
                {s.size ? ` · Size ${s.size}` : ""}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15 }}>Admin</h2>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ display: "block", marginTop: 4, width: "100%", maxWidth: 280 }}
          >
            {EE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "block", marginBottom: 8, fontSize: 13 }}>
          Admin notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            style={{ display: "block", marginTop: 4, width: "100%" }}
          />
        </label>
        <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
