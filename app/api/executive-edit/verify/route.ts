import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { nairaToKobo, verifyTransaction } from "@/lib/paystack";

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();
    if (!reference || typeof reference !== "string") {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 });
    }

    const verified = await verifyTransaction(reference);
    if (!verified.status || verified.data?.status !== "success") {
      return NextResponse.json({ error: "Payment not successful" }, { status: 400 });
    }

    const { data: order, error } = await supabaseAdmin
      .from("executive_edit_orders")
      .select("*")
      .eq("paystack_reference", reference)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paidKobo = Number(verified.data?.amount ?? 0);
    const expectedKobo = nairaToKobo(Number(order.amount));
    if (paidKobo !== expectedKobo) {
      console.error("[executive-edit/verify] amount mismatch", {
        reference,
        paidKobo,
        expectedKobo,
      });
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ success: true, order, alreadyPaid: true });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("executive_edit_orders")
      .update({
        payment_status: "paid",
        status: "confirmed",
        payment_reference: reference,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      console.error("[executive-edit/verify] update failed", updateError);
      return NextResponse.json({ error: "Could not confirm order" }, { status: 500 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("[executive-edit/verify]", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
