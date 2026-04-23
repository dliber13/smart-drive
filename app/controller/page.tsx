"use client";

import { useEffect, useMemo, useState } from "react";

type Application = {
  id: string;
  createdAt?: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;

  identityType?: string | null;
  identityValue?: string | null;
  issuingCountry?: string | null;
  identityStatus?: string | null;

  stockNumber?: string | null;
  vin?: string | null;
  vehicleYear?: number | null;
  vehicleMake?: string | null;
  vehicleModel?: string | null;
  vehiclePrice?: number | null;

  downPayment?: number | null;
  tradeIn?: number | null;
  amountFinanced?: number | null;

  creditScore?: number | null;
  monthlyIncome?: number | null;

  status?: string | null;
  lender?: string | null;
  tier?: string | null;
  maxPayment?: number | null;
  maxVehicle?: number | null;
  dealStrength?: number | null;
  decisionReason?: string | null;
};

type DecisionForm = {
  status: "APPROVED" | "DECLINED";
  lender: string;
  tier: string;
  maxPayment: string;
  maxVehicle: string;
  dealStrength: string;
  decisionReason: string;
};

function formatCurrency(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function safeText(value: string | null | undefined) {
  return value && String(value).trim() ? value : "N/A";
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return fallback;
}

function smartTier(creditScore: number) {
  if (creditScore >= 720) return "TIER_1";
  if (creditScore >= 660) return "TIER_2";
  if (creditScore >= 600) return "TIER_3";
  if (creditScore >= 540) return "TIER_4";
  return "TIER_5";
}

function smartLender(creditScore: number, monthlyIncome: number) {
  if (creditScore >= 720 && monthlyIncome >= 5000) return "Ally";
  if (creditScore >= 660) return "Westlake";
  if (creditScore >= 600) return "Global Lending";
  if (creditScore >= 540) return "Credit Acceptance";
  return "Specialty Review";
}

function smartMaxPayment(monthlyIncome: number, creditScore: number) {
  const baseRatio =
    creditScore >= 720 ? 0.2 :
    creditScore >= 660 ? 0.18 :
    creditScore >= 600 ? 0.16 :
    creditScore >= 540 ? 0.14 :
    0.12;

  return Math.max(0, Math.round(monthlyIncome * baseRatio));
}

function smartMaxVehicle(
  maxPayment: number,
  downPayment: number,
  tradeIn: number,
  creditScore: number
) {
  const advanceMultiple =
    creditScore >= 720 ? 58 :
    creditScore >= 660 ? 52 :
    creditScore >= 600 ? 46 :
    creditScore >= 540 ? 40 :
    34;

  return Math.max(
    0,
    Math.round(maxPayment * advanceMultiple + downPayment + tradeIn)
  );
}

function smartDealStrength(
  creditScore: number,
  monthlyIncome: number,
  downPayment: number,
  tradeIn: number,
  vehiclePrice: number
) {
  let score = 40;

  if (creditScore >= 720) score += 30;
  else if (creditScore >= 660) score += 24;
  else if (creditScore >= 600) score += 18;
  else if (creditScore >= 540) score += 10;
  else score += 4;

  if (monthlyIncome >= 6000) score += 15;
  else if (monthlyIncome >= 4500) score += 10;
  else if (monthlyIncome >= 3000) score += 6;

  const equity = downPayment + tradeIn;
  if (vehiclePrice > 0) {
    const equityRatio = equity / vehiclePrice;
    if (equityRatio >= 0.2) score += 15;
    else if (equityRatio >= 0.1) score += 10;
    else if (equityRatio >= 0.05) score += 5;
  }

  return Math.max(1, Math.min(100, Math.round(score)));
}

function buildSmartRecommendation(app: Application): DecisionForm {
  const creditScore = toNumber(app.creditScore);
  const monthlyIncome = toNumber(app.monthlyIncome);
  const downPayment = toNumber(app.downPayment);
  const tradeIn = toNumber(app.tradeIn);
  const vehiclePrice = toNumber(app.vehiclePrice);

  const tier = smartTier(creditScore);
  const lender = smartLender(creditScore, monthlyIncome);
  const maxPayment = smartMaxPayment(monthlyIncome, creditScore);
  const maxVehicle = smartMaxVehicle(maxPayment, downPayment, tradeIn, creditScore);
  const dealStrength = smartDealStrength(
    creditScore,
    monthlyIncome,
    downPayment,
    tradeIn,
    vehiclePrice
  );

  let status: "APPROVED" | "DECLINED" = "APPROVED";
  let decisionReason = `Approved ${tier} with ${lender}. Recommended max payment ${maxPayment} and max vehicle ${maxVehicle}.`;

  if (creditScore < 500) {
    status = "DECLINED";
    decisionReason = "Declined due to credit score below minimum review threshold.";
  } else if (monthlyIncome < 1800) {
    status = "DECLINED";
    decisionReason = "Declined due to insufficient monthly income.";
  } else if (vehiclePrice > 0 && maxVehicle > 0 && vehiclePrice > maxVehicle * 1.15) {
    status = "DECLINED";
    decisionReason = "Declined because requested vehicle exceeds recommended structure.";
  }

  return {
    status,
    lender,
    tier,
    maxPayment: String(maxPayment),
    maxVehicle: String(maxVehicle),
    dealStrength: String(dealStrength),
    decisionReason,
  };
}

const emptyDecision: DecisionForm = {
  status: "APPROVED",
  lender: "",
  tier: "",
  maxPayment: "",
  maxVehicle: "",
  dealStrength: "",
  decisionReason: "",
};

export default function ControllerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("Controller dashboard loaded");
  const [saving, setSaving] = useState(false);
  const [decisionForm, setDecisionForm] = useState<DecisionForm>(emptyDecision);

  async function loadApplications() {
    try {
      setLoading(true);

      const res = await fetch("/api/controller-dashboard", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data?.reason || "Failed to load controller dashboard");
        setApplications([]);
        setLoading(false);
        return;
      }

      const nextApps = Array.isArray(data.applications) ? data.applications : [];
      setApplications(nextApps);

      if (nextApps.length > 0) {
        setSelectedId((current) => {
          if (current && nextApps.some((app: Application) => app.id === current)) {
            return current;
          }
          return nextApps[0].id;
        });
      }

      setMessage("Controller dashboard loaded");
    } catch (error) {
      console.error("CONTROLLER PAGE LOAD ERROR:", error);
      setMessage("Failed to load controller dashboard");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const selectedApplication = useMemo(() => {
    return applications.find((app) => app.id === selectedId) || null;
  }, [applications, selectedId]);

  useEffect(() => {
    if (selectedApplication) {
      setDecisionForm(buildSmartRecommendation(selectedApplication));
    } else {
      setDecisionForm(emptyDecision);
    }
  }, [selectedApplication]);

  function updateDecisionField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setDecisionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function regenerateSmartDecision() {
    if (!selectedApplication) return;
    setDecisionForm(buildSmartRecommendation(selectedApplication));
    setMessage("Smart recommendation generated");
  }

  async function saveDecision(statusOverride?: "APPROVED" | "DECLINED") {
    if (!selectedApplication) {
      setMessage("Select an application first");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        applicationId: selectedApplication.id,
        ...decisionForm,
        status: statusOverride || decisionForm.status,
      };

      const res = await fetch("/api/controller-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage(data?.reason || "Failed to save decision");
        return;
      }

      setMessage(data?.message || "Decision saved");
      await loadApplications();

      const updated = data.application as Application;
      if (updated?.id) {
        setSelectedId(updated.id);
      }
    } catch (error) {
      console.error("SAVE DECISION ERROR:", error);
      setMessage("Failed to save decision");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-5 py-6 text-[#111111] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-[24px] border border-[#cfe6d5] bg-[#eaf6ee] px-6 py-5 text-[18px] text-[#2d7a45]">
          {message}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.45fr]">
          <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-[28px] font-semibold tracking-[-0.04em]">
                  Application Queue
                </h1>
                <p className="mt-1 text-[15px] text-black/55">
                  Review and manage file progression
                </p>
              </div>

              <button
                onClick={loadApplications}
                className="rounded-[18px] border border-black/10 bg-white px-5 py-3 font-semibold"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="rounded-[24px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-[24px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                No applications found
              </div>
            ) : (
              <div className="space-y-5">
                {applications.map((app) => {
                  const isSelected = app.id === selectedId;
                  const fullName =
                    `${app.firstName || ""} ${app.lastName || ""}`.trim() ||
                    "Unknown Borrower";

                  return (
                    <button
                      key={app.id}
                      onClick={() => setSelectedId(app.id)}
                      className={`w-full rounded-[24px] border p-5 text-left transition ${
                        isSelected
                          ? "border-[#ccb88d] bg-[#fcf8ee]"
                          : "border-black/10 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[18px] font-semibold">{fullName}</div>
                          <div className="mt-3 space-y-2 text-[15px] text-black/58">
                            <div>{safeText(app.identityType)}</div>
                            <div>Score: {app.creditScore ?? "N/A"}</div>
                            <div>Decision: {safeText(app.decisionReason)}</div>
                            <div>Lenders: {safeText(app.lender)}</div>
                            <div>Max Vehicle: {formatCurrency(app.maxVehicle)}</div>
                            <div>
                              Vehicle: {[app.vehicleYear, app.vehicleMake, app.vehicleModel]
                                .filter(Boolean)
                                .join(" ") || "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="min-w-[120px] text-right">
                          <div className="inline-flex rounded-full bg-[#edf3ff] px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#3f67d7]">
                            {safeText(app.status)}
                          </div>

                          <div className="mt-6 space-y-2 text-[15px] text-black/58">
                            <div>{safeText(app.identityStatus)}</div>
                            <div>Tier: {safeText(app.tier)}</div>
                            <div>Max Payment: {formatCurrency(app.maxPayment)}</div>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-[0_18px_45px_rgba(0,0,0,0.04)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[34px] font-semibold tracking-[-0.05em]">
                  Controller Review
                </h2>
                <p className="mt-1 text-[15px] text-black/55">
                  Decision controls and funding workflow
                </p>
              </div>

              <button
                onClick={regenerateSmartDecision}
                className="rounded-[18px] bg-black px-6 py-4 text-[15px] font-semibold text-white"
              >
                Generate Smart Decision
              </button>
            </div>

            {!selectedApplication ? (
              <div className="rounded-[24px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                Select an application from the queue
              </div>
            ) : (
              <div className="space-y-7">
                <div className="rounded-[28px] border border-black/8 bg-[#faf7f1] p-6">
                  <h3 className="mb-5 text-[22px] font-semibold">Applicant Snapshot</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Borrower</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {`${selectedApplication.firstName || ""} ${selectedApplication.lastName || ""}`.trim() ||
                          "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Phone</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {safeText(selectedApplication.phone)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Email</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {safeText(selectedApplication.email)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Identity Type</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {safeText(selectedApplication.identityType)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Identity Status</div>
                      <div className="mt-1 text-right text-[24px] font-semibold text-[#c64223]">
                        {safeText(selectedApplication.identityStatus)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Issuing Country</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {safeText(selectedApplication.issuingCountry)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-[#faf7f1] p-6">
                  <h3 className="mb-5 text-[22px] font-semibold">Deal Snapshot</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Current Status</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {safeText(selectedApplication.status)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Credit Score</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {selectedApplication.creditScore ?? "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Monthly Income</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {formatCurrency(selectedApplication.monthlyIncome)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Vehicle</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {[selectedApplication.vehicleYear, selectedApplication.vehicleMake, selectedApplication.vehicleModel]
                          .filter(Boolean)
                          .join(" ") || "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Vehicle Price</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {formatCurrency(selectedApplication.vehiclePrice)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Down Payment</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {formatCurrency(selectedApplication.downPayment)}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-white px-5 py-4">
                      <div className="text-black/45">Amount Financed</div>
                      <div className="mt-1 text-right text-[24px] font-semibold">
                        {formatCurrency(selectedApplication.amountFinanced)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-[#faf7f1] p-6">
                  <h3 className="mb-5 text-[22px] font-semibold">Smart Decision Controls</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <select
                      name="status"
                      value={decisionForm.status}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="DECLINED">DECLINED</option>
                    </select>

                    <input
                      name="tier"
                      value={decisionForm.tier}
                      onChange={updateDecisionField}
                      placeholder="Tier"
                      className="rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                    />

                    <input
                      name="lender"
                      value={decisionForm.lender}
                      onChange={updateDecisionField}
                      placeholder="Lender"
                      className="rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                    />

                    <input
                      name="dealStrength"
                      value={decisionForm.dealStrength}
                      onChange={updateDecisionField}
                      placeholder="Deal Strength"
                      className="rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                    />

                    <input
                      name="maxPayment"
                      value={decisionForm.maxPayment}
                      onChange={updateDecisionField}
                      placeholder="Max Payment"
                      className="rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                    />

                    <input
                      name="maxVehicle"
                      value={decisionForm.maxVehicle}
                      onChange={updateDecisionField}
                      placeholder="Max Vehicle"
                      className="rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                    />
                  </div>

                  <textarea
                    name="decisionReason"
                    value={decisionForm.decisionReason}
                    onChange={updateDecisionField}
                    placeholder="Decision Reason"
                    className="mt-4 min-h-[140px] w-full rounded-[18px] border border-black/10 bg-white px-5 py-4 outline-none"
                  />

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <button
                      onClick={() => saveDecision("APPROVED")}
                      disabled={saving}
                      className="rounded-[18px] bg-[#204f2b] px-6 py-4 text-[16px] font-semibold text-white disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Approve Deal"}
                    </button>

                    <button
                      onClick={() => saveDecision("DECLINED")}
                      disabled={saving}
                      className="rounded-[18px] bg-[#7c1f1f] px-6 py-4 text-[16px] font-semibold text-white disabled:opacity-60"
                    >
                      {saving ? "Saving..." : "Decline Deal"}
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-[#faf7f1] p-6">
                  <h3 className="mb-5 text-[22px] font-semibold">Decision Notes</h3>

                  <div className="rounded-[18px] bg-white px-5 py-5 text-[18px] text-black/70">
                    {safeText(decisionForm.decisionReason)}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
