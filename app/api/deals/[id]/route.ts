import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function getUserRole(request: NextRequest) {
  return (request.headers.get("x-user-role") || "").toUpperCase();
}

function isAllowedRole(role: string) {
  return role === "ADMIN" || role === "CONTROLLER" || role === "SALES";
}

function parseOptionalNumber(value: unknown) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return undefined;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const role = getUserRole(request);

    if (!isAllowedRole(role)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          reason: "Missing deal id",
        },
        { status: 400 }
      );
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          reason: "Deal not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error: any) {
    console.error("Deal GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load deal",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const role = getUserRole(request);

    if (role !== "ADMIN" && role !== "CONTROLLER") {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          reason: "Missing deal id",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const existing = await prisma.application.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          reason: "Deal not found",
        },
        { status: 404 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id },
      data: {
        lender:
          typeof body?.lender === "string" ? body.lender.trim() || null : undefined,
        tier:
          typeof body?.tier === "string" ? body.tier.trim() || null : undefined,
        maxPayment: parseOptionalNumber(body?.maxPayment),
        maxVehicle: parseOptionalNumber(body?.maxVehicle),
        decisionReason:
          typeof body?.decisionReason === "string"
            ? body.decisionReason.trim() || null
            : undefined,
        dealStrength: parseOptionalNumber(body?.dealStrength),
        status:
          typeof body?.status === "string"
            ? body.status.trim().toUpperCase()
            : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("Deal PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to update deal",
      },
      { status: 500 }
    );
  }
}
