import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const verified = await verifyTransaction(reference);
    if (!verified.status || verified.data?.status !== "success") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ success: true, order, alreadyPaid: true });
    }

    await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "processing",
        payment_reference: reference,
      })
      .eq("id", order.id);

    const updated = { ...order, payment_status: "paid", status: "processing" };

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("[checkout/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
