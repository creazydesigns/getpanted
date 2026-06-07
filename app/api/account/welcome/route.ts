import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendAccountWelcomeEmail } from "@/lib/email/send-account-welcome";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await sendAccountWelcomeEmail(user);

  if (result.reason === "send_failed") {
    return NextResponse.json({ error: "Could not send welcome email" }, { status: 502 });
  }

  return NextResponse.json({ success: true, sent: result.sent, reason: result.reason });
}
