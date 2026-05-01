import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { applicationId, fileKey } = await req.json();
    if (!applicationId || !fileKey) {
      return NextResponse.json({ error: "applicationId and fileKey required" }, { status: 400 });
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      select: { id: true, firstName: true, lastName: true },
    });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const firstName = (application.firstName || "").toLowerCase().trim();
    const lastName = (application.lastName || "").toLowerCase().trim();

    const fileRes = await fetch(fileKey, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!fileRes.ok) return NextResponse.json({ error: "Could not fetch residence file" }, { status: 400 });

    const arrayBuffer = await fileRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = fileRes.headers.get("content-type") || "image/jpeg";

    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 512,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: { type: "base64", media_type: contentType, data: base64 },
              },
              {
                type: "text",
                text: `You are a residence verification system for automotive finance. Analyze this document and respond ONLY with a JSON object, no other text:
{
  "documentType": "UTILITY_BILL | LEASE_AGREEMENT | MORTGAGE_STATEMENT | BANK_STATEMENT | INSURANCE | OTHER | UNKNOWN",
  "nameOnDocument": "",
  "serviceAddress": "",
  "documentDate": "YYYY-MM-DD or null",
  "isResidential": true,
  "isLegitimate": true,
  "legitimacyConcerns": []
}
If a field cannot be determined use null. Flag concerns like: PO Box address, commercial address, altered document, missing name, future dates, address looks like business not residence.`,
              },
            ],
          },
        ],
      }),
    });

    if (!claudeRes.ok) return NextResponse.json({ error: "Residence verification failed" }, { status: 500 });

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.[0]?.text || "";
    let extracted: any = {};
    try {
      extracted = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "Could not parse residence data", raw: rawText }, { status: 422 });
    }

    const reasons: string[] = [];
    let trafficLight = "GREEN";

    // Name match check
    const docName = (extracted.nameOnDocument || "").toLowerCase();
    const nameMatch = docName.includes(firstName) || docName.includes(lastName);
    if (!nameMatch && extracted.nameOnDocument) {
      reasons.push(`Name mismatch: document shows ${extracted.nameOnDocument}`);
      if (trafficLight === "GREEN") trafficLight = "YELLOW";
    }

    // Recency check — within 90 days
    if (extracted.documentDate) {
      const docDate = new Date(extracted.documentDate);
      const daysDiff = (Date.now() - docDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 90) {
        reasons.push(`Document may be outdated: dated ${extracted.documentDate}`);
        if (trafficLight === "GREEN") trafficLight = "YELLOW";
      }
    }

    // Residential check
    if (extracted.isResidential === false) {
      reasons.push("Address does not appear to be residential");
      trafficLight = "RED";
    }

    // Legitimacy concerns from AI
    if (extracted.legitimacyConcerns && extracted.legitimacyConcerns.length > 0) {
      extracted.legitimacyConcerns.forEach((c: string) => reasons.push(c));
      trafficLight = "RED";
    }

    if (!extracted.isLegitimate) {
      trafficLight = "RED";
      reasons.push("Document flagged as potentially illegitimate");
    }

    const statusReason = reasons.length > 0 ? reasons.join("; ") : "Residence verified successfully";

    return NextResponse.json({
      success: true,
      trafficLight,
      statusReason,
      extracted: {
        documentType: extracted.documentType,
        nameOnDocument: extracted.nameOnDocument,
        serviceAddress: extracted.serviceAddress,
        documentDate: extracted.documentDate,
        isResidential: extracted.isResidential,
      },
    });
  } catch (error: any) {
    console.error("Verify residence error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
