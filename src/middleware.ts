import { NextRequest, NextResponse } from "next/server";

export const runtime = "experimental-edge";

const PUBLIC_ROUTES = ["/login", "/", "/privacy", "/terms", "/request-access", "/signup"];
const ADMIN_ONLY = ["/controller", "/admin"];
const DEALER_ROUTES = ["/dealer", "/dealer-dashboard"];

function verifySessionEdge(token: string): object | null {
  try {
    const dotIndex = token.lastIndexOf(".");
    if (dotIndex === -1) return null;
    const payloadB64 = token.substring(0, dotIndex);
    const payload = Buffer.from(payloadB64, "base64").toString("utf8");
    const parsed = JSON.parse(payload);
    if (!parsed || !parsed.id || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    PUBLIC_ROUTES.some(r => pathname === r || pathname.startsWith(r + "/")) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/request-access")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("sde_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  const user = verifySessionEdge(token) as any;
  if (!user) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("sde_session", "", { maxAge: 0, path: "/" });
    return res;
  }

  const adminRoles = ["SUPER_ADMIN","EXECUTIVE","UNDERWRITER","SENIOR_UNDERWRITER","FUNDING","COLLECTIONS","COMPLIANCE","ANALYST"];

  if (ADMIN_ONLY.some(r => pathname.startsWith(r)) && !adminRoles.includes(user.role)) {
    return NextResponse.redirect(new URL("/dealer", req.url));
  }

  if (
    DEALER_ROUTES.some(r => pathname.startsWith(r)) &&
    !["DEALER_MANAGER","DEALER_USER",...adminRoles].includes(user.role)
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
