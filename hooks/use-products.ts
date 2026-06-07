"use client";

import { useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/products/types";

export function useProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<StoreProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/products/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((d) => setProduct(d.product ?? null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
}
