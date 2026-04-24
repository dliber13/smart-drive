import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toText(value: unknown, fallback = "") {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed || fallback;
  }
  return fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const applicationId = toText(body?.applicationId || body?.id);
    const nextStatus = toText(body?.status).toUpperCase();
    const note = toText(body?.note);

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
          reason: "Missing status",
        },
        { status: 400 }
      );
    }

    const existingApplication = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existingApplication) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
        },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        decisionReason: note || existingApplication.decisionReason,
      },
    });

    console.log("STATUS HISTORY SKIPPED (update-status)", {
      applicationId: updatedApplication.id,
      fromStatus: existingApplication.status ?? "DRAFT",
      toStatus: nextStatus,
      note,
    });

    return NextResponse.json({
      success: true,
      message: "Application status updated",
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