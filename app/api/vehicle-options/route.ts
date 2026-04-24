import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function stockSortValue(stockNumber: string | null) {
  const text = String(stockNumber || "").trim().toUpperCase();
  const numeric = Number(text.replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? Number.MAX_SAFE_INTEGER : numeric;
}

export async function GET() {
  try {
    const inventory = await prisma.inventoryUnit.findMany({
      where: {
        isAvailable: true,
      },
      select: {
        id: true,
        stockNumber: true,
        vin: true,
        year: true,
        make: true,
        model: true,
        mileage: true,
        askingPrice: true,
        status: true,
      },
      take: 500,
    });

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
      vehicles: vehicles.map((v) => ({
        id: v.id,
        stockNumber: v.stockNumber || "",
        vin: v.vin || "",
        year: v.year || 0,
        make: v.make || "",
        model: v.model || "",
        mileage: v.mileage || 0,
        askingPrice: v.askingPrice || 0,
        status: v.status || "ACTIVE",
      })),
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
