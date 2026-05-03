import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";
import { runDecisionEngine } from "../../../lib/decision-engine";
import { pullCredit } from "../../../lib/creditEngine";
import { runIBLEngine } from "../../../lib/iblEngine";
import { runProgramRouter } from "../../../lib/programRouter";

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

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    const user = token ? verifySession(token) as any : null;
    const body = await req.json();
    const decisionStartTime = Date.now();

    // Load platform settings
    let iblAprOverride = 0.2499;
    try {
      const aprSetting = await prisma.platformSetting.findUnique({ where: { key: "ibl_apr" } });
      if (aprSetting) iblAprOverride = parseFloat(aprSetting.value) / 100;
    } catch {}

    // Load platform settings
    let iblAprOverride = 0.2499;
    try {
      const aprSetting = await prisma.platformSetting.findUnique({ where: { key: "ibl_apr" } });
      if (aprSetting) iblAprOverride = parseFloat(aprSetting.value) / 100;
    } catch {}

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

    // Pull credit (mock until 700Credit live)
    const creditResult = await pullCredit({
      ssn: toTextOrNull(body?.ssn),
      dob: toTextOrNull(body?.dob),
      firstName: toTextOrNull(body?.firstName),
      lastName: toTextOrNull(body?.lastName),
      creditScore: toNumberOrNull(body?.creditScore),
      monthlyIncome: toNumberOrNull(body?.monthlyIncome),
    });

    // Merge credit data into decision input
    decisionInput.creditScore = decisionInput.creditScore ?? creditResult.score;
    decisionInput.bankruptcyStatus = creditResult.bankruptcyStatus;
    decisionInput.repoCount = creditResult.repoCount;

    // Run IBL engine first (program waterfall: IBL → Retail → Lease → Subscription)
    const iblResult = runIBLEngine({
      monthlyIncome: toNumberOrNull(body?.monthlyIncome) ?? 0,
      payFrequency: (toTextOrNull(body?.payFrequency) ?? "BIWEEKLY") as "WEEKLY" | "BIWEEKLY" | "SEMIMONTHLY" | "MONTHLY",
      monthlyExpenses: toNumberOrNull(body?.monthlyExpenses) ?? 0,
      employmentMonths: ((toNumberOrNull(body?.employmentYears) ?? 0) * 12) + (toNumberOrNull(body?.employmentMonths) ?? 0),
      residenceMonths: ((toNumberOrNull(body?.residenceYears) ?? 0) * 12) + (toNumberOrNull(body?.residenceMonths) ?? 0),
      creditScore: decisionInput.creditScore ?? 0,
      downPayment: toNumberOrNull(body?.downPayment) ?? 0,
      tradeIn: toNumberOrNull(body?.tradeIn) ?? 0,
      vehiclePrice: toNumberOrNull(body?.vehiclePrice) ?? 0,
      bankruptcyStatus: creditResult.bankruptcyStatus,
      repoCount: creditResult.repoCount,
      incomeType: toTextOrNull(body?.incomeType) ?? "W2",
    });

    // If IBL eligible, override decision input with IBL max vehicle
    if (iblResult.eligible) {
      decisionInput.incomeType = decisionInput.incomeType || "IBL";
    }

    const decision = runDecisionEngine(decisionInput);

    // Run program router — IBL → Retail → Lease → Subscription
    const programResult = runProgramRouter({
      ibl: iblResult,
      retail: decision,
      vehiclePrice: toNumberOrNull(body?.vehiclePrice) ?? 0,
      monthlyIncome: toNumberOrNull(body?.monthlyIncome) ?? 0,
      creditScore: decisionInput.creditScore ?? 0,
      payFrequency: toTextOrNull(body?.payFrequency) ?? "BIWEEKLY",
    });

    // 2. Save application with decision results
    const application = await prisma.application.create({
      data: {
        dealNumber: `SDE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        decisionMs: Date.now() - decisionStartTime,
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
        tier: programResult.assignedProgram === "IBL" ? `IBL Band ${iblResult.riskBand}` : decision.lenderTier,
        lender: programResult.assignedProgram === "IBL" ? "IBL / In-House" : programResult.assignedProgram === "LEASE" ? "Lease Program" : programResult.assignedProgram === "SUBSCRIPTION" ? "Subscription Program" : decision.lender,
        maxPayment: programResult.finalMaxPayment || decision.maxPayment,
        maxVehicle: programResult.finalMaxVehicle || decision.maxVehicle,
        dealStrength: decision.dealStrength,
        decisionReason: programResult.assignedProgram === "IBL"
          ? `Approved — IBL Income Based Lending. Band ${iblResult.riskBand} — Score ${iblResult.score}/100. Required down: $${(iblResult.requiredDown||0).toLocaleString()}. Max vehicle: $${(programResult.finalMaxVehicle||0).toLocaleString()}. Deal strength ${decision.dealStrength}/100.`
          : decision.decisionReason,
        programWaterfallJson: {
          assignedProgram: programResult.assignedProgram,
          programReason: programResult.programReason,
          iblEligible: programResult.iblEligible,
          retailEligible: programResult.retailEligible,
          leaseEligible: programResult.leaseEligible,
          subscriptionEligible: programResult.subscriptionEligible,
          waterfallTrace: programResult.waterfallTrace,
          iblScore: iblResult.score,
          iblBand: iblResult.riskBand,
          iblRequiredDown: iblResult.requiredDown,
          iblDeclineReasons: iblResult.declineReasons,
          finalMaxPayment: programResult.finalMaxPayment,
          finalMaxVehicle: programResult.finalMaxVehicle,
          finalTerm: programResult.finalTerm,
          finalLender: programResult.finalLender,
          finalAPR: programResult.finalAPR,
        },
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
      decisionTimeMs: Date.now() - decisionStartTime,
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
      programWaterfall: {
        assignedProgram: programResult.assignedProgram,
        programReason: programResult.programReason,
        iblEligible: programResult.iblEligible,
        retailEligible: programResult.retailEligible,
        leaseEligible: programResult.leaseEligible,
        subscriptionEligible: programResult.subscriptionEligible,
        waterfallTrace: programResult.waterfallTrace,
        finalMaxPayment: programResult.finalMaxPayment,
        finalMaxVehicle: programResult.finalMaxVehicle,
        finalWeeklyPayment: programResult.finalWeeklyPayment,
        finalBiweeklyPayment: programResult.finalBiweeklyPayment,
        finalTerm: programResult.finalTerm,
        finalLender: programResult.finalLender,
        finalAPR: programResult.finalAPR,
        iblScore: iblResult.score,
        iblBand: iblResult.riskBand,
        iblRequiredDown: iblResult.requiredDown,
        iblDeclineReasons: iblResult.declineReasons,
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