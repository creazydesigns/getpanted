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
    .from("executive_edit_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return jsonError(error.message, 500);
  if (!data) return jsonError("Not found", 404);

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
  const payload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.status !== undefined) payload.status = body.status;
  if (body.admin_notes !== undefined) payload.admin_notes = body.admin_notes;
  if (body.payment_status !== undefined) payload.payment_status = body.payment_status;

  const { data, error } = await supabaseAdmin
    .from("executive_edit_orders")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return jsonError(error.message, 500);

  return jsonOk({ order: data });
}
