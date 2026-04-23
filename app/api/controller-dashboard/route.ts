import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserRole } from "@/lib/access";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const role = getCurrentUserRole(request);

    if (role !== "ADMIN" && role !== "CONTROLLER") {
      return NextResponse.json(
        {
          success: false,
          reason: "Only ADMIN or CONTROLLER can access the controller dashboard",
        },
        { status: 403 }
      );
    }

    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,

        identityType: true,
        identityValue: true,
        issuingCountry: true,
        identityStatus: true,

        stockNumber: true,
        vin: true,
        vehicleYear: true,
        vehicleMake: true,
        vehicleModel: true,
        vehiclePrice: true,

        downPayment: true,
        tradeIn: true,
        amountFinanced: true,

        creditScore: true,
        monthlyIncome: true,

        status: true,
        lender: true,
        tier: true,
        maxPayment: true,
        maxVehicle: true,
        dealStrength: true,
        decisionReason: true,
      },
    });

    return NextResponse.json({
      success: true,
      applications,
      count: applications.length,
      currentUserRole: role,
    });
  } catch (error: any) {
    console.error("CONTROLLER DASHBOARD ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to load controller dashboard",
      },
      { status: 500 }
    );
  }
}
