import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_STATUSES = [
  "DRAFT",
  "READY",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "FUNDED",
] as const;

type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

function normalizeStatus(value: unknown): AllowedStatus | null {
  const status = String(value ?? "").trim().toUpperCase();

  if (ALLOWED_STATUSES.includes(status as AllowedStatus)) {
    return status as AllowedStatus;
  }

  return null;
}

function canTransition(currentStatus: string, nextStatus: AllowedStatus) {
  const current = currentStatus.toUpperCase();

  if (current === nextStatus) return true;

  const allowedTransitions: Record<string, AllowedStatus[]> = {
    DRAFT: ["READY", "SUBMITTED", "REJECTED"],
    READY: ["SUBMITTED", "REJECTED", "DRAFT"],
    SUBMITTED: ["APPROVED", "REJECTED", "READY"],
    APPROVED: ["FUNDED", "SUBMITTED", "REJECTED"],
    REJECTED: ["SUBMITTED", "READY"],
    FUNDED: ["FUNDED"],
  };

  return allowedTransitions[current]?.includes(nextStatus) ?? false;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const applicationId =
      typeof body?.applicationId === "string"
        ? body.applicationId
        : typeof body?.id === "string"
        ? body.id
        : "";

    const nextStatus = normalizeStatus(body?.status);

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          reason: "Missing applicationId",
        },
        { status: 400 }
      );
    }

    if (!nextStatus) {
      return NextResponse.json(
        {
          success: false,
          reason:
            "Invalid status. Allowed values: DRAFT, READY, SUBMITTED, APPROVED, REJECTED, FUNDED",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
        },
        { status: 404 }
      );
    }

    const currentStatus = String(existing.status ?? "DRAFT").toUpperCase();

    if (!canTransition(currentStatus, nextStatus)) {
      return NextResponse.json(
        {
          success: false,
          reason: `Invalid status transition from ${currentStatus} to ${nextStatus}`,
          currentStatus,
          requestedStatus: nextStatus,
        },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: { status: nextStatus },
    });

    return NextResponse.json({
      success: true,
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("Update status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update application status",
      },
      { status: 500 }
    );
  }
}
