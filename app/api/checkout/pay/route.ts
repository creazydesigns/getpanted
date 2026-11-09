import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  initializeTransaction,
  makePaystackReference,
  nairaToKobo,
  siteUrl,
} from "@/lib/paystack";
import { quoteShipping } from "@/lib/shipping/quote";

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

    const addr = shipping_address ?? {};
    const serverQuote = await quoteShipping({
      street: addr.street,
      city: addr.city,
      state: addr.state,
      country: addr.country,
    });

    const itemsSubtotal = Number(subtotal);
    const expectedTotal = itemsSubtotal + serverQuote.amount;
    if (Math.abs(Number(shipping_amount) - serverQuote.amount) > 1) {
      return NextResponse.json(
        {
          error: "Shipping changed. Refresh checkout and try again.",
          quote: serverQuote,
        },
        { status: 409 }
      );
    }
    if (Math.abs(Number(total_amount) - expectedTotal) > 1) {
      return NextResponse.json(
        { error: "Order total mismatch. Refresh checkout and try again." },
        { status: 409 }
      );
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
        shipping_address: {
          ...addr,
          shipping_quote: serverQuote,
        },
        items,
        total_amount: expectedTotal,
        shipping_amount: serverQuote.amount,
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
      amountKobo: nairaToKobo(expectedTotal),
      reference,
      callbackUrl: `${siteUrl()}/checkout/complete`,
      metadata: {
        order_id: order.id,
        customer_name,
        subtotal: itemsSubtotal,
        shipping_amount: serverQuote.amount,
        shipping_label: serverQuote.label,
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
    const message = err instanceof Error ? err.message : "Internal server error";
    const isConfig =
      /PAYSTACK_SECRET_KEY|is not configured|SUPABASE/i.test(message);
    return NextResponse.json(
      { error: isConfig ? "Payment is not configured on this server" : "Internal server error" },
      { status: 500 }
    );
  }
}
