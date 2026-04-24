import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toText(value: string | null | undefined, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function toNumberOrNull(value: string | null | undefined) {
  const text = String(value ?? "").trim();
  if (!text) return null;
  const parsed = Number(text);
  return Number.isNaN(parsed) ? null : parsed;
}

export async function GET() {
  try {
    const FEED_URL = process.env.DEALERCENTER_FEED_URL;

    if (!FEED_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing DEALERCENTER_FEED_URL",
        },
        { status: 500 }
      );
    }

    const res = await fetch(FEED_URL, { cache: "no-store" });
    const data = await res.text();

    const vehicles = data.split("<vehicle>").slice(1);
    const synced: string[] = [];

    for (const v of vehicles) {
      const getTag = (tag: string) => {
        const match = v.match(new RegExp(`<${tag}>(.*?)</${tag}>`, "i"));
        return match ? match[1] : null;
      };

      const stockNumber = toText(getTag("stock"));
      if (!stockNumber) continue;

      const vin = toText(getTag("vin")) || null;
      const make = toText(getTag("make"), "UNKNOWN");
      const model = toText(getTag("model"), "UNKNOWN");
      const year = toNumberOrNull(getTag("year"));
      const askingPrice = toNumberOrNull(getTag("price"));
      const mileage = toNumberOrNull(getTag("mileage"));
      const vehicleClass = toText(getTag("class") || getTag("vehicleClass"), "STANDARD");

      const saved = await prisma.vehicle.upsert({
        where: { stockNumber },
        update: {
          make,
          model,
          year: year ?? undefined,
          mileage: mileage ?? undefined,
          askingPrice: askingPrice ?? undefined,
          vehicleClass,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
        create: {
          id: crypto.randomUUID(),
          stockNumber,
          year: year ?? 0,
          make,
          model,
          mileage: mileage ?? 0,
          vehicleClass,
          askingPrice: askingPrice ?? 0,
          status: "ACTIVE",
          updatedAt: new Date(),
        },
      });

      synced.push(saved.id);
    }

    return NextResponse.json({
      success: true,
      message: "Inventory synced",
      count: synced.length,
      syncedIds: synced,
    });
  } catch (error) {
    console.error("INVENTORY SYNC ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Sync failed",
      },
      { status: 500 }
    );
  }
}