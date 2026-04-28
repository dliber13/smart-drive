import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { runDecisionEngine } from "../../../lib/decision-engine";

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

    // 1. Run decision engine before saving
    const decisionInput = {
      firstName: toTextOrNull(body?.firstName),
      lastName: toTextOrNull(body?.lastName),
      phone: toTextOrNull(body?.phone),
      email: toTextOrNull(body?.email),

      identityType: toTextOrNull(body?.identityType),
      identityValue: toTextOrNull(body?.identityValue),
      issuingCountry: toTextOrNull(body?.issuingCountry),
      identityStatus: toTextOrNull(body?.identityStatus),

      stockNumber: toTextOrNull(body?.stockNumber),
      vin: toTextOrNull(body?.vin),
      vehicleYear: toNumberOrNull(body?.vehicleYear),
      vehicleMake: toTextOrNull(body?.vehicleMake),
      vehicleModel: toTextOrNull(body?.vehicleModel),
      vehiclePrice: toNumberOrNull(body?.vehiclePrice),
      mileage: toNumberOrNull(body?.mileage),

      downPayment: toNumberOrNull(body?.downPayment),
      tradeIn: toNumberOrNull(body?.tradeIn),
      amountFinanced: toNumberOrNull(body?.amountFinanced),

      creditScore: toNumberOrNull(body?.creditScore),
      monthlyIncome: toNumberOrNull(body?.monthlyIncome),

      incomeType: toTextOrNull(body?.incomeType),
      employmentMonths: toNumberOrNull(body?.employmentMonths),
      residenceMonths: toNumberOrNull(body?.residenceMonths),
      bankruptcyStatus: toTextOrNull(body?.bankruptcyStatus),
      repoCount: toNumberOrNull(body?.repoCount),
      state: toTextOrNull(body?.state),
    };

    const decision = runDecisionEngine(decisionInput);

    // 2. Save application with decision results
    const application = await prisma.application.create({
      data: {
        firstName: decisionInput.firstName,
        lastName: decisionInput.lastName,
        phone: decisionInput.phone,
        email: decisionInput.email,

        identityType: decisionInput.identityType,
        identityValue: decisionInput.identityValue,
        issuingCountry: decisionInput.issuingCountry,
        identityStatus: decisionInput.identityStatus ?? "PENDING",

        stockNumber: decisionInput.stockNumber,
        vin: decisionInput.vin,
        vehicleYear: decisionInput.vehicleYear,
        vehicleMake: decisionInput.vehicleMake,
        vehicleModel: decisionInput.vehicleModel,
        vehiclePrice: decisionInput.vehiclePrice,

        downPayment: decisionInput.downPayment,
        tradeIn: decisionInput.tradeIn,
        amountFinanced: decisionInput.amountFinanced,

        creditScore: decisionInput.creditScore,
        monthlyIncome: decisionInput.monthlyIncome,

        // Decision engine results
        status: decision.status === "APPROVED" ? "APPROVED" : "DECLINED",
        tier: decision.lenderTier,
        lender: decision.lender,
        maxPayment: decision.maxPayment,
        maxVehicle: decision.maxVehicle,
        dealStrength: decision.dealStrength,
        decisionReason: decision.decisionReason,
      },
    });

    // 3. Log status history
    await prisma.statusHistory.create({
      data: {
        id: crypto.randomUUID(),
        applicationId: application.id,
        fromStatus: "DRAFT",
        toStatus: decision.status === "APPROVED" ? "APPROVED" : "DECLINED",
        note: `Auto-decisioned by Smart Drive Elite engine. ${decision.decisionReason}`,
      },
    });

    // 4. Return full decision output to the dealer
    return NextResponse.json({
      success: true,
      message:
        decision.status === "APPROVED"
          ? "Application approved."
          : "Application declined.",
      applicationId: application.id,
      decision: {
        status: decision.status,
        riskTier: decision.riskTier,
        recommendedDealType: decision.recommendedDealType,
        alternateDealType: decision.alternateDealType ?? null,
        dealTypeReason: decision.dealTypeReason,
        lender: decision.lender,
        lenderTier: decision.lenderTier,
        apr: decision.apr,
        termMonths: decision.termMonths,
        maxPayment: decision.maxPayment,
        maxVehicle: decision.maxVehicle,
        dealStrength: decision.dealStrength,
        pti: decision.pti,
        estimatedDTI: decision.estimatedDTI,
        decisionReason: decision.decisionReason,
        lenderWaterfall: decision.lenderWaterfall,
      },
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