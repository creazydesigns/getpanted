import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature") ?? "";
  const rawBody = await req.text();

  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody) as {
    event: string;
    data?: { reference?: string; status?: string };
  };

  if (event.event === "charge.success" && event.data?.reference) {
    await supabaseAdmin
      .from("orders")
      .update({ payment_status: "paid", status: "processing" })
      .eq("paystack_reference", event.data.reference)
      .eq("payment_status", "pending");
  }

  return NextResponse.json({ received: true });
}
