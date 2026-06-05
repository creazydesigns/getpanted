import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";
import { sumStock } from "@/lib/admin/format";

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    ordersRes,
    ordersTodayRes,
    productsRes,
    bespokeRes,
    subscribersRes,
    recentOrdersRes,
    recentBespokeRes,
  ] = await Promise.all([
    supabaseAdmin.from("orders").select("total_amount, created_at"),
    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", startOfDay.toISOString()),
    supabaseAdmin.from("products").select("*"),
    supabaseAdmin
      .from("bespoke_orders")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "in_discussion", "in_production", "pending"]),
    supabaseAdmin
      .from("newsletter_subscribers")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabaseAdmin
      .from("orders")
      .select("id, customer_name, total_amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabaseAdmin
      .from("bespoke_orders")
      .select("id, customer_name, silhouette, waist_style, pleat_style, created_at, status")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const orders = ordersRes.data ?? [];
  const totalRevenue = orders.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);
  const revenueThisMonth = orders
    .filter((o) => new Date(o.created_at) >= startOfMonth)
    .reduce((s, o) => s + Number(o.total_amount ?? 0), 0);

  const products = productsRes.data ?? [];
  let lowStock = 0;
  for (const p of products) {
    const stock =
      typeof p.total_stock === "number"
        ? p.total_stock
        : sumStock(p.stock_by_size as Record<string, number>);
    if (stock <= 3) lowStock++;
  }

  if (ordersRes.error) return jsonError(ordersRes.error.message, 500);

  return jsonOk({
    stats: {
      totalOrders: orders.length,
      ordersToday: ordersTodayRes.count ?? 0,
      totalRevenue,
      revenueThisMonth,
      totalProducts: products.length,
      lowStockAlerts: lowStock,
      pendingBespoke: bespokeRes.count ?? 0,
      newsletterSubscribers: subscribersRes.count ?? 0,
    },
    recentOrders: recentOrdersRes.data ?? [],
    recentBespoke: recentBespokeRes.data ?? [],
  });
}
