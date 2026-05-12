import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      total_amount,
      notes,
    } = body;

    if (!customer_name || !customer_email || !items?.length) {
      return NextResponse.json({ error: "Missing required order fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone: customer_phone ?? "",
        shipping_address: shipping_address ?? {},
        items,
        total_amount: total_amount ?? 0,
        status: "pending",
        ...(notes ? { notes } : {}),
      })
      .select("id")
      .single();

    if (error || !data) {
      console.error("[orders] Supabase error:", error);
      return NextResponse.json({ error: "Could not save order" }, { status: 500 });
    }

    return NextResponse.json({ orderId: data.id });
  } catch (err) {
    console.error("[orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
