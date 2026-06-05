import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";
import { slugify, sumStock } from "@/lib/admin/format";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const { data, error } = await supabaseAdmin.from("products").select("*").eq("id", id).maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Product not found", 404);

  return jsonOk({ product: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const payload: Record<string, unknown> = { ...body };

  if (body.stock_by_size) {
    payload.total_stock = sumStock(body.stock_by_size);
    payload.in_stock = (payload.total_stock as number) > 0;
  }
  if (body.images?.length) {
    payload.image = body.images[0];
  }
  if (body.name && !body.slug) {
    payload.slug = slugify(body.name);
  }
  if (body.status === "draft") payload.in_stock = false;

  delete payload.id;
  delete payload.created_at;

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);

  return jsonOk({ product: data });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id);

  if (error) return jsonError(error.message, 500);

  return jsonOk({ success: true });
}
