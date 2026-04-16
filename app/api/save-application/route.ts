import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUserRole } from "@/lib/access";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

function canSaveDraft(role: string | null | undefined) {
  const normalized = String(role ?? "").toUpperCase();
  return normalized === "ADMIN" || normalized === "CONTROLLER" || normalized === "SALES";
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
        firstName: body?.firstName ?? null,
        lastName: body?.lastName ?? null,
        phone: body?.phone ?? null,
        email: body?.email ?? null,

        identityType: body?.identityType ?? null,
        identityValue: body?.identityValue ?? null,
        issuingCountry: body?.issuingCountry ?? null,
        identityStatus: body?.identityStatus ?? "PENDING",

        stockNumber: body?.stockNumber ?? null,
        vin: body?.vin ?? null,
        vehicleYear: body?.vehicleYear ?? null,
        vehicleMake: body?.vehicleMake ?? null,
        vehicleModel: body?.vehicleModel ?? null,
        vehiclePrice: body?.vehiclePrice ?? null,

        downPayment: body?.downPayment ?? null,
        tradeIn: body?.tradeIn ?? null,
        amountFinanced: body?.amountFinanced ?? null,

        creditScore: body?.creditScore ?? null,
        monthlyIncome: body?.monthlyIncome ?? null,

        status: body?.status ?? "DRAFT",
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
  }
}
