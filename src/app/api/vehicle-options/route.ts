import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: "ACTIVE",
      },
      orderBy: [
        { make: "asc" },
        { model: "asc" },
      ],
      select: {
        id: true,
        stockNumber: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        trim: true,
        mileage: true,
        askingPrice: true,
        vehicleClass: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error) {
    console.error("Vehicle options error:", error);
    return NextResponse.json(
      { success: false, reason: "Failed to load inventory" },
      { status: 500 }
    );
  }
}
