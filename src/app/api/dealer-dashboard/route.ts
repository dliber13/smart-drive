import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ success: false, reason: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ success: false, reason: "Unauthorized" }, { status: 401 });

    const adminRoles = ["SUPER_ADMIN","EXECUTIVE","UNDERWRITER","SENIOR_UNDERWRITER","FUNDING","COLLECTIONS","COMPLIANCE","ANALYST"];
    const isAdmin = adminRoles.includes(user.role);

    // Dealers only see their own dealer's applications
    const whereClause = isAdmin ? {} : { dealerId: user.dealerId ?? "__none__" };

    // Mark expired deals (30 days idle)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await prisma.application.updateMany({
      where: {
        dealerId: isAdmin ? undefined : user.dealerId ?? "__none__",
        status: { in: ["DRAFT", "SUBMITTED"] },
        updatedAt: { lt: thirtyDaysAgo },
      },
      data: { status: "EXPIRED" },
    });

    const applications = await prisma.application.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        firstName: true,
        lastName: true,
        phone: true,
        email: true,
        identityType: true,
        identityValue: true,
        issuingCountry: true,
        identityStatus: true,
        stockNumber: true,
        vin: true,
        vehicleYear: true,
        vehicleMake: true,
        vehicleModel: true,
        vehiclePrice: true,
        downPayment: true,
        tradeIn: true,
        amountFinanced: true,
        creditScore: true,
        monthlyIncome: true,
        status: true,
        lender: true,
        tier: true,
        maxPayment: true,
        maxVehicle: true,
        decisionReason: true,
        dealStrength: true,
        fundingDate: true,
        fundingAmount: true,
        lenderConfirmation: true,
      },
    });

    const counts = {
      draft: applications.filter(a => String(a.status ?? "DRAFT").toUpperCase() === "DRAFT").length,
      submitted: applications.filter(a => String(a.status ?? "").toUpperCase() === "SUBMITTED").length,
      approved: applications.filter(a => String(a.status ?? "").toUpperCase() === "APPROVED").length,
      declined: applications.filter(a => String(a.status ?? "").toUpperCase() === "DECLINED").length,
      funded: applications.filter(a => String(a.status ?? "").toUpperCase() === "FUNDED").length,
    };

    // Compute metrics
    const approvedApps = applications.filter(a => String(a.status ?? "").toUpperCase() === "APPROVED");
    const fundedApps = applications.filter(a => String(a.status ?? "").toUpperCase() === "FUNDED");
    const decisioned = approvedApps.length + counts.declined;
    const approvalRate = decisioned > 0 ? Math.round((approvedApps.length / decisioned) * 100) : 0;
    const avgDealStrength = approvedApps.length > 0
      ? Math.round(approvedApps.reduce((sum, a) => sum + (a.dealStrength ?? 0), 0) / approvedApps.length)
      : 0;
    const pipelineValue = approvedApps.reduce((sum, a) => sum + (a.vehiclePrice ?? 0), 0);
    const fundedVolume = fundedApps.reduce((sum, a) => sum + (a.fundingAmount ?? a.vehiclePrice ?? 0), 0);

    return NextResponse.json({
      success: true,
      count: applications.length,
      counts,
      metrics: {
        approvalRate,
        avgDealStrength,
        pipelineValue,
        fundedVolume,
      },
      applications,
      currentUserRole: user.role,
    });
  } catch (error: any) {
    console.error("DEALER DASHBOARD ERROR:", error);
    return NextResponse.json(
      { success: false, reason: error?.message || "Failed to load applications" },
      { status: 500 }
    );
  }
}
