import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { sendAccountWelcomeEmail } from "@/lib/email/send-account-welcome";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/account";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata ?? {};
        const fullName = (meta.full_name ?? meta.name ?? "") as string;
        const parts = fullName.trim().split(/\s+/);
        await supabase.from("customer_profiles").upsert({
          id: user.id,
          first_name: (meta.first_name ?? meta.given_name ?? parts[0]) || null,
          last_name: (meta.last_name ?? meta.family_name ?? parts.slice(1).join(" ")) || null,
        });
        sendAccountWelcomeEmail(user).catch((err) =>
          console.warn("[auth/callback] welcome email:", err)
        );
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/account/login?error=auth`);
}
