import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

function getNextStatus(currentStatus: string) {
  const status = currentStatus.toUpperCase();

  if (status === "DRAFT") return "READY";
  if (status === "READY") return "SUBMITTED";
  if (status === "SUBMITTED") return "APPROVED";
  if (status === "APPROVED") return "FUNDED";
  if (status === "REJECTED") return "SUBMITTED";
  if (status === "FUNDED") return "FUNDED";

  return "DRAFT";
}

export async function GET() {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const results = [];

    for (const app of applications) {
      const currentStatus = String(app.status ?? "DRAFT").toUpperCase();
      const movedStatus = getNextStatus(currentStatus);

      const updatedApp = await prisma.application.update({
        where: { id: app.id },
        data: { status: movedStatus },
      });

      results.push({
        id: updatedApp.id,
        previousStatus: currentStatus,
        movedStatus,
      });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error: any) {
    console.error("Test system check error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to run system check",
      },
      { status: 500 }
    );
  }
}
