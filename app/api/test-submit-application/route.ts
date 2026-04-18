import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { canSubmitDeal, getCurrentUserRole } from "@/lib/access";
import {
  getNextSubmittedStatus,
  validateApplicationForSubmission,
} from "@/lib/applicationRules";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
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

    const latestDraftApplication = await prisma.application.findFirst({
      where: {
        status: "DRAFT",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!latestDraftApplication) {
      return NextResponse.json(
        {
          success: false,
          error: "NO_DRAFT_FOUND",
          message: "No draft application was found to submit.",
        },
        { status: 404 }
      );
    }

    const validation = validateApplicationForSubmission(latestDraftApplication);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "APPLICATION_NOT_READY",
          message: "Application is not ready for submission.",
          validationReasons: validation.reasons,
          applicationId: latestDraftApplication.id,
          currentUserRole,
        },
        { status: 400 }
      );
    }

    const nextStatus = getNextSubmittedStatus();

    const updatedApplication = await prisma.application.update({
      where: { id: latestDraftApplication.id },
      data: {
        status: nextStatus,
      },
    });

    try {
      await prisma.statusHistory.create({
        data: {
          applicationId: updatedApplication.id,
          fromStatus: latestDraftApplication.status ?? "DRAFT",
          toStatus: nextStatus,
          note: "Application submitted from dealer intake",
        },
      });
    } catch (historyError: any) {
      console.error("SUBMIT STATUS HISTORY ERROR:", historyError);
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
        message: error?.message || "Unknown submission error.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
