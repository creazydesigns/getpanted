"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/browser";

export type CustomerProfile = {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: CustomerProfile | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null);
      return;
    }
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("customer_profiles")
        .select("first_name, last_name, phone")
        .eq("id", u.id)
        .maybeSingle();
      if (error) {
        console.warn("[auth] profile load:", error.message);
        setProfile(null);
        return;
      }
      setProfile(data ?? null);
    } catch (err) {
      console.warn("[auth] profile load failed:", err);
      setProfile(null);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      void loadProfile(sessionUser);

      // Validate session with server in background (do not block UI)
      void supabase.auth.getUser().then(({ data: { user: verified } }) => {
        setUser(verified);
        if (verified) void loadProfile(verified);
      });
    } catch (err) {
      console.warn("[auth] refresh failed:", err);
      setUser(null);
      setProfile(null);
    }
  }, [loadProfile]);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const finishLoading = () => {
      if (mounted) setLoading(false);
    };

    // Never leave account pages stuck on "Loading…" if Supabase is slow/unreachable
    const loadingTimeout = window.setTimeout(finishLoading, 4000);

    refresh().finally(() => {
      window.clearTimeout(loadingTimeout);
      finishLoading();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      void loadProfile(u);
      finishLoading();

      if (u) {
        let items: { id: number | string; name: string; price: string; image?: string }[] = [];
        try {
          const raw = localStorage.getItem("getpanted_wishlist_v1");
          if (raw) items = JSON.parse(raw);
        } catch {
          /* ignore */
        }
        fetch("/api/account/wishlist/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        }).catch(() => {});
      }
    });

    return () => {
      mounted = false;
      window.clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [loadProfile, refresh]);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
