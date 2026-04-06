import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const deal = await prisma.application.create({
      data: {
        externalReference: `web-${Date.now()}`,
        dealerId: body.dealerId,
        createdByUserId: body.createdByUserId,
        customerFirstName: body.customerFirstName,
        customerLastName: body.customerLastName,
        grossIncome: Number(body.grossIncome),
        creditScore: Number(body.creditScore),
        employmentMonths: Number(body.employmentMonths || 0),
        residenceMonths: Number(body.residenceMonths || 0),
        requestedVehicle: body.requestedVehicle || null,
        downPayment: Number(body.downPayment || 0),
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(deal);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create deal" }, { status: 500 });
  }
}
