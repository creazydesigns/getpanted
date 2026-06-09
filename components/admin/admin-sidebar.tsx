"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";

const LAST_SEEN_KEY = "gp_admin_last_seen";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders", badge: "orders" as const },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/bespoke", label: "Bespoke Orders", badge: "bespoke" as const },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/content", label: "Site Content" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [badges, setBadges] = useState({ orders: 0, bespoke: 0 });

  useEffect(() => {
    const since = localStorage.getItem(LAST_SEEN_KEY);
    if (!since) return;

    fetch(`/api/admin/badges?since=${encodeURIComponent(since)}`)
      .then((r) => r.json())
      .then((d) => {
        setBadges({ orders: d.newOrders ?? 0, bespoke: d.newBespoke ?? 0 });
      })
      .catch(() => {});
  }, [pathname]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">GetPanted Admin</div>
      <nav className="admin-sidebar-nav">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const count = item.badge ? badges[item.badge] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link${active ? " active" : ""}`}
            >
              <span>{item.label}</span>
              {count > 0 && <span className="admin-nav-badge">{count}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="admin-sidebar-footer">
        <button
          type="button"
          className="admin-nav-link"
          style={{ border: "none", background: "none", width: "100%", cursor: "pointer", textAlign: "left" }}
          onClick={signOut}
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function markAdminSeen() {
  if (typeof window !== "undefined") {
    localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
  }
}
