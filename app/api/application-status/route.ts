import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

const allowedStatuses = ["DRAFT", "READY", "SUBMITTED", "APPROVED", "REJECTED", "FUNDED"]

export async function POST(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (currentUserRole !== "ADMIN" && currentUserRole !== "CONTROLLER") {
      return NextResponse.json(
        {
          success: false,
          reason: "Only ADMIN or CONTROLLER can change application status",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const body = await request.json()

    if (!body.applicationId) {
      return NextResponse.json(
        {
          success: false,
          reason: "Missing applicationId",
        },
        { status: 400 }
      )
    }

    if (!body.newStatus || !allowedStatuses.includes(body.newStatus)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Invalid newStatus value",
        },
        { status: 400 }
      )
    }

    const existingApplication = await prisma.application.findUnique({
      where: { id: body.applicationId },
    })

    if (!existingApplication) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
        },
        { status: 404 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id: body.applicationId },
      data: {
        status: body.newStatus,
        decisionReason:
          body.decisionReason ?? existingApplication.decisionReason ?? null,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Application moved to ${body.newStatus}`,
      application: updatedApplication,
      currentUserRole,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Status update failed",
      },
      { status: 500 }
    )
  }
}
