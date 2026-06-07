import type { CatalogProduct } from "@/lib/catalog";
import type { ProductFilterTag, StoreProduct } from "./types";

export function formatNaira(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

function filterTags(category: string, badge?: string | null): ProductFilterTag[] {
  const tags: ProductFilterTag[] = [];
  const c = category.toLowerCase();

  if (c === "solid" || c === "ready-to-wear" || c.includes("solid") || c.includes("minimal")) {
    tags.push("solid");
  }
  if (badge?.toLowerCase() === "new") {
    tags.push("new");
  }
  if (tags.length === 0) {
    tags.push("solid");
  }
  return tags;
}

export function normalizeStoreProduct(row: Record<string, unknown>): StoreProduct {
  const priceRaw = Number(row.price ?? 0);
  const images = (row.images as string[])?.length
    ? (row.images as string[])
    : row.image
      ? [String(row.image)]
      : [];
  const badge = (row.badge as string | null) ?? undefined;
  const category = String(row.category ?? "ready-to-wear");
  const createdAt = String(row.created_at ?? "");

  return {
    id: String(row.id),
    slug: (row.slug as string | undefined) ?? undefined,
    name: String(row.name ?? ""),
    price: formatNaira(priceRaw),
    priceRaw,
    image: images[0] ?? "",
    images,
    category,
    categories: filterTags(category, badge),
    badge,
    sizes: (row.sizes as string[]) ?? [],
    colors: (row.colors as string[]) ?? ["#1a1a1a"],
    description: String(row.description ?? ""),
    inStock: row.in_stock !== false,
    createdAt,
    sortKey: createdAt ? new Date(createdAt).getTime() : 0,
  };
}

export function catalogToStoreProduct(p: CatalogProduct): StoreProduct {
  const categories: ProductFilterTag[] =
    p.badge?.toLowerCase() === "new" ? ["solid", "new"] : ["solid"];

  return {
    id: p.id,
    name: p.name,
    price: p.price,
    priceRaw: p.priceRaw,
    image: p.image,
    images: p.image ? [p.image] : [],
    category: p.category,
    categories,
    badge: p.badge,
    sizes: p.sizes,
    colors: p.colors,
    description: p.description,
    inStock: true,
    createdAt: "",
    sortKey: Number(p.id) || 0,
  };
}
