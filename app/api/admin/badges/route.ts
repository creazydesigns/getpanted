import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const since = new URL(req.url).searchParams.get("since");
  if (!since) return jsonOk({ newOrders: 0, newBespoke: 0 });

  const [ordersRes, bespokeRes] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gt("created_at", since),
    supabaseAdmin
      .from("bespoke_orders")
      .select("id", { count: "exact", head: true })
      .gt("created_at", since),
  ]);

  if (ordersRes.error) return jsonError(ordersRes.error.message, 500);

  return jsonOk({
    newOrders: ordersRes.count ?? 0,
    newBespoke: bespokeRes.count ?? 0,
  });
}
