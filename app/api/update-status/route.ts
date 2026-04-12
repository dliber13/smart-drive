import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizeStatus(value: unknown) {
  const status = String(value ?? "").trim().toUpperCase();

  if (
    status === "DRAFT" ||
    status === "READY" ||
    status === "SUBMITTED" ||
    status === "APPROVED" ||
    status === "REJECTED" ||
    status === "FUNDED"
  ) {
    return status;
  }

  return null;
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
