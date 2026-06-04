import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import type { PostgrestError } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL } from "@/lib/resend";
import NewsletterWelcomeEmail from "@/emails/NewsletterWelcome";

/** Retries without optional columns when migrations 002/003 have not been applied yet. */
function stripOptionalSubscriberColumns(
  payload: Record<string, unknown>
): Record<string, unknown> {
  const { source: _s, whatsapp: _w, ...rest } = payload;
  return rest;
}

function isMissingColumnError(error: PostgrestError): boolean {
  return (
    error.code === "PGRST204" &&
    (error.message.includes("source") || error.message.includes("whatsapp"))
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, fullName, whatsapp, source } = body as {
      email?: string;
      firstName?: string;
      fullName?: string;
      whatsapp?: string;
      source?: string;
    };

    const name = fullName?.trim() || firstName?.trim() || null;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    // Check for existing subscriber
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, active")
      .eq("email", email.toLowerCase())
      .maybeSingle();

    if (lookupError) {
      console.error("[subscribe] Supabase lookup error:", lookupError);
      return NextResponse.json({ error: "Could not save subscription" }, { status: 500 });
    }

    if (existing) {
      if (existing.active) {
        return NextResponse.json({ error: "already_subscribed" }, { status: 409 });
      }
      // Re-activate
      const reactivatePayload: Record<string, unknown> = {
        active: true,
        first_name: name,
      };
      if (source) reactivatePayload.source = source;
      if (whatsapp) reactivatePayload.whatsapp = whatsapp;

      let { error: updateError } = await supabaseAdmin
        .from("newsletter_subscribers")
        .update(reactivatePayload)
        .eq("id", existing.id);

      if (updateError && isMissingColumnError(updateError)) {
        ({ error: updateError } = await supabaseAdmin
          .from("newsletter_subscribers")
          .update(stripOptionalSubscriberColumns(reactivatePayload))
          .eq("id", existing.id));
        console.warn(
          "[subscribe] Ran without source/whatsapp columns — apply supabase/migrations/002 and 003"
        );
      }

      if (updateError) {
        console.error("[subscribe] Supabase update error:", updateError);
        return NextResponse.json({ error: "Could not save subscription" }, { status: 500 });
      }
    } else {
      const insertPayload: Record<string, unknown> = {
        email: email.toLowerCase(),
        first_name: name,
      };
      if (source) insertPayload.source = source;
      if (whatsapp) insertPayload.whatsapp = whatsapp;

      let { error: insertError } = await supabaseAdmin
        .from("newsletter_subscribers")
        .insert(insertPayload);

      if (insertError && isMissingColumnError(insertError)) {
        ({ error: insertError } = await supabaseAdmin
          .from("newsletter_subscribers")
          .insert(stripOptionalSubscriberColumns(insertPayload)));
        console.warn(
          "[subscribe] Ran without source/whatsapp columns — apply supabase/migrations/002 and 003"
        );
      }

      if (insertError) {
        console.error("[subscribe] Supabase insert error:", insertError);
        return NextResponse.json({ error: "Could not save subscription" }, { status: 500 });
      }
    }

    // Send welcome email (fire-and-forget — don't fail on email error)
    try {
      const html = await render(NewsletterWelcomeEmail({ firstName: name ?? undefined }));
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Welcome to the Clan — GetPanted",
        html,
      });
    } catch (emailErr) {
      console.warn("[subscribe] Welcome email failed:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[subscribe]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
