import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const q = searchParams.get("q")?.trim().toLowerCase();
  const sort = searchParams.get("sort") ?? "date_desc";

  let query = supabaseAdmin.from("orders").select("*");

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (sort === "date_asc") query = query.order("created_at", { ascending: true });
  else if (sort === "status") query = query.order("status").order("created_at", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) return jsonError(error.message, 500);

  let rows = data ?? [];
  if (q) {
    rows = rows.filter(
      (o) =>
        o.customer_name?.toLowerCase().includes(q) ||
        o.id?.toLowerCase().includes(q) ||
        o.customer_email?.toLowerCase().includes(q)
    );
  }

  return jsonOk({ orders: rows });
}
