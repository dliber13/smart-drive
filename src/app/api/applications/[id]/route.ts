import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserRole = await getCurrentUserRole()

    if (
      currentUserRole !== "ADMIN" &&
      currentUserRole !== "CONTROLLER" &&
      currentUserRole !== "SALES"
    ) {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized to access application",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const { id } = await context.params

    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      application,
      currentUserRole,
    })
  } catch (error) {
    console.error("Application fetch error:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to load application",
      },
      { status: 500 }
    )
  }
}
