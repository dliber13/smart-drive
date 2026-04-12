import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!Array.isArray(body)) {
      return NextResponse.json({ success: false, reason: "Invalid data" }, { status: 400 });
    }

    const created = [];

    for (const row of body) {
      const vehicle = await prisma.vehicle.upsert({
        where: { stockNumber: String(row["Stock Number"]) },
        update: {
          year: Number(row["Year"]) || null,
          make: row["Make"] || null,
          model: row["Model"] || null,
          mileage: Number(row["Odometer"]) || null,
          askingPrice: Number(row["Asking Price"]) || null,
          totalCost: Number(row["Total Cost"]) || null,
          jdTrade: Number(row["J.D. Power Clean Trade"]) || null,
          jdRetail: Number(row["J.D. Power Clean Retail"]) || null,
        },
        create: {
          stockNumber: String(row["Stock Number"]),
          year: Number(row["Year"]) || null,
          make: row["Make"] || null,
          model: row["Model"] || null,
          mileage: Number(row["Odometer"]) || null,
          askingPrice: Number(row["Asking Price"]) || null,
          totalCost: Number(row["Total Cost"]) || null,
          jdTrade: Number(row["J.D. Power Clean Trade"]) || null,
          jdRetail: Number(row["J.D. Power Clean Retail"]) || null,
        },
      });

      created.push(vehicle);
    }

    return NextResponse.json({
      success: true,
      count: created.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
