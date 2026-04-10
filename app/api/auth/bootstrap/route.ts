import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createSessionToken, hashPassword, sessionCookieOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const existingUsers = await prisma.user.count()

    if (existingUsers > 0) {
      return NextResponse.json(
        { error: "Bootstrap is no longer available" },
        { status: 403 }
      )
    }

    const body = await req.json()
    const email = String(body.email || "").trim().toLowerCase()
    const fullName = String(body.fullName || "").trim()
    const password = String(body.password || "")

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { error: "Email, full name, and password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash: hashPassword(password),
        role: "ADMIN",
      },
    })

    const token = createSessionToken(user.id)
    const response = NextResponse.json({ success: true, role: user.role })

    response.cookies.set({
      ...sessionCookieOptions(),
      value: token,
    })

    return response
  } catch (error) {
    console.error("BOOTSTRAP ERROR:", error)
    return NextResponse.json(
      { error: "Failed to bootstrap admin user" },
      { status: 500 }
    )
  }
}
