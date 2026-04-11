import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { canSubmitDeal, getCurrentUserRole } from "@/lib/access"
import {
  getNextSubmittedStatus,
  validateApplicationForSubmission,
} from "@/lib/applicationRules"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (!canSubmitDeal(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "SUBMISSION BLOCKED",
          reason: "Current user role cannot submit deals",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const latestApplication = await prisma.application.findFirst({
      orderBy: { createdAt: "desc" },
    })

    if (!latestApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "NO APPLICATION FOUND",
          reason: "There is no application available to submit",
        },
        { status: 404 }
      )
    }

    const validation = validateApplicationForSubmission(latestApplication)

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "APPLICATION BLOCKED",
          reason: "Identity verification required before submission",
          validationReasons: validation.reasons,
          applicationId: latestApplication.id,
          currentUserRole,
        },
        { status: 400 }
      )
    }

    const updatedApplication = await prisma.application.update({
      where: { id: latestApplication.id },
      data: {
        status: getNextSubmittedStatus(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      applicationId: updatedApplication.id,
      newStatus: updatedApplication.status,
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
