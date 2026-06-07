export type ProductFilterTag = "solid" | "new";

export type StoreProduct = {
  id: string;
  slug?: string;
  name: string;
  price: string;
  priceRaw: number;
  image: string;
  images: string[];
  category: string;
  categories: ProductFilterTag[];
  badge?: string;
  sizes: string[];
  colors: string[];
  description: string;
  inStock: boolean;
  createdAt: string;
  sortKey: number;
};
