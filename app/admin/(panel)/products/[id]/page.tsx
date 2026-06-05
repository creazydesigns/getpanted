"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useAdminToast();
  const [initial, setInitial] = useState<ProductFormData | null>(null);

  useEffect(() => {
    adminFetch<{ product: Record<string, unknown> }>(`/api/admin/products/${id}`).then(({ data }) => {
      const p = data?.product;
      if (!p) return;
      setInitial({
        id: p.id as string,
        name: p.name as string,
        slug: (p.slug as string) ?? "",
        description: (p.description as string) ?? "",
        price: Number(p.price),
        original_price: p.original_price ? Number(p.original_price) : null,
        category: (p.category as string) || "ready-to-wear",
        sizes: (p.sizes as string[]) ?? [],
        stock_by_size: (p.stock_by_size as Record<string, number>) ?? {},
        images: (p.images as string[])?.length ? (p.images as string[]) : p.image ? [p.image as string] : [],
        status: (p.status as string) ?? "active",
        badge: (p.badge as string) ?? "",
        colors: (p.colors as string[]) ?? ["#1a1a1a"],
      });
    });
  }, [id]);

  if (!initial) return <p>Loading…</p>;

  return (
    <div>
      <Link href="/admin/products" className="admin-btn" style={{ marginBottom: 16 }}>
        ← Products
      </Link>
      <h1 className="admin-page-title">Edit Product</h1>
      <ProductForm
        initial={initial}
        onSave={async (data) => {
          const { error } = await adminFetch(`/api/admin/products/${id}`, {
            method: "PATCH",
            body: JSON.stringify(data),
          });
          if (error) {
            toast(error, "error");
            return false;
          }
          return true;
        }}
        onDelete={async () => {
          const { error } = await adminFetch(`/api/admin/products/${id}`, { method: "DELETE" });
          if (error) {
            toast(error, "error");
            return false;
          }
          router.push("/admin/products");
          return true;
        }}
      />
    </div>
  );
}
