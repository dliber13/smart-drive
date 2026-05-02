"use client";

import { useEffect, useMemo, useState } from "react";

type Application = {
  id: string;
  createdAt?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  creditScore?: number | null;
  monthlyIncome?: number | null;
  vehiclePrice?: number | null;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehicleYear?: number | null;
  stockNumber?: string | null;
  status?: string | null;
  lender?: string | null;
  tier?: string | null;
  maxPayment?: number | null;
  maxVehicle?: number | null;
  dealStrength?: number | null;
  decisionReason?: string | null;
  identityStatus?: string | null;
  downPayment?: number | null;
  dealNumber?: string | null;
  decisionMs?: number | null;
  docusignStatus?: string | null;
  Dealer?: { name: string; dealerNumber: string } | null;
  ApplicationDocument?: { id: string; documentType: string; verifyStatus: string }[];
};

type Metrics = {
  approvalRate: number;
  avgDealStrength: number;
  pipelineValue: number;
  fundedVolume: number;
  totalApplications: number;
};

type DecisionForm = {
  applicationId: string;
  status: "APPROVED" | "DECLINED";
  lender: string;
  tier: string;
  maxPayment: string;
  maxVehicle: string;
  dealStrength: string;
  decisionReason: string;
};

const emptyDecision: DecisionForm = {
  applicationId: "", status: "APPROVED", lender: "", tier: "",
  maxPayment: "", maxVehicle: "", dealStrength: "", decisionReason: "",
};

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
}

function getStatusTone(status: string | null | undefined) {
  const s = String(status ?? "DRAFT").toUpperCase();
  if (s === "APPROVED") return "bg-[#eef6f2] text-[#2f6f55] border-[#d7e9df]";
  if (s === "DECLINED") return "bg-[#fbefee] text-[#b42318] border-[#f0c8c4]";
  if (s === "FUNDED") return "bg-[#f3f0ff] text-[#5b3cc4] border-[#ddd2ff]";
  if (s === "SUBMITTED") return "bg-[#f8f2e8] text-[#9a6700] border-[#ead7b0]";
  return "bg-[#f5f3ee] text-[#5f5a52] border-[#e2ddd4]";
}

function getIdentityTone(status: string | null | undefined) {
  const s = String(status ?? "PENDING").toUpperCase();
  if (s === "VERIFIED") return "text-[#2f6f55]";
  if (s === "REJECTED") return "text-[#b42318]";
  return "text-[#9a6700]";
}

function StipDots({ docs }: { docs?: { documentType: string; verifyStatus: string }[] }) {
  const types = ["identity", "income", "residence"];
  return (
    <div className="flex gap-1.5 items-center">
      {types.map(t => {
        const doc = docs?.find(d => d.documentType === t);
        const color = !doc ? "bg-black/15" : doc.verifyStatus === "VERIFIED" ? "bg-[#2f6f55]" : doc.verifyStatus === "REJECTED" ? "bg-[#b42318]" : "bg-[#9a6700]";
        return <span key={t} className={`w-2 h-2 rounded-full ${color}`} title={t} />;
      })}
    </div>
  );
}

export default function ControllerPage() {
  const [iblApr, setIblApr] = useState<number>(24.99);
  const [iblAprInput, setIblAprInput] = useState<string>("24.99");
  const [iblAprSaving, setIblAprSaving] = useState(false);
  const [iblAprMessage, setIblAprMessage] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ approvalRate: 0, avgDealStrength: 0, pipelineValue: 0, fundedVolume: 0, totalApplications: 0 });
  const [counts, setCounts] = useState({ draft: 0, submitted: 0, approved: 0, declined: 0, funded: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matches, setMatches] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("error");
  const [decision, setDecision] = useState<DecisionForm>(emptyDecision);
  const [filter, setFilter] = useState<"ALL" | "SUBMITTED" | "APPROVED" | "DECLINED">("SUBMITTED");

  async function loadApplications() {
    try {
      setLoading(true);
      setMessage("");
      const res = await fetch("/api/admin/applications", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) { setMessage(data?.reason || "Failed to load"); setApplications([]); return; }
      setApplications(data.applications || []);
      setMetrics(data.metrics || {});
      setCounts(data.counts || {});
    } catch {
      setMessage("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadApplications(); }, []);

  const filteredApps = useMemo(() => {
    if (filter === "ALL") return applications;
    return applications.filter(a => String(a.status ?? "DRAFT").toUpperCase() === filter);
  }, [applications, filter]);

  const selectedApp = useMemo(() => applications.find(a => a.id === decision.applicationId) || null, [applications, decision.applicationId]);

  async function loadMatches(applicationId: string) {
    try {
      setLoadingMatches(true);
      setMatches([]);
      const res = await fetch("/api/match-vehicles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ applicationId }) });
      const data = await res.json();
      setMatches(Array.isArray(data?.matches) ? data.matches : []);
    } catch { setMatches([]); }
    finally { setLoadingMatches(false); }
  }

  function selectApplication(app: Application) {
    setDecision({
      applicationId: app.id,
      status: "APPROVED",
      lender: app.lender || "",
      tier: app.tier || "",
      maxPayment: typeof app.maxPayment === "number" ? String(app.maxPayment) : "",
      maxVehicle: typeof app.maxVehicle === "number" ? String(app.maxVehicle) : "",
      dealStrength: typeof app.dealStrength === "number" ? String(app.dealStrength) : "",
      decisionReason: app.decisionReason || "",
    });
    setMessage("");
    loadMatches(app.id);
  }

  function updateDecisionField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setDecision(prev => ({ ...prev, [name]: value }));
  }

  async function submitDecision() {
    if (!decision.applicationId) { setMessage("Select an application first."); setMessageType("error"); return; }
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/controller-decision", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(decision) });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.reason || "Failed to save decision"); setMessageType("error"); setSaving(false); return; }
      setMessage(data?.message || "Decision saved.");
      setMessageType("success");
      setDecision(emptyDecision);
      setMatches([]);
      await loadApplications();
    } catch { setMessage("Failed to save decision"); setMessageType("error"); }
    finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">Smart Drive Elite</div>
          <h1 className="mt-3 text-[52px] font-semibold tracking-[-0.05em]">Controller Dashboard</h1>
          <p className="mt-2 text-[16px] text-black/55">Review submitted deals, apply decisions, and surface eligible vehicle matches across all dealers.</p>
        </div>

        {message && (
          <div className={`mb-6 rounded-[18px] border px-5 py-4 text-[14px] ${messageType === "success" ? "border-[#d7e9df] bg-[#eef6f2] text-[#2f6f55]" : "border-[#f0c8c4] bg-[#fbefee] text-[#b42318]"}`}>
            {message}
          </div>
        )}

        {/* IBL Settings */}
        <div style={{ background: "#0f0f0f", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: 24, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "#C9A84C", marginBottom: 4 }}>IBL Rate Override</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Set your in-house lending APR. Default 24.99%. Max 24.99%.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                min="0"
                max="24.99"
                step="0.01"
                value={iblAprInput}
                onChange={e => setIblAprInput(e.target.value)}
                style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(201,168,76,0.4)", borderRadius: 10, padding: "8px 40px 8px 14px", fontSize: 16, fontWeight: 700, color: "#C9A84C", width: 110, outline: "none" }}
              />
              <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 14, color: "#C9A84C", fontWeight: 700 }}>%</span>
            </div>
            <button
              onClick={async () => {
                const val = parseFloat(iblAprInput);
                if (isNaN(val) || val < 0 || val > 24.99) {
                  setIblAprMessage("Rate must be between 0% and 24.99%");
                  return;
                }
                setIblAprSaving(true);
                setIblApr(val);
                setIblAprMessage(`IBL APR set to ${val.toFixed(2)}%`);
                setIblAprSaving(false);
                setTimeout(() => setIblAprMessage(""), 3000);
              }}
              style={{ background: "#C9A84C", color: "#0f0f0f", borderRadius: 10, padding: "8px 20px", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}
            >
              {iblAprSaving ? "Saving..." : "Set Rate"}
            </button>
            {iblAprMessage && <span style={{ fontSize: 12, color: "#C9A84C", fontWeight: 600 }}>{iblAprMessage}</span>}
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { label: "Draft", value: counts.draft },
            { label: "Submitted", value: counts.submitted },
            { label: "Approved", value: counts.approved },
            { label: "Declined", value: counts.declined },
            { label: "Funded", value: counts.funded },
          ].map(s => (
            <div key={s.label} className="rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.04)]">
              <div className="text-[11px] uppercase tracking-[0.22em] text-black/36">{s.label}</div>
              <div className="mt-3 text-[30px] font-semibold tracking-[-0.05em]">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: "Approval Rate", value: `${metrics.approvalRate}%` },
            { label: "Avg Deal Strength", value: metrics.avgDealStrength || "—" },
            { label: "Pipeline Value", value: formatCurrency(metrics.pipelineValue) },
            { label: "Funded Volume", value: formatCurrency(metrics.fundedVolume) },
          ].map(m => (
            <div key={m.label} className="rounded-[22px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.04)]">
              <div className="text-[11px] uppercase tracking-[0.22em] text-black/36">{m.label}</div>
              <div className="mt-3 text-[24px] font-semibold tracking-[-0.04em]">{m.value}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_440px]">

          {/* Queue */}
          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h2 className="text-[28px] font-semibold tracking-[-0.04em]">All Applications</h2>
              <button onClick={loadApplications} className="rounded-[14px] border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold">Refresh</button>
            </div>

            {/* Filter tabs */}
            <div className="mb-5 flex gap-2 flex-wrap">
              {(["SUBMITTED", "APPROVED", "DECLINED", "ALL"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] transition ${filter === f ? "bg-black text-white" : "border border-black/10 bg-white text-black/55 hover:bg-[#faf7f1]"}`}>
                  {f} {f !== "ALL" ? `(${counts[f.toLowerCase() as keyof typeof counts]})` : `(${metrics.totalApplications})`}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/50">Loading applications...</div>
            ) : filteredApps.length === 0 ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/50">No applications in this filter.</div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {filteredApps.map(app => (
                  <button key={app.id} onClick={() => selectApplication(app)}
                    className={`w-full rounded-[22px] border p-5 text-left transition ${decision.applicationId === app.id ? "border-black bg-black text-white" : "border-black/8 bg-[#fcfbf8] hover:bg-[#faf7f1]"}`}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <div className="text-[16px] font-semibold">{[app.firstName, app.lastName].filter(Boolean).join(" ") || "Unnamed"}</div>
                          {app.dealNumber && <span style={{ background: "#0f0f0f", color: "#C9A84C", borderRadius: 6, padding: "2px 8px", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>{app.dealNumber}</span>}
                        </div>
                        <div className={`text-[12px] mt-0.5 ${decision.applicationId === app.id ? "opacity-60" : "text-black/45"}`}>
                          {app.Dealer?.name || "No dealer"} · #{app.Dealer?.dealerNumber || "—"}
                        </div>
                      </div>
                      <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${decision.applicationId === app.id ? "border-white/30 bg-white/10 text-white" : getStatusTone(app.status)}`}>
                        {app.status || "DRAFT"}
                      </div>
                    </div>
                    <div className={`grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] ${decision.applicationId === app.id ? "opacity-70" : "text-black/55"}`}>
                      <div>{app.vehicleYear} {app.vehicleMake} {app.vehicleModel}</div>
                      <div>{formatCurrency(app.vehiclePrice)}</div>
                      <div>Income: {formatCurrency(app.monthlyIncome)}</div>
                      <div>Strength: {app.dealStrength ?? "—"}</div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <StipDots docs={app.ApplicationDocument} />
                      <span className={`text-[11px] ${getIdentityTone(app.identityStatus)} ${decision.applicationId === app.id ? "opacity-80" : ""}`}>
                        ID: {app.identityStatus || "PENDING"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Decision panel */}
          <section className="space-y-6">
            <div className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-4 text-[12px] uppercase tracking-[0.28em] text-black/40">Underwriting Decision</div>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em]">
                {selectedApp ? `${selectedApp.firstName || ""} ${selectedApp.lastName || ""}`.trim() || "Selected" : "Select Application"}
              </h2>

              {selectedApp ? (
                <>
                  {/* App summary */}
                  <div className="mt-4 mb-5 rounded-[18px] border border-black/8 bg-[#faf7f1] px-5 py-4 text-[13px] text-black/60 space-y-1">
                    <div>{selectedApp.vehicleYear} {selectedApp.vehicleMake} {selectedApp.vehicleModel} · {formatCurrency(selectedApp.vehiclePrice)}</div>
                    <div>Income: {formatCurrency(selectedApp.monthlyIncome)} · Down: {formatCurrency(selectedApp.downPayment)}</div>
                    <div>Credit: {selectedApp.creditScore ?? "Not provided"} · ID: <span className={getIdentityTone(selectedApp.identityStatus)}>{selectedApp.identityStatus || "PENDING"}</span></div>
                    <div>Dealer: {selectedApp.Dealer?.name || "Unknown"} #{selectedApp.Dealer?.dealerNumber || "—"}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <select name="status" value={decision.status} onChange={updateDecisionField} className="rounded-[16px] border border-black/10 px-5 py-3.5 outline-none text-sm font-semibold">
                      <option value="APPROVED">APPROVED</option>
                      <option value="DECLINED">DECLINED</option>
                    </select>
                    <div className="grid grid-cols-2 gap-3">
                      <input name="lender" placeholder="Lender" value={decision.lender} onChange={updateDecisionField} className="rounded-[16px] border border-black/10 px-4 py-3 outline-none text-sm" />
                      <input name="tier" placeholder="Tier" value={decision.tier} onChange={updateDecisionField} className="rounded-[16px] border border-black/10 px-4 py-3 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input name="maxPayment" placeholder="Max Payment" value={decision.maxPayment} onChange={updateDecisionField} className="rounded-[16px] border border-black/10 px-4 py-3 outline-none text-sm" />
                      <input name="maxVehicle" placeholder="Max Vehicle" value={decision.maxVehicle} onChange={updateDecisionField} className="rounded-[16px] border border-black/10 px-4 py-3 outline-none text-sm" />
                    </div>
                    <input name="dealStrength" placeholder="Deal Strength (0-100)" value={decision.dealStrength} onChange={updateDecisionField} className="rounded-[16px] border border-black/10 px-4 py-3 outline-none text-sm" />
                    <textarea name="decisionReason" placeholder="Decision Reason" value={decision.decisionReason} onChange={updateDecisionField} className="min-h-[120px] rounded-[16px] border border-black/10 px-4 py-3 outline-none text-sm" />
                  </div>

                  <button onClick={submitDecision} disabled={saving}
                    className={`mt-4 w-full rounded-[18px] px-6 py-4 font-semibold text-sm transition ${decision.status === "APPROVED" ? "bg-[#2f6f55] text-white hover:bg-[#265e47]" : "bg-[#b42318] text-white hover:bg-[#9a1e14]"} disabled:opacity-50`}>
                    {saving ? "Saving..." : `${decision.status} — Save Decision`}
                  </button>
                </>
              ) : (
                <div className="mt-6 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/50">
                  Choose a submitted application from the queue.
                </div>
              )}
            </div>

            {/* Vehicle matches */}
            <div className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-4 text-[12px] uppercase tracking-[0.28em] text-black/40">Matching Engine</div>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em]">Vehicle Matches</h2>
              {!selectedApp ? (
                <div className="mt-4 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-8 text-center text-black/50">Select an application to see eligible vehicles.</div>
              ) : loadingMatches ? (
                <div className="mt-4 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-8 text-center text-black/50">Loading matches...</div>
              ) : matches.length === 0 ? (
                <div className="mt-4 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-8 text-center text-black/50">No eligible inventory matches found.</div>
              ) : (
                <div className="mt-4 space-y-3">
                  {matches.map(v => (
                    <div key={v.id} className="rounded-[20px] border border-black/8 bg-[#fcfbf8] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-[15px] font-semibold">{v.year} {v.make} {v.model}</div>
                          <div className="text-[13px] text-black/50 mt-0.5">Stock #{v.stockNumber} · {v.mileage?.toLocaleString()} mi</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[15px] font-semibold">{formatCurrency(v.askingPrice)}</div>
                          <div className="text-[11px] text-black/40 mt-0.5">Match {v.matchScore}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
