import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const status = new URL(req.url).searchParams.get("status");

  let query = supabaseAdmin.from("bespoke_orders").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return jsonError(error.message, 500);

  const orders = (data ?? []).map((o) => ({
    ...o,
    style_description: [o.silhouette, o.waist_style, o.pleat_style, o.fabric, o.color]
      .filter(Boolean)
      .join(" · "),
    has_measurements:
      o.measurements &&
      typeof o.measurements === "object" &&
      Object.keys(o.measurements as object).length > 0,
  }));

  return jsonOk({ orders });
}
