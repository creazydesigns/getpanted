import { supabaseAdmin } from "@/lib/supabase";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("customer_name, customer_email, customer_phone, total_amount, created_at")
    .order("created_at", { ascending: false });

  if (error) return jsonError(error.message, 500);

  const map = new Map<
    string,
    {
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      order_count: number;
      total_spent: number;
      last_order_at: string;
    }
  >();

  for (const o of data ?? []) {
    const email = o.customer_email?.toLowerCase();
    if (!email) continue;
    const existing = map.get(email);
    const amount = Number(o.total_amount ?? 0);
    if (!existing) {
      map.set(email, {
        customer_name: o.customer_name,
        customer_email: o.customer_email,
        customer_phone: o.customer_phone ?? "",
        order_count: 1,
        total_spent: amount,
        last_order_at: o.created_at,
      });
    } else {
      existing.order_count += 1;
      existing.total_spent += amount;
      if (new Date(o.created_at) > new Date(existing.last_order_at)) {
        existing.last_order_at = o.created_at;
        existing.customer_name = o.customer_name;
        existing.customer_phone = o.customer_phone ?? existing.customer_phone;
      }
    }
  }

  let customers = Array.from(map.values());
  if (q) {
    customers = customers.filter(
      (c) =>
        c.customer_name?.toLowerCase().includes(q) ||
        c.customer_email?.toLowerCase().includes(q)
    );
  }

  customers.sort(
    (a, b) => new Date(b.last_order_at).getTime() - new Date(a.last_order_at).getTime()
  );

  return jsonOk({ customers });
}
