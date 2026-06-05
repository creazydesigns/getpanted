import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { requireAdminApi, jsonOk, jsonError } from "@/lib/admin/api-response";

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

  const { subject, body, confirm } = await req.json();
  if (!confirm) return jsonError("Confirmation required", 400);
  if (!subject?.trim() || !body?.trim()) return jsonError("Subject and body required");

  const { data: subscribers, error } = await supabaseAdmin
    .from("newsletter_subscribers")
    .select("email")
    .eq("active", true);

  if (error) return jsonError(error.message, 500);

  const emails = (subscribers ?? []).map((s) => s.email).filter(Boolean);
  let sent = 0;
  const failures: string[] = [];

  for (const to of emails) {
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to,
        subject: subject.trim(),
        text: body.trim(),
      });
      sent++;
    } catch {
      failures.push(to);
    }
  }

  return jsonOk({ sent, total: emails.length, failures });
}
