import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

function toNumberOrNull(value: any) {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export async function POST(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (currentUserRole !== "ADMIN" && currentUserRole !== "CONTROLLER") {
      return NextResponse.json(
        {
          success: false,
          reason: "Only ADMIN or CONTROLLER can make controller decisions",
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

    if (!body.action || !["APPROVE", "REJECT"].includes(body.action)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Action must be APPROVE or REJECT",
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
        status: body.action === "APPROVE" ? "APPROVED" : "REJECTED",
        lender: body.lender ?? existingApplication.lender ?? null,
        tier: body.tier ?? existingApplication.tier ?? null,
        maxPayment:
          toNumberOrNull(body.maxPayment) ?? existingApplication.maxPayment ?? null,
        maxVehicle:
          toNumberOrNull(body.maxVehicle) ?? existingApplication.maxVehicle ?? null,
        decisionReason:
          body.decisionReason ?? existingApplication.decisionReason ?? null,
        dealStrength:
          toNumberOrNull(body.dealStrength) ?? existingApplication.dealStrength ?? null,
      },
    })

    return NextResponse.json({
      success: true,
      message:
        body.action === "APPROVE"
          ? "Application approved successfully"
          : "Application rejected successfully",
      application: updatedApplication,
      currentUserRole,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Controller decision failed",
      },
      { status: 500 }
    )
  }
}
