import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

function estimatePayment(price: number, down: number = 0) {
  return (price - down) / 60;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const applicationId = body.applicationId;

    const app = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!app) {
      return NextResponse.json({ success: false, reason: "Application not found" });
    }

    const maxVehicle = app.maxVehicle || 0;
    const maxPayment = app.maxPayment || 0;
    const down = app.downPayment || 0;

    const vehicles = await prisma.vehicle.findMany();

    const matches = vehicles.filter((v) => {
      if (!v.askingPrice) return false;

      const payment = estimatePayment(v.askingPrice, down);

      return (
        v.askingPrice <= maxVehicle &&
        payment <= maxPayment
      );
    });

    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
