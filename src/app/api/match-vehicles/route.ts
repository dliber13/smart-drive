import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) return Number(value);
  return fallback;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ success: false, reason: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ success: false, reason: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const applicationId = typeof body?.applicationId === "string" ? body.applicationId.trim() : "";
    if (!applicationId) return NextResponse.json({ success: false, reason: "Missing applicationId" }, { status: 400 });

    const application = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) return NextResponse.json({ success: false, reason: "Application not found" }, { status: 404 });

    const creditScore = toNumber(application.creditScore);
    const monthlyIncome = toNumber(application.monthlyIncome);
    const maxVehicle = toNumber(application.maxVehicle) || toNumber(application.vehiclePrice) || monthlyIncome * 6;
    const lender = (application.lender || "").toLowerCase();
    const tier = (application.tier || "").toLowerCase();
    const currentYear = new Date().getFullYear();

    // Lender-specific constraints
    let maxMileage = 999999;
    let maxVehicleAge = 30;
    let maxPrice = maxVehicle;

    if (lender.includes("global lending")) {
      maxMileage = tier.includes("select") ? 80000 : tier.includes("tier 1") ? 120000 : 150000;
      maxPrice = Math.min(maxVehicle, 55000);
    } else if (lender.includes("westlake")) {
      maxPrice = Math.min(maxVehicle, 50000);
    } else if (lender.includes("cps")) {
      maxVehicleAge = 15;
      maxPrice = Math.min(maxVehicle, 55000);
    } else if (lender.includes("midwest")) {
      maxPrice = Math.min(maxVehicle, 20000);
    } else if (lender.includes("western funding") || lender.includes("in-house") || lender.includes("bhph")) {
      maxPrice = Math.min(maxVehicle, 25000);
      maxMileage = 150000;
    }

    // Fetch active inventory
    const inventory = await prisma.vehicle.findMany({
      where: { status: "ACTIVE" },
      orderBy: { askingPrice: "asc" },
      take: 100,
    });

    const matches = inventory
      .filter(unit => {
        const price = toNumber(unit.askingPrice);
        const mileage = toNumber(unit.mileage);
        const year = toNumber(unit.year);
        const age = currentYear - year;

        if (!price || price <= 0) return false;
        if (price > maxPrice) return false;
        if (mileage > maxMileage) return false;
        if (age > maxVehicleAge) return false;
        if (unit.vehicleRiskScore && creditScore > 0 && creditScore < toNumber(unit.vehicleRiskScore)) return false;

        return true;
      })
      .map(unit => {
        const price = toNumber(unit.askingPrice);
        const mileage = toNumber(unit.mileage);
        const year = toNumber(unit.year);
        let score = 40;

        // Price fit (0-25) — how well the price fits within budget
        if (maxVehicle > 0) {
          const pricePct = price / maxVehicle;
          if (pricePct <= 0.70) score += 15; // well under budget
          else if (pricePct <= 0.85) score += 25; // sweet spot
          else if (pricePct <= 0.95) score += 20; // close to max
          else if (pricePct <= 1.00) score += 12; // right at max
        }

        // Mileage score (0-20)
        if (mileage <= 30000) score += 20;
        else if (mileage <= 60000) score += 16;
        else if (mileage <= 90000) score += 12;
        else if (mileage <= 120000) score += 7;
        else score += 2;

        // Vehicle age score (0-10)
        const age = currentYear - year;
        if (age <= 2) score += 10;
        else if (age <= 4) score += 8;
        else if (age <= 6) score += 6;
        else if (age <= 8) score += 4;
        else score += 1;

        // Make/model preference match (0-10)
        if (application.vehicleMake && unit.make &&
            application.vehicleMake.toLowerCase() === unit.make.toLowerCase()) {
          score += 5;
          if (application.vehicleModel && unit.model &&
              application.vehicleModel.toLowerCase() === unit.model.toLowerCase()) {
            score += 5;
          }
        }

        // Dealer margin score (0-15) — higher margin = better for dealer
        const bookVal = toNumber(unit.bookValue);
        const totalCost = toNumber(unit.totalCost);
        const costBasis = bookVal > 0 ? bookVal : totalCost > 0 ? totalCost : 0;
        if (costBasis > 0) {
          const margin = price - costBasis;
          const marginPct = margin / price;
          if (marginPct >= 0.20) score += 15;
          else if (marginPct >= 0.15) score += 12;
          else if (marginPct >= 0.10) score += 8;
          else if (marginPct >= 0.05) score += 4;
          else score += 1;
        }

        // Subtract points for right at or over limit
        if (price >= maxPrice * 0.98) score -= 5;

        return {
          id: unit.id,
          stockNumber: unit.stockNumber,
          year: unit.year,
          make: unit.make,
          model: unit.model,
          trim: unit.trim,
          mileage: unit.mileage,
          askingPrice: unit.askingPrice,
          vehicleClass: unit.vehicleClass,
          status: unit.status,
          matchScore: Math.min(Math.max(score, 1), 100),
          priceVsBudget: maxVehicle > 0 ? Math.round((price / maxVehicle) * 100) : 0,
          eligible: true,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 15);

    // Calculate gap for ineligible vehicles
    const ineligibleMatches = inventory
      .filter(unit => {
        const price = toNumber(unit.askingPrice);
        const mileage = toNumber(unit.mileage);
        const year = toNumber(unit.year);
        const age = currentYear - year;
        if (!price || price <= 0) return false;
        // Already in eligible list
        if (matches.find(m => m.id === unit.id)) return false;
        return true;
      })
      .slice(0, 20)
      .map(unit => {
        const price = toNumber(unit.askingPrice);
        const mileage = toNumber(unit.mileage);
        const year = toNumber(unit.year);
        const age = currentYear - year;

        // Calculate reasons and down payment gap
        const reasons: string[] = [];
        let additionalDownNeeded = 0;

        if (price > maxPrice) {
          const gap = price - maxPrice;
          additionalDownNeeded = Math.max(additionalDownNeeded, gap);
          reasons.push(`$${gap.toLocaleString()} over lender max`);
        }
        if (mileage > maxMileage) reasons.push(`${(mileage - maxMileage).toLocaleString()} miles over limit`);
        if (age > maxVehicleAge) reasons.push(`Vehicle age ${age} years exceeds limit`);

        return {
          id: unit.id,
          stockNumber: unit.stockNumber,
          year: unit.year,
          make: unit.make,
          model: unit.model,
          trim: unit.trim,
          mileage: unit.mileage,
          askingPrice: unit.askingPrice,
          vehicleClass: unit.vehicleClass,
          eligible: false,
          ineligibleReasons: reasons,
          additionalDownNeeded: Math.ceil(additionalDownNeeded / 100) * 100,
          priceVsBudget: maxVehicle > 0 ? Math.round((price / maxVehicle) * 100) : 0,
          matchScore: 0,
        };
      });

    return NextResponse.json({
      success: true,
      applicationId,
      maxVehicle,
      lenderConstraints: { maxMileage, maxVehicleAge, maxPrice },
      matchCount: matches.length,
      matches,
      ineligibleMatches,
    });
  } catch (error: any) {
    console.error("MATCH VEHICLES ERROR:", error);
    return NextResponse.json({ success: false, reason: error?.message || "Failed to match vehicles" }, { status: 500 });
  }
}
