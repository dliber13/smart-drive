import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toTextOrNull(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function toNumberOrNull(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text) return null;
  const parsed = Number(text);
  return Number.isNaN(parsed) ? null : parsed;
}

function normalizeStatus(value: unknown) {
  const status = String(value ?? "").trim().toUpperCase();
  if (status === "APPROVED" || status === "DECLINED") return status;
  return "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const applicationId = toTextOrNull(body?.applicationId);
    const nextStatus = normalizeStatus(body?.status);

    if (!applicationId) {
      return NextResponse.json(
        { success: false, reason: "Missing applicationId" },
        { status: 400 }
      );
    }

    if (!nextStatus) {
      return NextResponse.json(
        { success: false, reason: "Status must be APPROVED or DECLINED" },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, reason: "Application not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: nextStatus,
        lender: toTextOrNull(body?.lender),
        tier: toTextOrNull(body?.tier),
        maxPayment: toNumberOrNull(body?.maxPayment),
        maxVehicle: toNumberOrNull(body?.maxVehicle),
        dealStrength: toNumberOrNull(body?.dealStrength),
        decisionReason: toTextOrNull(body?.decisionReason),
      },
    });

    await prisma.statusHistory.create({
      data: {
        id: crypto.randomUUID(),
        applicationId: applicationId,
        fromStatus: String(existing.status ?? "SUBMITTED"),
        toStatus: nextStatus,
        note:
          toTextOrNull(body?.decisionReason) ||
          `Application ${nextStatus.toLowerCase()} by controller`,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Application ${nextStatus.toLowerCase()} successfully`,
      application: updated,
    });
  } catch (error: any) {
    console.error("CONTROLLER DECISION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to process controller decision",
      },
      { status: 500 }
    );
  }
}
