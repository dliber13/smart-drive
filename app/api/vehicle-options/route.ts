import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: {
        stockNumber: "asc",
      },
      select: {
        id: true,
        stockNumber: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        price: true,
      },
    });

    return NextResponse.json({
      success: true,
      vehicles,
    });
  } catch (error) {
    console.error("VEHICLE OPTIONS ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load vehicles" },
      { status: 500 }
    );
  }
}
