import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL, SUPPORT_EMAIL } from "@/lib/resend";
import SupportTicketAck from "@/emails/SupportTicketAck";
import {
  SUPPORT_CATEGORIES,
  SUPPORT_TICKET_TYPES,
  categoryLabel,
  makeTicketNumber,
  type SupportCategory,
  type SupportTicketType,
} from "@/lib/support/constants";

function resolveCustomerName(
  profile: { first_name?: string | null; last_name?: string | null } | null,
  user: { user_metadata?: Record<string, unknown>; email?: string }
): string {
  const fromProfile = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim();
  if (fromProfile) return fromProfile;

  const meta = user.user_metadata ?? {};
  const metaName = [meta.first_name, meta.last_name].filter(Boolean).join(" ").trim();
  if (metaName) return metaName;

  if (typeof meta.full_name === "string" && meta.full_name.trim()) return meta.full_name.trim();
  if (typeof meta.name === "string" && meta.name.trim()) return meta.name.trim();

  return user.email?.split("@")[0] ?? "Customer";
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { subject, ticket_type, category, message } = body as {
      subject?: string;
      ticket_type?: string;
      category?: string;
      message?: string;
    };

    if (!subject?.trim() || !ticket_type || !category || !message?.trim()) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const validType = SUPPORT_TICKET_TYPES.some((t) => t.value === ticket_type);
    const validCategory = SUPPORT_CATEGORIES.some((c) => c.value === category);

    if (!validType || !validCategory) {
      return NextResponse.json({ error: "Invalid type or category" }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("customer_profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();

    const customerName = resolveCustomerName(profile, user);
    const customerEmail = user.email;
    const ticketId = crypto.randomUUID();
    const ticketNumber = makeTicketNumber(ticketId);

    const { error: insertError } = await supabaseAdmin.from("support_tickets").insert({
      id: ticketId,
      ticket_number: ticketNumber,
      user_id: user.id,
      customer_name: customerName,
      customer_email: customerEmail,
      subject: subject.trim(),
      ticket_type: ticket_type as SupportTicketType,
      category: category as SupportCategory,
      message: message.trim(),
      status: "open",
    });

    if (insertError) {
      console.error("[account/support]", insertError);
      return NextResponse.json({ error: "Could not save ticket" }, { status: 500 });
    }

    const typeLabel = ticket_type === "feedback" ? "Feedback" : "Query";
    const categoryName = categoryLabel(category);
    const firstName = customerName.split(" ")[0] ?? "there";

    const html = await render(
      SupportTicketAck({
        firstName,
        ticketNumber,
        subject: subject.trim(),
        ticketType: typeLabel,
        category: categoryName,
        message: message.trim(),
      })
    );

    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Support Ticket ${ticketNumber} — We've received your ${typeLabel.toLowerCase()}`,
      html,
    });

    if (emailError) {
      console.error("[account/support] customer email:", emailError);
      return NextResponse.json(
        { error: "Ticket saved but confirmation email could not be sent. Please contact us directly.", ticketNumber },
        { status: 502 }
      );
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: SUPPORT_EMAIL,
      subject: `New ${typeLabel}: ${ticketNumber} — ${subject.trim()}`,
      html: `
        <p><strong>Ticket:</strong> ${ticketNumber}</p>
        <p><strong>From:</strong> ${customerName} &lt;${customerEmail}&gt;</p>
        <p><strong>Type:</strong> ${typeLabel}</p>
        <p><strong>Category:</strong> ${categoryName}</p>
        <p><strong>Subject:</strong> ${subject.trim()}</p>
        <p><strong>Message:</strong></p>
        <p>${message.trim().replace(/\n/g, "<br>")}</p>
      `,
    }).catch((err) => console.error("[account/support] team email:", err));

    return NextResponse.json({ success: true, ticketNumber });
  } catch (err) {
    console.error("[account/support]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
