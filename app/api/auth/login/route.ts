import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSessionToken, sessionCookieOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const password =
      typeof body?.password === "string" ? body.password.trim() : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Temporary simple check because current seed value is plain text in passwordHash.
    // Later we should upgrade this to real hashing.
    if (user.passwordHash !== password) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const token = createSessionToken(user.id);

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    response.cookies.set({
      ...sessionCookieOptions(),
      value: token,
    });

    return response;
  } catch (error: any) {
    console.error("Login route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Login failed.",
      },
      { status: 500 }
    );
  }
}
