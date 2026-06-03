import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Redirect www → apex. Required for custom domains; on *.vercel.app only
 * getpanted.vercel.app has a valid cert (www.getpanted.vercel.app will SSL-fail).
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";

  if (host.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
