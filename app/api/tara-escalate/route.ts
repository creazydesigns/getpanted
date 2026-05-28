import { NextRequest, NextResponse } from "next/server";
import { resend, FROM_EMAIL, ADMIN_EMAIL, WHATSAPP_URL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message, sessionId, conversation } = body as {
      name?: string;
      email?: string;
      message?: string;
      sessionId?: string;
      conversation?: { role: string; content: string }[];
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const transcript = (conversation ?? [])
      .slice(-10)
      .map((m) => `<p><strong>${m.role === "user" ? "Customer" : "Tara"}:</strong> ${m.content}</p>`)
      .join("");

    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        replyTo: email || undefined,
        subject: `Tara handoff — ${name ?? "Website visitor"}`,
        html: `
          <h2>Customer requested human support via Tara</h2>
          ${name ? `<p><strong>Name:</strong> ${name}</p>` : ""}
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
          ${sessionId ? `<p><strong>Session:</strong> ${sessionId}</p>` : ""}
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          ${transcript ? `<hr /><h3>Conversation</h3>${transcript}` : ""}
          <hr />
          <p>Reply via WhatsApp: <a href="${WHATSAPP_URL}">${WHATSAPP_URL}</a></p>
        `,
      });
    } catch (e) {
      console.warn("[tara-escalate] Email failed:", e);
      return NextResponse.json({ error: "Could not send escalation email" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      whatsapp: WHATSAPP_URL,
    });
  } catch (err) {
    console.error("[tara-escalate]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
