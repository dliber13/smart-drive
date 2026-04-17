import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUserRole } from "@/lib/access";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

function canSaveDraft(role: string | null | undefined) {
  const normalized = String(role ?? "").toUpperCase();
  return (
    normalized === "ADMIN" ||
    normalized === "CONTROLLER" ||
    normalized === "SALES"
  );
}

function toTextOrNull(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

function toIntOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed =
    typeof value === "number" ? Math.trunc(value) : parseInt(String(value), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function toFloatOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const parsed =
    typeof value === "number" ? value : parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
}

export async function POST(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request);

    if (!canSaveDraft(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Current user role cannot save deals.",
          currentUserRole,
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const application = await prisma.application.create({
      data: {
        firstName: toTextOrNull(body?.firstName),
        lastName: toTextOrNull(body?.lastName),
        phone: toTextOrNull(body?.phone),
        email: toTextOrNull(body?.email),

        identityType: toTextOrNull(body?.identityType),
        identityValue: toTextOrNull(body?.identityValue),
        issuingCountry: toTextOrNull(body?.issuingCountry),
        identityStatus: toTextOrNull(body?.identityStatus) ?? "PENDING",

        stockNumber: toTextOrNull(body?.stockNumber),
        vin: toTextOrNull(body?.vin),
        vehicleYear: toIntOrNull(body?.vehicleYear),
        vehicleMake: toTextOrNull(body?.vehicleMake),
        vehicleModel: toTextOrNull(body?.vehicleModel),
        vehiclePrice: toFloatOrNull(body?.vehiclePrice),

        downPayment: toFloatOrNull(body?.downPayment),
        tradeIn: toFloatOrNull(body?.tradeIn),
        amountFinanced: toFloatOrNull(body?.amountFinanced),

        creditScore: toIntOrNull(body?.creditScore),
        monthlyIncome: toFloatOrNull(body?.monthlyIncome),

        status: toTextOrNull(body?.status) ?? "DRAFT",
      },
    });

    try {
      await prisma.statusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus: null,
          toStatus: application.status ?? "DRAFT",
          note: "Application draft created",
        },
      });
    } catch (historyError) {
      console.error("SAVE APPLICATION STATUS HISTORY ERROR:", historyError);
    }

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully.",
      applicationId: application.id,
      status: application.status,
      currentUserRole,
    });
  } catch (error: any) {
    console.error("SAVE APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Draft save failed.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
