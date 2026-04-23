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
  status?: string | null;
  lender?: string | null;
  tier?: string | null;
  maxPayment?: number | null;
  maxVehicle?: number | null;
  dealStrength?: number | null;
  decisionReason?: string | null;
};

type MatchVehicle = {
  id: string;
  stockNumber: string;
  year?: number | null;
  make?: string | null;
  model?: string | null;
  mileage?: number | null;
  askingPrice?: number | null;
  vehicleClass?: string | null;
  status?: string | null;
  matchScore: number;
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
  applicationId: "",
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matches, setMatches] = useState<MatchVehicle[]>([]);
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState<DecisionForm>(emptyDecision);

  async function loadApplications() {
    try {
      setLoading(true);
      setMessage("");

      const res = await fetch("/api/dealer-dashboard", { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.reason || "Failed to load applications");
        setApplications([]);
        return;
      }

      setApplications(Array.isArray(data?.applications) ? data.applications : []);
    } catch {
      setMessage("Failed to load applications");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  function formatCurrency(value: number | null | undefined) {
    if (typeof value !== "number" || Number.isNaN(value)) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  }

  function formatDate(value: string | undefined) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
  }

  const submittedApps = useMemo(() => {
    return applications.filter(
      (app) => String(app.status ?? "").toUpperCase() === "SUBMITTED"
    );
  }, [applications]);

  const selectedApp = useMemo(() => {
    return applications.find((app) => app.id === decision.applicationId) || null;
  }, [applications, decision.applicationId]);

  async function loadMatches(applicationId: string) {
    try {
      setLoadingMatches(true);
      setMatches([]);

      const res = await fetch("/api/match-vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ applicationId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.reason || "Failed to load matches");
        setMatches([]);
        return;
      }

      setMatches(Array.isArray(data?.matches) ? data.matches : []);
    } catch {
      setMessage("Failed to load matches");
      setMatches([]);
    } finally {
      setLoadingMatches(false);
    }
  }

  function selectApplication(app: Application) {
    setDecision({
      applicationId: app.id,
      status: "APPROVED",
      lender: app.lender || "",
      tier: app.tier || "",
      maxPayment:
        typeof app.maxPayment === "number" ? String(app.maxPayment) : "",
      maxVehicle:
        typeof app.maxVehicle === "number" ? String(app.maxVehicle) : "",
      dealStrength:
        typeof app.dealStrength === "number" ? String(app.dealStrength) : "",
      decisionReason: app.decisionReason || "",
    });
    setMessage("");
    loadMatches(app.id);
  }

  function updateDecisionField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setDecision((prev) => ({ ...prev, [name]: value }));
  }

  async function submitDecision() {
    if (!decision.applicationId) {
      setMessage("Select an application first.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/controller-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(decision),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.reason || "Failed to save controller decision");
        setSaving(false);
        return;
      }

      setMessage(data?.message || "Decision saved.");
      setDecision(emptyDecision);
      setMatches([]);
      await loadApplications();
    } catch {
      setMessage("Failed to save controller decision");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
            Controller Dashboard
          </h1>
          <p className="mt-3 text-base text-black/60">
            Review submitted deals, apply decisions, and surface eligible vehicle matches.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-[18px] border border-black/8 bg-white px-5 py-4 text-[14px] text-black/70">
            {message}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Submitted Queue
            </div>
            <div className="mt-3 text-3xl font-semibold">{submittedApps.length}</div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Approved
            </div>
            <div className="mt-3 text-3xl font-semibold">
              {
                applications.filter(
                  (a) => String(a.status ?? "").toUpperCase() === "APPROVED"
                ).length
              }
            </div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Declined
            </div>
            <div className="mt-3 text-3xl font-semibold">
              {
                applications.filter(
                  (a) => String(a.status ?? "").toUpperCase() === "DECLINED"
                ).length
              }
            </div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
                  Review queue
                </div>
                <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.04em]">
                  Submitted Applications
                </h2>
              </div>

              <button
                onClick={loadApplications}
                className="rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm font-semibold"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                Loading applications...
              </div>
            ) : submittedApps.length === 0 ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                No submitted applications waiting for review.
              </div>
            ) : (
              <div className="space-y-4">
                {submittedApps.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => selectApplication(app)}
                    className={`w-full rounded-[22px] border p-5 text-left transition ${
                      decision.applicationId === app.id
                        ? "border-black bg-black text-white"
                        : "border-black/8 bg-[#fcfbf8] text-black"
                    }`}
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="text-[20px] font-semibold">
                          {[app.firstName, app.lastName].filter(Boolean).join(" ") ||
                            "Unnamed Applicant"}
                        </div>
                        <div className="mt-1 text-sm opacity-70">
                          {app.email || "No email"} · {app.phone || "No phone"}
                        </div>
                        <div className="mt-3 text-sm opacity-70">
                          {app.vehicleMake || "Vehicle"} {app.vehicleModel || ""} ·{" "}
                          {formatCurrency(app.vehiclePrice)}
                        </div>
                        <div className="mt-1 text-sm opacity-60">
                          Submitted: {formatDate(app.createdAt)}
                        </div>
                      </div>

                      <div className="min-w-[180px] text-sm opacity-75">
                        <div>Credit: {app.creditScore ?? "—"}</div>
                        <div>Income: {formatCurrency(app.monthlyIncome)}</div>
                        <div>Status: {app.status || "—"}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-8">
            <div className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">
                Underwriting decision
              </div>
              <h2 className="text-[32px] font-semibold tracking-[-0.04em]">
                {selectedApp
                  ? `${selectedApp.firstName || ""} ${selectedApp.lastName || ""}`.trim() ||
                    "Selected Application"
                  : "Select an Application"}
              </h2>

              {selectedApp ? (
                <>
                  <div className="mt-6 grid grid-cols-1 gap-4">
                    <select
                      name="status"
                      value={decision.status}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="DECLINED">DECLINED</option>
                    </select>

                    <input
                      name="lender"
                      placeholder="Lender"
                      value={decision.lender}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    />

                    <input
                      name="tier"
                      placeholder="Tier"
                      value={decision.tier}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    />

                    <input
                      name="maxPayment"
                      placeholder="Max Payment"
                      value={decision.maxPayment}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    />

                    <input
                      name="maxVehicle"
                      placeholder="Max Vehicle"
                      value={decision.maxVehicle}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    />

                    <input
                      name="dealStrength"
                      placeholder="Deal Strength"
                      value={decision.dealStrength}
                      onChange={updateDecisionField}
                      className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    />

                    <textarea
                      name="decisionReason"
                      placeholder="Decision Reason"
                      value={decision.decisionReason}
                      onChange={updateDecisionField}
                      className="min-h-[140px] rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                    />
                  </div>

                  <button
                    onClick={submitDecision}
                    disabled={saving}
                    className="mt-6 w-full rounded-[18px] bg-black px-6 py-4 text-white disabled:opacity-60"
                  >
                    {saving ? "Saving Decision..." : "Save Controller Decision"}
                  </button>
                </>
              ) : (
                <div className="mt-6 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                  Choose a submitted application from the queue to review it.
                </div>
              )}
            </div>

            <div className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
              <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">
                Matching engine
              </div>
              <h2 className="text-[32px] font-semibold tracking-[-0.04em]">
                Vehicle Matches
              </h2>

              {!selectedApp ? (
                <div className="mt-6 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                  Select an application to see eligible vehicles.
                </div>
              ) : loadingMatches ? (
                <div className="mt-6 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                  Loading matches...
                </div>
              ) : matches.length === 0 ? (
                <div className="mt-6 rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                  No eligible inventory matches found yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {matches.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="rounded-[20px] border border-black/8 bg-[#fcfbf8] p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[18px] font-semibold">
                            {vehicle.year || "—"} {vehicle.make || ""} {vehicle.model || ""}
                          </div>
                          <div className="mt-1 text-sm text-black/55">
                            Stock #{vehicle.stockNumber}
                          </div>
                          <div className="mt-3 text-sm text-black/60">
                            Mileage: {vehicle.mileage ?? "—"} · Price:{" "}
                            {formatCurrency(vehicle.askingPrice)}
                          </div>
                        </div>

                        <div className="rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
                          Match {vehicle.matchScore}
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
