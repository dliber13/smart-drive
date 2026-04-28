import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

const PUBLIC_ROUTES = ["/login", "/", "/privacy", "/terms", "/request-access"];
const ADMIN_ONLY = ["/controller", "/admin"];
const DEALER_ROUTES = ["/dealer", "/dealer-dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + "/")) ||
      pathname.startsWith("/_next") || pathname.startsWith("/api/auth") ||
      pathname.startsWith("/api/request-access")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("sde_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const user = verifySession(token) as any;
  if (!user) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("sde_session", "", { maxAge: 0, path: "/" });
    return res;
  }

  const adminRoles = ["SUPER_ADMIN","EXECUTIVE","UNDERWRITER","SENIOR_UNDERWRITER","FUNDING","COLLECTIONS","COMPLIANCE","ANALYST"];

  if (ADMIN_ONLY.some(r => pathname.startsWith(r)) && !adminRoles.includes(user.role)) {
    return NextResponse.redirect(new URL("/dealer", req.url));
  }

  if (DEALER_ROUTES.some(r => pathname.startsWith(r)) &&
      !["DEALER_MANAGER","DEALER_USER",...adminRoles].includes(user.role)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
