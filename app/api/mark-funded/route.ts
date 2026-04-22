import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function asNumber(value: unknown, fallback: number | null = null) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
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

    const fundingAmount = asNumber(body?.fundingAmount);

    const fundingDate =
      typeof body?.fundingDate === "string" && body.fundingDate.trim()
        ? new Date(body.fundingDate)
        : new Date();

    const note =
      typeof body?.note === "string" && body.note.trim()
        ? body.note.trim()
        : "Application marked funded";

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          reason: "Missing applicationId",
        },
        { status: 400 }
      );
    }

    if (fundingDate && Number.isNaN(fundingDate.getTime())) {
      return NextResponse.json(
        {
          success: false,
          reason: "Invalid fundingDate",
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

    if (currentStatus !== "APPROVED" && currentStatus !== "FUNDED") {
      return NextResponse.json(
        {
          success: false,
          reason: "Only approved applications can be marked as funded",
          currentStatus,
        },
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const updatedApplication = await tx.application.update({
        where: { id: applicationId },
        data: {
          status: "FUNDED",
          fundingDate,
          fundingAmount,
          decisionReason: existing.decisionReason ?? note,
        },
      });

      await tx.statusHistory.create({
        data: {
          applicationId,
          fromStatus: currentStatus,
          toStatus: "FUNDED",
          changedByRole: "CONTROLLER",
          note,
        },
      });

      return updatedApplication;
    });

    return NextResponse.json({
      success: true,
      message: "Application marked as funded",
      application: result,
    });
  } catch (error: any) {
    console.error("Mark funded error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to mark application as funded",
      },
      { status: 500 }
    );
  }
}
