import { NextRequest, NextResponse } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import BespokeConfirmationEmail from "@/emails/BespokeConfirmation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName, customerEmail, customerPhone,
      silhouette, waistStyle, pleatStyle, fabric, color,
      measurements, timeline, notes,
    } = body;

    if (!customerName || !customerEmail || !silhouette) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert into Supabase
    const { data, error: insertError } = await supabaseAdmin
      .from("bespoke_orders")
      .insert({
        customer_name:  customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone ?? "",
        silhouette,
        waist_style:  waistStyle ?? "",
        pleat_style:  pleatStyle ?? "",
        fabric:       fabric ?? "",
        color:        color ?? "",
        measurements: measurements ?? {},
        timeline:     timeline ?? "",
        notes:        notes ?? null,
      })
      .select("id")
      .single();

    if (insertError || !data) {
      console.error("[bespoke-order] Supabase error:", insertError);
      return NextResponse.json({ error: "Could not save order" }, { status: 500 });
    }

    const orderId = `BSP-${data.id.slice(0, 8).toUpperCase()}`;
    const selections = { silhouette, waistStyle, pleatStyle, fabric, color, timeline };

    // Send customer confirmation
    try {
      const customerHtml = renderToStaticMarkup(
        createElement(BespokeConfirmationEmail, {
          customerName,
          customerEmail,
          orderId,
          selections,
          notes,
        })
      );
      await resend.emails.send({
        from: FROM_EMAIL,
        to: customerEmail,
        subject: `Bespoke Order Received — ${orderId} | GetPanted`,
        html: customerHtml,
      });
    } catch (e) {
      console.warn("[bespoke-order] Customer email failed:", e);
    }

    // Send internal admin notification
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Bespoke Order: ${orderId} from ${customerName}`,
        html: `
          <h2>New Bespoke Order: ${orderId}</h2>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <hr />
          <p><strong>Silhouette:</strong> ${silhouette}</p>
          <p><strong>Waist Style:</strong> ${waistStyle}</p>
          <p><strong>Pleat Style:</strong> ${pleatStyle}</p>
          <p><strong>Fabric:</strong> ${fabric}</p>
          <p><strong>Colour:</strong> ${color}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ""}
          <hr />
          <p><strong>Measurements:</strong><br />${JSON.stringify(measurements, null, 2)}</p>
        `,
      });
    } catch (e) {
      console.warn("[bespoke-order] Admin email failed:", e);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (err) {
    console.error("[bespoke-order]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
