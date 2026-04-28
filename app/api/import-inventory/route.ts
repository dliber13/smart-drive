import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseCSV(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (cell || row.length) {
        row.push(cell.trim());
        rows.push(row);
        row = [];
        cell = "";
      }
      if (char === "\r" && next === "\n") i++;
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell.trim());
    rows.push(row);
  }

  return rows.filter((r) => r.some((c) => String(c || "").trim()));
}

function toNumber(value: string | undefined) {
  const cleaned = String(value || "").replace(/[^0-9.-]/g, "");
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function clean(value: string | undefined) {
  const cleaned = String(value || "").trim();
  return cleaned.length ? cleaned : null;
}

function cleanVin(value: string | undefined) {
  const vin = String(value || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, "");

  return vin.length === 17 ? vin : null;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "No CSV file uploaded." },
        { status: 400 }
      );
    }

    const text = await file.text();
    const rows = parseCSV(text);

    const headerIndex = rows.findIndex((r) =>
      r.some((c) => String(c).trim().toLowerCase() === "stock number")
    );

    if (headerIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Could not find DealerCenter header row." },
        { status: 400 }
      );
    }

    const headers = rows[headerIndex].map((h) => h.trim());
    const dataRows = rows.slice(headerIndex + 1);

    const db = prisma as any;

    let imported = 0;
    let updated = 0;
    let skipped = 0;
    let missingVin = 0;

    for (const cells of dataRows) {
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = cells[index] || "";
      });

      const stockNumber = clean(row["Stock Number"]);
      const vin = cleanVin(row["VIN"]);

      if (!stockNumber) {
        skipped++;
        continue;
      }

      if (!vin) missingVin++;

      const existing = await db.$queryRawUnsafe(
        `SELECT "id" FROM public."Vehicle" WHERE "stockNumber" = $1 LIMIT 1`,
        stockNumber
      );

      await db.$executeRawUnsafe(
        `
        INSERT INTO public."Vehicle" (
          "stockNumber",
          "vin",
          "year",
          "make",
          "model",
          "trim",
          "mileage",
          "totalCost",
          "bookValue",
          "askingPrice",
          "vehicleClass",
          "driveTrain",
          "fuelType",
          "transmission",
          "daysInInventory",
          "dateInStock",
          "status",
          "updatedAt"
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
          $11,$12,$13,$14,$15,$16,$17,now()
        )
        ON CONFLICT ("stockNumber")
        DO UPDATE SET
          "vin" = EXCLUDED."vin",
          "year" = EXCLUDED."year",
          "make" = EXCLUDED."make",
          "model" = EXCLUDED."model",
          "trim" = EXCLUDED."trim",
          "mileage" = EXCLUDED."mileage",
          "totalCost" = EXCLUDED."totalCost",
          "bookValue" = EXCLUDED."bookValue",
          "askingPrice" = EXCLUDED."askingPrice",
          "vehicleClass" = EXCLUDED."vehicleClass",
          "driveTrain" = EXCLUDED."driveTrain",
          "fuelType" = EXCLUDED."fuelType",
          "transmission" = EXCLUDED."transmission",
          "daysInInventory" = EXCLUDED."daysInInventory",
          "dateInStock" = EXCLUDED."dateInStock",
          "status" = EXCLUDED."status",
          "updatedAt" = now();
        `,
        stockNumber,
        vin,
        toNumber(row["Year"]),
        clean(row["Make"]),
        clean(row["Model"]),
        clean(row["Trim"]),
        toNumber(row["Odometer"]),
        toNumber(row["Total Cost"]),
        toNumber(row["J.D. Power Clean Trade"]),
        toNumber(row["Asking Price"]),
        clean(row["Vehicle Class"]),
        clean(row["Drive Train"]),
        clean(row["Fuel Type"]),
        clean(row["Transmission"]),
        toNumber(row["Days In Inventory"]),
        row["Date In Stock"] ? new Date(row["Date In Stock"]) : null,
        clean(row["Status"]) || "UNKNOWN"
      );

      if (Array.isArray(existing) && existing.length > 0) updated++;
      else imported++;
    }

    return NextResponse.json({
      success: true,
      message: `Inventory import complete: ${imported} imported, ${updated} updated, ${skipped} skipped, ${missingVin} missing VIN.`,
      imported,
      updated,
      skipped,
      missingVin,
    });
  } catch (error: any) {
    console.error("IMPORT INVENTORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Inventory import failed.",
      },
      { status: 500 }
    );
  }
}