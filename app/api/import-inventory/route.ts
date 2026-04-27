import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function parseCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }

      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  return rows.map((r) => r.map((cell) => cell.trim()));
}

function normalizeHeader(value: string) {
  return value.trim().toLowerCase();
}

function moneyToNumber(value: string | undefined) {
  if (!value) return 0;
  const cleaned = value.replace(/\$/g, "").replace(/,/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function intFromString(value: string | undefined) {
  if (!value) return 0;
  const cleaned = value.replace(/,/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : Math.round(parsed);
}

function inferVehicleClass(make: string, model: string) {
  const text = `${make} ${model}`.toUpperCase();

  if (
    text.includes("F150") ||
    text.includes("F250") ||
    text.includes("SILVERADO") ||
    text.includes("SIERRA") ||
    text.includes("RAM") ||
    text.includes("TRUCK")
  ) {
    return "TRUCK";
  }

  if (
    text.includes("ESCAPE") ||
    text.includes("ACADIA") ||
    text.includes("EDGE") ||
    text.includes("XT4") ||
    text.includes("OUTLANDER") ||
    text.includes("WRANGLER") ||
    text.includes("RENEGADE") ||
    text.includes("GRAND CHEROKEE")
  ) {
    return "SUV";
  }

  if (
    text.includes("CHARGER") ||
    text.includes("CHALLENGER") ||
    text.includes("MALIBU") ||
    text.includes("IMPALA") ||
    text.includes("COROLLA") ||
    text.includes("SENTRA") ||
    text.includes("SONATA") ||
    text.includes("VERSA") ||
    text.includes("FOCUS")
  ) {
    return "SEDAN";
  }

  return "OTHER";
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, reason: "Missing CSV file upload" },
        { status: 400 }
      );
    }

    const text = await file.text();
    const rows = parseCsv(text);

    const headerRowIndex = rows.findIndex((row) =>
      row.some((cell) => normalizeHeader(cell) === "stock number")
    );

    if (headerRowIndex === -1) {
      return NextResponse.json(
        { success: false, reason: "Could not find inventory header row in CSV" },
        { status: 400 }
      );
    }

    const headers = rows[headerRowIndex].map(normalizeHeader);

    const stockIndex = headers.indexOf("stock number");
    const yearIndex = headers.indexOf("year");
    const makeIndex = headers.indexOf("make");
    const modelIndex = headers.indexOf("model");
    const odometerIndex = headers.indexOf("odometer");
    const askingPriceIndex = headers.indexOf("asking price");

    if (
      stockIndex === -1 ||
      yearIndex === -1 ||
      makeIndex === -1 ||
      modelIndex === -1 ||
      odometerIndex === -1 ||
      askingPriceIndex === -1
    ) {
      return NextResponse.json(
        { success: false, reason: "CSV is missing one or more required columns" },
        { status: 400 }
      );
    }

    const dataRows = rows.slice(headerRowIndex + 1);

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of dataRows) {
      const stockNumber = row[stockIndex]?.trim() || "";
      const year = intFromString(row[yearIndex]);
      const make = row[makeIndex]?.trim() || "";
      const model = row[modelIndex]?.trim() || "";
      const mileage = intFromString(row[odometerIndex]);
      const askingPrice = moneyToNumber(row[askingPriceIndex]);

      if (!stockNumber || !make || !model || !year || askingPrice <= 0) {
        skipped += 1;
        continue;
      }

      const vehicleClass = inferVehicleClass(make, model);

      const existing = await (prisma as any).vehicle.findUnique({
        where: { stockNumber },
      });

      if (existing) {
        await (prisma as any).vehicle.update({
          where: { stockNumber },
          data: {
            year,
            make,
            model,
            mileage,
            vehicleClass,
            askingPrice,
            status: "ACTIVE",
            updatedAt: new Date(),
          },
        });
        updated += 1;
      } else {
        await (prisma as any).vehicle.create({
          data: {
            id: randomUUID(),
            stockNumber,
            year,
            make,
            model,
            mileage,
            vehicleClass,
            askingPrice,
            status: "ACTIVE",
            updatedAt: new Date(),
          },
        });
        imported += 1;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Inventory import completed",
      imported,
      updated,
      skipped,
    });
  } catch (error: any) {
    console.error("IMPORT INVENTORY ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        reason: error?.message || "Failed to import inventory",
      },
      { status: 500 }
    );
  }
}