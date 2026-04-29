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
      select: { id: true, firstName: true, lastName: true, customerFirstName: true, customerLastName: true },
    });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const firstName = (application.firstName || application.customerFirstName || "").toLowerCase().trim();
    const lastName = (application.lastName || application.customerLastName || "").toLowerCase().trim();

    // Fetch the file from Vercel Blob
    const fileRes = await fetch(fileKey, {
      headers: { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` },
    });
    if (!fileRes.ok) return NextResponse.json({ error: "Could not fetch ID file" }, { status: 400 });

    const arrayBuffer = await fileRes.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const contentType = fileRes.headers.get("content-type") || "image/jpeg";

    // Call Claude vision to extract ID fields
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
                text: `You are an ID verification system. Extract fields from this government-issued ID and respond ONLY with a JSON object, no other text:
{
  "firstName": "",
  "lastName": "",
  "dateOfBirth": "YYYY-MM-DD",
  "expiryDate": "YYYY-MM-DD",
  "documentNumber": "",
  "documentType": "DRIVERS_LICENSE | PASSPORT | STATE_ID | UNKNOWN"
}
If a field cannot be determined, use null.`,
              },
            ],
          },
        ],
      }),
    });

    if (!claudeRes.ok) {
      const err = await claudeRes.text();
      console.error("Claude API error:", err);
      return NextResponse.json({ error: "ID extraction failed" }, { status: 500 });
    }

    const claudeData = await claudeRes.json();
    const rawText = claudeData.content?.[0]?.text || "";

    let extracted: any = {};
    try {
      extracted = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    } catch {
      return NextResponse.json({ error: "Could not parse ID data", raw: rawText }, { status: 422 });
    }

    // Check expiry
    let expired = false;
    if (extracted.expiryDate) {
      expired = new Date(extracted.expiryDate) < new Date();
    }

    // Check name match
    const extractedFirst = (extracted.firstName || "").toLowerCase().trim();
    const extractedLast = (extracted.lastName || "").toLowerCase().trim();
    const nameMatch =
      firstName && lastName && extractedFirst && extractedLast &&
      (extractedFirst.includes(firstName) || firstName.includes(extractedFirst)) &&
      (extractedLast.includes(lastName) || lastName.includes(extractedLast));

    let identityStatus = "VERIFIED";
    const reasons: string[] = [];

    if (expired) { identityStatus = "REJECTED"; reasons.push("ID is expired"); }
    if (!nameMatch) { identityStatus = "REJECTED"; reasons.push(`Name mismatch: ID shows ${extracted.firstName} ${extracted.lastName}`); }
    if (!extracted.expiryDate) reasons.push("Could not read expiry date");

    const statusReason = reasons.length > 0 ? reasons.join("; ") : "ID verified successfully";

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        identityStatus,
        identityType: extracted.documentType || "UNKNOWN",
        identityValue: extracted.documentNumber || null,
      },
    });

    await prisma.applicationDocument.updateMany({
      where: { applicationId, documentType: "identity" },
      data: {
        verifyStatus: identityStatus === "VERIFIED" ? "VERIFIED" : "REJECTED",
        notes: statusReason,
        verifiedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      identityStatus,
      statusReason,
      extracted: {
        firstName: extracted.firstName,
        lastName: extracted.lastName,
        dateOfBirth: extracted.dateOfBirth,
        expiryDate: extracted.expiryDate,
        documentType: extracted.documentType,
      },
      checks: { expired, nameMatch },
    });
  } catch (error: any) {
    console.error("Verify identity error:", error);
    return NextResponse.json({ error: error.message || "Verification failed" }, { status: 500 });
  }
}
