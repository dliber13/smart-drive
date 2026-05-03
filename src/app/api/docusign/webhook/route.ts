import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    const envelopeId = body?.envelopeId || body?.data?.envelopeId || body?.envelopeid;
    const dsStatus = (body?.status || body?.data?.envelopeSummary?.status || "").toUpperCase();
    if (!envelopeId) return NextResponse.json({ error: "No envelopeId" }, { status: 400 });
    const application = await prisma.application.findFirst({ where: { docusignEnvelopeId: envelopeId } });
    if (!application) return NextResponse.json({ received: true });
    if (dsStatus === "COMPLETED") {
      const prevStatus = application.status;
      await prisma.application.update({ where: { id: application.id }, data: { docusignStatus: "SIGNED", docusignSignedAt: new Date(), status: "PENDING_FUNDING" } });
      await prisma.statusHistory.create({ data: { applicationId: application.id, fromStatus: prevStatus, toStatus: "PENDING_FUNDING", note: "DocuSign envelope completed — deal signed, awaiting funding." } });
      return NextResponse.json({ success: true, applicationId: application.id, newStatus: "PENDING_FUNDING" });
    }
    const statusMap: Record<string, string> = { SENT: "SENT", DELIVERED: "DELIVERED", DECLINED: "DECLINED", VOIDED: "VOIDED" };
    if (statusMap[dsStatus]) await prisma.application.update({ where: { id: application.id }, data: { docusignStatus: statusMap[dsStatus] } });
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("DocuSign webhook error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
