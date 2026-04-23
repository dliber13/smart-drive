import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserRole } from "@/lib/access";

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function smartTier(creditScore: number) {
  if (creditScore >= 720) return "TIER_1";
  if (creditScore >= 660) return "TIER_2";
  if (creditScore >= 600) return "TIER_3";
  if (creditScore >= 540) return "TIER_4";
  return "TIER_5";
}

function smartLender(creditScore: number, monthlyIncome: number) {
  if (creditScore >= 720 && monthlyIncome >= 5000) return "Ally";
  if (creditScore >= 660) return "Westlake";
  if (creditScore >= 600) return "Global Lending";
  if (creditScore >= 540) return "Credit Acceptance";
  return "Specialty Review";
}

function smartMaxPayment(monthlyIncome: number, creditScore: number) {
  const baseRatio =
    creditScore >= 720 ? 0.2 :
    creditScore >= 660 ? 0.18 :
    creditScore >= 600 ? 0.16 :
    creditScore >= 540 ? 0.14 :
    0.12;

  return Math.max(0, Math.round(monthlyIncome * baseRatio));
}

function smartMaxVehicle(
  maxPayment: number,
  downPayment: number,
  tradeIn: number,
  creditScore: number
) {
  const advanceMultiple =
    creditScore >= 720 ? 58 :
    creditScore >= 660 ? 52 :
    creditScore >= 600 ? 46 :
    creditScore >= 540 ? 40 :
    34;

  return Math.max(
    0,
    Math.round(maxPayment * advanceMultiple + downPayment + tradeIn)
  );
}

function smartDealStrength(
  creditScore: number,
  monthlyIncome: number,
  downPayment: number,
  tradeIn: number,
  vehiclePrice: number
) {
  let score = 40;

  if (creditScore >= 720) score += 30;
  else if (creditScore >= 660) score += 24;
  else if (creditScore >= 600) score += 18;
  else if (creditScore >= 540) score += 10;
  else score += 4;

  if (monthlyIncome >= 6000) score += 15;
  else if (monthlyIncome >= 4500) score += 10;
  else if (monthlyIncome >= 3000) score += 6;

  const equity = downPayment + tradeIn;
  if (vehiclePrice > 0) {
    const equityRatio = equity / vehiclePrice;
    if (equityRatio >= 0.2) score += 15;
    else if (equityRatio >= 0.1) score += 10;
    else if (equityRatio >= 0.05) score += 5;
  }

  return Math.max(1, Math.min(100, Math.round(score)));
}

function smartDecision(application: {
  creditScore?: number | null;
  monthlyIncome?: number | null;
  downPayment?: number | null;
  tradeIn?: number | null;
  vehiclePrice?: number | null;
}) {
  const creditScore = toNumber(application.creditScore);
  const monthlyIncome = toNumber(application.monthlyIncome);
  const downPayment = toNumber(application.downPayment);
  const tradeIn = toNumber(application.tradeIn);
  const vehiclePrice = toNumber(application.vehiclePrice);

  const tier = smartTier(creditScore);
  const lender = smartLender(creditScore, monthlyIncome);
  const maxPayment = smartMaxPayment(monthlyIncome, creditScore);
  const maxVehicle = smartMaxVehicle(maxPayment, downPayment, tradeIn, creditScore);
  const dealStrength = smartDealStrength(
    creditScore,
    monthlyIncome,
    downPayment,
    tradeIn,
    vehiclePrice
  );

  let status: "APPROVED" | "DECLINED" = "APPROVED";
  let decisionReason = `Recommended ${tier} with ${lender}.`;

  if (creditScore < 500) {
    status = "DECLINED";
    decisionReason = "Declined due to credit score below minimum review threshold.";
  } else if (monthlyIncome < 1800) {
    status = "DECLINED";
    decisionReason = "Declined due to insufficient monthly income.";
  } else if (vehiclePrice > 0 && maxVehicle > 0 && vehiclePrice > maxVehicle * 1.15) {
    status = "DECLINED";
    decisionReason = "Requested vehicle exceeds recommended structure.";
  } else {
    decisionReason = `Approved ${tier} with ${lender}. Recommended max payment ${maxPayment} and max vehicle ${maxVehicle}.`;
  }

  return {
    status,
    lender,
    tier,
    maxPayment,
    maxVehicle,
    dealStrength,
    decisionReason,
  };
}

export async function POST(request: Request) {
  try {
    const role = getCurrentUserRole(request);

    if (role !== "ADMIN" && role !== "CONTROLLER") {
      return NextResponse.json(
        { success: false, reason: "Only ADMIN or CONTROLLER can save decisions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const applicationId = typeof body?.applicationId === "string" ? body.applicationId : "";

    if (!applicationId) {
      return NextResponse.json(
        { success: false, reason: "Missing applicationId" },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, reason: "Application not found" },
        { status: 404 }
      );
    }

    const smart = smartDecision(application);

    const finalStatus =
      body?.status === "APPROVED" || body?.status === "DECLINED"
        ? body.status
        : smart.status;

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: finalStatus,
        lender:
          typeof body?.lender === "string" && body.lender.trim()
            ? body.lender.trim()
            : smart.lender,
        tier:
          typeof body?.tier === "string" && body.tier.trim()
            ? body.tier.trim()
            : smart.tier,
        maxPayment:
          body?.maxPayment !== undefined && body?.maxPayment !== null && body?.maxPayment !== ""
            ? toNumber(body.maxPayment)
            : smart.maxPayment,
        maxVehicle:
          body?.maxVehicle !== undefined && body?.maxVehicle !== null && body?.maxVehicle !== ""
            ? toNumber(body.maxVehicle)
            : smart.maxVehicle,
        dealStrength:
          body?.dealStrength !== undefined && body?.dealStrength !== null && body?.dealStrength !== ""
            ? toNumber(body.dealStrength)
            : smart.dealStrength,
        decisionReason:
          typeof body?.decisionReason === "string" && body.decisionReason.trim()
            ? body.decisionReason.trim()
            : smart.decisionReason,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        finalStatus === "APPROVED"
          ? "Application approved successfully."
          : "Application declined successfully.",
      application: updatedApplication,
      smartRecommendation: smart,
    });
  } catch (error: any) {
    console.error("CONTROLLER DECISION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to save controller decision",
      },
      { status: 500 }
    );
  }
}
