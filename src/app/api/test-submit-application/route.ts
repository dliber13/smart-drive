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

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
        vehicleYear: toNumberOrNull(body?.vehicleYear),
        vehicleMake: toTextOrNull(body?.vehicleMake),
        vehicleModel: toTextOrNull(body?.vehicleModel),
        vehiclePrice: toNumberOrNull(body?.vehiclePrice),

        downPayment: toNumberOrNull(body?.downPayment),
        tradeIn: toNumberOrNull(body?.tradeIn),
        amountFinanced: toNumberOrNull(body?.amountFinanced),

        creditScore: toNumberOrNull(body?.creditScore),
        monthlyIncome: toNumberOrNull(body?.monthlyIncome),

        status: "SUBMITTED",
      },
    });

    await prisma.statusHistory.create({
      data: {
        id: crypto.randomUUID(),
        applicationId: application.id,
        fromStatus: "DRAFT",
        toStatus: "SUBMITTED",
        note: "Application submitted from intake",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
      applicationId: application.id,
      newStatus: application.status,
    });
  } catch (error: any) {
    console.error("SUBMIT APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to submit application",
      },
      { status: 500 }
    );
  }
}