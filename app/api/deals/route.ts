import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getUserRole(request: NextRequest) {
  return (request.headers.get("x-user-role") || "").toUpperCase();
}

function isAllowedRole(role: string) {
  return role === "ADMIN" || role === "CONTROLLER" || role === "SALES";
}

export async function GET(request: NextRequest) {
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

    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error("Deals GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load deals",
      },
      { status: 500 }
    );
  }
}
