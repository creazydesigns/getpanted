import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Order not found", 404);

  return jsonOk({ order: data });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await req.json();
  const payload: Record<string, unknown> = {};

  if (body.status !== undefined) payload.status = body.status;
  if (body.tracking_number !== undefined) payload.tracking_number = body.tracking_number;
  if (body.admin_notes !== undefined) payload.admin_notes = body.admin_notes;
  if (body.shipping_amount !== undefined) payload.shipping_amount = body.shipping_amount;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);

  return jsonOk({ order: data });
}
