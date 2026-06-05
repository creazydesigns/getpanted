export function formatNaira(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function sumStock(stockBySize: Record<string, number> | null | undefined): number {
  if (!stockBySize || typeof stockBySize !== "object") return 0;
  return Object.values(stockBySize).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function shortId(id: string, prefix = "ORD"): string {
  return `${prefix}-${id.slice(0, 8).toUpperCase()}`;
}
