import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        dealer: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { success: false, error: "Deal not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error("GET /api/deals/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const body = await req.json();
    const { id } = await context.params;

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: body.status,
        tier: body.tier ?? undefined,
        lender: body.lender ?? undefined,
        maxPayment: body.maxPayment ?? undefined,
        maxVehicle: body.maxVehicle ?? undefined,
        decisionReason: body.reason ?? undefined,
      },
    });

    return NextResponse.json({
      success: true,
      application: updated,
    });
  } catch (error) {
    console.error("PATCH /api/deals/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "Update failed" },
      { status: 500 }
    );
  }
}
