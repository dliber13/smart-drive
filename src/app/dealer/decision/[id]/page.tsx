"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const ADMIN_FEE = 499;
const TITLE_FEE = 9;

const FI_PRODUCTS = [
  { id: "vsc", label: "VSC / Extended Warranty", price: 1495, note: "Must be from lender-approved provider" },
  { id: "gap", label: "GAP Insurance", price: 795, note: "Recommended for financed amounts over $10,000" },
  { id: "paint", label: "Paint & Fabric Protection", price: 395, note: "" },
  { id: "tire", label: "Tire & Wheel Protection", price: 495, note: "" },
  { id: "key", label: "Key Replacement", price: 195, note: "" },
];

type Application = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  lender: string | null;
  tier: string | null;
  apr: number | null;
  termMonths: number | null;
  maxPayment: number | null;
  maxVehicle: number | null;
  dealStrength: number | null;
  decisionReason: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  vehiclePrice: number | null;
  monthlyIncome: number | null;
  creditScore: number | null;
  identityStatus: string | null;
  downPayment: number | null;
  createdAt: string;
  dealNumber: string | null;
  decisionMs: number | null;
  payFrequency: string | null;
  programWaterfallJson: any | null;
};

type MatchedVehicle = {
  id: string;
  stockNumber: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  mileage: number | null;
  askingPrice: number | null;
  matchScore: number;
  priceVsBudget: number;
};

function formatCurrency(v: number | null | undefined) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function DealStrengthBar({ value }: { value: number | null }) {
  if (value == null) return <span>—</span>;
  const color = value >= 70 ? "#1D9E75" : value >= 45 ? "#BA7517" : "#A32D2D";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: 8, borderRadius: 999, background: color }} />
      </div>
      <span style={{ fontSize: 20, fontWeight: 500, color, minWidth: 32 }}>{value}</span>
    </div>
  );
}


function generateDealSummaryPDF(application: any, selectedVehicle: any, fiProducts: Record<string, boolean>, amountFinanced: number, estimatedPayment: number, estimatedWeekly: number, estimatedBiweekly: number, fiTotal: number, baseDealTotal: number) {
  const jsPDF = require("jspdf").jsPDF;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;
  const ADMIN_FEE = 499;
  const TITLE_FEE = 9;
  const FI_LIST = [
    { id: "vsc", label: "VSC / Extended Warranty", price: 1495 },
    { id: "gap", label: "GAP Insurance", price: 795 },
    { id: "paint", label: "Paint & Fabric Protection", price: 395 },
    { id: "tire", label: "Tire & Wheel Protection", price: 495 },
    { id: "key", label: "Key Replacement", price: 195 },
  ];
  const fmt = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // Header
  doc.setFillColor(15, 15, 15);
  doc.rect(0, 0, pageWidth, 28, "F");
  doc.setTextColor(201, 168, 76);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("SMART DRIVE ELITE", margin, 13);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(150, 150, 150);
  doc.text("DEAL SUMMARY", margin, 21);
  doc.text("Generated: " + new Date().toLocaleString(), pageWidth - margin, 21, { align: "right" });
  y = 38;

  // Customer
  doc.setFillColor(248, 246, 241);
  doc.rect(margin, y - 5, pageWidth - margin * 2, 28, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(120, 120, 120);
  doc.text("CUSTOMER", margin + 3, y);
  y += 7;
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 15, 15);
  doc.text((application.firstName || "") + " " + (application.lastName || ""), margin + 3, y);
  y += 6;
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
  doc.text((application.email || "No email") + "  |  " + (application.phone || "No phone") + "  |  Income: " + fmt(application.monthlyIncome || 0) + "/mo  |  Credit: " + (application.creditScore || "N/A"), margin + 3, y);
  y += 16;

  // Vehicle
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(230, 225, 216);
  doc.rect(margin, y - 5, pageWidth - margin * 2, 24, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(120, 120, 120);
  doc.text("VEHICLE", margin + 3, y);
  y += 7;
  const vname = selectedVehicle
    ? ((selectedVehicle.year || "") + " " + (selectedVehicle.make || "") + " " + (selectedVehicle.model || "") + " " + (selectedVehicle.trim || "")).trim()
    : ((application.vehicleYear || "") + " " + (application.vehicleMake || "") + " " + (application.vehicleModel || "")).trim();
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(15, 15, 15);
  doc.text(vname || "No vehicle selected", margin + 3, y);
  y += 6;
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(100, 100, 100);
  const stock = selectedVehicle?.stockNumber || application.stockNumber || "—";
  const miles = selectedVehicle?.mileage || application.mileage;
  doc.text("Stock #" + stock + "  |  " + (miles ? miles.toLocaleString() + " mi" : "—"), margin + 3, y);
  y += 16;

  // Deal structure
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 100, 100);
  doc.text("DEAL STRUCTURE", margin, y); y += 5;
  const vehiclePrice = selectedVehicle?.askingPrice || application.vehiclePrice || 0;
  const rows: [string, string][] = [
    ["Vehicle Price", fmt(vehiclePrice)],
    ["Admin Fee", fmt(ADMIN_FEE)],
    ["Title Fee", fmt(TITLE_FEE)],
  ];
  FI_LIST.filter(p => fiProducts[p.id]).forEach(p => rows.push([p.label, fmt(p.price)]));
  rows.push(["Down Payment", "(" + fmt(application.downPayment || 0) + ")"]);
  rows.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 252 : 248, i % 2 === 0 ? 251 : 246, i % 2 === 0 ? 248 : 241);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 7, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60);
    doc.text(row[0], margin + 3, y);
    doc.text(row[1], pageWidth - margin - 3, y, { align: "right" });
    y += 7;
  });

  // Amount financed
  doc.setFillColor(15, 15, 15);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 10, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(10);
  doc.text("AMOUNT FINANCED", margin + 3, y + 2);
  doc.text(fmt(amountFinanced), pageWidth - margin - 3, y + 2, { align: "right" });
  y += 14;

  // Payments
  doc.setFillColor(201, 168, 76);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 20, "F");
  doc.setTextColor(15, 15, 15); doc.setFont("helvetica", "bold"); doc.setFontSize(8);
  doc.text("PAYMENT OPTIONS", margin + 3, y);
  y += 8;
  doc.setFontSize(10);
  const col = (pageWidth - margin * 2) / 3;
  doc.text("Monthly: " + fmt(estimatedPayment), margin + 3, y);
  doc.text("Bi-Weekly: " + fmt(estimatedBiweekly), margin + col + 3, y);
  doc.text("Weekly: " + fmt(estimatedWeekly), margin + col * 2 + 3, y);
  y += 16;

  // Lender
  doc.setFillColor(248, 246, 241);
  doc.rect(margin, y - 4, pageWidth - margin * 2, 16, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(100, 100, 100);
  doc.text("LENDER", margin + 3, y); y += 7;
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(15, 15, 15);
  doc.text((application.lender || "—") + "  —  " + (application.tier || "—") + "  |  APR: " + (application.apr ? (application.apr * 100).toFixed(2) + "%" : "See lender"), margin + 3, y);
  y += 16;

  // Signatures
  doc.setDrawColor(180, 180, 180);
  doc.setTextColor(80, 80, 80); doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.line(margin, y + 12, margin + 75, y + 12);
  doc.text("Customer Signature", margin, y + 18);
  doc.line(margin + 85, y + 12, margin + 130, y + 12);
  doc.text("Date", margin + 85, y + 18);
  doc.line(pageWidth - margin - 75, y + 12, pageWidth - margin, y + 12);
  doc.text("Dealer Representative", pageWidth - margin - 75, y + 18);
  doc.line(pageWidth - margin - 130, y + 12, pageWidth - margin - 85, y + 12);
  doc.text("Date", pageWidth - margin - 130, y + 18);
  y += 30;

  // Disclaimer
  doc.setFontSize(7); doc.setTextColor(160, 160, 160); doc.setFont("helvetica", "italic");
  const disc = "This deal summary is generated by Smart Drive Elite LLC and is subject to lender approval. Approval and funding are not guaranteed. Payment estimates may vary at funding. All F&I products must be from lender-approved providers. Smart Drive Elite LLC | Smithville, MO 64089 | USPTO Trademark #99764274";
  doc.text(doc.splitTextToSize(disc, pageWidth - margin * 2), margin, y);

  const name = ((application.firstName || "customer") + "_" + (application.lastName || "")).toLowerCase().replace(/\s/g, "_");
  doc.save("sde_deal_" + name + "_" + Date.now() + ".pdf");
}

export default function DecisionPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [vehicles, setVehicles] = useState<MatchedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<MatchedVehicle | null>(null);
  const [ineligibleVehicles, setIneligibleVehicles] = useState<any[]>([]);
  const [fiProducts, setFiProducts] = useState<Record<string, boolean>>({});
  const [docusignStatus, setDocusignStatus] = useState<string>("NOT_SENT");
  const [docusignSending, setDocusignSending] = useState(false);
  const [docusignMessage, setDocusignMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/applications/${id}`).then(r => r.json()),
      fetch("/api/match-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id }),
      }).then(r => r.json()),
    ])
      .then(([appData, matchData]) => {
        if (appData?.application) setApplication(appData.application);
        else setError("Application not found.");
        if (matchData?.matches) setVehicles(matchData.matches);
        if (matchData?.ineligibleMatches) setIneligibleVehicles(matchData.ineligibleMatches);
      })
      .catch(() => setError("Failed to load decision."))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleFI = (id: string) => setFiProducts(prev => ({ ...prev, [id]: !prev[id] }));

  const vehiclePrice = selectedVehicle?.askingPrice ?? application?.vehiclePrice ?? 0;
  const baseDealTotal = vehiclePrice + ADMIN_FEE + TITLE_FEE;
  const fiTotal = FI_PRODUCTS.filter(p => fiProducts[p.id]).reduce((sum, p) => sum + p.price, 0);
  const downPayment = application?.downPayment ?? 0;
  const amountFinanced = Math.max(0, baseDealTotal + fiTotal - downPayment);
  const maxPayment = application?.maxPayment ?? 0;
  const apr = application?.apr ?? 0;
  const termMonths = application?.termMonths ?? 72;
  const estimatedPayment = amountFinanced > 0 && apr > 0
    ? Math.round((amountFinanced * (apr / 12)) / (1 - Math.pow(1 + apr / 12, -termMonths)))
    : Math.round(amountFinanced / termMonths);
  const estimatedWeekly = Math.round(estimatedPayment * 12 / 52);
  const estimatedBiweekly = Math.round(estimatedPayment * 12 / 26);
  const paymentOk = maxPayment > 0 ? estimatedPayment <= maxPayment : true;

  const sendForSignature = async () => {
    setDocusignSending(true);
    setDocusignMessage("");
    try {
      const res = await fetch("/api/docusign/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id }),
      });
      const data = await res.json();
      if (data.success) {
        setDocusignStatus("SENT");
        setDocusignMessage(data.message || "Sent for signature successfully");
      } else {
        setDocusignMessage(data.error || "Failed to send for signature");
      }
    } catch {
      setDocusignMessage("Failed to send for signature");
    } finally {
      setDocusignSending(false);
    }
  };

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#888" }}>Loading decision...</div>
    </main>
  );

  if (error || !application) return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#b42318" }}>{error || "Not found"}</div>
    </main>
  );

  const approved = String(application.status ?? "").toUpperCase() === "APPROVED";
  const declined = String(application.status ?? "").toUpperCase() === "DECLINED";
  const weeklyPayment = maxPayment ? Math.round(maxPayment * 12 / 52) : null;
  const biweeklyPayment = maxPayment ? Math.round(maxPayment * 12 / 26) : null;

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", padding: "2rem 1.5rem", color: "#111" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Smart Drive Elite · Decision Engine</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 4 }}>
            <h1 style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-0.04em", margin: 0 }}>
              {[application.firstName, application.lastName].filter(Boolean).join(" ") || "Applicant"}
            </h1>
            {application.dealNumber && (
              <div style={{ background: "#0f0f0f", color: "#C9A84C", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", fontFamily: "monospace" }}>
                {application.dealNumber}
              </div>
            )}
            {application.decisionMs && (
              <div style={{ background: "#f0f9f4", color: "#2f6f55", border: "1px solid #d7e9df", borderRadius: 8, padding: "6px 16px", fontSize: 13, fontWeight: 700, letterSpacing: "0.05em" }}>
                ⚡ {application.decisionMs < 1000 ? `${application.decisionMs}ms` : `${(application.decisionMs / 1000).toFixed(1)}s`}
              </div>
            )}
          </div>
          <div style={{ fontSize: 14, color: "rgba(0,0,0,0.55)", marginTop: 6 }}>
            {application.email || "No email"} · {application.phone || "No phone"} · Submitted {new Date(application.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Decision banner */}
        <div style={{ borderRadius: 24, padding: "2rem", background: approved ? "#eef6f2" : declined ? "#fbefee" : "#f5f3ee", border: `1px solid ${approved ? "#d7e9df" : declined ? "#f0c8c4" : "#e2ddd4"}`, marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: approved ? "#2f6f55" : "#b42318", marginBottom: 8, opacity: 0.7 }}>Engine Decision</div>
              <div style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.04em", color: approved ? "#2f6f55" : declined ? "#b42318" : "#111" }}>
                {application.status || "PENDING"}
              </div>
              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", marginTop: 8, maxWidth: 500, lineHeight: 1.6 }}>
                {application.decisionReason || "Decision pending."}
              </div>
            </div>
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Deal Strength</div>
              <div style={{ fontSize: 56, fontWeight: 500, color: (application.dealStrength ?? 0) >= 70 ? "#1D9E75" : (application.dealStrength ?? 0) >= 45 ? "#BA7517" : "#A32D2D" }}>
                {application.dealStrength ?? "—"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>out of 100</div>
            </div>
          </div>
        </div>

        {/* Decline Reasons Panel */}
        {declined && (
          <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#b42318", marginBottom: 16 }}>Decline Analysis</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {(() => {
                const pw = application.programWaterfallJson as any;
                const reasons: { label: string; reason: string }[] = [];

                if (pw) {
                  if (!pw.iblEligible) reasons.push({ label: "IBL — Income Based Lending", reason: pw.iblDeclineReasons?.join("; ") || "Does not meet IBL income requirements" });
                  if (!pw.retailEligible) reasons.push({ label: "Retail Financing", reason: "Credit score, income, or profile does not meet retail lender minimums" });
                  if (!pw.leaseEligible) reasons.push({ label: "Lease Program", reason: "Credit below 600, income below $2,500/mo, or vehicle over $35,000" });
                  if (!pw.subscriptionEligible) reasons.push({ label: "Subscription Program", reason: "Income below $1,500/mo or vehicle price over $15,000" });
                } else {
                  reasons.push({ label: "Decision Engine", reason: application.decisionReason || "Does not meet minimum program requirements" });
                }

                return reasons.map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: "#fdf5f5", border: "1px solid #f5d0cd" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#b42318", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                      <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✕</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#b42318", marginBottom: 3 }}>{r.label}</div>
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>{r.reason}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
            <div style={{ marginTop: 16, padding: "12px 14px", background: "#fff8e6", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#b87800", marginBottom: 4 }}>What can improve this decision?</div>
              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)", lineHeight: 1.6 }}>
                Consider: higher down payment · co-signer · lower vehicle price · proof of additional income · resolving open collections
              </div>
            </div>
          </div>
        )}

        {approved && (
          <>
            {/* Program Waterfall */}
            {application.programWaterfallJson && (
              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 16 }}>Program Waterfall Analysis</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {(() => {
                    const pw = application.programWaterfallJson as any;
                    const programs = [
                      { key: "IBL", label: "IBL — Income Based Lending", eligible: pw.iblEligible, reason: pw.iblEligible ? `Band ${pw.iblBand} — Score ${pw.iblScore}/100. Required down: $${(pw.iblRequiredDown||0).toLocaleString()}. Max vehicle: $${(pw.finalMaxVehicle||0).toLocaleString()}.` : (pw.iblDeclineReasons?.join("; ") || "Does not meet IBL requirements") },
                      { key: "RETAIL", label: "Retail Financing", eligible: pw.retailEligible, reason: pw.retailEligible ? `${application.lender} ${application.tier} — ${application.apr ? (Number(application.apr)*100).toFixed(2)+"%" : "—"} APR, ${application.termMonths} months` : "Does not meet retail lender requirements" },
                      { key: "LEASE", label: "Lease Program", eligible: pw.leaseEligible, reason: pw.leaseEligible ? "Eligible — credit and income meet lease requirements" : "Credit below 600 or income below $2,500/mo or vehicle over $35,000" },
                      { key: "SUBSCRIPTION", label: "Subscription Program", eligible: pw.subscriptionEligible, reason: pw.subscriptionEligible ? "Eligible — last resort month-to-month program" : "Income below $1,500/mo or vehicle over $15,000" },
                    ];
                    const eligiblePrograms = programs.filter(p => p.eligible);
                    return programs.map(p => (
                      <div key={p.key} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", borderRadius: 12, background: p.eligible ? "#eef6f2" : "#faf7f1", border: `1px solid ${p.eligible ? "#d7e9df" : "rgba(0,0,0,0.06)"}` }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: p.eligible ? "#2f6f55" : "#ddd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{p.eligible ? "✓" : "✕"}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                            <span style={{ fontSize: 13, fontWeight: 700, color: p.eligible ? "#2f6f55" : "#888" }}>{p.label}</span>
                            {pw.assignedProgram === p.key && <span style={{ background: "#C9A84C", color: "#0f0f0f", borderRadius: 999, padding: "2px 8px", fontSize: 10, fontWeight: 800 }}>ASSIGNED</span>}
                          </div>
                          <div style={{ fontSize: 12, color: p.eligible ? "#2f6f55" : "rgba(0,0,0,0.4)", lineHeight: 1.5 }}>{p.reason}</div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
                {(() => {
                  const pw = application.programWaterfallJson as any;
                  const eligibleCount = [pw.iblEligible, pw.retailEligible, pw.leaseEligible, pw.subscriptionEligible].filter(Boolean).length;
                  if (eligibleCount > 1) {
                    return (
                      <div style={{ marginTop: 16, padding: "14px", background: "#f0f9f4", border: "1px solid #d7e9df", borderRadius: 12 }}>
                        <div style={{ fontSize: 12, color: "#2f6f55", fontWeight: 600, marginBottom: 10 }}>
                          {eligibleCount} programs eligible — select the best fit for this customer:
                        </div>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {pw.iblEligible && <button style={{ background: pw.assignedProgram === "IBL" ? "#2f6f55" : "#fff", color: pw.assignedProgram === "IBL" ? "#fff" : "#2f6f55", border: "1px solid #2f6f55", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>IBL</button>}
                          {pw.retailEligible && <button style={{ background: pw.assignedProgram === "RETAIL" ? "#2f6f55" : "#fff", color: pw.assignedProgram === "RETAIL" ? "#fff" : "#2f6f55", border: "1px solid #2f6f55", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Retail</button>}
                          {pw.leaseEligible && <button style={{ background: pw.assignedProgram === "LEASE" ? "#2f6f55" : "#fff", color: pw.assignedProgram === "LEASE" ? "#fff" : "#2f6f55", border: "1px solid #2f6f55", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Lease</button>}
                          {pw.subscriptionEligible && <button style={{ background: pw.assignedProgram === "SUBSCRIPTION" ? "#2f6f55" : "#fff", color: pw.assignedProgram === "SUBSCRIPTION" ? "#fff" : "#2f6f55", border: "1px solid #2f6f55", borderRadius: 8, padding: "8px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Subscription</button>}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            )}

            {/* Lender terms */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
              {(() => {
                const pw = application.programWaterfallJson as any;
                const isIBL = pw?.assignedProgram === "IBL";
                return [
                  { label: "Lender", value: application.lender || "—", sub: application.tier || "" },
                  { label: "Max Monthly", value: formatCurrency(maxPayment), sub: application.payFrequency === "MONTHLY" ? "★ your pay cycle" : "payment" },
                  { label: "Max Weekly", value: formatCurrency(weeklyPayment), sub: application.payFrequency === "WEEKLY" ? "★ your pay cycle" : "payment" },
                  { label: "Max Bi-Weekly", value: formatCurrency(biweeklyPayment), sub: (application.payFrequency === "BIWEEKLY" || application.payFrequency === "SEMI_MONTHLY") ? "★ your pay cycle" : "payment" },
                  { label: "Max Vehicle", value: formatCurrency(application.maxVehicle), sub: "price" },
                  { label: "APR", value: apr ? `${(apr * 100).toFixed(2)}%` : "—", sub: isIBL ? "in-house rate" : "rate" },
                  { label: "Term", value: termMonths ? `${termMonths} months` : "—", sub: "loan term" },
                ];
              })().map(item => (
                <div key={item.label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 16, padding: "1rem 1.25rem" }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 500 }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>{item.sub}</div>}
                </div>
              ))}
            </div>

            {/* Deal strength bar */}
            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 12 }}>Deal Strength</div>
              <DealStrengthBar value={application.dealStrength} />
            </div>

            {/* Selected Vehicle Summary */}
            {selectedVehicle && (
              <div style={{ background: "#0f0f0f", border: "2px solid #C9A84C", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A84C", marginBottom: 8 }}>✓ Selected Vehicle</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model} {selectedVehicle.trim || ""}</div>
                    <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Stock #{selectedVehicle.stockNumber} · {selectedVehicle.mileage?.toLocaleString()} mi</div>
                  </div>
                  <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: "#C9A84C" }}>{formatCurrency(selectedVehicle.askingPrice)}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{selectedVehicle.priceVsBudget}% of budget</div>
                    </div>
                    {selectedVehicle.bookValue && selectedVehicle.bookValue > 0 && (
                      <div style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 10, padding: "8px 14px", textAlign: "center" }}>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Est. Profit</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: "#C9A84C" }}>{formatCurrency((selectedVehicle.askingPrice || 0) - (selectedVehicle.bookValue || 0))}</div>
                      </div>
                    )}
                    <button onClick={() => setSelectedVehicle(null)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "6px 14px", fontSize: 12, color: "rgba(255,255,255,0.5)", cursor: "pointer" }}>Change</button>
                  </div>
                </div>
              </div>
            )}

            {/* Vehicle selector */}
            {vehicles.length > 0 && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ background: "#0f0f0f", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: 12 }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A84C", marginBottom: 4 }}>Recommended by Smart Drive Elite Engine</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>Top 3 matches scored across credit, income, mileage, price fit, and dealer margin</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {vehicles.slice(0, 3).map((v, idx) => {
                      const isSelected = selectedVehicle?.id === v.id;
                      const picks = [
                        { rank: "#1 BEST MATCH", border: "#C9A84C", bg: "rgba(201,168,76,0.08)", badge: "#C9A84C", badgeText: "#0f0f0f" },
                        { rank: "#2 STRONG MATCH", border: "#2E6DA4", bg: "rgba(46,109,164,0.08)", badge: "#2E6DA4", badgeText: "#fff" },
                        { rank: "#3 GOOD MATCH", border: "#2F6F55", bg: "rgba(47,111,85,0.08)", badge: "#2F6F55", badgeText: "#fff" },
                      ];
                      const pick = picks[idx];
                      return (
                        <button key={v.id} onClick={() => setSelectedVehicle(isSelected ? null : v)}
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "1rem 1.25rem", background: isSelected ? "rgba(201,168,76,0.15)" : pick.bg, border: `1.5px solid ${isSelected ? "#C9A84C" : pick.border}`, borderRadius: 14, flexWrap: "wrap", cursor: "pointer", textAlign: "left", width: "100%" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                            <div style={{ background: pick.badge, color: pick.badgeText, borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 800, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{pick.rank}</div>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{v.year} {v.make} {v.model} {v.trim || ""}</div>
                              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Stock #{v.stockNumber} · {v.mileage?.toLocaleString()} mi</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                            <div style={{ textAlign: "right" }}>
                              <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>{formatCurrency(v.askingPrice)}</div>
                              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{v.priceVsBudget}% of budget</div>
                              {v.bookValue > 0 && <div style={{ fontSize: 11, color: "#C9A84C", fontWeight: 600 }}>Est. profit: {formatCurrency((v.askingPrice || 0) - (v.bookValue || 0))}</div>}
                            </div>
                            <div style={{ background: isSelected ? "#C9A84C" : pick.badge, color: isSelected ? "#0f0f0f" : pick.badgeText, borderRadius: 999, padding: "4px 14px", fontSize: 12, fontWeight: 700, minWidth: 60, textAlign: "center" }}>
                              {isSelected ? "✓ Selected" : v.matchScore}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {vehicles.length > 3 && (
                  <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginTop: 12 }}>
                    <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 4 }}>All Eligible Vehicles</div>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginBottom: 12 }}>{vehicles.length - 3} additional vehicles within program limits</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {vehicles.slice(3).map(v => {
                        const isSelected = selectedVehicle?.id === v.id;
                        return (
                          <button key={v.id} onClick={() => setSelectedVehicle(isSelected ? null : v)}
                            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "0.75rem 1rem", background: isSelected ? "#eef6f2" : "#faf7f1", border: `1px solid ${isSelected ? "#d7e9df" : "rgba(0,0,0,0.08)"}`, borderRadius: 12, flexWrap: "wrap", cursor: "pointer", textAlign: "left", width: "100%" }}>
                            <div>
                              <div style={{ fontSize: 15, fontWeight: 500, color: "#111" }}>{v.year} {v.make} {v.model} {v.trim || ""}</div>
                              <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>Stock #{v.stockNumber} · {v.mileage?.toLocaleString()} mi</div>
                            </div>
                            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 16, fontWeight: 500 }}>{formatCurrency(v.askingPrice)}</div>
                                <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>{v.priceVsBudget}% of budget</div>
                                {v.bookValue > 0 && <div style={{ fontSize: 11, color: "#2f6f55", fontWeight: 600 }}>Est. profit: {formatCurrency((v.askingPrice || 0) - (v.bookValue || 0))}</div>}
                              </div>
                              <div style={{ background: isSelected ? "#2f6f55" : v.matchScore >= 80 ? "#eef6f2" : "#f5f3ee", color: isSelected ? "#fff" : v.matchScore >= 80 ? "#2f6f55" : "#5f5a52", borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 500, minWidth: 60, textAlign: "center" }}>
                                {isSelected ? "✓ Selected" : v.matchScore}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Ineligible Vehicles — Down Payment Gap */}
            {ineligibleVehicles.length > 0 && (
              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 4 }}>Additional Down Payment Required</div>
                <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginBottom: 12 }}>These vehicles need more down to qualify. Show customers how close they are.</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {ineligibleVehicles.slice(0, 10).map(v => (
                    <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "0.75rem 1rem", background: "#fdf8f0", border: "1px solid rgba(201,168,76,0.2)", borderRadius: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{v.year} {v.make} {v.model} {v.trim || ""}</div>
                        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>Stock #{v.stockNumber} · {v.mileage?.toLocaleString()} mi</div>
                        <div style={{ fontSize: 11, color: "#b42318", marginTop: 3 }}>{v.ineligibleReasons?.join(" · ")}</div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrency(v.askingPrice)}</div>
                        {v.additionalDownNeeded > 0 && (
                          <div style={{ background: "#C9A84C", color: "#0f0f0f", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 800, marginTop: 4 }}>
                            +{formatCurrency(v.additionalDownNeeded)} down to qualify
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 16 }}>Deal Jacket</div>

              {/* Base deal */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>Base Deal</div>
                {[
                  { label: "Vehicle Price", value: vehiclePrice },
                  { label: "Admin Fee", value: ADMIN_FEE },
                  { label: "Title Fee", value: TITLE_FEE },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid rgba(0,0,0,0.06)", fontSize: 14 }}>
                    <span style={{ color: "rgba(0,0,0,0.6)" }}>{row.label}</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(row.value)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 15, fontWeight: 600, borderTop: "1px solid rgba(0,0,0,0.1)", marginTop: 4 }}>
                  <span>Base Deal Total</span>
                  <span>{formatCurrency(baseDealTotal)}</span>
                </div>
              </div>

              {/* F&I Products */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.5)", marginBottom: 8 }}>F&I Products (Optional)</div>
                {FI_PRODUCTS.map(product => (
                  <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: fiProducts[product.id] ? "#eef6f2" : "#faf7f1", border: `0.5px solid ${fiProducts[product.id] ? "#d7e9df" : "rgba(0,0,0,0.06)"}`, borderRadius: 10, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: "#111" }}>{product.label}</div>
                      {product.note && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 1 }}>⚠️ {product.note}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{formatCurrency(product.price)}</span>
                      <button onClick={() => toggleFI(product.id)}
                        style={{ background: fiProducts[product.id] ? "#2f6f55" : "#e0ddd8", color: fiProducts[product.id] ? "#fff" : "#888", border: "none", borderRadius: 999, padding: "4px 14px", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                        {fiProducts[product.id] ? "ON" : "OFF"}
                      </button>
                    </div>
                  </div>
                ))}
                {fiTotal > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: 13, color: "rgba(0,0,0,0.5)" }}>
                    <span>F&I Total</span>
                    <span>{formatCurrency(fiTotal)}</span>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.1)", paddingTop: 12 }}>
                {[
                  { label: "Down Payment", value: -downPayment, note: "" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 14 }}>
                    <span style={{ color: "rgba(0,0,0,0.5)" }}>{row.label}</span>
                    <span style={{ fontWeight: 500, color: "#b42318" }}>({formatCurrency(downPayment)})</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 18, fontWeight: 700, borderTop: "1px solid rgba(0,0,0,0.12)", marginTop: 6 }}>
                  <span>Amount Financed</span>
                  <span>{formatCurrency(amountFinanced)}</span>
                </div>
              </div>

              {/* Payment check */}
              <div style={{ background: paymentOk ? "#eef6f2" : "#fbefee", border: `1px solid ${paymentOk ? "#d7e9df" : "#f0c8c4"}`, borderRadius: 14, padding: "14px 16px", marginTop: 12 }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: paymentOk ? "#2f6f55" : "#b42318", marginBottom: 8 }}>Payment Check</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 12 }}>
                  {[
                    { label: "Est. Monthly", value: formatCurrency(estimatedPayment), ok: paymentOk },
                    { label: "Est. Weekly", value: formatCurrency(estimatedWeekly), ok: paymentOk },
                    { label: "Est. Bi-Weekly", value: formatCurrency(estimatedBiweekly), ok: paymentOk },
                    { label: "Lender Max", value: formatCurrency(maxPayment), ok: true },
                  ].map(item => (
                    <div key={item.label}>
                      <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: item.label === "Lender Max" ? "rgba(0,0,0,0.6)" : paymentOk ? "#2f6f55" : "#b42318" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                {!paymentOk && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#b42318", fontWeight: 500 }}>
                    ⚠️ Estimated payment exceeds lender maximum. Remove F&I products or increase down payment.
                  </div>
                )}
                {paymentOk && fiTotal > 0 && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#2f6f55", fontWeight: 500 }}>
                    ✓ Payment with F&I products is within lender limits.
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div style={{ background: "#0f0f0f", borderRadius: 20, padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "#C9A84C", marginBottom: 16 }}>Next Steps for Your Team</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  {
                    step: "01",
                    title: "Present terms to the customer",
                    desc: `Show them ${formatCurrency(estimatedPayment)}/mo · ${formatCurrency(estimatedWeekly)}/wk · ${formatCurrency(estimatedBiweekly)} bi-weekly. Let them choose their payment frequency.`,
                  },
                  {
                    step: "02",
                    title: "Collect down payment",
                    desc: `Required down payment: ${formatCurrency(downPayment)}. Collect cash, check, or card before proceeding.`,
                  },
                  {
                    step: "03",
                    title: "Confirm F&I products",
                    desc: "Review selected back end products with the customer. VSC and GAP must be from a lender-approved provider — confirm with your F&I office before finalizing.",
                  },
                  {
                    step: "04",
                    title: "Submit to " + (application.lender || "lender"),
                    desc: "Submit via your lender portal (DealerTrack, RouteOne, or direct). Tier: " + (application.tier || "—") + ". Include all uploaded stips.",
                  },
                  {
                    step: "05",
                    title: "Await funding confirmation",
                    desc: "Typical turnaround: 24–48 hours after lender approval. Do not release the vehicle until funding is confirmed.",
                  },
                ].map((s, i) => (
                  <div key={s.step} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ minWidth: 28, height: 28, borderRadius: "50%", background: "#C9A84C", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0f0f0f", flexShrink: 0, marginTop: 2 }}>{s.step}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>{s.title}</div>
                      <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant profile */}
            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 12 }}>Applicant Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                {[
                  { label: "Monthly Income", value: formatCurrency(application.monthlyIncome) },
                  { label: "Credit Score", value: String(application.creditScore ?? "Not provided") },
                  { label: "Down Payment", value: formatCurrency(application.downPayment) },
                  { label: "Identity Status", value: application.identityStatus || "PENDING" },
                  { label: "Vehicle Selected", value: selectedVehicle ? `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}` : [application.vehicleYear, application.vehicleMake, application.vehicleModel].filter(Boolean).join(" ") || "—" },
                  { label: "Vehicle Price", value: formatCurrency(vehiclePrice) },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{ textAlign: "center", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: "1.5rem" }}>
          This decision is generated by the Smart Drive Elite engine. Payment estimates are based on lender program guidelines and may vary at funding.
        </div>

        {docusignMessage && (
          <div style={{ textAlign: "center", marginBottom: 12, fontSize: 13, color: docusignStatus === "SENT" ? "#2f6f55" : "#b42318", fontWeight: 500 }}>
            {docusignMessage}
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <button onClick={() => router.push("/dealer")}
            style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: 999, padding: "10px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#111" }}>
            Back to Dealer Dashboard
          </button>
          <button onClick={() => generateDealSummaryPDF(application, selectedVehicle, fiProducts, amountFinanced, estimatedPayment, estimatedWeekly, estimatedBiweekly, fiTotal, baseDealTotal)}
            style={{ background: "#C9A84C", border: "none", borderRadius: 999, padding: "10px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#0f0f0f" }}>
            Download PDF
          </button>
          <button onClick={() => window.print()}
            style={{ background: "#0f0f0f", border: "none", borderRadius: 999, padding: "10px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#fff" }}>
            Print Deal Summary
          </button>
          {approved && (
            <button onClick={sendForSignature} disabled={docusignSending || docusignStatus === "SENT"}
              style={{ background: docusignStatus === "SENT" ? "#2f6f55" : "#1a4fa0", border: "none", borderRadius: 999, padding: "10px 28px", fontSize: 14, fontWeight: 500, cursor: docusignSending || docusignStatus === "SENT" ? "not-allowed" : "pointer", color: "#fff", opacity: docusignSending ? 0.7 : 1 }}>
              {docusignSending ? "Sending…" : docusignStatus === "SENT" ? "✓ Sent for Signature" : "Send for Signature"}
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
