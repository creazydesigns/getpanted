"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/auth-context";
import { AccountHero } from "@/components/account/account-hero";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";
import "./account.css";

export default function AccountPage() {
  const { user, profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <main className="account-page font-barlow">
        <Navbar />
        <div className="account-loading" style={{ paddingTop: 140 }}>
          Loading your account…
        </div>
        <PageFooter />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="account-page font-barlow">
        <Navbar />
        <section className="account-body">
          <div className="account-body-inner account-empty">
            <p>
              Please{" "}
              <Link href="/account/login?next=/account" className="account-link">
                sign in
              </Link>{" "}
              to view your account.
            </p>
          </div>
        </section>
        <PageFooter />
      </main>
    );
  }

  const name =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user?.user_metadata?.first_name ||
    "there";

  return (
    <main className="account-page font-barlow">
      <Navbar />
      <AccountHero
        eyebrow="My Account"
        title={`Hello, ${name}`}
        meta={user?.email ?? undefined}
        description="You can track all your orders, and items on your wishlist and in your cart, and also submit feedbacks or queries right here in your client area. Relax and enjoy your space!"
      />

      <section className="account-body">
        <div className="account-body-inner">
          <div className="account-tiles">
            <Link href="/account/orders" className="account-tile">
              <span className="account-tile-label">Orders</span>
              <span className="account-tile-title">My Orders</span>
              <span className="account-tile-arrow">→</span>
            </Link>
            <Link href="/wishlist" className="account-tile">
              <span className="account-tile-label">Saved</span>
              <span className="account-tile-title">My Wishlist</span>
              <span className="account-tile-arrow">→</span>
            </Link>
            <Link href="/cart" className="account-tile">
              <span className="account-tile-label">Bag</span>
              <span className="account-tile-title">My Cart</span>
              <span className="account-tile-arrow">→</span>
            </Link>
            <Link href="/collections" className="account-tile">
              <span className="account-tile-label">Shop</span>
              <span className="account-tile-title">Browse Collections</span>
              <span className="account-tile-arrow">→</span>
            </Link>
            <Link href="/account/support" className="account-tile">
              <span className="account-tile-label">Support</span>
              <span className="account-tile-title">Feedback & Queries</span>
              <span className="account-tile-arrow">→</span>
            </Link>
            <button
              type="button"
              onClick={() => signOut().then(() => (window.location.href = "/"))}
              className="account-tile account-tile--signout"
            >
              <span className="account-tile-label">Leave</span>
              <span className="account-tile-title">Sign Out</span>
            </button>
          </div>
        </div>
      </section>
      <PageFooter />
    </main>
  );
}
