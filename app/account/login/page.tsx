"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { OAuthButtons } from "@/components/account/oauth-buttons";
import { AccountBrand } from "@/components/account/account-brand";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";
import "../account.css";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") ?? "/account";
    router.push(next);
    router.refresh();
  };

  return (
    <div className="account-card">
      <h1 className="account-card-title font-playfair">Sign in</h1>
      <p className="account-card-lead">
        Track orders, save your wishlist, and checkout faster.
      </p>

      <OAuthButtons />
      <div className="account-divider">or</div>

      <form onSubmit={handleSubmit}>
        <label className="account-label">
          <span>Email</span>
          <input
            type="email"
            className="account-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@email.com"
          />
        </label>
        <label className="account-label">
          <span>Password</span>
          <input
            type="password"
            className="account-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="account-message account-message--error">{error}</p>}
        <button type="submit" className="account-btn account-btn-primary" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="account-footer-text">
        New here?{" "}
        <Link href="/account/signup" className="account-link">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default function AccountLoginPage() {
  return (
    <main className="account-page font-barlow">
      <Navbar />
      <div className="account-auth-layout">
        <AccountBrand
          headline="Welcome back"
          subline="Your orders, wishlist, and preferences — curated for you."
        />
        <section className="account-auth-form-wrap">
          <Suspense fallback={<div className="account-card account-loading">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </section>
      </div>
      <PageFooter />
    </main>
  );
}
