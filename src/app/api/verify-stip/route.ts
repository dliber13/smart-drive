import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!;

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const stipType = formData.get("stipType") as string;
    const firstName = ((formData.get("firstName") as string) || "").toLowerCase().trim();
    const lastName = ((formData.get("lastName") as string) || "").toLowerCase().trim();
    const monthlyIncome = Number(formData.get("monthlyIncome") || 0);
    const dob = (formData.get("dob") as string) || "";

    if (!file || !stipType) {
      return NextResponse.json({ error: "file and stipType required" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = file.type || "image/jpeg";

    let prompt = "";

    if (stipType === "identity") {
      prompt = `You are an ID verification system for automotive finance. Analyze this government-issued ID and respond ONLY with JSON:
{
  "firstName": "",
  "lastName": "",
  "dateOfBirth": "YYYY-MM-DD or null",
  "expiryDate": "YYYY-MM-DD or null",
  "documentType": "DRIVERS_LICENSE | PASSPORT | STATE_ID | UNKNOWN",
  "isLegitimate": true,
  "legitimacyConcerns": []
}
Flag concerns like: expired ID, altered document, poor image quality, missing fields.`;
    } else if (stipType === "income") {
      prompt = `You are an income verification system for automotive finance. Analyze this income document and respond ONLY with JSON:
{
  "documentType": "PAY_STUB | BANK_STATEMENT | TAX_RETURN | OTHER | UNKNOWN",
  "employeeName": "",
  "employerName": "",
  "payPeriodEnd": "YYYY-MM-DD or null",
  "grossPayThisPeriod": 0,
  "payFrequency": "WEEKLY | BIWEEKLY | SEMIMONTHLY | MONTHLY | UNKNOWN",
  "estimatedMonthlyGross": 0,
  "isLegitimate": true,
  "legitimacyConcerns": []
}
Flag concerns like: altered document, mismatched fonts, missing employer info, future dates, income not visible.`;
    } else {
      prompt = `You are a residence verification system for automotive finance. Analyze this document and respond ONLY with JSON:
{
  "documentType": "UTILITY_BILL | LEASE_AGREEMENT | MORTGAGE_STATEMENT | BANK_STATEMENT | OTHER | UNKNOWN",
  "nameOnDocument": "",
  "serviceAddress": "",
  "documentDate": "YYYY-MM-DD or null",
  "isResidential": true,
  "isLegitimate": true,
  "legitimacyConcerns": []
}
Flag concerns like: PO Box, commercial address, altered document, missing name, future dates.`;
    }

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
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: contentType, data: base64 } },
            { type: "text", text: prompt },
          ],
        }],
      }),
    });

    if (!claudeRes.ok) {
      return NextResponse.json({ trafficLight: "YELLOW", statusReason: "Verification service unavailable" });
    }

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.[0]?.text || "";
    let extracted: any = {};
    try {
      extracted = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({ trafficLight: "YELLOW", statusReason: "Could not parse document" });
    }

    const reasons: string[] = [];
    let trafficLight = "GREEN";

    if (stipType === "identity") {
      if (extracted.expiryDate && new Date(extracted.expiryDate) < new Date()) {
        reasons.push("ID is expired");
        trafficLight = "RED";
      }
      const idFirst = (extracted.firstName || "").toLowerCase();
      const idLast = (extracted.lastName || "").toLowerCase();
      if (firstName && lastName && idFirst && idLast) {
        const nameMatch = (idFirst.includes(firstName) || firstName.includes(idFirst)) &&
                          (idLast.includes(lastName) || lastName.includes(idLast));
        if (!nameMatch) {
          reasons.push(`Name mismatch: ID shows ${extracted.firstName} ${extracted.lastName}`);
          trafficLight = "RED";
        }
      }
      if (dob && extracted.dateOfBirth) {
        const dobClean = dob.replace(/\D/g, "");
        const extractedDob = extracted.dateOfBirth.replace(/\D/g, "");
        if (dobClean.length === 8 && extractedDob.length === 8) {
          const enteredMDY = dobClean.slice(0,2) + dobClean.slice(2,4) + dobClean.slice(4);
          const extractedYMD = extractedDob;
          const extractedMDY = extractedDob.slice(4,6) + extractedDob.slice(6,8) + extractedDob.slice(0,4);
          if (enteredMDY !== extractedMDY && dobClean !== extractedMDY) {
            reasons.push("Date of birth does not match ID");
            trafficLight = "RED";
          }
        }
      }
    } else if (stipType === "income") {
      const docName = (extracted.employeeName || "").toLowerCase();
      if (firstName && lastName && docName && !docName.includes(firstName) && !docName.includes(lastName)) {
        reasons.push(`Name mismatch: document shows ${extracted.employeeName}`);
        trafficLight = "RED";
      }
      const docMonthly = Number(extracted.estimatedMonthlyGross || 0);
      if (monthlyIncome > 0 && docMonthly > 0) {
        const variance = Math.abs(docMonthly - monthlyIncome) / monthlyIncome;
        if (variance > 0.40) {
          reasons.push(`Income mismatch: stated $${monthlyIncome.toLocaleString()}/mo, document shows $${docMonthly.toLocaleString()}/mo`);
          trafficLight = "RED";
        } else if (variance > 0.20) {
          reasons.push(`Income variance: stated $${monthlyIncome.toLocaleString()}/mo, document shows $${docMonthly.toLocaleString()}/mo`);
          if (trafficLight === "GREEN") trafficLight = "YELLOW";
        }
      }
      if (extracted.payPeriodEnd) {
        const days = (Date.now() - new Date(extracted.payPeriodEnd).getTime()) / (1000 * 60 * 60 * 24);
        if (days > 60) {
          reasons.push(`Pay stub may be outdated: period ended ${extracted.payPeriodEnd}`);
          if (trafficLight === "GREEN") trafficLight = "YELLOW";
        }
      }
    } else {
      const docName = (extracted.nameOnDocument || "").toLowerCase();
      if (firstName && lastName && docName && !docName.includes(firstName) && !docName.includes(lastName)) {
        reasons.push(`Name mismatch: document shows ${extracted.nameOnDocument}`);
        if (trafficLight === "GREEN") trafficLight = "YELLOW";
      }
      if (extracted.documentDate) {
        const days = (Date.now() - new Date(extracted.documentDate).getTime()) / (1000 * 60 * 60 * 24);
        if (days > 90) {
          reasons.push(`Document may be outdated: dated ${extracted.documentDate}`);
          if (trafficLight === "GREEN") trafficLight = "YELLOW";
        }
      }
      if (extracted.isResidential === false) {
        reasons.push("Address does not appear to be residential");
        trafficLight = "RED";
      }
    }

    if (extracted.legitimacyConcerns && extracted.legitimacyConcerns.length > 0) {
      extracted.legitimacyConcerns.forEach((c: string) => reasons.push(c));
      if (trafficLight === "GREEN") trafficLight = "YELLOW";
    }

    if (extracted.isLegitimate === false) {
      trafficLight = "RED";
      reasons.push("Document flagged as potentially illegitimate");
    }

    const statusReason = reasons.length > 0 ? reasons.join("; ") : (
      stipType === "identity" ? "ID verified — name and expiry check passed" :
      stipType === "income" ? "Income verified — amount and name check passed" :
      "Residence verified — address and name check passed"
    );

    return NextResponse.json({ success: true, trafficLight, statusReason, extracted });
  } catch (error: any) {
    console.error("Verify stip error:", error);
    return NextResponse.json({ trafficLight: "YELLOW", statusReason: "Verification unavailable" });
  }
}
