import { NextRequest, NextResponse } from "next/server";
import { generateTaraReply, type TaraMessage } from "@/lib/tara";
import { resend, FROM_EMAIL, ADMIN_EMAIL, WHATSAPP_URL, SUPPORT_EMAIL } from "@/lib/resend";

interface ChatRequestBody {
  messages?: TaraMessage[];
  message?: string;
  sessionId?: string;
  customerEmail?: string;
  customerName?: string;
}

async function sendEscalationEmail(params: {
  userMessage: string;
  conversation: TaraMessage[];
  reason?: string;
  sessionId?: string;
  customerEmail?: string;
  customerName?: string;
}) {
  const { userMessage, conversation, reason, sessionId, customerEmail, customerName } = params;
  const transcript = conversation
    .slice(-8)
    .map((m) => `<p><strong>${m.role === "user" ? "Customer" : "Tara"}:</strong> ${m.content}</p>`)
    .join("");

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `Tara escalation — ${customerName ?? "Website visitor"}${sessionId ? ` (${sessionId.slice(0, 8)})` : ""}`,
      html: `
        <h2>Tara could not fully answer — handoff requested</h2>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ""}
        ${customerName ? `<p><strong>Name:</strong> ${customerName}</p>` : ""}
        ${customerEmail ? `<p><strong>Email:</strong> ${customerEmail}</p>` : ""}
        ${sessionId ? `<p><strong>Session:</strong> ${sessionId}</p>` : ""}
        <hr />
        <p><strong>Latest message:</strong></p>
        <p>${userMessage}</p>
        <hr />
        <h3>Recent conversation</h3>
        ${transcript}
        <hr />
        <p>WhatsApp: <a href="${WHATSAPP_URL}">${WHATSAPP_URL}</a></p>
      `,
    });
  } catch (e) {
    console.warn("[chat] Escalation email failed:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (process.env.NEXT_PUBLIC_TARA_ENABLED === "false") {
      return NextResponse.json({ error: "Tara is currently unavailable" }, { status: 503 });
    }

    const body = (await req.json()) as ChatRequestBody;
    const latestUserMessage = body.message?.trim();
    const history = Array.isArray(body.messages) ? body.messages : [];

    if (!latestUserMessage) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const messages: TaraMessage[] = [
      ...history.filter((m) => m.role === "user" || m.role === "assistant"),
      { role: "user", content: latestUserMessage },
    ];

    const reply = await generateTaraReply(messages, latestUserMessage);

    if (reply.needsEscalation) {
      await sendEscalationEmail({
        userMessage: latestUserMessage,
        conversation: messages,
        reason: reply.escalationReason,
        sessionId: body.sessionId,
        customerEmail: body.customerEmail,
        customerName: body.customerName,
      });
    }

    return NextResponse.json({
      message: reply.message,
      suggestedProducts: reply.suggestedProducts,
      escalated: reply.needsEscalation,
      handoff: reply.needsEscalation
        ? {
            whatsapp: WHATSAPP_URL,
            email: SUPPORT_EMAIL,
            message:
              "Our team has been notified. For the fastest response, message us on WhatsApp or email hello@getpanted.com.",
          }
        : undefined,
    });
  } catch (err) {
    console.error("[chat]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
