export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@getpanted.com";

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export const BESPOKE_STATUSES = [
  "new",
  "in_discussion",
  "in_production",
  "completed",
  "cancelled",
] as const;

export const PRODUCT_STATUSES = ["active", "draft"] as const;

export const PRODUCT_CATEGORIES = [
  { value: "ready-to-wear", label: "Ready-to-Wear" },
  { value: "bespoke", label: "Bespoke" },
  { value: "coord", label: "Co-ord" },
] as const;

export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "2XL", "3XL"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type BespokeStatus = (typeof BESPOKE_STATUSES)[number];
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
