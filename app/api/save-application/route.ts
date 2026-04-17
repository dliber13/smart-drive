import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUserRole } from "@/lib/access";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

function canSaveDraft(role: string | null | undefined) {
  const normalized = String(role ?? "").toUpperCase();
  return (
    normalized === "ADMIN" ||
    normalized === "CONTROLLER" ||
    normalized === "SALES"
  );
}

function toTextOrNull(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text ? text : null;
}

export async function POST(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request);

    if (!canSaveDraft(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          message: "Current user role cannot save deals.",
          currentUserRole,
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const application = await prisma.application.create({
      data: {
        firstName: toTextOrNull(body?.firstName),
        lastName: toTextOrNull(body?.lastName),
        phone: toTextOrNull(body?.phone),
        email: toTextOrNull(body?.email),
        status: "DRAFT",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully.",
      applicationId: application.id,
      status: application.status,
      currentUserRole,
    });
  } catch (error: any) {
    console.error("SAVE APPLICATION ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Draft save failed.",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
