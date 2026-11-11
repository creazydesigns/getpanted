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
import { quoteShipping } from "@/lib/shipping/quote";

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
      shipping_amount,
    } = body as {
      package: ExecutivePackageId;
      customer_name: string;
      customer_email: string;
      customer_phone: string;
      shipping_address: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        shipping_amount?: number;
        shipping_label?: string;
        package_amount?: number;
      };
      selections: { slug: string; name: string; colorName: string; size: string; image?: string }[];
      customer_notes?: string | null;
      amount: number;
      shipping_amount?: number;
    };

    if (!packageId || !["classic", "signature"].includes(packageId)) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }
    if (!customer_name || !customer_email || !customer_phone) {
      return NextResponse.json({ error: "Missing customer details" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }
    if (
      !shipping_address?.street?.trim() ||
      !shipping_address?.city?.trim() ||
      !shipping_address?.state?.trim()
    ) {
      return NextResponse.json({ error: "Delivery address is required" }, { status: 400 });
    }
    if (!Array.isArray(selections) || selections.length !== EE_SELECTION_COUNT) {
      return NextResponse.json({ error: `Select exactly ${EE_SELECTION_COUNT} pieces` }, { status: 400 });
    }
    if (selections.some((s) => !s.slug || !s.size)) {
      return NextResponse.json({ error: "Each piece needs a style and size" }, { status: 400 });
    }

    const pkg = getPackage(packageId);
    const serverQuote = await quoteShipping({
      street: shipping_address.street,
      city: shipping_address.city,
      state: shipping_address.state,
      country: shipping_address.country ?? "Nigeria",
    });

    if (Math.abs(Number(shipping_amount ?? 0) - serverQuote.amount) > 1) {
      return NextResponse.json({ error: "Shipping quote expired. Refresh and try again." }, { status: 400 });
    }

    const expectedTotal = pkg.price + serverQuote.amount;
    if (Math.abs(Number(amount) - expectedTotal) > 1) {
      return NextResponse.json({ error: "Amount does not match package plus delivery" }, { status: 400 });
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

    const storedAddress = {
      street: shipping_address.street?.trim() ?? "",
      city: shipping_address.city?.trim() ?? "",
      state: shipping_address.state?.trim() ?? "",
      country: (shipping_address.country ?? "Nigeria").trim() || "Nigeria",
      package_amount: pkg.price,
      shipping_amount: serverQuote.amount,
      shipping_label: serverQuote.label,
      shipping_quote: serverQuote,
    };

    const { data: order, error: insertError } = await supabaseAdmin
      .from("executive_edit_orders")
      .insert({
        package: packageId,
        amount: expectedTotal,
        customer_name,
        customer_email,
        customer_phone,
        shipping_address: storedAddress,
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

    const { error: refError } = await supabaseAdmin
      .from("executive_edit_orders")
      .update({ paystack_reference: reference, payment_reference: reference })
      .eq("id", order.id);

    if (refError) {
      console.error("[executive-edit/pay] reference update", refError);
      return NextResponse.json({ error: "Could not prepare payment" }, { status: 500 });
    }

    const callbackUrl = `${siteUrl()}/thefive/complete`;
    const paystack = await initializeTransaction({
      email: customer_email,
      amountKobo: nairaToKobo(expectedTotal),
      reference,
      callbackUrl,
      metadata: {
        order_id: order.id,
        type: "executive_edit",
        package: packageId,
        customer_name,
        package_amount: pkg.price,
        shipping_amount: serverQuote.amount,
        cancel_action: `${siteUrl()}/thefive/checkout?package=${packageId}`,
      },
    });

    if (!paystack.status || !paystack.data?.authorization_url) {
      console.error("[executive-edit/pay] paystack init", paystack);
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
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
