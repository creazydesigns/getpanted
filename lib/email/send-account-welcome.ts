import { render } from "@react-email/render";
import type { User } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, FROM_EMAIL } from "@/lib/resend";
import AccountWelcome from "@/emails/AccountWelcome";

function resolveFirstName(
  profile: { first_name?: string | null } | null,
  user: User
): string {
  if (profile?.first_name?.trim()) return profile.first_name.trim();

  const meta = user.user_metadata ?? {};
  if (typeof meta.first_name === "string" && meta.first_name.trim()) return meta.first_name.trim();
  if (typeof meta.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim().split(/\s+/)[0] ?? "there";
  }
  if (typeof meta.name === "string" && meta.name.trim()) {
    return meta.name.trim().split(/\s+/)[0] ?? "there";
  }

  return user.email?.split("@")[0] ?? "there";
}

export async function sendAccountWelcomeEmail(user: User): Promise<{ sent: boolean; reason?: string }> {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
    return { sent: false, reason: "resend_not_configured" };
  }

  if (!user.email) {
    return { sent: false, reason: "no_email" };
  }

  const { data: profile } = await supabaseAdmin
    .from("customer_profiles")
    .select("first_name, welcome_email_sent_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.welcome_email_sent_at) {
    return { sent: false, reason: "already_sent" };
  }

  const firstName = resolveFirstName(profile, user);
  const html = await render(AccountWelcome({ firstName }));

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: user.email,
    subject: "Welcome to GetPanted — Your account is ready",
    html,
  });

  if (error) {
    console.error("[sendAccountWelcomeEmail]", error);
    return { sent: false, reason: "send_failed" };
  }

  await supabaseAdmin
    .from("customer_profiles")
    .upsert({
      id: user.id,
      first_name: profile?.first_name ?? firstName,
      welcome_email_sent_at: new Date().toISOString(),
    });

  return { sent: true };
}
