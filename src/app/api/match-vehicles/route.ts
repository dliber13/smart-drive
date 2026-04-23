import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const applicationId = body?.applicationId;

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

    // 🔥 Pull inventory correctly
    const inventory = await prisma.inventoryUnit.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        price: "asc",
      },
    });

    // 🔥 Matching logic
    const matches = inventory
      .filter((unit) => {
        if (!unit.price) return false;

        // Budget check
        if (app.maxVehicle && unit.price > app.maxVehicle) return false;

        // Credit check
        if (unit.minCreditScore && app.creditScore) {
          if (app.creditScore < unit.minCreditScore) return false;
        }

        return true;
      })
      .slice(0, 10); // top 10 matches

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
