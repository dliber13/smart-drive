import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.inventoryUnit.findMany({
      where: {
        isAvailable: true,
      },
      orderBy: {
        stockNumber: "asc", // 🔥 smallest to largest (your request)
      },
    });

    return NextResponse.json({
      success: true,
      vehicles: vehicles.map((v) => ({
        id: v.id,
        stockNumber: v.stockNumber,
        vin: v.vin,
        year: v.year,
        make: v.make,
        model: v.model,
        mileage: v.mileage,
        vehicleClass: v.vehicleClass,
        askingPrice: v.askingPrice,
        status: v.status,
      })),
    });
  } catch (error) {
    console.error("VEHICLE OPTIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to load vehicle options",
      },
      { status: 500 }
    );
  }
}
