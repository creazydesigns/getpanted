import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let items: { id: number | string; name: string; price: string; image?: string }[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body.items)) items = body.items;
  } catch {
    /* empty body ok — fetch server wishlist only */
  }

  if (items.length > 0) {
    const rows = items.map((p) => ({
      user_id: user.id,
      product_id: String(p.id),
      product_data: { name: p.name, price: p.price, image: p.image ?? null },
    }));
    await supabase.from("wishlist_items").upsert(rows, { onConflict: "user_id,product_id" });
  }

  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id, product_data")
    .eq("user_id", user.id);

  return NextResponse.json({ items: data ?? [] });
}
