import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const applicationId =
      typeof body?.applicationId === "string" ? body.applicationId : "";

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

    const maxVehicle =
      toNumber(application.maxVehicle) ||
      toNumber(application.vehiclePrice) ||
      toNumber(application.monthlyIncome) * 12 * 0.5;

    const inventory = await prisma.inventoryUnit.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        price: "asc",
      },
      take: 50,
    });

    const matches = inventory
      .filter((v) => {
        const price = toNumber(v.price);
        if (!price) return false;
        if (maxVehicle > 0 && price > maxVehicle) return false;
        if (v.minCreditScore && toNumber(application.creditScore) < v.minCreditScore) {
          return false;
        }
        return true;
      })
      .map((v) => {
        let score = 50;

        if (
          application.vehicleMake &&
          v.make &&
          application.vehicleMake.toLowerCase() === v.make.toLowerCase()
        ) {
          score += 20;
        }

        if (
          application.vehicleModel &&
          v.model &&
          application.vehicleModel.toLowerCase() === v.model.toLowerCase()
        ) {
          score += 20;
        }

        if (toNumber(v.mileage) <= 60000) score += 10;
        if (toNumber(v.price) <= maxVehicle * 0.9) score += 10;

        return {
          id: v.id,
          stockNumber: v.stockNumber,
          year: v.year,
          make: v.make,
          model: v.model,
          mileage: v.mileage,
          askingPrice: v.price,
          vehicleClass: v.bodyStyle,
          status: v.isAvailable ? "ACTIVE" : "INACTIVE",
          matchScore: Math.min(score, 100),
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      applicationId,
      matchCount: matches.length,
      matches,
    });
  } catch (error: any) {
    console.error("MATCH VEHICLES ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to match vehicles",
      },
      { status: 500 }
    );
  }
}
