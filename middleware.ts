import { NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"

const PROTECTED_PATHS = [
  "/dashboard",
  "/dealer",
  "/underwriting",
  "/admin",
]

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  if (!isProtected) {
    return NextResponse.next()
  }

  const token = req.cookies.get("sdf_session")?.value
  const session = verifySessionToken(token)

  if (!session) {
    const loginUrl = new URL("/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/dealer/:path*", "/underwriting/:path*", "/admin/:path*"],
}
