import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole, canPullCredit, canSubmitDeal } from "@/lib/access"
import { validateApplicationForSubmission } from "@/lib/applicationRules"
import { canMoveToReady, getNextStatus } from "@/lib/status"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    const app = await prisma.application.create({
      data: {
        firstName: "System",
        lastName: "Check",
        identityType: "SSN",
        identityValue: "555667777",
        issuingCountry: "US",
        identityStatus: "VERIFIED",
        status: "DRAFT",
      },
    })

    const readiness = canMoveToReady(app)
    const submissionValidation = validateApplicationForSubmission(app)

    let movedStatus = app.status

    if (app.status === "DRAFT" && readiness) {
      movedStatus = "READY"
    } else {
      movedStatus = getNextStatus(app.status)
    }

    const updatedApp = await prisma.application.update({
      where: { id: app.id },
      data: {
        status: movedStatus,
      },
    })

    return NextResponse.json({
      success: true,
      systemCheck: {
        currentUserRole,
        canSubmitDeal: canSubmitDeal(currentUserRole),
        canPullCredit: canPullCredit(currentUserRole),
        submissionValid: submissionValidation.isValid,
        submissionReasons: submissionValidation.reasons,
        originalStatus: app.status,
        newStatus: updatedApp.status,
      },
      application: updatedApp,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
