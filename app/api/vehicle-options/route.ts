import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function stockSortValue(stockNumber: string | null | undefined) {
  const text = String(stockNumber || "").trim().toUpperCase();
  const numeric = Number(text.replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? Number.MAX_SAFE_INTEGER : numeric;
}

function toNumber(value: unknown) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;

  if (
    typeof value === "string" &&
    value.trim() !== "" &&
    !Number.isNaN(Number(value))
  ) {
    return Number(value);
  }

  return 0;
}

export async function GET() {
  try {
    const db = prisma as any;

    const inventory = (await db.vehicle.findMany({
      take: 500,
    })) as any[];

    const vehicles = [...inventory].sort((a, b) => {
      const stockA = stockSortValue(a.stockNumber);
      const stockB = stockSortValue(b.stockNumber);

      if (stockA !== stockB) return stockA - stockB;

      return String(a.stockNumber || "").localeCompare(
        String(b.stockNumber || "")
      );
    });

    return NextResponse.json({
      success: true,
      count: vehicles.length,
      vehicles: vehicles.map((v) => {
        const price =
          toNumber(v.askingPrice) ||
          toNumber(v.price) ||
          toNumber(v.vehiclePrice) ||
          toNumber(v.retailPrice) ||
          toNumber(v.listPrice);

        return {
          id: v.id,
          stockNumber: v.stockNumber || "",
          vin: v.vin || "",
          year: v.year || 0,
          make: v.make || "",
          model: v.model || "",
          mileage: v.mileage || 0,
          vehicleClass: v.vehicleClass || v.bodyStyle || v.trim || "",
          askingPrice: price,
          status: v.status || "ACTIVE",
        };
      }),
    });
  } catch (error: any) {
    console.error("VEHICLE OPTIONS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to load vehicle options",
      },
      { status: 500 }
    );
  }
}
