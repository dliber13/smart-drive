import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function normalizeHeader(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/#/g, "number")
    .replace(/[^a-z0-9]+/g, "");
}

function parseCSV(text: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
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

function money(value: string) {
  const n = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function intValue(value: string) {
  const n = Number(String(value || "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? Math.round(n) : null;
}

function clean(value: string | null | undefined) {
  const v = String(value || "").trim();
  return v.length ? v : null;
}

function validVin(value: string | null | undefined) {
  const vin = String(value || "").trim().toUpperCase();
  return /^[A-HJ-NPR-Z0-9]{17}$/.test(vin) ? vin : null;
}

function get(row: Record<string, string>, keys: string[]) {
  for (const key of keys) {
    const normalized = normalizeHeader(key);
    if (row[normalized] !== undefined) return row[normalized];
  }
  return "";
}

function inferBodyType(trim: string | null) {
  const t = String(trim || "").toUpperCase();

  if (t.includes("SPORT UTILITY") || t.includes("SUV")) return "SUV";
  if (t.includes("PICKUP") || t.includes("TRUCK")) return "TRUCK";
  if (t.includes("SEDAN")) return "SEDAN";
  if (t.includes("COUPE")) return "COUPE";
  if (t.includes("HATCHBACK")) return "HATCHBACK";
  if (t.includes("VAN")) return "VAN";

  return null;
}

async function ensureVehicleTable() {
  const db = prisma as any;

  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS public."Vehicle" (
      "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      "stockNumber" TEXT UNIQUE NOT NULL,
      "vin" TEXT,
      "year" INTEGER,
      "make" TEXT,
      "model" TEXT,
      "trim" TEXT,
      "mileage" INTEGER,
      "totalCost" DOUBLE PRECISION,
      "bookValue" DOUBLE PRECISION,
      "askingPrice" DOUBLE PRECISION,
      "vehicleClass" TEXT,
      "bodyType" TEXT,
      "driveTrain" TEXT,
      "fuelType" TEXT,
      "transmission" TEXT,
      "daysInInventory" INTEGER,
      "dateInStock" TIMESTAMP,
      "status" TEXT DEFAULT 'ACTIVE'
    );
  `);

  const columns = [
    `"vin" TEXT`,
    `"trim" TEXT`,
    `"mileage" INTEGER`,
    `"totalCost" DOUBLE PRECISION`,
    `"bookValue" DOUBLE PRECISION`,
    `"askingPrice" DOUBLE PRECISION`,
    `"vehicleClass" TEXT`,
    `"bodyType" TEXT`,
    `"driveTrain" TEXT`,
    `"fuelType" TEXT`,
    `"transmission" TEXT`,
    `"daysInInventory" INTEGER`,
    `"dateInStock" TIMESTAMP`,
    `"status" TEXT DEFAULT 'ACTIVE'`,
    `"updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
  ];

  for (const column of columns) {
    await db.$executeRawUnsafe(
      `ALTER TABLE public."Vehicle" ADD COLUMN IF NOT EXISTS ${column};`
    );
  }
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

    const text = new TextDecoder().decode(await file.arrayBuffer());
    const rows = parseCSV(text);

    const headerIndex = rows.findIndex((row) =>
      row.some((cell) => normalizeHeader(cell) === "stocknumber")
    );

    if (headerIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not find Stock Number header row in CSV.",
        },
        { status: 400 }
      );
    }

    const headers = rows[headerIndex].map(normalizeHeader);
    const dataRows = rows.slice(headerIndex + 1);

    await ensureVehicleTable();

    const db = prisma as any;

    let imported = 0;
    let updated = 0;
    let skipped = 0;

    for (const cells of dataRows) {
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = cells[index] || "";
      });

      const stockNumber = clean(
        get(row, ["Stock Number", "Stock #", "Stock"])
      );
      const vin = validVin(get(row, ["VIN"]));

      if (!stockNumber || !vin) {
        skipped++;
        continue;
      }

      const year = intValue(get(row, ["Year"]));
      const make = clean(get(row, ["Make"]));
      const model = clean(get(row, ["Model"]));
      const trim = clean(get(row, ["Trim"]));
      const mileage = intValue(get(row, ["Odometer", "Mileage"]));

      const totalCost = money(get(row, ["Total Cost", "Cost"]));
      const bookValue = money(
        get(row, ["J.D. Power Clean Trade", "JD Power Clean Trade", "Book Value"])
      );
      const askingPrice = money(get(row, ["Asking Price", "Price"]));

      const vehicleClass = clean(get(row, ["Vehicle Class"]));
      const bodyType = inferBodyType(trim);
      const driveTrain = clean(get(row, ["Drive Train", "Drivetrain"]));
      const fuelType = clean(get(row, ["Fuel Type"]));
      const transmission = clean(get(row, ["Transmission"]));
      const daysInInventory = intValue(get(row, ["Days In Inventory"]));
      const status = clean(get(row, ["Status"])) || "ACTIVE";

      const dateRaw = clean(get(row, ["Date In Stock"]));
      const dateInStock = dateRaw ? new Date(dateRaw) : null;
      const safeDate =
        dateInStock && !Number.isNaN(dateInStock.getTime()) ? dateInStock : null;

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
          "bodyType",
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
          $11,$12,$13,$14,$15,$16,$17,$18,now()
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
          "bodyType" = EXCLUDED."bodyType",
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
        year,
        make,
        model,
        trim,
        mileage,
        totalCost,
        bookValue,
        askingPrice,
        vehicleClass,
        bodyType,
        driveTrain,
        fuelType,
        transmission,
        daysInInventory,
        safeDate,
        status
      );

      if (Array.isArray(existing) && existing.length > 0) updated++;
      else imported++;
    }

    return NextResponse.json({
      success: true,
      message: `Inventory import complete: ${imported} imported, ${updated} updated, ${skipped} skipped.`,
      imported,
      updated,
      skipped,
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