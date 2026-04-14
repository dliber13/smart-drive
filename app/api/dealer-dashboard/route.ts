import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getUserRole(request: NextRequest) {
  return (request.headers.get("x-user-role") || "SALES").toUpperCase();
}

function isAllowedRole(role: string) {
  return role === "ADMIN" || role === "CONTROLLER" || role === "SALES";
}

function getStatusCounts(applications: Array<{ status: string | null }>) {
  return {
    draft: applications.filter((app) => (app.status ?? "DRAFT") === "DRAFT").length,
    submitted: applications.filter((app) => app.status === "SUBMITTED").length,
    approved: applications.filter((app) => app.status === "APPROVED").length,
    declined: applications.filter((app) => app.status === "DECLINED").length,
    funded: applications.filter((app) => app.status === "FUNDED").length,
  };
}

export async function GET(request: NextRequest) {
  try {
    const currentUserRole = getUserRole(request);

    if (!isAllowedRole(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized to access dealer dashboard",
          currentUserRole,
        },
        { status: 403 }
      );
    }

    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      include: {
        statusHistory: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const counts = getStatusCounts(applications);

    return NextResponse.json({
      success: true,
      count: applications.length,
      counts,
      applications,
      currentUserRole,
    });
  } catch (error: any) {
    console.error("Dealer dashboard route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load dealer dashboard",
      },
      { status: 500 }
    );
  }
}
