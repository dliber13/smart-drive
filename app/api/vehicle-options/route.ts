import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

<<<<<<< HEAD
function stockSortValue(stockNumber: string | null | undefined) {
=======
function stockSortValue(stockNumber: string) {
>>>>>>> cafa814 (save current Smart Drive updates)
  const text = String(stockNumber || "").trim().toUpperCase();
  const numeric = Number(text.replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? Number.MAX_SAFE_INTEGER : numeric;
}

<<<<<<< HEAD
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

async function readInventory() {
  const db = prisma as any;

  const attempts = [
    `SELECT * FROM public."Vehicle" LIMIT 500`,
    `SELECT * FROM public."InventoryUnit" LIMIT 500`,
    `SELECT * FROM public.vehicle LIMIT 500`,
    `SELECT * FROM public.inventoryunit LIMIT 500`,
  ];

  let lastError: any = null;

  for (const sql of attempts) {
    try {
      const rows = await db.$queryRawUnsafe(sql);
      if (Array.isArray(rows)) {
        return rows;
      }
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No inventory table found");
}

export async function GET() {
  try {
    const inventory = (await readInventory()) as any[];

    const vehicles = [...inventory].sort((a, b) => {
      const stockA = stockSortValue(a.stockNumber || a.stock_number);
      const stockB = stockSortValue(b.stockNumber || b.stock_number);

      if (stockA !== stockB) return stockA - stockB;

      return String(a.stockNumber || a.stock_number || "").localeCompare(
        String(b.stockNumber || b.stock_number || "")
      );
=======
export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        status: "ACTIVE",
      },
      select: {
        id: true,
        stockNumber: true,
        year: true,
        make: true,
        model: true,
        mileage: true,
        vehicleClass: true,
        askingPrice: true,
        status: true,
      },
      take: 500,
    });

    const sortedVehicles = [...vehicles].sort((a, b) => {
      const stockA = stockSortValue(a.stockNumber);
      const stockB = stockSortValue(b.stockNumber);

      if (stockA !== stockB) return stockA - stockB;

      return String(a.stockNumber).localeCompare(String(b.stockNumber));
>>>>>>> cafa814 (save current Smart Drive updates)
    });

    return NextResponse.json({
      success: true,
<<<<<<< HEAD
      count: vehicles.length,
      vehicles: vehicles.map((v) => {
        const price =
          toNumber(v.askingPrice) ||
          toNumber(v.asking_price) ||
          toNumber(v.price) ||
          toNumber(v.vehiclePrice) ||
          toNumber(v.vehicle_price) ||
          toNumber(v.retailPrice) ||
          toNumber(v.retail_price) ||
          toNumber(v.listPrice) ||
          toNumber(v.list_price);

        return {
          id: v.id,
          stockNumber: v.stockNumber || v.stock_number || "",
          vin: v.vin || v.VIN || "",
          year: v.year || 0,
          make: v.make || "",
          model: v.model || "",
          mileage: v.mileage || 0,
          vehicleClass:
            v.vehicleClass ||
            v.vehicle_class ||
            v.bodyStyle ||
            v.body_style ||
            v.trim ||
            "",
          askingPrice: price,
          status: v.status || "ACTIVE",
        };
      }),
=======
      vehicles: sortedVehicles,
      count: sortedVehicles.length,
>>>>>>> cafa814 (save current Smart Drive updates)
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
<<<<<<< HEAD
}
=======
}
>>>>>>> cafa814 (save current Smart Drive updates)
