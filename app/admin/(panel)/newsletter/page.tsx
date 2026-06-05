"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";

type Subscriber = {
  id: string;
  email: string;
  first_name?: string;
  subscribed_at: string;
  source?: string;
};

export default function AdminNewsletterPage() {
  const { toast } = useAdminToast();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const load = () => {
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    adminFetch<{ subscribers: Subscriber[]; total: number }>(`/api/admin/newsletter${params}`).then(
      ({ data }) => {
        setSubscribers(data?.subscribers ?? []);
        setTotal(data?.total ?? 0);
      }
    );
  };

  useEffect(() => {
    load();
  }, []);

  const exportCsv = () => {
    const header = "email,name,subscribed_at,source\n";
    const rows = subscribers
      .map(
        (s) =>
          `"${s.email}","${(s.first_name ?? "").replace(/"/g, '""')}","${s.subscribed_at}","${s.source ?? ""}"`
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `getpanted-subscribers-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const unsubscribe = async (id: string) => {
    if (!confirm("Unsubscribe this email?")) return;
    const { error } = await adminFetch("/api/admin/newsletter", {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    if (error) toast(error, "error");
    else {
      toast("Unsubscribed");
      load();
    }
  };

  const sendBroadcast = async () => {
    if (!confirm(`You are about to email ${total} subscribers. Continue?`)) return;
    setSending(true);
    const { data, error } = await adminFetch<{ sent: number; total: number }>(
      "/api/admin/newsletter",
      {
        method: "POST",
        body: JSON.stringify({ subject, body, confirm: true }),
      }
    );
    setSending(false);
    if (error) toast(error, "error");
    else toast(`Sent to ${data?.sent ?? 0} of ${data?.total ?? 0} subscribers`);
  };

  return (
    <div>
      <h1 className="admin-page-title">Newsletter</h1>
      <p style={{ marginBottom: 20, color: "#71717a" }}>
        <strong>{total}</strong> active subscribers
      </p>

      <div className="admin-toolbar">
        <input
          className="admin-input"
          style={{ maxWidth: 220 }}
          placeholder="Search email…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <button type="button" className="admin-btn" onClick={load}>
          Search
        </button>
        <button type="button" className="admin-btn" onClick={exportCsv}>
          Export CSV
        </button>
      </div>

      <div className="admin-card admin-table-wrap" style={{ marginBottom: 24 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Subscribed</th>
              <th>Source</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s) => (
              <tr key={s.id}>
                <td>{s.email}</td>
                <td>{s.first_name ?? "—"}</td>
                <td>{new Date(s.subscribed_at).toLocaleDateString()}</td>
                <td>{s.source ?? "—"}</td>
                <td>
                  <button type="button" className="admin-btn admin-btn-danger" onClick={() => unsubscribe(s.id)}>
                    Unsubscribe
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-card">
        <h2 style={{ fontSize: 15, margin: "0 0 12px" }}>Send to all subscribers</h2>
        <div className="admin-field">
          <label className="admin-label">Subject</label>
          <input className="admin-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="admin-field">
          <label className="admin-label">Message (plain text)</label>
          <textarea className="admin-textarea" value={body} onChange={(e) => setBody(e.target.value)} rows={8} />
        </div>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={sendBroadcast}
          disabled={sending || !subject || !body}
        >
          {sending ? "Sending…" : `Send to ${total} subscribers`}
        </button>
      </div>
    </div>
  );
}
