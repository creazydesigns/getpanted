import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

export async function getAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user?.email) return null;
  if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) return null;
  return user;
}
