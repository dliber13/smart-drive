import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function cleanString(value: unknown) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim();
  return cleaned.length ? cleaned : null;
}

function cleanNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isNaN(number) ? null : number;
}

function cleanInt(value: unknown) {
  const number = cleanNumber(value);
  return number === null ? null : Math.round(number);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = prisma as any;

    const firstName = cleanString(body.firstName);
    const lastName = cleanString(body.lastName);

    const vehicleYear = cleanInt(body.vehicleYear);
    const vehiclePrice = cleanNumber(body.vehiclePrice);
    const downPayment = cleanNumber(body.downPayment);
    const tradeIn = cleanNumber(body.tradeIn);

    const amountFinanced =
      cleanNumber(body.amountFinanced) ??
      Math.max((vehiclePrice ?? 0) - (downPayment ?? 0) - (tradeIn ?? 0), 0);

    const requestedVehicle =
      cleanString(body.requestedVehicle) ||
      [body.vehicleYear, body.vehicleMake, body.vehicleModel]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      null;

    const application = await db.application.create({
      data: {
        firstName,
        lastName,
        customerFirstName: firstName,
        customerLastName: lastName,

        email: cleanString(body.email),
        phone: cleanString(body.phone),

        identityType: cleanString(body.identityType),
        identityValue: cleanString(body.identityValue),
        issuingCountry: cleanString(body.issuingCountry),
        identityStatus: cleanString(body.identityStatus) || "PENDING",

        creditScore: cleanInt(body.creditScore),
        monthlyIncome: cleanInt(body.monthlyIncome),
        grossIncome: cleanNumber(body.monthlyIncome),

        stockNumber: cleanString(body.stockNumber),
        vin: cleanString(body.vin),
        vehicleYear,
        vehicleMake: cleanString(body.vehicleMake),
        vehicleModel: cleanString(body.vehicleModel),
        vehiclePrice,

        requestedVehicle,
        requestedPrice: cleanNumber(body.requestedPrice) ?? vehiclePrice,

        downPayment,
        tradeIn,
        amountFinanced,

        status: "DRAFT",
      },
    });

    return NextResponse.json({
      success: true,
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
