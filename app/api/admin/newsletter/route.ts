import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

type AttachmentInput = { filename: string; content: string };

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export async function GET(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const q = new URL(req.url).searchParams.get("q")?.trim().toLowerCase();

  let query = supabaseAdmin
    .from("newsletter_subscribers")
    .select("*")
    .eq("active", true)
    .order("subscribed_at", { ascending: false });

  const { data, error } = await query;
  if (error) return jsonError(error.message, 500);

  let subscribers = data ?? [];
  if (q) {
    subscribers = subscribers.filter(
      (s) =>
        s.email?.toLowerCase().includes(q) ||
        s.first_name?.toLowerCase().includes(q)
    );
  }

  return jsonOk({ subscribers, total: subscribers.length });
}

export async function DELETE(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const { id } = await req.json();
  if (!id) return jsonError("Missing id");

  const { error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .update({ active: false })
    .eq("id", id);

  if (error) return jsonError(error.message, 500);

  return jsonOk({ success: true });
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;

  const {
    subject,
    body,
    html,
    confirm,
    to,
    cc,
    bcc,
    attachments,
  }: {
    subject?: string;
    body?: string;
    html?: string;
    confirm?: boolean;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    attachments?: AttachmentInput[];
  } = await req.json();

  if (!confirm) return jsonError("Confirmation required", 400);
  if (!subject?.trim() || (!body?.trim() && !html?.trim())) {
    return jsonError("Subject and body required");
  }

  let emails: string[] = [];

  if (Array.isArray(to) && to.length > 0) {
    emails = to.map((e) => e.trim().toLowerCase()).filter(Boolean);
  } else {
    const { data: subscribers, error } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("email")
      .eq("active", true);

    if (error) return jsonError(error.message, 500);
    emails = (subscribers ?? []).map((s) => s.email).filter(Boolean);
  }

  const ccList = Array.isArray(cc) ? cc.map((e) => e.trim()).filter(Boolean) : [];
  const bccList = Array.isArray(bcc) ? bcc.map((e) => e.trim()).filter(Boolean) : [];

  const resendAttachments =
    attachments?.map((a) => ({
      filename: a.filename,
      content: Buffer.from(a.content, "base64"),
    })) ?? [];

  let sent = 0;
  const failures: string[] = [];

  for (const email of emails) {
    try {
      const payload: Parameters<typeof resend.emails.send>[0] = {
        from: FROM_EMAIL,
        to: email,
        subject: subject.trim(),
        text: body?.trim() || stripTags(html ?? ""),
      };
      if (ccList.length) payload.cc = ccList;
      if (bccList.length) payload.bcc = bccList;
      if (html?.trim()) payload.html = html.trim();
      if (resendAttachments.length) payload.attachments = resendAttachments;

      await resend.emails.send(payload);
      sent++;
    } catch {
      failures.push(email);
    }
  }

  return jsonOk({ sent, total: emails.length, failures });
}
