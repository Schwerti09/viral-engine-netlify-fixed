import { NextResponse, type NextRequest } from "next/server";

const COOKIE = "ve_token";

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const isApp = url.pathname.startsWith("/app");
  const isAuth = url.pathname.startsWith("/login") || url.pathname.startsWith("/register");
  const hasToken = !!req.cookies.get(COOKIE)?.value;

  // Edge middleware can't verify JWT/DB. It's just a fast gate.
  if (isApp && !hasToken) {
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (hasToken && isAuth) {
    url.pathname = "/app/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*", "/login", "/register"],
};
