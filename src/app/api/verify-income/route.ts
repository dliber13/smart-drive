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
      select: { id: true, firstName: true, lastName: true, monthlyIncome: true },
    });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const statedMonthly = Number(application.monthlyIncome || 0);
    const firstName = (application.firstName || "").toLowerCase().trim();
    const lastName = (application.lastName || "").toLowerCase().trim();

    const fileRes = await fetch(fileKey, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!fileRes.ok) return NextResponse.json({ error: "Could not fetch income file" }, { status: 400 });

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
                text: `You are an income verification system for automotive finance. Analyze this document and respond ONLY with a JSON object, no other text:
{
  "documentType": "PAY_STUB | BANK_STATEMENT | TAX_RETURN | OFFER_LETTER | OTHER | UNKNOWN",
  "employerName": "",
  "employeeName": "",
  "payPeriodEnd": "YYYY-MM-DD or null",
  "grossPayThisPeriod": 0,
  "payFrequency": "WEEKLY | BIWEEKLY | SEMIMONTHLY | MONTHLY | UNKNOWN",
  "estimatedMonthlyGross": 0,
  "isLegitimate": true,
  "legitimacyConcerns": []
}
If a field cannot be determined use null. For estimatedMonthlyGross calculate from grossPayThisPeriod and payFrequency. Flag concerns like: altered document, mismatched fonts, missing employer info, future dates, suspiciously round numbers.`,
              },
            ],
          },
        ],
      }),
    });

    if (!claudeRes.ok) return NextResponse.json({ error: "Income verification failed" }, { status: 500 });

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.[0]?.text || "";
    let extracted: any = {};
    try {
      extracted = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "Could not parse income data", raw: rawText }, { status: 422 });
    }

    const reasons: string[] = [];
    let trafficLight = "GREEN";

    // Name match check
    const docName = (extracted.employeeName || "").toLowerCase();
    const nameMatch = docName.includes(firstName) || docName.includes(lastName);
    if (!nameMatch && extracted.employeeName) {
      reasons.push(`Name mismatch: document shows ${extracted.employeeName}`);
      trafficLight = "RED";
    }

    // Income alignment check — within 25% of stated
    const docMonthly = Number(extracted.estimatedMonthlyGross || 0);
    if (statedMonthly > 0 && docMonthly > 0) {
      const variance = Math.abs(docMonthly - statedMonthly) / statedMonthly;
      if (variance > 0.40) {
        reasons.push(`Income variance: stated $${statedMonthly.toLocaleString()}/mo, document shows $${docMonthly.toLocaleString()}/mo`);
        trafficLight = "RED";
      } else if (variance > 0.20) {
        reasons.push(`Minor income variance: stated $${statedMonthly.toLocaleString()}/mo, document shows $${docMonthly.toLocaleString()}/mo`);
        if (trafficLight === "GREEN") trafficLight = "YELLOW";
      }
    }

    // Recency check
    if (extracted.payPeriodEnd) {
      const payDate = new Date(extracted.payPeriodEnd);
      const daysDiff = (Date.now() - payDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysDiff > 60) {
        reasons.push(`Document may be outdated: pay period ended ${extracted.payPeriodEnd}`);
        if (trafficLight === "GREEN") trafficLight = "YELLOW";
      }
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

    const statusReason = reasons.length > 0 ? reasons.join("; ") : "Income verified successfully";

    return NextResponse.json({
      success: true,
      trafficLight,
      statusReason,
      extracted: {
        documentType: extracted.documentType,
        employerName: extracted.employerName,
        estimatedMonthlyGross: extracted.estimatedMonthlyGross,
        payFrequency: extracted.payFrequency,
        payPeriodEnd: extracted.payPeriodEnd,
      },
      checks: { nameMatch, docMonthly, statedMonthly },
    });
  } catch (error: any) {
    console.error("Verify income error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
