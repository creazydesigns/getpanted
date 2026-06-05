"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";
import { BESPOKE_STATUSES } from "@/lib/admin/constants";
import { StatusBadge } from "@/components/admin/status-badge";
import { shortId } from "@/lib/admin/format";

type Bespoke = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  silhouette: string;
  waist_style: string;
  pleat_style: string;
  fabric: string;
  color: string;
  measurements: Record<string, string>;
  timeline: string;
  notes?: string;
  status: string;
  admin_notes?: string;
  contacted_at?: string;
  created_at: string;
};

export default function AdminBespokeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useAdminToast();
  const [order, setOrder] = useState<Bespoke | null>(null);
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    adminFetch<{ order: Bespoke }>(`/api/admin/bespoke/${id}`).then(({ data }) => {
      if (data?.order) {
        setOrder(data.order);
        setStatus(data.order.status === "pending" ? "new" : data.order.status);
        setNotes(data.order.admin_notes ?? "");
      }
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  const save = async (extra?: Record<string, unknown>) => {
    setSaving(true);
    const { error } = await adminFetch(`/api/admin/bespoke/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status, admin_notes: notes, ...extra }),
    });
    setSaving(false);
    if (error) toast(error, "error");
    else {
      toast("Updated");
      load();
    }
  };

  if (!order) return <p>Loading…</p>;

  return (
    <div>
      <Link href="/admin/bespoke" className="admin-btn" style={{ marginBottom: 16 }}>
        ← Bespoke orders
      </Link>
      <h1 className="admin-page-title">
        {shortId(order.id, "BSP")} · <StatusBadge status={status} />
      </h1>

      <div className="admin-grid-2">
        <div className="admin-card">
          <h2 style={{ fontSize: 15 }}>Contact</h2>
          <p>
            {order.customer_name}
            <br />
            {order.customer_email}
            <br />
            {order.customer_phone}
          </p>
          {order.contacted_at && (
            <p style={{ fontSize: 12, color: "#71717a" }}>
              First contacted: {new Date(order.contacted_at).toLocaleString()}
            </p>
          )}
        </div>
        <div className="admin-card">
          <h2 style={{ fontSize: 15 }}>Style</h2>
          <p>
            Silhouette: {order.silhouette}
            <br />
            Waist: {order.waist_style}
            <br />
            Pleats: {order.pleat_style}
            <br />
            Fabric: {order.fabric}
            <br />
            Colour: {order.color}
            <br />
            Timeline: {order.timeline}
          </p>
          {order.notes && <p>Notes: {order.notes}</p>}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 15 }}>Measurements</h2>
        <pre style={{ fontSize: 12, whiteSpace: "pre-wrap" }}>
          {JSON.stringify(order.measurements, null, 2)}
        </pre>
      </div>

      <div className="admin-card" style={{ marginTop: 16 }}>
        <div className="admin-field">
          <label className="admin-label">Status</label>
          <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {BESPOKE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label className="admin-label">Internal notes</label>
          <textarea className="admin-textarea" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => save()} disabled={saving}>
            Save
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => save({ mark_contacted: true })}
            disabled={saving}
          >
            Mark as Contacted
          </button>
        </div>
      </div>
    </div>
  );
}
