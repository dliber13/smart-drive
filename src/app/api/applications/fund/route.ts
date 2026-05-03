import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/session";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session || !["SUPER_ADMIN","EXECUTIVE","FUNDING","ADMIN"].includes(session.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { applicationId, lenderConfirmation, fundingAmount } = await req.json();
    if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400 });
    const app = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (app.status !== "PENDING_FUNDING" && app.status !== "APPROVED") {
      return NextResponse.json({ error: "Cannot fund — status is " + app.status }, { status: 400 });
    }
    const prev = app.status;
    await prisma.application.update({ where: { id: applicationId }, data: { status: "FUNDED", fundingDate: new Date(), fundingAmount: fundingAmount || app.amountFinanced, lenderConfirmation: lenderConfirmation || null } });
    await prisma.statusHistory.create({ data: { applicationId, fromStatus: prev, toStatus: "FUNDED", note: "Marked funded by controller." + (lenderConfirmation ? " Lender conf: " + lenderConfirmation : "") } });
    return NextResponse.json({ success: true, applicationId, status: "FUNDED" });
  } catch (err: any) {
    console.error("Fund route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
