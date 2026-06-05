import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin/auth";

export default async function AdminIndexPage() {
  const user = await getAdminUser();
  redirect(user ? "/admin/dashboard" : "/admin/login");
}
