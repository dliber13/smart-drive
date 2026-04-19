import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { canSubmitDeal, getCurrentUserRole } from "@/lib/access";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

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

    const updatedApplication = await prisma.application.update({
      where: { id: latestDraftApplication.id },
      data: {
        status: "SUBMITTED",
      },
    });

    try {
      await prisma.statusHistory.create({
        data: {
          applicationId: updatedApplication.id,
          fromStatus: latestDraftApplication.status ?? "DRAFT",
          toStatus: "SUBMITTED",
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
    console.error("TEST SUBMIT APPLICATION ERROR:", error);

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

export async function GET(request: Request) {
  return handleSubmit(request);
}

export async function POST(request: Request) {
  return handleSubmit(request);
}
