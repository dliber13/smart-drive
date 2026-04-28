import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { dealerId, vehicles } = await req.json();

    if (!dealerId || !vehicles?.length) {
      return NextResponse.json({ error: "dealerId and vehicles required" }, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const v of vehicles) {
      try {
        const stockNumber = v.stockNumber || v.stock || v["Stock #"] || v["stock_number"];
        const vin = v.vin || v.VIN || v["VIN"];
        const year = parseInt(v.year || v.Year || v["Year"]);
        const make = v.make || v.Make || v["Make"];
        const model = v.model || v.Model || v["Model"];
        const askingPrice = parseFloat(String(v.askingPrice || v.price || v.Price || v["Asking Price"] || "0").replace(/[$,]/g, ""));
        const mileage = parseInt(String(v.mileage || v.Mileage || v["Miles"] || "0").replace(/,/g, ""));

        if (!stockNumber || !make || !model || !year) {
          skipped++;
          continue;
        }

        // Upsert by stockNumber + dealerId
        await prisma.vehicle.upsert({
          where: { stockNumber },
          update: {
            vin: vin || null,
            year,
            make,
            model,
            trim: v.trim || v.Trim || null,
            askingPrice: askingPrice || 0,
            mileage: mileage || 0,
            status: "ACTIVE",
            dealerId,
            vehicleClass: v.vehicleClass || v["Vehicle Class"] || "USED",
            bodyType: v.bodyType || v["Body Type"] || null,
            transmission: v.transmission || v.Transmission || null,
            fuelType: v.fuelType || v["Fuel Type"] || null,
          },
          create: {
            stockNumber,
            vin: vin || null,
            year,
            make,
            model,
            trim: v.trim || v.Trim || null,
            askingPrice: askingPrice || 0,
            mileage: mileage || 0,
            status: "ACTIVE",
            dealerId,
            vehicleClass: v.vehicleClass || v["Vehicle Class"] || "USED",
            bodyType: v.bodyType || v["Body Type"] || null,
            transmission: v.transmission || v.Transmission || null,
            fuelType: v.fuelType || v["Fuel Type"] || null,
          },
        });
        imported++;
      } catch (err: any) {
        errors.push(`Row error: ${err.message}`);
        skipped++;
      }
    }

    return NextResponse.json({ success: true, imported, skipped, errors });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
