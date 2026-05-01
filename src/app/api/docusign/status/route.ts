import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");
    if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400 });

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { docusignEnvelopeId: true, docusignStatus: true, docusignSentAt: true, docusignSignedAt: true },
    });

    if (!application) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ success: true, ...application });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
