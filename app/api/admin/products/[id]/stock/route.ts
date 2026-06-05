import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";
import { sumStock } from "@/lib/admin/format";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const { total_stock, stock_by_size } = await req.json();

  const payload: Record<string, unknown> = {};

  if (stock_by_size !== undefined) {
    payload.stock_by_size = stock_by_size;
    payload.total_stock = sumStock(stock_by_size);
  } else if (total_stock !== undefined) {
    payload.total_stock = Number(total_stock);
  }

  payload.in_stock = (payload.total_stock as number) > 0;

  const { data, error } = await supabaseAdmin
    .from("products")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);

  return jsonOk({ product: data });
}
