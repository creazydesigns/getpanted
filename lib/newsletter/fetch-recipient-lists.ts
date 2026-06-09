import { supabaseAdmin } from "@/lib/supabase";
import type { RecipientList } from "./recipient-lists";

function uniqueEmails(rows: { email?: string | null }[]): string[] {
  return [...new Set(rows.map((r) => r.email?.trim().toLowerCase()).filter(Boolean) as string[])];
}

async function emailsFromWishlist(): Promise<string[]> {
  const { data: items, error } = await supabaseAdmin.from("wishlist_items").select("user_id");
  if (error || !items?.length) return [];

  const userIds = [...new Set(items.map((i) => i.user_id).filter(Boolean))];
  const emails: string[] = [];

  await Promise.all(
    userIds.map(async (id) => {
      const { data } = await supabaseAdmin.auth.admin.getUserById(id);
      const email = data.user?.email?.trim().toLowerCase();
      if (email) emails.push(email);
    })
  );

  return [...new Set(emails)];
}

export async function fetchRecipientLists(): Promise<RecipientList[]> {
  // Carts: checkout started but payment not completed (guest cart emails aren't stored server-side).
  const [
    ordersRes,
    cartRes,
    waitlistRes,
    newsletterRes,
    bespokeRes,
    wishlistEmails,
  ] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("customer_email")
      .eq("payment_status", "paid"),
    supabaseAdmin
      .from("orders")
      .select("customer_email")
      .in("payment_status", ["pending", "unpaid"]),
    supabaseAdmin
      .from("newsletter_subscribers")
      .select("email")
      .eq("active", true)
      .eq("source", "waitlist"),
    supabaseAdmin
      .from("newsletter_subscribers")
      .select("email")
      .eq("active", true)
      .or("source.eq.newsletter,source.is.null"),
    supabaseAdmin.from("bespoke_orders").select("customer_email"),
    emailsFromWishlist(),
  ]);

  const orders = uniqueEmails(
    (ordersRes.data ?? []).map((r) => ({ email: r.customer_email }))
  );

  const carts = uniqueEmails(
    (cartRes.data ?? []).map((r) => ({ email: r.customer_email }))
  );

  const waitlist = uniqueEmails(
    (waitlistRes.data ?? []).map((r) => ({ email: r.email }))
  );

  const newsletter = uniqueEmails(
    (newsletterRes.data ?? []).map((r) => ({ email: r.email }))
  );

  const bespoke = uniqueEmails(
    (bespokeRes.data ?? []).map((r) => ({ email: r.customer_email }))
  );

  const wishlist = [...new Set(wishlistEmails)];

  const lists: RecipientList[] = [
    { id: "orders", label: "Orders", emails: orders, count: orders.length },
    { id: "wishlist", label: "Wishlist", emails: wishlist, count: wishlist.length },
    { id: "carts", label: "Carts", emails: carts, count: carts.length },
    { id: "waitlist", label: "Waitlist", emails: waitlist, count: waitlist.length },
    { id: "newsletter", label: "Newsletter", emails: newsletter, count: newsletter.length },
    { id: "bespoke", label: "Bespoke", emails: bespoke, count: bespoke.length },
  ];

  return lists;
}
