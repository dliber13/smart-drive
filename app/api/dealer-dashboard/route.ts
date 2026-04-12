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

export async function GET(request: Request) {
  try {
    const role = getCurrentUserRole(request);

    if (role !== "ADMIN" && role !== "CONTROLLER" && role !== "SALES") {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized",
          currentUserRole: role,
        },
        { status: 403 }
      );
    }

    const records = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const applications = records.map((app: any) => {
      const status = normalizeStatus(app.status);

      return {
        id: app.id,
        createdAt: app.createdAt?.toISOString() || "",
        updatedAt: app.updatedAt?.toISOString() || "",

        firstName: asString(app.firstName) || null,
        lastName: asString(app.lastName) || null,
        phone: asString(app.phone) || null,
        email: asString(app.email) || null,

        identityType: asString(app.identityType) || null,
        identityValue: asString(app.identityValue) || null,
        issuingCountry: asString(app.issuingCountry) || null,
        identityStatus: asString(app.identityStatus) || null,

        stockNumber: asString(app.stockNumber) || null,
        vin: asString(app.vin) || null,
        vehicleYear: asNumber(app.vehicleYear),
        vehicleMake: asString(app.vehicleMake) || null,
        vehicleModel: asString(app.vehicleModel) || null,
        vehiclePrice: asNumber(app.vehiclePrice),

        downPayment: asNumber(app.downPayment),
        tradeIn: asNumber(app.tradeIn),
        amountFinanced: asNumber(app.amountFinanced),

        creditScore: asNumber(app.creditScore),
        monthlyIncome: asNumber(app.monthlyIncome),

        status,
        lender: asString(app.lender) || null,
        tier: asString(app.tier) || null,
        maxPayment: asNumber(app.maxPayment),
        maxVehicle: asNumber(app.maxVehicle),
        decisionReason: asString(app.decisionReason) || null,
        dealStrength: asNumber(app.dealStrength),

        timeline: [
          {
            label: "Draft Created",
            complete: true,
            date: app.createdAt?.toISOString() || "",
          },
          {
            label: "Ready",
            complete:
              status === "READY" ||
              status === "SUBMITTED" ||
              status === "APPROVED" ||
              status === "REJECTED" ||
              status === "FUNDED",
            date:
              status === "READY" ||
              status === "SUBMITTED" ||
              status === "APPROVED" ||
              status === "REJECTED" ||
              status === "FUNDED"
                ? app.updatedAt?.toISOString() || ""
                : "",
          },
          {
            label: "Submitted",
            complete:
              status === "SUBMITTED" ||
              status === "APPROVED" ||
              status === "REJECTED" ||
              status === "FUNDED",
            date:
              status === "SUBMITTED" ||
              status === "APPROVED" ||
              status === "REJECTED" ||
              status === "FUNDED"
                ? app.updatedAt?.toISOString() || ""
                : "",
          },
          {
            label: "Approved",
            complete: status === "APPROVED" || status === "FUNDED",
            date:
              status === "APPROVED" || status === "FUNDED"
                ? app.updatedAt?.toISOString() || ""
                : "",
          },
          {
            label: "Rejected",
            complete: status === "REJECTED",
            date: status === "REJECTED" ? app.updatedAt?.toISOString() || "" : "",
          },
          {
            label: "Funded",
            complete: status === "FUNDED",
            date: status === "FUNDED" ? app.updatedAt?.toISOString() || "" : "",
          },
        ],
      };
    });

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
      currentUserRole: role,
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
