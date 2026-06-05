"use client";

import { useState } from "react";
import { slugify } from "@/lib/admin/format";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES, SIZE_OPTIONS } from "@/lib/admin/constants";
import { useAdminToast } from "@/components/admin/admin-toast";

export type ProductFormData = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  sizes: string[];
  stock_by_size: Record<string, number>;
  images: string[];
  status: string;
  badge: string;
  colors: string[];
};

type Props = {
  initial: ProductFormData;
  onSave: (data: ProductFormData) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
};

export function ProductForm({ initial, onSave, onDelete }: Props) {
  const { toast } = useAdminToast();
  const [form, setForm] = useState(initial);
  const [slugManual, setSlugManual] = useState(!!initial.slug);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customSize, setCustomSize] = useState("");

  const set = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleSize = (size: string) => {
    const sizes = form.sizes.includes(size)
      ? form.sizes.filter((s) => s !== size)
      : [...form.sizes, size];
    const stock = { ...form.stock_by_size };
    if (!sizes.includes(size)) delete stock[size];
    else if (stock[size] === undefined) stock[size] = 0;
    setForm((f) => ({ ...f, sizes, stock_by_size: stock }));
  };

  const uploadImage = async (file: File) => {
    if (form.images.length >= 5) {
      toast("Maximum 5 images", "error");
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const json = await res.json();
    setUploading(false);
    if (!res.ok) {
      toast(json.error ?? "Upload failed", "error");
      return;
    }
    set("images", [...form.images, json.url]);
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave({
      ...form,
      slug: form.slug || slugify(form.name),
    });
    setSaving(false);
    if (ok) toast("Product saved");
  };

  return (
    <div className="admin-card" style={{ maxWidth: 720 }}>
      <div className="admin-field">
        <label className="admin-label">Product name</label>
        <input
          className="admin-input"
          value={form.name}
          onChange={(e) => {
            const name = e.target.value;
            set("name", name);
            if (!slugManual) set("slug", slugify(name));
          }}
        />
      </div>
      <div className="admin-field">
        <label className="admin-label">Slug</label>
        <input
          className="admin-input"
          value={form.slug}
          onChange={(e) => {
            setSlugManual(true);
            set("slug", e.target.value);
          }}
        />
      </div>
      <div className="admin-field">
        <label className="admin-label">Description</label>
        <textarea
          className="admin-textarea"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="admin-field">
          <label className="admin-label">Price (₦)</label>
          <input
            type="number"
            className="admin-input"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
          />
        </div>
        <div className="admin-field">
          <label className="admin-label">Compare-at price (₦)</label>
          <input
            type="number"
            className="admin-input"
            value={form.original_price ?? ""}
            onChange={(e) =>
              set("original_price", e.target.value ? Number(e.target.value) : null)
            }
          />
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Category</label>
        <select
          className="admin-select"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="admin-field">
        <label className="admin-label">Available sizes & stock</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
          {SIZE_OPTIONS.map((size) => (
            <label key={size} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <input
                type="checkbox"
                checked={form.sizes.includes(size)}
                onChange={() => toggleSize(size)}
              />
              {size}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="admin-input"
            placeholder="Custom size"
            value={customSize}
            onChange={(e) => setCustomSize(e.target.value)}
          />
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              if (customSize.trim()) {
                toggleSize(customSize.trim().toUpperCase());
                setCustomSize("");
              }
            }}
          >
            Add size
          </button>
        </div>
        {form.sizes.map((size) => (
          <div key={size} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            <span style={{ width: 48 }}>{size}</span>
            <input
              type="number"
              className="admin-input"
              style={{ maxWidth: 100 }}
              min={0}
              value={form.stock_by_size[size] ?? 0}
              onChange={(e) =>
                set("stock_by_size", {
                  ...form.stock_by_size,
                  [size]: Number(e.target.value),
                })
              }
            />
          </div>
        ))}
      </div>
      <div className="admin-field">
        <label className="admin-label">Images (up to 5)</label>
        <input
          type="file"
          accept="image/*"
          disabled={uploading || form.images.length >= 5}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadImage(f);
            e.target.value = "";
          }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
          {form.images.map((url, i) => (
            <div key={url} style={{ position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="admin-thumb" style={{ width: 72, height: 88 }} />
              <button
                type="button"
                className="admin-btn admin-btn-danger"
                style={{ position: "absolute", top: 0, right: 0, padding: "2px 6px", fontSize: 10 }}
                onClick={() => set("images", form.images.filter((_, j) => j !== i))}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="admin-field">
        <label className="admin-label">Status</label>
        <select
          className="admin-select"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
        >
          {PRODUCT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "active" ? "Active" : "Draft"}
            </option>
          ))}
        </select>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save Product"}
        </button>
        {onDelete && (
          <button
            type="button"
            className="admin-btn admin-btn-danger"
            onClick={async () => {
              if (!confirm("Delete this product permanently?")) return;
              const ok = await onDelete();
              if (ok) toast("Product deleted");
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
