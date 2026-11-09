import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import {
  initializeTransaction,
  makePaystackReference,
  nairaToKobo,
  siteUrl,
} from "@/lib/paystack";
import {
  EE_SELECTION_COUNT,
  type ExecutivePackageId,
  availableStylesForPackage,
  getPackage,
} from "@/lib/executive-edit/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      package: packageId,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      selections,
      customer_notes,
      amount,
    } = body as {
      package: ExecutivePackageId;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: Record<string, string>;
      selections: { slug: string; name: string; colorName: string; size: string; image?: string }[];
      customer_notes?: string | null;
      amount: number;
    };

    if (!packageId || !["classic", "signature"].includes(packageId)) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }
    if (!customer_name || !customer_email || !customer_phone) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }
    if (!Array.isArray(selections) || selections.length !== EE_SELECTION_COUNT) {
      return NextResponse.json({ error: `Select exactly ${EE_SELECTION_COUNT} pieces` }, { status: 400 });
    }
    if (selections.some((s) => !s.slug || !s.size)) {
      return NextResponse.json({ error: "Each piece needs a style and size" }, { status: 400 });
    }

    const pkg = getPackage(packageId);
    if (Number(amount) !== pkg.price) {
      return NextResponse.json({ error: "Amount does not match package price" }, { status: 400 });
    }

    const allowed = availableStylesForPackage(packageId);
    for (const sel of selections) {
      const style = allowed.find((s) => s.slug === sel.slug);
      if (!style) {
        return NextResponse.json({ error: `Style unavailable: ${sel.slug}` }, { status: 400 });
      }
      if (!style.sizes.includes(sel.size)) {
        return NextResponse.json(
          { error: `Size ${sel.size} unavailable for ${style.colorName}` },
          { status: 400 }
        );
      }
    }

    const normalizedSelections = selections.map((sel) => {
      const style = allowed.find((s) => s.slug === sel.slug)!;
      return {
        slug: style.slug,
        name: style.name,
        color: style.colorName,
        colorName: style.colorName,
        size: sel.size,
        product_id: null,
        image: style.image,
      };
    });

    const { data: order, error: insertError } = await supabaseAdmin
      .from("executive_edit_orders")
      .insert({
        package: packageId,
        amount: pkg.price,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address: shipping_address ?? {},
        selections: normalizedSelections,
        customer_notes: customer_notes ?? null,
        status: "pending",
        payment_status: "pending",
      })
      .select("id")
      .single();

    if (insertError || !order) {
      console.error("[executive-edit/pay]", insertError);
      return NextResponse.json(
        { error: insertError?.message ?? "Could not create pre-order" },
        { status: 500 }
      );
    }

    const reference = makePaystackReference(order.id);

    await supabaseAdmin
      .from("executive_edit_orders")
      .update({ paystack_reference: reference, payment_reference: reference })
      .eq("id", order.id);

    const paystack = await initializeTransaction({
      email: customer_email,
      amountKobo: nairaToKobo(pkg.price),
      reference,
      callbackUrl: `${siteUrl()}/executive-edit/complete`,
      metadata: {
        order_id: order.id,
        type: "executive_edit",
        package: packageId,
        customer_name,
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
    console.error("[executive-edit/pay]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
