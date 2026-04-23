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

export async function POST(request: Request) {
  try {
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
        vehicleYear: toNumberOrNull(body?.vehicleYear),
        vehicleMake: toTextOrNull(body?.vehicleMake),
        vehicleModel: toTextOrNull(body?.vehicleModel),
        vehiclePrice: toNumberOrNull(body?.vehiclePrice),

        downPayment: toNumberOrNull(body?.downPayment),
        tradeIn: toNumberOrNull(body?.tradeIn),
        amountFinanced: toNumberOrNull(body?.amountFinanced),

        creditScore: toNumberOrNull(body?.creditScore),
        monthlyIncome: toNumberOrNull(body?.monthlyIncome),

        status: "DRAFT",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully",
      application,
    });
  } catch (error: any) {
    console.error("SAVE APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to save application",
      },
      { status: 500 }
    );
  }
}
