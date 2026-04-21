import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const FEED_URL = process.env.DEALERCENTER_FEED_URL!;

    const res = await fetch(FEED_URL);
    const data = await res.text();

    // VERY BASIC XML PARSER (we'll refine later)
    const vehicles = data.split("<vehicle>").slice(1);

    for (const v of vehicles) {
      const getTag = (tag: string) => {
        const match = v.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
        return match ? match[1] : null;
      };

      const stockNumber = getTag("stock");
      if (!stockNumber) continue;

      await prisma.inventoryUnit.upsert({
        where: { stockNumber },
        update: {
          vin: getTag("vin"),
          make: getTag("make"),
          model: getTag("model"),
          year: Number(getTag("year")) || null,
          price: Number(getTag("price")) || null,
          mileage: Number(getTag("mileage")) || null,
          isAvailable: true,
        },
        create: {
          stockNumber,
          vin: getTag("vin"),
          make: getTag("make"),
          model: getTag("model"),
          year: Number(getTag("year")) || null,
          price: Number(getTag("price")) || null,
          mileage: Number(getTag("mileage")) || null,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Inventory synced",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Sync failed",
    });
  }
}
