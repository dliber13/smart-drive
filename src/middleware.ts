import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/", "/privacy", "/api/auth/login"];
const ADMIN_ONLY = ["/controller", "/admin"];
const DEALER_ROUTES = ["/dealer", "/dealer-dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes and static files
  if (PUBLIC_ROUTES.some(r => pathname.startsWith(r)) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const session = req.cookies.get("sde_session")?.value;

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const user = JSON.parse(session);

    // Admin-only routes
    if (ADMIN_ONLY.some(r => pathname.startsWith(r))) {
      const adminRoles = ["SUPER_ADMIN", "EXECUTIVE", "UNDERWRITER", "SENIOR_UNDERWRITER", "FUNDING", "COLLECTIONS", "COMPLIANCE", "ANALYST"];
      if (!adminRoles.includes(user.role)) {
        return NextResponse.redirect(new URL("/dealer", req.url));
      }
    }

    // Dealer routes — must have dealerId
    if (DEALER_ROUTES.some(r => pathname.startsWith(r))) {
      if (!["DEALER_MANAGER", "DEALER_USER"].includes(user.role)) {
        return NextResponse.redirect(new URL("/controller", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
