import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { canSubmitDeal, getCurrentUserRole } from "@/lib/access"
import { runDecisionEngine } from "@/lib/decisionEngine"
import { getLenderOptions } from "@/lib/lenderEngine"

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

async function handleSubmit(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (!canSubmitDeal(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "SUBMISSION_BLOCKED",
          message: "Current user role cannot submit deals.",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const body = await request.json()
    const applicationId = String(body?.applicationId || "").trim()

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          error: "MISSING_APPLICATION_ID",
          message: "Application ID is required before submission.",
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
          error: "APPLICATION_NOT_FOUND",
          message: "Application was not found.",
          applicationId,
        },
        { status: 404 }
      )
    }

    const currentStatus = String(existingApplication.status || "").toUpperCase()

    if (currentStatus !== "DRAFT") {
      return NextResponse.json(
        {
          success: false,
          error: "INVALID_STATUS",
          message: `Only DRAFT applications can be submitted. Current status: ${currentStatus}.`,
          applicationId,
        },
        { status: 400 }
      )
    }

    const decision = runDecisionEngine({
      creditScore: existingApplication.creditScore,
      monthlyIncome: existingApplication.monthlyIncome,
      amountFinanced: existingApplication.amountFinanced,
    })

    const lenderOptions = getLenderOptions({
      tier: decision.tier,
      monthlyIncome: existingApplication.monthlyIncome,
    })

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "SUBMITTED",
        tier: decision.tier,
        dealStrength: decision.score,
        decisionReason: decision.decision,
        lender: lenderOptions.lenders.join(", "),
        maxVehicle: lenderOptions.maxVehicle,
        maxPayment: lenderOptions.maxPayment,
      },
    })

    try {
      await prisma.statusHistory.create({
        data: {
          applicationId: updatedApplication.id,
          fromStatus: existingApplication.status ?? "DRAFT",
          toStatus: "SUBMITTED",
          note: `Application submitted from dealer intake | Tier ${decision.tier} | Score ${decision.score} | ${decision.decision} | Lenders: ${lenderOptions.lenders.join(", ")}`,
        },
      })
    } catch (historyError: any) {
      console.error("SUBMIT STATUS HISTORY ERROR:", historyError)
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: updatedApplication.id,
      newStatus: updatedApplication.status,
      tier: updatedApplication.tier,
      dealStrength: updatedApplication.dealStrength,
      decisionReason: updatedApplication.decisionReason,
      lender: updatedApplication.lender,
      maxVehicle: updatedApplication.maxVehicle,
      maxPayment: updatedApplication.maxPayment,
      currentUserRole,
    })
  } catch (error: any) {
    console.error("TEST SUBMIT APPLICATION ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        error: "SUBMIT_APPLICATION_FAILED",
        message: error?.message || "Unknown submission error.",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET(request: Request) {
  return handleSubmit(request)
}

export async function POST(request: Request) {
  return handleSubmit(request)
}
