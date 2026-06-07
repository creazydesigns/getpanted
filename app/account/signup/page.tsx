"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { OAuthButtons } from "@/components/account/oauth-buttons";
import { AccountBrand } from "@/components/account/account-brand";
import { Navbar } from "@/app/components/navbar";
import { PageFooter } from "@/app/components/page-footer";
import "../account.css";

export default function AccountSignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { first_name: firstName.trim(), last_name: lastName.trim() },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("customer_profiles").upsert({
        id: data.user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
    }

    if (data.session) {
      fetch("/api/account/welcome", { method: "POST" }).catch(() => {});
      router.push("/account");
      router.refresh();
    } else {
      setMessage("Check your email to confirm your account, then sign in.");
    }
    setLoading(false);
  };

  return (
    <main className="account-page font-barlow">
      <Navbar />
      <div className="account-auth-layout">
        <AccountBrand
          tag="Join Us"
          headline="Become a client"
          subline="Create your private GetPanted account to shop, save favourites, and track every order."
        />
        <section className="account-auth-form-wrap">
          <div className="account-card">
            <h1 className="account-card-title font-playfair">Create account</h1>
            <p className="account-card-lead">
              Join GetPanted to manage orders and your wishlist.
            </p>

            <OAuthButtons />
            <div className="account-divider">or</div>

            <form onSubmit={handleSubmit}>
              <div className="account-label-grid">
                <label className="account-label" style={{ marginBottom: 0 }}>
                  <span>First name</span>
                  <input
                    className="account-input"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    placeholder="Ada"
                  />
                </label>
                <label className="account-label" style={{ marginBottom: 0 }}>
                  <span>Last name</span>
                  <input
                    className="account-input"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    placeholder="Okafor"
                  />
                </label>
              </div>
              <label className="account-label">
                <span>Email</span>
                <input
                  type="email"
                  className="account-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                  minLength={8}
                  placeholder="Min. 8 characters"
                />
              </label>
              {error && <p className="account-message account-message--error">{error}</p>}
              {message && <p className="account-message account-message--success">{message}</p>}
              <button type="submit" className="account-btn account-btn-primary" disabled={loading}>
                {loading ? "Creating…" : "Create Account"}
              </button>
            </form>

            <p className="account-footer-text">
              Already have an account?{" "}
              <Link href="/account/login" className="account-link">
                Sign in
              </Link>
            </p>
          </div>
        </section>
      </div>
      <PageFooter />
    </main>
  );
}
