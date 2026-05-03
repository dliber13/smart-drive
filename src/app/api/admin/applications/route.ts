import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_ROLES = ["SUPER_ADMIN","EXECUTIVE","UNDERWRITER","SENIOR_UNDERWRITER","FUNDING","COLLECTIONS","COMPLIANCE","ANALYST"];

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ success: false, reason: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return NextResponse.json({ success: false, reason: "Forbidden" }, { status: 403 });
    }

    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        creditScore: true,
        monthlyIncome: true,
        vehiclePrice: true,
        vehicleMake: true,
        vehicleModel: true,
        vehicleYear: true,
        stockNumber: true,
        status: true,
        lender: true,
        tier: true,
        maxPayment: true,
        maxVehicle: true,
        dealStrength: true,
        decisionReason: true,
        identityStatus: true,
        downPayment: true,
        dealerId: true,
        Dealer: { select: { name: true, dealerNumber: true } },
        ApplicationDocument: { select: { id: true, documentType: true, verifyStatus: true } },
      },
    });

    const counts = {
      draft: applications.filter(a => String(a.status ?? "DRAFT").toUpperCase() === "DRAFT").length,
      submitted: applications.filter(a => String(a.status ?? "").toUpperCase() === "SUBMITTED").length,
      approved: applications.filter(a => String(a.status ?? "").toUpperCase() === "APPROVED").length,
      declined: applications.filter(a => String(a.status ?? "").toUpperCase() === "DECLINED").length,
      funded: applications.filter(a => String(a.status ?? "").toUpperCase() === "FUNDED").length,
      pending_funding: applications.filter(a => String(a.status ?? "").toUpperCase() === "PENDING_FUNDING").length,
    };

    const approvedApps = applications.filter(a => String(a.status ?? "").toUpperCase() === "APPROVED");
    const fundedApps = applications.filter(a => String(a.status ?? "").toUpperCase() === "FUNDED");
    const decisioned = approvedApps.length + counts.declined;

    const metrics = {
      approvalRate: decisioned > 0 ? Math.round((approvedApps.length / decisioned) * 100) : 0,
      avgDealStrength: approvedApps.length > 0
        ? Math.round(approvedApps.reduce((sum, a) => sum + (a.dealStrength ?? 0), 0) / approvedApps.length)
        : 0,
      pipelineValue: approvedApps.reduce((sum, a) => sum + (a.vehiclePrice ?? 0), 0),
      fundedVolume: fundedApps.reduce((sum, a) => sum + (a.vehiclePrice ?? 0), 0),
      totalApplications: applications.length,
    };

    return NextResponse.json({ success: true, counts, metrics, applications });
  } catch (error: any) {
    console.error("ADMIN APPLICATIONS ERROR:", error);
    return NextResponse.json({ success: false, reason: error?.message || "Failed" }, { status: 500 });
  }
}
