"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";
import { SITE_CONTENT_GROUPS } from "@/lib/site-content-defaults";

export default function AdminContentPage() {
  const { toast } = useAdminToast();
  const [content, setContent] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch<{ content: Record<string, string> }>("/api/admin/content").then(({ data }) => {
      if (data?.content) setContent(data.content);
    });
  }, []);

  const set = (key: string, value: string) => setContent((c) => ({ ...c, [key]: value }));

  const save = async () => {
    setSaving(true);
    const { error } = await adminFetch("/api/admin/content", {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
    setSaving(false);
    if (error) toast(error, "error");
    else toast("Site content saved");
  };

  return (
    <div>
      <h1 className="admin-page-title">Site Content</h1>
      <p style={{ color: "#71717a", marginBottom: 20 }}>
        Update homepage, about, collections, and bespoke copy without deploying code.
      </p>

      {Object.entries(SITE_CONTENT_GROUPS).map(([section, fields]) => (
        <div key={section} className="admin-card" style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, margin: "0 0 16px", textTransform: "capitalize" }}>{section}</h2>
          {fields.map((field) => (
            <div key={field.key} className="admin-field">
              <label className="admin-label">{field.label}</label>
              {"textarea" in field && field.textarea ? (
                <textarea
                  className="admin-textarea"
                  value={content[field.key] ?? ""}
                  onChange={(e) => set(field.key, e.target.value)}
                />
              ) : (
                <input
                  className="admin-input"
                  value={content[field.key] ?? ""}
                  onChange={(e) => set(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <button type="button" className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
        {saving ? "Saving…" : "Save all content"}
      </button>
    </div>
  );
}
