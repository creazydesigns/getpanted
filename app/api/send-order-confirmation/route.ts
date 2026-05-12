import { NextRequest, NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { resend, FROM_EMAIL } from "@/lib/resend";
import OrderConfirmationEmail from "@/emails/OrderConfirmation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerEmail, customerName, orderId, items, totalAmount, shippingAddress } = body;

    if (!customerEmail || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const firstName = customerName?.split(" ")[0] ?? "there";

    const html = renderToStaticMarkup(
      createElement(OrderConfirmationEmail, {
        firstName,
        orderId,
        items: items ?? [],
        totalAmount: totalAmount ?? "₦0",
        shippingAddress: shippingAddress ?? { street: "", city: "", state: "", country: "" },
      })
    );

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmed — ${orderId} | GetPanted`,
      html,
    });

    if (error) {
      console.error("[send-order-confirmation] Resend error:", error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[send-order-confirmation]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
