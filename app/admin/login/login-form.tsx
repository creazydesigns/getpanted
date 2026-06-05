"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Login failed");
      setLoading(false);
      return;
    }

    if (data.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      await supabase.auth.signOut();
      setError("This account is not authorized for admin access.");
      setLoading(false);
      return;
    }

    const next = searchParams.get("next") ?? "/admin/dashboard";
    router.push(next);
    router.refresh();
  };

  return (
    <div className="admin-login-card">
      <h1 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 600 }}>Sign in</h1>
      <p style={{ margin: "0 0 24px", color: "#71717a", fontSize: 13 }}>
        Use your admin email and password.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="admin-field">
          <label className="admin-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div className="admin-field">
          <label className="admin-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && (
          <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</p>
        )}
        <button
          type="submit"
          className="admin-btn admin-btn-primary"
          style={{ width: "100%" }}
          disabled={loading}
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
