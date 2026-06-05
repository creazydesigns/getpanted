import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ email: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { email } = await params;
  const decoded = decodeURIComponent(email);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("customer_email", decoded)
    .order("created_at", { ascending: false });

  if (error) return jsonError(error.message, 500);

  return jsonOk({ orders: data ?? [] });
}
