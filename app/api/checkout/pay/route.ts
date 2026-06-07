import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  initializeTransaction,
  makePaystackReference,
  nairaToKobo,
  siteUrl,
} from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      subtotal,
      shipping_amount,
      total_amount,
      customer_notes,
    } = body;

    if (!customer_name || !customer_email || !items?.length || !total_amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: order, error: insertError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: user?.id ?? null,
        customer_name,
        customer_email,
        customer_phone: customer_phone ?? "",
        shipping_address: shipping_address ?? {},
        items,
        total_amount,
        shipping_amount: shipping_amount ?? 0,
        customer_notes: customer_notes ?? null,
        status: "pending",
        payment_status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !order) {
      console.error("[checkout/pay]", insertError);
      return NextResponse.json({ error: "Could not create order" }, { status: 500 });
    }

    const reference = makePaystackReference(order.id);

    await supabaseAdmin
      .from("orders")
      .update({ paystack_reference: reference, payment_reference: reference })
      .eq("id", order.id);

    const paystack = await initializeTransaction({
      email: customer_email,
      amountKobo: nairaToKobo(Number(total_amount)),
      reference,
      callbackUrl: `${siteUrl()}/checkout/complete`,
      metadata: {
        order_id: order.id,
        customer_name,
        subtotal,
      },
    });

    if (!paystack.status || !paystack.data?.authorization_url) {
      return NextResponse.json(
        { error: paystack.message ?? "Payment initialization failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      orderId: order.id,
      authorizationUrl: paystack.data.authorization_url,
      reference: paystack.data.reference,
    });
  } catch (err) {
    console.error("[checkout/pay]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
