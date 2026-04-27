import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function parseCSV(data: string) {
  const lines = data.split("\n").filter(Boolean);
  const headers = lines[0].split(",");

  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: any = {};

    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim();
    });

    return obj;
  });
}

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "inventory.csv");

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ vehicles: [] });
    }

    const raw = fs.readFileSync(filePath, "utf-8");
    const vehicles = parseCSV(raw);

    return NextResponse.json({
      count: vehicles.length,
      vehicles,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        reason: error.message || "Failed to load vehicle options",
      },
      { status: 500 }
    );
  }
}