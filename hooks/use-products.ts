"use client";

import { useEffect, useState } from "react";
import type { StoreProduct } from "@/lib/products/types";

export function useProducts() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const r = await fetch("/api/products");
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          const d = await r.json();
          if (!cancelled) setProducts(d.products ?? []);
          return;
        } catch (err) {
          console.error("[useProducts]", err);
          if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
      if (!cancelled) setProducts([]);
    }

    load().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
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
