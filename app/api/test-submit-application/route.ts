import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { canSubmitDeal, getCurrentUserRole } from "@/lib/access";
import {
  getNextSubmittedStatus,
  validateApplicationForSubmission,
} from "@/lib/applicationRules";

const prisma = new PrismaClient();

async function handleSubmit(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request);

    if (!canSubmitDeal(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          error: "SUBMISSION_BLOCKED",
          message: "Current user role cannot submit deals.",
          currentUserRole,
        },
        { status: 403 }
      );
    }

    const latestApplication = await prisma.application.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!latestApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "NO_APPLICATION_FOUND",
          message: "There is no application available to submit.",
        },
        { status: 404 }
      );
    }

    const validation = validateApplicationForSubmission(latestApplication);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "APPLICATION_BLOCKED",
          message: "Application is not ready for submission.",
          validationReasons: validation.reasons,
          applicationId: latestApplication.id,
          currentUserRole,
        },
        { status: 400 }
      );
    }

    const nextStatus = getNextSubmittedStatus();

    const updatedApplication = await prisma.application.update({
      where: { id: latestApplication.id },
      data: {
        status: nextStatus,
      },
    });

    try {
      await prisma.statusHistory.create({
        data: {
          applicationId: updatedApplication.id,
          fromStatus: latestApplication.status ?? "DRAFT",
          toStatus: nextStatus,
          note: "Application submitted from dealer intake",
        },
      });
    } catch (historyError: any) {
      console.error("STATUS HISTORY ERROR:", historyError);
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: updatedApplication.id,
      newStatus: updatedApplication.status,
      currentUserRole,
    });
  } catch (error: any) {
    console.error("SUBMIT APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: "SUBMIT_APPLICATION_FAILED",
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return handleSubmit(request);
}

export async function POST(request: Request) {
  return handleSubmit(request);
}
