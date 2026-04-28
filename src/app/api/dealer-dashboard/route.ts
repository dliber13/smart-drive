import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        creditScore: true,
        monthlyIncome: true,
        vehiclePrice: true,
        vehicleMake: true,
        vehicleModel: true,
        status: true,
        tier: true,
        lender: true,
        maxPayment: true,
        maxVehicle: true,
        dealStrength: true,
        decisionReason: true,
      },
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("DEALER DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, reason: error?.message || "Failed to load applications" },
      { status: 500 }
    );
  }
}
