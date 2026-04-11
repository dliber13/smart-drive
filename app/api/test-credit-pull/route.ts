import { NextResponse } from "next/server"
import { canPullCredit, getCurrentUserRole } from "@/lib/access"

export async function GET(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (!canPullCredit(currentUserRole)) {
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
