"use client";

import { useRouter } from "next/navigation";
import { ProductForm, type ProductFormData } from "@/components/admin/product-form";
import { adminFetch } from "@/components/admin/admin-fetch";
import { useAdminToast } from "@/components/admin/admin-toast";

const empty: ProductFormData = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  original_price: null,
  category: "ready-to-wear",
  sizes: [],
  stock_by_size: {},
  images: [],
  status: "active",
  badge: "",
  colors: ["#1a1a1a"],
};

export default function NewProductPage() {
  const router = useRouter();
  const { toast } = useAdminToast();

  return (
    <div>
      <h1 className="admin-page-title">Add New Product</h1>
      <ProductForm
        initial={empty}
        onSave={async (data) => {
          const { data: res, error } = await adminFetch<{ product: { id: string } }>(
            "/api/admin/products",
            { method: "POST", body: JSON.stringify(data) }
          );
          if (error) {
            toast(error, "error");
            return false;
          }
          router.push(`/admin/products/${res?.product.id}`);
          return true;
        }}
      />
    </div>
  );
}
