import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAIL } from "@/lib/admin/constants";

const ACCOUNT_PUBLIC = ["/account/login", "/account/signup"];

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // ── Admin routes ────────────────────────────────────────────────────────────
  if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
    const isAdminUser = user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const isLogin = path === "/admin/login";
    const isAdminApi = path.startsWith("/api/admin");

    if (isAdminApi) {
      if (!isAdminUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return supabaseResponse;
    }

    if (path === "/admin") {
      const url = request.nextUrl.clone();
      url.pathname = isAdminUser ? "/admin/dashboard" : "/admin/login";
      return NextResponse.redirect(url);
    }

    if (isLogin) {
      if (isAdminUser) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/dashboard";
        return NextResponse.redirect(url);
      }
      return supabaseResponse;
    }

    if (!isAdminUser) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // ── Customer account routes ─────────────────────────────────────────────────
  if (path.startsWith("/account")) {
    const isPublic = ACCOUNT_PUBLIC.includes(path);

    if (!isPublic && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/account/login";
      url.searchParams.set("next", path);
      return NextResponse.redirect(url);
    }

    if (isPublic && user) {
      const url = request.nextUrl.clone();
      url.pathname = "/account";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
