import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Papa from "papaparse";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const text = await file.text();

    const parsed = Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
    });

    const rows = parsed.data as any[];

    for (const row of rows) {
      const stockNumber = row["Stock #"] || row["StockNumber"];
      const vin = row["VIN"];
      const year = row["Year"];
      const make = row["Make"];
      const model = row["Model"];
      const price = row["Price"] || row["Internet Price"];
      const mileage = row["Mileage"];
      const status = row["Status"] || "ACTIVE";

      if (!stockNumber) continue;

      await (prisma as any).vehicle.upsert({
        where: { stockNumber },
        update: {
          vin: vin || null,
          year: year ? Number(year) : null,
          make: make || null,
          model: model || null,
          askingPrice: price ? Number(price) : null,
          mileage: mileage ? Number(mileage) : null,
          status: status || "ACTIVE",
        },
        create: {
          stockNumber,
          vin: vin || null,
          year: year ? Number(year) : null,
          make: make || null,
          model: model || null,
          askingPrice: price ? Number(price) : null,
          mileage: mileage ? Number(mileage) : null,
          status: status || "ACTIVE",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}