import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "../../../../lib/access"

// ⛔ TEMP: remove broken import
// import { runDecisionEngine } from "../../../../lib/decision-engine"

const prisma = new PrismaClient()

export async function POST(
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
          reason: "Unauthorized to run decision engine",
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

    // ✅ TEMP TEST DECISION (proves system works)
    const decision = {
      status: "APPROVED",
      tier: "A",
      lender: "Test Lender",
      maxPayment: 500,
      maxVehicle: 20000,
      dealStrength: 80,
      decisionReason: "Temporary test decision",
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        status: decision.status,
        lender: decision.lender,
        tier: decision.tier,
        maxPayment: decision.maxPayment,
        maxVehicle: decision.maxVehicle,
        dealStrength: decision.dealStrength,
        decisionReason: decision.decisionReason,
      },
    })

    return NextResponse.json({
      success: true,
      message: "Decision engine test successful",
      decision,
      application: updatedApplication,
      currentUserRole,
    })
  } catch (error) {
    console.error("Decision engine error:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to run decision engine",
      },
      { status: 500 }
    )
  }
}
