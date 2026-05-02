import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import prisma from "@/lib/prisma";

const DOCUSIGN_INTEGRATION_KEY = process.env.DOCUSIGN_INTEGRATION_KEY!;
const DOCUSIGN_USER_ID = process.env.DOCUSIGN_USER_ID!;
const DOCUSIGN_ACCOUNT_ID = process.env.DOCUSIGN_ACCOUNT_ID!;
const DOCUSIGN_BASE_URL = process.env.DOCUSIGN_BASE_URL!;
const DOCUSIGN_PRIVATE_KEY = (process.env.DOCUSIGN_PRIVATE_KEY || "").replace(/\\n/g, "\n");

export const dynamic = "force-dynamic";

async function getJWTAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: DOCUSIGN_INTEGRATION_KEY,
    sub: DOCUSIGN_USER_ID,
    aud: "account-d.docusign.com",
    iat: now,
    exp: now + 3600,
    scope: "signature impersonation",
  };

  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url");
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signingInput = `${base64Header}.${base64Payload}`;

  const crypto = await import("crypto");
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(signingInput);
  const signature = sign.sign(DOCUSIGN_PRIVATE_KEY, "base64url");

  const jwt = `${signingInput}.${signature}`;

  const tokenRes = await fetch("https://account-d.docusign.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`DocuSign JWT token error: ${err}`);
  }

  const data = await tokenRes.json();
  return data.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { applicationId } = await req.json();
    if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400 });

    const application = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

    const signerEmail = application.email || "";
    const signerName = [application.firstName, application.lastName].filter(Boolean).join(" ") || "Applicant";
    const dealerEmail = user.email || "";
    const dealerName = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Dealer Representative";
    const dealNumber = application.dealNumber || applicationId;

    if (!signerEmail) {
      return NextResponse.json({ error: "Applicant email required to send for signature" }, { status: 400 });
    }

    const accessToken = await getJWTAccessToken();

    const documentHtml = `<!DOCTYPE html><html><head><style>
body { font-family: Arial, sans-serif; margin: 40px; color: #111; }
h1 { font-size: 24px; color: #0f0f0f; }
h2 { font-size: 16px; color: #C9A84C; border-bottom: 1px solid #C9A84C; padding-bottom: 4px; }
table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
td { padding: 8px 12px; border: 1px solid #ddd; font-size: 13px; }
td:first-child { font-weight: bold; background: #f8f6f1; width: 40%; }
</style></head><body>
<h1>Smart Drive Elite — Deal Summary</h1>
<p>Deal Number: <strong>${dealNumber}</strong> &nbsp;|&nbsp; Date: ${new Date().toLocaleDateString()}</p>
<h2>Applicant</h2>
<table>
<tr><td>Name</td><td>${signerName}</td></tr>
<tr><td>Email</td><td>${signerEmail}</td></tr>
<tr><td>Phone</td><td>${application.phone || "—"}</td></tr>
</table>
<h2>Vehicle & Deal</h2>
<table>
<tr><td>Vehicle</td><td>${application.vehicleYear || ""} ${application.vehicleMake || ""} ${application.vehicleModel || ""}</td></tr>
<tr><td>Vehicle Price</td><td>$${(application.vehiclePrice || 0).toLocaleString()}</td></tr>
<tr><td>Down Payment</td><td>$${(application.downPayment || 0).toLocaleString()}</td></tr>
<tr><td>Amount Financed</td><td>$${(application.amountFinanced || 0).toLocaleString()}</td></tr>
</table>
<h2>Approval Terms</h2>
<table>
<tr><td>Lender</td><td>${application.lender || "—"}</td></tr>
<tr><td>Max Monthly Payment</td><td>$${(application.maxPayment || 0).toLocaleString()}/mo</td></tr>
<tr><td>APR</td><td>${application.apr ? (Number(application.apr) * 100).toFixed(2) + "%" : "—"}</td></tr>
<tr><td>Term</td><td>${application.termMonths || "—"} months</td></tr>
</table>
<p style="margin-top:40px;">By signing below, I acknowledge that I have reviewed and agree to the terms of this deal summary.</p>
<br/><br/>
<table style="border:none;">
<tr>
<td style="border:none; width:45%;"><div style="border-bottom:1px solid #000;height:40px;"></div><p style="font-size:12px;">Applicant Signature / Date</p></td>
<td style="border:none;width:10%;"></td>
<td style="border:none;width:45%;"><div style="border-bottom:1px solid #000;height:40px;"></div><p style="font-size:12px;">Dealer Representative / Date</p></td>
</tr>
</table>
<p style="font-size:11px;color:#999;margin-top:40px;">Smart Drive Elite LLC | Smithville, MO 64089 | USPTO #99764274 | License #2763</p>
</body></html>`;

    const documentBase64 = Buffer.from(documentHtml).toString("base64");

    const envelope = {
      emailSubject: `Smart Drive Elite — Deal ${dealNumber} Ready for Signature`,
      documents: [{
        documentBase64,
        name: `Deal_Summary_${dealNumber}.html`,
        fileExtension: "html",
        documentId: "1",
      }],
      recipients: {
        signers: [
          {
            email: signerEmail,
            name: signerName,
            recipientId: "1",
            routingOrder: "1",
            tabs: {
              signHereTabs: [{ documentId: "1", pageNumber: "1", xPosition: "50", yPosition: "500" }],
              dateSignedTabs: [{ documentId: "1", pageNumber: "1", xPosition: "250", yPosition: "500" }],
            },
          },
          {
            email: dealerEmail,
            name: dealerName,
            recipientId: "2",
            routingOrder: "2",
            tabs: {
              signHereTabs: [{ documentId: "1", pageNumber: "1", xPosition: "50", yPosition: "560" }],
              dateSignedTabs: [{ documentId: "1", pageNumber: "1", xPosition: "250", yPosition: "560" }],
            },
          },
        ],
      },
      status: "sent",
    };

    const envelopeRes = await fetch(`${DOCUSIGN_BASE_URL}/restapi/v2.1/accounts/${DOCUSIGN_ACCOUNT_ID}/envelopes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envelope),
    });

    if (!envelopeRes.ok) {
      const err = await envelopeRes.text();
      console.error("DocuSign envelope error:", err);
      return NextResponse.json({ error: err }, { status: 500 });
    }

    const envelopeData = await envelopeRes.json();
    const envelopeId = envelopeData.envelopeId;

    await prisma.application.update({
      where: { id: applicationId },
      data: {
        docusignEnvelopeId: envelopeId,
        docusignStatus: "SENT",
        docusignSentAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      envelopeId,
      message: `Deal summary sent to ${signerEmail} for signature`,
    });
  } catch (error: any) {
    console.error("DocuSign send error:", error);
    return NextResponse.json({ error: error.message || "Failed to send" }, { status: 500 });
  }
}
