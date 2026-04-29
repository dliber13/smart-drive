"use client";

import { useEffect, useMemo, useState } from "react";

type Application = {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  identityType: string | null;
  identityValue: string | null;
  issuingCountry: string | null;
  identityStatus: string | null;
  stockNumber: string | null;
  vin: string | null;
  vehicleYear: number | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehiclePrice: number | null;
  downPayment: number | null;
  tradeIn: number | null;
  amountFinanced: number | null;
  creditScore: number | null;
  monthlyIncome: number | null;
  status: string | null;
  lender: string | null;
  tier: string | null;
  maxPayment: number | null;
  maxVehicle: number | null;
  decisionReason: string | null;
  dealStrength: number | null;
  fundingDate: string | null;
  fundingAmount: number | null;
  lenderConfirmation: string | null;
};

type Metrics = {
  approvalRate: number;
  avgDealStrength: number;
  pipelineValue: number;
  fundedVolume: number;
};

type DealerDashboardResponse = {
  success: boolean;
  count: number;
  counts: { draft: number; submitted: number; approved: number; declined: number; funded: number; };
  metrics: Metrics;
  applications: Application[];
  currentUserRole: string;
  message?: string;
  reason?: string;
};

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "N/A";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getApplicantName(app: Application) {
  return [app.firstName, app.lastName].filter(Boolean).join(" ").trim() || "Unknown Applicant";
}

function getVehicleLabel(app: Application) {
  return [app.vehicleYear, app.vehicleMake, app.vehicleModel].filter(Boolean).join(" ").trim() || "No vehicle selected";
}

function getStatusTone(status: string | null | undefined) {
  const s = String(status ?? "DRAFT").toUpperCase();
  if (s === "APPROVED") return "bg-[#eef6f2] text-[#2f6f55] border-[#d7e9df]";
  if (s === "DECLINED") return "bg-[#fbefee] text-[#b42318] border-[#f0c8c4]";
  if (s === "FUNDED") return "bg-[#f3f0ff] text-[#5b3cc4] border-[#ddd2ff]";
  if (s === "SUBMITTED") return "bg-[#f8f2e8] text-[#9a6700] border-[#ead7b0]";
  return "bg-[#f5f3ee] text-[#5f5a52] border-[#e2ddd4]";
}

function DealStrengthBar({ value }: { value: number | null }) {
  if (value == null) return <span className="text-black/40">N/A</span>;
  const color = value >= 70 ? "#2f6f55" : value >= 45 ? "#9a6700" : "#b42318";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-black/8 overflow-hidden">
        <div className="h-2 rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[15px] font-semibold" style={{ color }}>{value}</span>
    </div>
  );
}

export default function DealerDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [counts, setCounts] = useState({ draft: 0, submitted: 0, approved: 0, declined: 0, funded: 0 });
  const [metrics, setMetrics] = useState<Metrics>({ approvalRate: 0, avgDealStrength: 0, pipelineValue: 0, fundedVolume: 0 });
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState("DEALER_USER");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard(refresh = false) {
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      setErrorMessage("");
      const response = await fetch("/api/dealer-dashboard", { cache: "no-store" });
      const data: DealerDashboardResponse = await response.json();
      if (!response.ok || !data.success) throw new Error(data.reason || "Failed to load");
      setApplications(data.applications || []);
      setCounts(data.counts || { draft: 0, submitted: 0, approved: 0, declined: 0, funded: 0 });
      setMetrics(data.metrics || { approvalRate: 0, avgDealStrength: 0, pipelineValue: 0, fundedVolume: 0 });
      setCurrentUserRole(data.currentUserRole || "DEALER_USER");
      if (data.applications?.length) {
        setSelectedId(cur => data.applications.some(a => a.id === cur) ? cur : data.applications[0].id);
      } else {
        setSelectedId("");
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "Failed to load dealer dashboard");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  useEffect(() => { loadDashboard(); }, []);

  const selectedApplication = useMemo(() => applications.find(a => a.id === selectedId) || null, [applications, selectedId]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">Smart Drive Elite</div>
            <h1 className="mt-3 text-[56px] font-semibold leading-none tracking-[-0.06em]">Dealer Dashboard</h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-7 text-black/55">Track submitted deals, approval movement, funding progress, and key underwriting metrics.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-black/10 bg-white px-5 py-3 text-[13px] font-semibold tracking-[0.18em] text-black/60">{applications.length} FILES</div>
            <div className="rounded-full bg-black px-6 py-3 text-[13px] font-semibold tracking-[0.18em] text-white">{currentUserRole}</div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-[20px] border border-[#f0c8c4] bg-[#fbefee] px-6 py-4 text-[15px] text-[#b42318]">{errorMessage}</div>
        )}

        {/* Pipeline counts */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { label: "Draft", value: counts.draft },
            { label: "Submitted", value: counts.submitted },
            { label: "Approved", value: counts.approved },
            { label: "Declined", value: counts.declined },
            { label: "Funded", value: counts.funded },
          ].map(s => (
            <div key={s.label} className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.04)]">
              <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">{s.label}</div>
              <div className="mt-3 text-[32px] font-semibold tracking-[-0.05em]">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Performance metrics */}
        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Approval Rate", value: `${metrics.approvalRate}%`, sub: "of decisioned deals" },
            { label: "Avg Deal Strength", value: metrics.avgDealStrength || "—", sub: "approved deals" },
            { label: "Pipeline Value", value: formatCurrency(metrics.pipelineValue), sub: "approved vehicle value" },
            { label: "Funded Volume", value: formatCurrency(metrics.fundedVolume), sub: "total funded" },
          ].map(m => (
            <div key={m.label} className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.04)]">
              <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">{m.label}</div>
              <div className="mt-3 text-[26px] font-semibold tracking-[-0.04em]">{m.value}</div>
              <div className="mt-1 text-[11px] text-black/40">{m.sub}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_1.2fr]">
          {/* Queue */}
          <section className="rounded-[34px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[26px] font-semibold tracking-[-0.03em]">Dealer Queue</h2>
                <p className="mt-1 text-[14px] text-black/50">Live view of your submitted and decisioned files.</p>
              </div>
              <button onClick={() => loadDashboard(true)} className="rounded-[16px] border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black/60 hover:bg-[#faf7f1]">
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            {isLoading ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] p-6 text-black/50">Loading dashboard...</div>
            ) : applications.length === 0 ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] p-6 text-black/50">No deals found yet.</div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {applications.map(app => (
                  <button key={app.id} onClick={() => setSelectedId(app.id)}
                    className={`w-full rounded-[24px] border p-5 text-left transition ${selectedId === app.id ? "border-[#d8c19a] bg-[#fbf7ef] shadow-[0_12px_30px_rgba(0,0,0,0.04)]" : "border-black/8 bg-white hover:bg-[#faf7f1]"}`}>
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[15px] font-semibold">{getApplicantName(app)}</div>
                        <div className="mt-0.5 text-[13px] text-black/50">{getVehicleLabel(app)}</div>
                      </div>
                      <div className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${getStatusTone(app.status)}`}>
                        {app.status || "DRAFT"}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[13px] text-black/55">
                      <div><span className="text-black/35">Date:</span> {formatDate(app.createdAt)}</div>
                      <div><span className="text-black/35">Lender:</span> {app.lender || "—"}</div>
                      <div><span className="text-black/35">Max Pmt:</span> {formatCurrency(app.maxPayment)}</div>
                      <div><span className="text-black/35">Strength:</span> {app.dealStrength ?? "—"}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Detail */}
          <section className="rounded-[34px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <h2 className="text-[26px] font-semibold tracking-[-0.03em]">Deal Detail</h2>
              <p className="mt-1 text-[14px] text-black/50">Full file view with decision metrics and underwriting data.</p>
            </div>
            {!selectedApplication ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] p-6 text-black/50">Select a deal to view details.</div>
            ) : (
              <div className="space-y-5">
                {/* Header */}
                <div className="rounded-[24px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="text-[12px] uppercase tracking-[0.20em] text-black/36">Applicant</div>
                      <div className="mt-1 text-[28px] font-semibold tracking-[-0.04em]">{getApplicantName(selectedApplication)}</div>
                      <div className="mt-1 text-[14px] text-black/50">{selectedApplication.email || "No email"} · {selectedApplication.phone || "No phone"}</div>
                    </div>
                    <div className={`rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] ${getStatusTone(selectedApplication.status)}`}>
                      {selectedApplication.status || "DRAFT"}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">Identity Status</div>
                      <div className="mt-1 text-[15px] font-semibold">{selectedApplication.identityStatus || "PENDING"}</div>
                    </div>
                    <div className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                      <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">Credit Score</div>
                      <div className="mt-1 text-[15px] font-semibold">{selectedApplication.creditScore ?? "Not provided"}</div>
                    </div>
                  </div>
                </div>

                {/* Vehicle & Finance */}
                <div className="rounded-[24px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="mb-4 text-[12px] uppercase tracking-[0.20em] text-black/36">Vehicle & Finance</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Vehicle", value: getVehicleLabel(selectedApplication) },
                      { label: "Stock #", value: selectedApplication.stockNumber || "N/A" },
                      { label: "Vehicle Price", value: formatCurrency(selectedApplication.vehiclePrice) },
                      { label: "Down Payment", value: formatCurrency(selectedApplication.downPayment) },
                      { label: "Amount Financed", value: formatCurrency(selectedApplication.amountFinanced) },
                      { label: "Monthly Income", value: formatCurrency(selectedApplication.monthlyIncome) },
                    ].map(f => (
                      <div key={f.label} className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">{f.label}</div>
                        <div className="mt-1 text-[15px] font-semibold">{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Decision */}
                <div className="rounded-[24px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="mb-4 text-[12px] uppercase tracking-[0.20em] text-black/36">Decision Engine Output</div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      { label: "Lender", value: selectedApplication.lender || "Pending" },
                      { label: "Tier", value: selectedApplication.tier || "Pending" },
                      { label: "Max Payment", value: formatCurrency(selectedApplication.maxPayment) },
                      { label: "Max Vehicle", value: formatCurrency(selectedApplication.maxVehicle) },
                    ].map(f => (
                      <div key={f.label} className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">{f.label}</div>
                        <div className="mt-1 text-[15px] font-semibold">{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-[16px] border border-black/8 bg-white px-4 py-3 mb-3">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-black/36 mb-2">Deal Strength</div>
                    <DealStrengthBar value={selectedApplication.dealStrength} />
                  </div>
                  <div className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                    <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">Decision Reason</div>
                    <div className="mt-1 text-[14px] text-black/70">{selectedApplication.decisionReason || "No decision note yet."}</div>
                  </div>
                </div>

                {/* Funding */}
                {(selectedApplication.fundingDate || selectedApplication.fundingAmount || selectedApplication.lenderConfirmation) && (
                  <div className="rounded-[24px] border border-black/8 bg-[#fcfbf8] p-6">
                    <div className="mb-4 text-[12px] uppercase tracking-[0.20em] text-black/36">Funding</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">Funding Date</div>
                        <div className="mt-1 text-[15px] font-semibold">{formatDate(selectedApplication.fundingDate)}</div>
                      </div>
                      <div className="rounded-[16px] border border-black/8 bg-white px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">Funded Amount</div>
                        <div className="mt-1 text-[15px] font-semibold">{formatCurrency(selectedApplication.fundingAmount)}</div>
                      </div>
                      <div className="col-span-2 rounded-[16px] border border-black/8 bg-white px-4 py-3">
                        <div className="text-[11px] uppercase tracking-[0.16em] text-black/36">Lender Confirmation</div>
                        <div className="mt-1 text-[15px] font-semibold">{selectedApplication.lenderConfirmation || "Pending"}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
