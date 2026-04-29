import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { signSession } from "@/lib/session";
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 attempts per IP per 15 minutes
    const ip = getIP(req);
    const rl = rateLimit(`login:${ip}`, 5, 15 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required" }, { status: 400 });

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { DealerUser: { include: { Dealer: true } } }
    });

    if (!user || !user.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    if (!user.isActive) return NextResponse.json({ error: "Account is inactive" }, { status: 403 });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const dealer = user.DealerUser?.[0]?.Dealer ?? null;
    const sessionData = {
      id: user.id, email: user.email, firstName: user.firstName,
      lastName: user.lastName, fullName: user.fullName, role: user.role,
      dealerId: dealer?.id ?? null, dealerName: dealer?.name ?? null,
      dealerNumber: dealer?.dealerNumber ?? null, iat: Date.now(),
    };

    let redirectTo = "/dealer";
    if (["SUPER_ADMIN","EXECUTIVE","UNDERWRITER","SENIOR_UNDERWRITER","FUNDING","COLLECTIONS","COMPLIANCE","ANALYST"].includes(user.role)) {
      redirectTo = "/controller";
    } else if (user.role === "DEALER_MANAGER") {
      redirectTo = "/dealer-dashboard";
    }

    const signedToken = signSession(sessionData);
    const response = NextResponse.json({ success: true, user: sessionData, redirectTo });
    response.cookies.set("sde_session", signedToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 8, path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
