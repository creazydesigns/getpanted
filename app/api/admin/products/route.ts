import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";
import { slugify, sumStock } from "@/lib/admin/format";

function normalizeProduct(row: Record<string, unknown>) {
  const stockBySize = (row.stock_by_size as Record<string, number>) ?? {};
  const total =
    typeof row.total_stock === "number" && row.total_stock > 0
      ? row.total_stock
      : sumStock(stockBySize);
  const images = (row.images as string[])?.length
    ? (row.images as string[])
    : row.image
      ? [row.image as string]
      : [];

  return { ...row, stock_by_size: stockBySize, total_stock: total, images } as Record<string, unknown> & {
    name: string;
    stock_by_size: Record<string, number>;
    total_stock: number;
    images: string[];
  };
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim().toLowerCase();

  let query = supabaseAdmin.from("products").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return jsonError(error.message, 500);

  let products = (data ?? []).map((p) => normalizeProduct(p as Record<string, unknown>));
  if (q) {
    products = products.filter((p) => p.name?.toLowerCase().includes(q));
  }

  return jsonOk({ products });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const body = await req.json();
  const stockBySize = (body.stock_by_size as Record<string, number>) ?? {};
  const totalStock = sumStock(stockBySize);
  const images: string[] = body.images ?? (body.image ? [body.image] : []);
  const slug = body.slug?.trim() || slugify(body.name ?? "product");

  const row = {
    name: body.name,
    slug,
    description: body.description ?? "",
    price: Number(body.price),
    original_price: body.original_price ? Number(body.original_price) : null,
    category: body.category ?? "ready-to-wear",
    badge: body.badge ?? null,
    sizes: body.sizes ?? [],
    colors: body.colors ?? ["#1a1a1a"],
    image: images[0] ?? "",
    images,
    stock_by_size: stockBySize,
    total_stock: totalStock,
    in_stock: totalStock > 0,
    status: body.status ?? "active",
  };

  const { data, error } = await supabaseAdmin.from("products").insert(row).select("*").single();

  if (error) return jsonError(error.message, 500);

  return jsonOk({ product: normalizeProduct(data as Record<string, unknown>) }, 201);
}
