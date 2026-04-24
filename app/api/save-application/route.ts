import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toTextOrNull(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

<<<<<<< HEAD
function toNumberOrNull(value: unknown) {
=======
function toIntOrNull(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (!text) return null;
  const parsed = Number(text);
  if (Number.isNaN(parsed)) return null;
  return Math.round(parsed);
}

function toFloatOrNull(value: unknown) {
>>>>>>> cafa814 (save current Smart Drive updates)
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
        email: toTextOrNull(body?.email),
        phone: toTextOrNull(body?.phone),

        identityType: toTextOrNull(body?.identityType),
        identityValue: toTextOrNull(body?.identityValue),
        issuingCountry: toTextOrNull(body?.issuingCountry),
        identityStatus: toTextOrNull(body?.identityStatus) ?? "PENDING",

<<<<<<< HEAD
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
=======
        creditScore: toIntOrNull(body?.creditScore),
        monthlyIncome: toIntOrNull(body?.monthlyIncome),

        stockNumber: toTextOrNull(body?.stockNumber),
        vin: toTextOrNull(body?.vin),
        vehicleYear: toIntOrNull(body?.vehicleYear),
        vehicleMake: toTextOrNull(body?.vehicleMake),
        vehicleModel: toTextOrNull(body?.vehicleModel),
        vehiclePrice: toFloatOrNull(body?.vehiclePrice),

        downPayment: toFloatOrNull(body?.downPayment),
        tradeIn: toFloatOrNull(body?.tradeIn),
        amountFinanced: toFloatOrNull(body?.amountFinanced),

        requestedVehicle: toTextOrNull(body?.requestedVehicle),
        requestedPrice: toFloatOrNull(body?.requestedPrice),
>>>>>>> cafa814 (save current Smart Drive updates)

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