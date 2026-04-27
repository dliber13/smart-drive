import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Number(value))
  ) {
    return Number(value);
  }
  return fallback;
}

function normalizeText(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim().toLowerCase();
}

function maxMileageAllowed(creditScore: number) {
  if (creditScore >= 720) return 120000;
  if (creditScore >= 660) return 135000;
  if (creditScore >= 600) return 155000;
  if (creditScore >= 540) return 170000;
  return 185000;
}

function maxVehicleAgeAllowed(creditScore: number, currentYear: number) {
  if (creditScore >= 720) return currentYear - 12;
  if (creditScore >= 660) return currentYear - 14;
  if (creditScore >= 600) return currentYear - 16;
  if (creditScore >= 540) return currentYear - 18;
  return currentYear - 20;
}

function lenderVehicleClassRules(lender: string) {
  const normalized = normalizeText(lender);

  if (normalized.includes("global")) {
    return ["sedan", "suv", "truck", "other"];
  }

  if (normalized.includes("westlake")) {
    return ["sedan", "suv", "truck"];
  }

  if (normalized.includes("ally")) {
    return ["sedan", "suv", "truck", "other"];
  }

  if (normalized.includes("credit acceptance")) {
    return ["sedan", "suv", "truck", "other"];
  }

  if (normalized.includes("specialty")) {
    return ["sedan", "suv", "other"];
  }

  return ["sedan", "suv", "truck", "other"];
}

function tierBudgetTolerance(tier: string) {
  const normalized = normalizeText(tier);

  if (normalized === "tier_1") return 1.05;
  if (normalized === "tier_2") return 1.03;
  if (normalized === "tier_3") return 1.0;
  if (normalized === "tier_4") return 0.95;
  if (normalized === "tier_5") return 0.9;

  return 1.0;
}

export async function POST(req: Request) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { success: false, reason: "Missing applicationId" },
        { status: 400 }
      );
    }

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, reason: "Application not found" },
        { status: 404 }
      );
    }

    const creditScore = asNumber(app.creditScore, 0);
    const monthlyIncome = asNumber(app.monthlyIncome, 0);
    const maxPayment = asNumber(app.maxPayment, 0);
    const maxVehicle = asNumber(app.maxVehicle, 0);
    const downPayment = asNumber(app.downPayment, 0);
    const tradeIn = asNumber(app.tradeIn, 0);

    const lender = app.lender || "";
    const tier = app.tier || "";

    const requestedMake = normalizeText(app.vehicleMake);
    const requestedModel = normalizeText(app.vehicleModel);

    const currentYear = new Date().getFullYear();
    const allowedClasses = lenderVehicleClassRules(lender);
    const mileageLimit = maxMileageAllowed(creditScore);
    const minYearAllowed = maxVehicleAgeAllowed(creditScore, currentYear);
    const budgetTolerance = tierBudgetTolerance(tier);

    const effectiveVehicleCap =
      maxVehicle > 0
        ? Math.round(maxVehicle * budgetTolerance)
        : 0;

    const canApproveInventory =
      creditScore >= 540 &&
      monthlyIncome >= 1800 &&
      effectiveVehicleCap > 0 &&
      maxPayment > 0;

    if (!canApproveInventory) {
      return NextResponse.json({
        success: true,
        matches: [],
        inventoryCount: 0,
        maxVehicleUsed: effectiveVehicleCap,
        reason:
          "Application does not meet minimum deal constraints for vehicle matching.",
      });
    }

    const inventory = await (prisma as any).vehicle.findMany({
      where: {
        status: "ACTIVE",
        askingPrice: {
          lte: effectiveVehicleCap,
        },
      },
      orderBy: {
        askingPrice: "asc",
      },
      take: 100,
    });

    const filtered = inventory.filter((unit: any) => {
      const vehicleClass = normalizeText(unit.vehicleClass);
      const mileage = asNumber(unit.mileage, 0);
      const year = asNumber(unit.year, 0);

      if (!allowedClasses.includes(vehicleClass)) return false;
      if (mileage > mileageLimit) return false;
      if (year < minYearAllowed) return false;

      return true;
    });

    const matches = filtered.map((unit: any) => {
      let score = 50;

      const price = asNumber(unit.askingPrice, 0);
      const mileage = asNumber(unit.mileage, 0);

      if (price && effectiveVehicleCap) {
        const ratio = price / effectiveVehicleCap;

        if (ratio <= 0.85) score += 18;
        else if (ratio <= 1.0) score += 28;
        else score -= 40;
      }

      if (unit.year >= currentYear - 3) score += 15;
      else if (unit.year >= currentYear - 6) score += 10;
      else if (unit.year >= currentYear - 10) score += 5;

      if (mileage > 0 && mileage <= 60000) score += 15;
      else if (mileage <= 90000) score += 10;
      else if (mileage <= 120000) score += 5;
      else score -= 10;

      const unitMake = normalizeText(unit.make);
      const unitModel = normalizeText(unit.model);
      const unitClass = normalizeText(unit.vehicleClass);

      if (requestedMake && requestedMake === unitMake) score += 12;
      if (requestedModel && requestedModel === unitModel) score += 15;

      if (!requestedMake && unitClass === "sedan" && creditScore < 620) {
        score += 6;
      }

      if (!requestedMake && unitClass === "suv" && creditScore >= 620) {
        score += 6;
      }

      if (downPayment + tradeIn >= 2000) score += 4;
      if (monthlyIncome >= 4000) score += 4;

      return {
        id: unit.id,
        stockNumber: unit.stockNumber,
        year: unit.year,
        make: unit.make,
        model: unit.model,
        mileage: unit.mileage,
        askingPrice: unit.askingPrice,
        vehicleClass: unit.vehicleClass,
        status: unit.status,
        matchScore: Math.max(1, Math.min(100, Math.round(score))),
      };
    });

    matches.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return NextResponse.json({
      success: true,
      matches: matches.slice(0, 10),
      inventoryCount: filtered.length,
      maxVehicleUsed: effectiveVehicleCap,
      constraints: {
        creditScore,
        monthlyIncome,
        maxPayment,
        maxVehicle: effectiveVehicleCap,
        lender,
        tier,
        mileageLimit,
        minYearAllowed,
        allowedClasses,
      },
    });
  } catch (error: any) {
    console.error("MATCH VEHICLES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Server error",
      },
      { status: 500 }
    );
  }
}