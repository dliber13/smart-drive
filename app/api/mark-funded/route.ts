import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const applicationId =
      typeof body?.applicationId === "string"
        ? body.applicationId
        : typeof body?.id === "string"
        ? body.id
        : "";

    if (!applicationId) {
      return NextResponse.json(
        {
          success: false,
          reason: "Missing applicationId",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
        },
        { status: 404 }
      );
    }

    const currentStatus = String(existing.status ?? "DRAFT").toUpperCase();

    if (currentStatus !== "APPROVED" && currentStatus !== "FUNDED") {
      return NextResponse.json(
        {
          success: false,
          reason: "Only approved applications can be marked as funded",
          currentStatus,
        },
        { status: 400 }
      );
    }

    const updatedApplication = await prisma.application.update({
      where: { id: applicationId },
      data: {
        status: "FUNDED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application marked as funded",
      application: updatedApplication,
    });
  } catch (error: any) {
    console.error("Mark funded error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to mark application as funded",
      },
      { status: 500 }
    );
  }
}
