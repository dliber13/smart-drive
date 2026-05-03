import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_FEE = 499;
const TITLE_FEE = 9;

function fmt(v: number | null | undefined) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { applicationId, selectedVehicle, fiProducts, amountFinanced, estimatedPayment, estimatedWeekly, estimatedBiweekly } = await req.json();
    if (!applicationId) return NextResponse.json({ error: "applicationId required" }, { status: 400 });

    const app = await prisma.application.findUnique({ where: { id: applicationId } });
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const dealerName = user.dealerName || "Authorized Dealer";
    const dealerRep = user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Dealer Representative";
    const vehicleName = selectedVehicle
      ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model} ${selectedVehicle.trim || ""}`.trim()
      : `${app.vehicleYear || ""} ${app.vehicleMake || ""} ${app.vehicleModel || ""}`.trim();
    const vehiclePrice = selectedVehicle?.askingPrice ?? app.vehiclePrice ?? 0;
    const stockNumber = selectedVehicle?.stockNumber ?? app.stockNumber ?? "—";
    const downPayment = app.downPayment ?? 0;
    const apr = app.apr ? (Number(app.apr) * 100).toFixed(2) + "%" : "See lender";
    const term = app.termMonths ? `${app.termMonths} months` : "—";
    const lender = app.lender || "—";
    const tier = app.tier || "—";
    const dealNumber = app.dealNumber || applicationId;
    const generatedAt = new Date().toLocaleString();

    const fiList: { label: string; price: number }[] = fiProducts ? [
      fiProducts.vsc && { label: "VSC / Extended Warranty", price: 1495 },
      fiProducts.gap && { label: "GAP Insurance", price: 795 },
      fiProducts.paint && { label: "Paint & Fabric Protection", price: 395 },
      fiProducts.tire && { label: "Tire & Wheel Protection", price: 495 },
      fiProducts.key && { label: "Key Replacement", price: 195 },
    ].filter(Boolean) as { label: string; price: number }[] : [];

    const fiTotal = fiList.reduce((sum, p) => sum + p.price, 0);
    const baseDealTotal = vehiclePrice + ADMIN_FEE + TITLE_FEE;

    const fiRows = fiList.map(p => `
      <tr><td>${p.label}</td><td style="text-align:right">${fmt(p.price)}</td></tr>`).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Arial, sans-serif; color: #111; background: #fff; }
  .header { background: #0f0f0f; padding: 28px 40px; display: flex; justify-content: space-between; align-items: center; }
  .header-title { color: #C9A84C; font-size: 20px; font-weight: 700; letter-spacing: 0.05em; }
  .header-sub { color: #888; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 4px; }
  .header-right { color: #666; font-size: 12px; text-align: right; }
  .body { padding: 32px 40px; }
  .deal-number { background: #0f0f0f; color: #C9A84C; display: inline-block; padding: 6px 16px; border-radius: 8px; font-size: 13px; font-weight: 700; font-family: monospace; margin-bottom: 24px; }
  .section { margin-bottom: 28px; }
  .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: #888; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e5e5e5; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 8px 12px; font-size: 13px; border-bottom: 1px solid #f0f0f0; }
  td:first-child { color: #666; width: 55%; }
  td:last-child { font-weight: 600; text-align: right; }
  .total-row td { font-size: 16px; font-weight: 700; border-top: 2px solid #0f0f0f; border-bottom: none; padding-top: 12px; }
  .payment-box { background: #C9A84C; border-radius: 12px; padding: 16px 20px; margin-bottom: 28px; }
  .payment-box-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.22em; color: #0f0f0f; margin-bottom: 10px; font-weight: 700; }
  .payment-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .payment-item-label { font-size: 11px; color: rgba(0,0,0,0.6); margin-bottom: 3px; }
  .payment-item-value { font-size: 18px; font-weight: 700; color: #0f0f0f; }
  .alert { background: #fff8e6; border: 1px solid #C9A84C; border-radius: 10px; padding: 12px 16px; font-size: 12px; color: #7a5200; margin-bottom: 24px; }
  .sig-section { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e5e5; }
  .sig-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 20px; }
  .sig-line { border-bottom: 1px solid #000; height: 44px; margin-bottom: 6px; }
  .sig-label { font-size: 11px; color: #888; }
  .disclaimer { margin-top: 32px; font-size: 10px; color: #aaa; line-height: 1.6; }
  .wet-sig-box { background: #f8f6f1; border: 1px dashed #C9A84C; border-radius: 10px; padding: 10px 14px; font-size: 11px; color: #888; margin-bottom: 8px; text-align: center; }
</style>
</head>
<body>
<div class="header">
  <div>
    <div class="header-title">SMART DRIVE ELITE</div>
    <div class="header-sub">Official Deal Packet</div>
  </div>
  <div class="header-right">
    Generated: ${generatedAt}<br/>
    ${dealerName}
  </div>
</div>

<div class="body">
  <div class="deal-number">${dealNumber}</div>

  <div class="section">
    <div class="section-title">Customer</div>
    <table>
      <tr><td>Full Name</td><td>${app.firstName || ""} ${app.lastName || ""}</td></tr>
      <tr><td>Email</td><td>${app.email || "—"}</td></tr>
      <tr><td>Phone</td><td>${app.phone || "—"}</td></tr>
      <tr><td>Monthly Income</td><td>${fmt(app.monthlyIncome)}</td></tr>
      <tr><td>Credit Score</td><td>${app.creditScore || "Not provided"}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Vehicle</div>
    <table>
      <tr><td>Vehicle</td><td>${vehicleName}</td></tr>
      <tr><td>Stock Number</td><td>${stockNumber}</td></tr>
      <tr><td>Vehicle Price</td><td>${fmt(vehiclePrice)}</td></tr>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Deal Structure</div>
    <table>
      <tr><td>Vehicle Price</td><td>${fmt(vehiclePrice)}</td></tr>
      <tr><td>Admin Fee</td><td>${fmt(ADMIN_FEE)}</td></tr>
      <tr><td>Title Fee</td><td>${fmt(TITLE_FEE)}</td></tr>
      ${fiRows}
      ${fiTotal > 0 ? `<tr><td>F&I Total</td><td>${fmt(fiTotal)}</td></tr>` : ""}
      <tr><td>Down Payment</td><td style="color:#b42318">(${fmt(downPayment)})</td></tr>
      <tr class="total-row"><td>Amount Financed</td><td>${fmt(amountFinanced)}</td></tr>
    </table>
  </div>

  <div class="payment-box">
    <div class="payment-box-title">Payment Options</div>
    <div class="payment-grid">
      <div>
        <div class="payment-item-label">Monthly</div>
        <div class="payment-item-value">${fmt(estimatedPayment)}</div>
      </div>
      <div>
        <div class="payment-item-label">Bi-Weekly</div>
        <div class="payment-item-value">${fmt(estimatedBiweekly)}</div>
      </div>
      <div>
        <div class="payment-item-label">Weekly</div>
        <div class="payment-item-value">${fmt(estimatedWeekly)}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Lender Terms</div>
    <table>
      <tr><td>Lender</td><td>${lender}</td></tr>
      <tr><td>Tier</td><td>${tier}</td></tr>
      <tr><td>APR</td><td>${apr}</td></tr>
      <tr><td>Term</td><td>${term}</td></tr>
      <tr><td>Max Monthly Payment</td><td>${fmt(app.maxPayment)}</td></tr>
    </table>
  </div>

  ${fiList.length > 0 ? `<div class="alert">⚠️ F&I products (VSC, GAP) must be from a lender-approved provider. Confirm with your F&I office before finalizing.</div>` : ""}

  <div class="sig-section">
    <div class="section-title">Signatures</div>
    <div class="wet-sig-box">✍ Sign below — wet signature or via DocuSign e-signature</div>
    <div class="sig-grid">
      <div>
        <div class="sig-line"></div>
        <div class="sig-label">Customer Signature</div>
        <div style="margin-top:20px">
          <div class="sig-line"></div>
          <div class="sig-label">Date</div>
        </div>
      </div>
      <div>
        <div class="sig-line"></div>
        <div class="sig-label">Dealer Representative — ${dealerRep}</div>
        <div style="margin-top:20px">
          <div class="sig-line"></div>
          <div class="sig-label">Date</div>
        </div>
      </div>
    </div>
  </div>

  <div class="disclaimer">
    This deal packet is generated by Smart Drive Elite LLC and is subject to lender approval. Approval and funding are not guaranteed. 
    Payment estimates are based on program guidelines and may vary at funding. All F&I products must be from lender-approved providers. 
    Smart Drive Elite LLC | 13411 Forest Oaks Drive, Smithville, MO 64089 | USPTO Trademark #99764274 | License #2763
  </div>
</div>
</body>
</html>`;

    return NextResponse.json({ success: true, html, dealNumber, vehicleName, generatedAt });
  } catch (err: any) {
    console.error("Deal packet error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
