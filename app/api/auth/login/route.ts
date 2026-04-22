import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        {
          success: false,
          reason: "Email is required",
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    let role: "ADMIN" | "CONTROLLER" | "SALES" = "SALES"

    if (normalizedEmail.includes("admin")) {
      role = "ADMIN"
    } else if (
      normalizedEmail.includes("controller") ||
      normalizedEmail.includes("finance")
    ) {
      role = "CONTROLLER"
    }

    return NextResponse.json({
      success: true,
      user: {
        email: normalizedEmail,
        role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Login failed",
      },
      { status: 500 }
    )
  }
}
