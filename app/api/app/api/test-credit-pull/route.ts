import { NextResponse } from "next/server"

export async function GET() {
  try {
    // 🔒 Simulated current logged-in user role
    const currentUserRole = "SALES"

    if (currentUserRole !== "ADMIN" && currentUserRole !== "CONTROLLER") {
      return NextResponse.json(
        {
          success: false,
          error: "CREDIT PULL BLOCKED",
          reason: "Only ADMIN or CONTROLLER can pull credit",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Credit pull allowed",
      currentUserRole,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: "Something broke",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
