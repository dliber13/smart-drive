import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
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
