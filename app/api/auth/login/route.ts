import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = String(body.email || "").trim().toLowerCase()
    const password = String(body.password || "")

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { team: true },
    })

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const token = createSessionToken(user.id)
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        teamId: user.teamId,
        teamName: user.team?.name ?? null,
      },
    })

    response.cookies.set({
      ...sessionCookieOptions(),
      value: token,
    })

    return response
  } catch (error) {
    console.error("LOGIN ERROR:", error)
    return NextResponse.json(
      { error: "Failed to log in" },
      { status: 500 }
    )
  }
}
