import { CATALOG } from "@/lib/catalog";
import { supabaseAdmin } from "@/lib/supabase";
import { catalogToStoreProduct, normalizeStoreProduct } from "./normalize";
import type { StoreProduct } from "./types";

function staticFallback(): StoreProduct[] {
  return CATALOG.map(catalogToStoreProduct);
}

function isStorefrontActive(row: Record<string, unknown>): boolean {
  const status = String(row.status ?? "active").toLowerCase();
  return status === "active";
}

export async function fetchStoreProducts(): Promise<StoreProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[products/fetch]", error.message);
    return staticFallback();
  }

  const active = (data ?? []).filter((row) => isStorefrontActive(row as Record<string, unknown>));

  if (!active.length) {
    return staticFallback();
  }

  return active.map((row) => normalizeStoreProduct(row as Record<string, unknown>));
}

export async function fetchStoreProductById(idOrSlug: string): Promise<StoreProduct | null> {
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);

  let query = supabaseAdmin.from("products").select("*");

  if (isUuid) {
    query = query.eq("id", idOrSlug);
  } else {
    query = query.eq("slug", idOrSlug);
  }

  const { data, error } = await query.maybeSingle();

  if (!error && data && isStorefrontActive(data as Record<string, unknown>)) {
    return normalizeStoreProduct(data as Record<string, unknown>);
  }

  const fallback = staticFallback().find((p) => p.id === idOrSlug);
  return fallback ?? null;
}

export async function fetchStoreProductCatalog(): Promise<StoreProduct[]> {
  return fetchStoreProducts();
}
