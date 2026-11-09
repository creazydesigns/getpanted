import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const status = new URL(req.url).searchParams.get("status");
  const payment = new URL(req.url).searchParams.get("payment_status");

  let query = supabaseAdmin
    .from("executive_edit_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (payment && payment !== "all") query = query.eq("payment_status", payment);

  const { data, error } = await query;
  if (error) return jsonError(error.message, 500);

  return jsonOk({ orders: data ?? [] });
}
