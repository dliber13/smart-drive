import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUserRole } from "@/lib/access";

export const dynamic = "force-dynamic";

function asString(value: unknown, fallback = "") {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

function asNumber(value: unknown, fallback: number | null = null) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function normalizeStatus(value: unknown) {
  const raw = asString(value, "DRAFT").toUpperCase();

  if (
    raw === "DRAFT" ||
    raw === "READY" ||
    raw === "SUBMITTED" ||
    raw === "APPROVED" ||
    raw === "REJECTED" ||
    raw === "FUNDED"
  ) {
    return raw;
  }

  return "DRAFT";
}

function buildApplicantName(app: Record<string, unknown>) {
  const first =
    asString(app.firstName) ||
    asString(app.applicantFirstName) ||
    asString(app.borrowerFirstName);

  const last =
    asString(app.lastName) ||
    asString(app.applicantLastName) ||
    asString(app.borrowerLastName);

  const combined = `${first} ${last}`.trim();

  if (combined) return combined;

  return (
    asString(app.applicantName) ||
    asString(app.fullName) ||
    asString(app.customerName) ||
    "Unnamed Applicant"
  );
}

function buildVehicleLabel(app: Record<string, unknown>) {
  const year = asString(app.vehicleYear);
  const make = asString(app.vehicleMake) || asString(app.make);
  const model = asString(app.vehicleModel) || asString(app.model);

  const combined = `${year} ${make} ${model}`.replace(/\s+/g, " ").trim();

  if (combined) return combined;

  return asString(app.vehicle) || asString(app.vehicleDescription) || "Vehicle not listed";
}

function formatDate(value: unknown) {
  if (!value) return null;

  const date = new Date(value as string);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString();
}

export async function GET(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request);

    if (
      currentUserRole !== "ADMIN" &&
      currentUserRole !== "CONTROLLER" &&
      currentUserRole !== "SALES"
    ) {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized to access dealer dashboard",
          currentUserRole,
        },
        { status: 403 }
      );
    }

    const records = (await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })) as unknown as Record<string, unknown>[];

    const applications = records.map((app) => ({
      id: asString(app.id),
      applicantName: buildApplicantName(app),
      status: normalizeStatus(app.status),
      lender: asString(app.lender) || "—",
      tier: asString(app.tier) || "—",
      maxPayment: asNumber(app.maxPayment),
      maxVehicle: asNumber(app.maxVehicle),
      decisionReason: asString(app.decisionReason) || "—",
      vehicle: buildVehicleLabel(app),
      createdAt: formatDate(app.createdAt) || formatDate(app.updatedAt),
    }));

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
      currentUserRole,
    });
  } catch (error: any) {
    console.error("Dealer dashboard API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load dealer dashboard",
      },
      { status: 500 }
    );
  }
}
