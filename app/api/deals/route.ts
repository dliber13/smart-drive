import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        dealer: true,
      },
    });

    return NextResponse.json({ success: true, applications });
  } catch (error) {
    console.error("GET /api/deals failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load deals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const dealer = await prisma.dealer.upsert({
      where: { code: "WEB-DEFAULT" },
      update: {
        name: body.dealerName || "Web Dealer",
      },
      create: {
        name: body.dealerName || "Web Dealer",
        code: "WEB-DEFAULT",
        authorityLevel: "STANDARD",
      },
    });

    const user = await prisma.user.upsert({
      where: { email: "webdealer@smartdrive.local" },
      update: {},
      create: {
        firstName: "Web",
        lastName: "Dealer",
        email: "webdealer@smartdrive.local",
        role: "DEALER_USER",
      },
    });

    const application = await prisma.application.create({
      data: {
        externalReference: `web-${Date.now()}`,
        dealerId: dealer.id,
        createdByUserId: user.id,
        customerFirstName: body.customerFirstName || "",
        customerLastName: body.customerLastName || "Unknown",
        grossIncome: Number(body.grossIncome || 0),
        verifiedIncome: Number(body.grossIncome || 0),
        creditScore: Number(body.creditScore || 0),
        employmentMonths: Number(body.employmentMonths || 0),
        residenceMonths: Number(body.residenceMonths || 0),
        requestedVehicle: body.requestedVehicle || null,
        downPayment: Number(body.downPayment || 0),
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("POST /api/deals failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
