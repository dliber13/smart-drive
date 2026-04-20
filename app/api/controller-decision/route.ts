import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

function canControllerDecide(role: string | null | undefined) {
  const normalized = String(role ?? "").toUpperCase()
  return normalized === "ADMIN" || normalized === "CONTROLLER"
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  if (!text) return null
  const parsed = Number(text)
  return Number.isNaN(parsed) ? null : parsed
}

function toTextOrNull(value: unknown) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

function calculateDeal(application: {
  creditScore?: number | null
  monthlyIncome?: number | null
  downPayment?: number | null
  vehiclePrice?: number | null
}) {
  let score = 0

  const creditScore = application.creditScore ?? 0
  const monthlyIncome = application.monthlyIncome ?? 0
  const downPayment = application.downPayment ?? 0
  const vehiclePrice = application.vehiclePrice ?? 0

  // CREDIT SCORE
  if (creditScore >= 720) score += 40
  else if (creditScore >= 660) score += 30
  else if (creditScore >= 600) score += 20
  else if (creditScore > 0) score += 10

  // MONTHLY INCOME
  if (monthlyIncome >= 6000) score += 25
  else if (monthlyIncome >= 4000) score += 15
  else if (monthlyIncome > 0) score += 5

  // DOWN PAYMENT
  if (downPayment >= 5000) score += 20
  else if (downPayment >= 2000) score += 10
  else if (downPayment > 0) score += 5

  // VEHICLE AFFORDABILITY
  if (vehiclePrice > 0 && monthlyIncome > 0) {
    const ratio = vehiclePrice / (monthlyIncome * 12)

    if (ratio < 0.4) score += 15
    else if (ratio < 0.6) score += 10
    else score += 0
  }

  let tier = "D"
  if (score >= 80) tier = "A"
  else if (score >= 65) tier = "B"
  else if (score >= 50) tier = "C"

  let decision = "DECLINE"
  if (score >= 70) decision = "APPROVE"
  else if (score >= 50) decision = "REVIEW"

  return {
    score,
    tier,
    decision,
  }
}

export async function POST(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (!canControllerDecide(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized to make controller decisions.",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const body = await request.json()

    const applicationId = toTextOrNull(body?.applicationId)
    const action = String(body?.action ?? "").trim().toUpperCase()

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Application ID is required.",
        },
        { status: 400 }
      )
    }

    if (action !== "APPROVE" && action !== "REJECT") {
      return NextResponse.json(
        {
          success: false,
          message: "Action must be APPROVE or REJECT.",
        },
        { status: 400 }
      )
    }

    const existingApplication = await prisma.application.findUnique({
      where: { id: applicationId },
    })

    if (!existingApplication) {
      return NextResponse.json(
        {
          success: false,
          message: "Application not found.",
          applicationId,
        },
        { status: 404 }
      )
    }

    const calculated = calculateDeal({
      creditScore: existingApplication.creditScore,
      monthlyIncome: existingApplication.monthlyIncome,
      downPayment: existingApplication.downPayment,
      vehiclePrice: existingApplication.vehiclePrice,
    })

    const lender = toTextOrNull(body?.lender)
    const manualTier = toTextOrNull(body?.tier)
    const manualDecisionReason = toTextOrNull(body?.decisionReason)
    const maxPayment = toNumberOrNull(body?.maxPayment)
    const maxVehicle = toNumberOrNull(body?.maxVehicle)
    const manualDealStrength = toNumberOrNull(body?.dealStrength)

    const nextStatus = action === "APPROVE" ? "APPROVED" : "DECLINED"

    const finalTier = manualTier ?? calculated.tier
    const finalDealStrength = manualDealStrength ?? calculated.score
    const finalDecisionReason =
      manualDecisionReason ??
      (action === "APPROVE"
        ? `Approved by controller | Suggested: ${calculated.decision}`
        : `Rejected by controller | Suggested: ${calculated.decision}`)

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        lender,
        tier: finalTier,
        maxPayment,
        maxVehicle,
        decisionReason: finalDecisionReason,
        dealStrength: finalDealStrength,
      },
    })

    try {
      await prisma.statusHistory.create({
        data: {
          applicationId: updatedApplication.id,
          fromStatus: existingApplication.status ?? "SUBMITTED",
          toStatus: nextStatus,
          note:
            action === "APPROVE"
              ? `Controller approved | Tier ${finalTier} | Score ${finalDealStrength}`
              : `Controller declined | Tier ${finalTier} | Score ${finalDealStrength}`,
        },
      })
    } catch (historyError: any) {
      console.error("CONTROLLER STATUS HISTORY ERROR:", historyError)
    }

    return NextResponse.json({
      success: true,
      message:
        action === "APPROVE"
          ? "Deal approved successfully."
          : "Deal rejected successfully.",
      application: updatedApplication,
      calculated,
      currentUserRole,
    })
  } catch (error: any) {
    console.error("CONTROLLER DECISION ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Controller decision failed.",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
