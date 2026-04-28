"use client";

import { useEffect, useMemo, useState } from "react";

type DealStatus = "New Submission" | "Needs Stips" | "Approved" | "Declined";

type FundingStage =
  | "New Submission"
  | "In Underwriting"
  | "Needs Stips"
  | "Approved Pending Stips"
  | "Ready to Fund"
  | "Submitted to Lender"
  | "Lender Approved"
  | "Lender Declined"
  | "Funded"
  | "Declined";

type LenderRoute =
  | "Smart Drive"
  | "Westlake"
  | "CAC"
  | "RouteOne Lane"
  | "Manual Review";

type LenderDecision = "Pending" | "Approved" | "Declined";

type StipChecklist = {
  poi: boolean;
  por: boolean;
  insurance: boolean;
  gps: boolean;
  references: boolean;
  signedDocs: boolean;
};

type PaymentBucket = "Current" | "1-30 Late" | "31-60 Late" | "61-90 Late" | "Charge-Off";

type Deal = {
  id: string;
  dealerName: string;
  customerName: string;
  vehicle: string;
  monthlyIncome: number;
  creditScore: number;
  downPayment: number;
  systemRecommendation: DealStatus;
  finalDecision?: DealStatus;
  status: DealStatus;
  submittedAt: string;
  tier: string;
  maxPayment: number;
  maxVehiclePrice: number;
  vehicleRecommendation: string;
  lenderRoute: LenderRoute;
  lenderSubmittedAt?: string;
  lenderSubmittedBy?: string;
  lenderDecision: LenderDecision;
  lenderDecisionAt?: string;
  lenderDecisionBy?: string;
  fundingStage: FundingStage;
  fundedAt?: string;
  fundedBy?: string;
  stips: StipChecklist;
  notes: string;
  decisionedAt?: string;
  locked?: boolean;
  decisionBy?: string;

  // Portfolio / servicing fields
  financedAmount?: number;
  estimatedPayment?: number;
  paymentBucket?: PaymentBucket;
  nextDueDate?: string;
  lastPaymentDate?: string;
  collectionsAssignedTo?: string;
  collectionsNotes?: string;
};

const STORAGE_KEY = "smartdrive_deal_queue_v4";

export default function PortfolioPage() {
  const [queue, setQueue] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: Deal[] = JSON.parse(raw);

        const enriched = parsed.map((deal) => {
          if (deal.fundingStage !== "Funded") return deal;

          const financedAmount =
            deal.financedAmount ??
            Math.max(Math.round(deal.maxVehiclePrice - deal.downPayment), 0);

          const estimatedPayment =
            deal.estimatedPayment ?? Math.round(deal.maxPayment);

          return {
            ...deal,
            financedAmount,
            estimatedPayment,
            paymentBucket: deal.paymentBucket ?? "Current",
            nextDueDate: deal.nextDueDate ?? "2026-05-01",
            lastPaymentDate: deal.lastPaymentDate ?? "2026-04-01",
            collectionsAssignedTo: deal.collectionsAssignedTo ?? "Alamo Financial",
            collectionsNotes: deal.collectionsNotes ?? "",
          };
        });

        setQueue(enriched);
      } catch {
        setQueue([]);
      }
    }
  }, []);

  const fundedDeals = useMemo(
    () => queue.filter((deal) => deal.fundingStage === "Funded"),
    [queue]
  );

  const metrics = useMemo(() => {
    const totalFunded = fundedDeals.length;
    const totalBalance = fundedDeals.reduce(
      (sum, deal) => sum + (deal.financedAmount ?? 0),
      0
    );
    const avgPayment =
      totalFunded > 0
        ? Math.round(
            fundedDeals.reduce(
              (sum, deal) => sum + (deal.estimatedPayment ?? 0),
              0
            ) / totalFunded
          )
        : 0;

    return {
      totalFunded,
      totalBalance,
      avgPayment,
      current: fundedDeals.filter((d) => d.paymentBucket === "Current").length,
      late1to30: fundedDeals.filter((d) => d.paymentBucket === "1-30 Late").length,
      late31to60: fundedDeals.filter((d) => d.paymentBucket === "31-60 Late").length,
      late61to90: fundedDeals.filter((d) => d.paymentBucket === "61-90 Late").length,
      chargeOff: fundedDeals.filter((d) => d.paymentBucket === "Charge-Off").length,
    };
  }, [fundedDeals]);

  function updateBucket(id: string, bucket: PaymentBucket) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        const updated = { ...deal, paymentBucket: bucket };
        if (selectedDeal?.id === id) setSelectedDeal(updated);
        return updated;
      })
    );
  }

  function updateCollectionsNotes(id: string, notes: string) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        const updated = { ...deal, collectionsNotes: notes };
        if (selectedDeal?.id === id) setSelectedDeal(updated);
        return updated;
      })
    );
  }

  function savePortfolioChanges() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Portfolio & Collections Monitor</h1>
      <p style={subStyle}>
        Active funded-account monitoring, delinquency tracking, and collections visibility for Smart Drive Financial.
      </p>

      <div style={statsGrid}>
        <StatCard label="Funded Accounts" value={metrics.totalFunded.toString()} />
        <StatCard label="Portfolio Balance" value={`$${metrics.totalBalance.toLocaleString()}`} />
        <StatCard label="Avg Payment" value={`$${metrics.avgPayment.toLocaleString()}`} />
        <StatCard label="Current" value={metrics.current.toString()} />
        <StatCard label="1-30 Late" value={metrics.late1to30.toString()} />
        <StatCard label="31-60 Late" value={metrics.late31to60.toString()} />
        <StatCard label="61-90 Late" value={metrics.late61to90.toString()} />
        <StatCard label="Charge-Off" value={metrics.chargeOff.toString()} />
      </div>

      <div style={layoutStyle}>
        <section style={panelStyle}>
          <h2 style={sectionHeading}>Active Portfolio</h2>

          {fundedDeals.length === 0 ? (
            <p>No funded accounts yet. Fund a deal from the dealer page first.</p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {fundedDeals.map((deal) => (
                <div
                  key={deal.id}
                  onClick={() => setSelectedDeal(deal)}
                  style={{ ...dealCardStyle, cursor: "pointer" }}
                >
                  <div style={dealHeaderStyle}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        {deal.customerName}
                      </div>
                      <div style={{ color: "#555", marginTop: 4 }}>
                        {deal.vehicle} • {deal.dealerName}
                      </div>
                    </div>
                    <BucketBadge bucket={deal.paymentBucket ?? "Current"} />
                  </div>

                  <div style={{ marginTop: 12, lineHeight: 1.8 }}>
                    <div>
                      <strong>Financed Amount:</strong> $
                      {(deal.financedAmount ?? 0).toLocaleString()}
                    </div>
                    <div>
                      <strong>Estimated Payment:</strong> $
                      {(deal.estimatedPayment ?? 0).toLocaleString()}
                    </div>
                    <div>
                      <strong>Next Due:</strong> {deal.nextDueDate ?? "N/A"}
                    </div>
                    <div>
                      <strong>Collections:</strong>{" "}
                      {deal.collectionsAssignedTo ?? "Unassigned"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: 18 }}>
            <button style={primaryBtn} onClick={savePortfolioChanges}>
              Save Portfolio Changes
            </button>
          </div>
        </section>

        {selectedDeal && (
          <section style={panelStyle}>
            <h2 style={sectionHeading}>Account Detail</h2>

            <div style={{ lineHeight: 1.9 }}>
              <div><strong>Customer:</strong> {selectedDeal.customerName}</div>
              <div><strong>Vehicle:</strong> {selectedDeal.vehicle}</div>
              <div><strong>Lender Route:</strong> {selectedDeal.lenderRoute}</div>
              <div><strong>Funded At:</strong> {selectedDeal.fundedAt ?? "N/A"}</div>
              <div><strong>Funded By:</strong> {selectedDeal.fundedBy ?? "N/A"}</div>
              <div>
                <strong>Financed Amount:</strong> $
                {(selectedDeal.financedAmount ?? 0).toLocaleString()}
              </div>
              <div>
                <strong>Estimated Payment:</strong> $
                {(selectedDeal.estimatedPayment ?? 0).toLocaleString()}
              </div>
              <div><strong>Next Due Date:</strong> {selectedDeal.nextDueDate ?? "N/A"}</div>
              <div><strong>Last Payment:</strong> {selectedDeal.lastPaymentDate ?? "N/A"}</div>
              <div>
                <strong>Collections Assigned To:</strong>{" "}
                {selectedDeal.collectionsAssignedTo ?? "N/A"}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3 style={miniHeading}>Payment Status Bucket</h3>
              <div style={buttonRowStyle}>
                {(
                  ["Current", "1-30 Late", "31-60 Late", "61-90 Late", "Charge-Off"] as PaymentBucket[]
                ).map((bucket) => (
                  <button
                    key={bucket}
                    style={
                      selectedDeal.paymentBucket === bucket
                        ? selectedBucketBtn
                        : bucketBtn
                    }
                    onClick={() => updateBucket(selectedDeal.id, bucket)}
                  >
                    {bucket}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <h3 style={miniHeading}>Collections Notes</h3>
              <textarea
                style={textareaStyle}
                value={selectedDeal.collectionsNotes ?? ""}
                onChange={(e) =>
                  updateCollectionsNotes(selectedDeal.id, e.target.value)
                }
                placeholder="Add collections / servicing notes here..."
              />
            </div>

            <div style={{ marginTop: 18 }}>
              <button style={deleteBtn} onClick={() => setSelectedDeal(null)}>
                Close Account
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={statCardStyle}>
      <div style={{ color: "#5f6f86", fontSize: 13, fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function BucketBadge({ bucket }: { bucket: PaymentBucket }) {
  const colors: Record<PaymentBucket, React.CSSProperties> = {
    Current: { background: "#e7f7ea", color: "#1f7a35" },
    "1-30 Late": { background: "#fff4d6", color: "#946200" },
    "31-60 Late": { background: "#fde7d9", color: "#b54708" },
    "61-90 Late": { background: "#fdeaea", color: "#b42318" },
    "Charge-Off": { background: "#3f3f46", color: "#ffffff" },
  };

  return (
    <span
      style={{
        ...colors[bucket],
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {bucket}
    </span>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 40,
  fontFamily: "Arial, sans-serif",
  background: "#f5f7fb",
  minHeight: "100vh",
};

const headingStyle: React.CSSProperties = {
  marginBottom: 8,
};

const subStyle: React.CSSProperties = {
  color: "#444",
  marginBottom: 24,
};

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(360px, 460px) 1fr",
  gap: 24,
  alignItems: "start",
};

const panelStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 20,
};

const sectionHeading: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 16,
};

const miniHeading: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
};

const statCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 18,
};

const dealCardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  background: "#fcfdff",
};

const dealHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "start",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 100,
  padding: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box",
  resize: "vertical",
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
};

const primaryBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
};

const bucketBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#eef2ff",
  color: "#1f2937",
  border: "1px solid #c7d2fe",
  borderRadius: 8,
  cursor: "pointer",
};

const selectedBucketBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "1px solid #2563eb",
  borderRadius: 8,
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
