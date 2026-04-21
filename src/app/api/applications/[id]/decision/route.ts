import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { runDecisionEngine } from "../../../../lib/decision-engine"
import { getCurrentUserRole } from "../../../../lib/access"

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

    const decision = runDecisionEngine({
      firstName: application.firstName,
      lastName: application.lastName,
      phone: application.phone,
      email: application.email,

      identityType: application.identityType,
      identityValue: application.identityValue,
      issuingCountry: application.issuingCountry,
      identityStatus: application.identityStatus,

      stockNumber: application.stockNumber,
      vin: application.vin,
      vehicleYear: application.vehicleYear,
      vehicleMake: application.vehicleMake,
      vehicleModel: application.vehicleModel,
      vehiclePrice: application.vehiclePrice,

      downPayment: application.downPayment,
      tradeIn: application.tradeIn,
      amountFinanced: application.amountFinanced,

      creditScore: application.creditScore,
      monthlyIncome: application.monthlyIncome,
    })

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
      message: "Decision engine completed successfully",
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
