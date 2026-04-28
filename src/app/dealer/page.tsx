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
  tier?: string | null;
  lender?: string | null;
  maxPayment?: number | null;
  maxVehicle?: number | null;
  dealStrength?: number | null;
  decisionReason?: string | null;
};

type Vehicle = {
  id: string;
  stockNumber: string;
  vin?: string | null;
  year: number;
  make: string;
  model: string;
  trim?: string | null;
  mileage: number;
  askingPrice: number;
  vehicleClass?: string | null;
  status: string;
};

type DecisionResult = {
  status: "APPROVED" | "DECLINED";
  riskTier: string;
  recommendedDealType: string;
  alternateDealType?: string | null;
  dealTypeReason: string;
  lender: string;
  lenderTier: string;
  apr: number;
  termMonths: number;
  maxPayment: number;
  maxVehicle: number;
  dealStrength: number;
  pti: number;
  estimatedDTI: number;
  decisionReason: string;
  lenderWaterfall: {
    lender: string;
    tier: string;
    eligible: boolean;
    reason: string;
    apr: number;
    termMonths: number;
  }[];
};

export default function DealerPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    creditScore: "",
    monthlyIncome: "",
    stockNumber: "",
    vin: "",
    vehicleYear: "",
    vehicleMake: "",
    vehicleModel: "",
    vehiclePrice: "",
    mileage: "",
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState<DecisionResult | null>(null);

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

  async function loadVehicles() {
    try {
      setLoadingVehicles(true);
      const res = await fetch("/api/vehicle-options", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data?.vehicles)) {
        setVehicles(data.vehicles);
      }
    } catch {
      console.error("Failed to load vehicles");
    } finally {
      setLoadingVehicles(false);
    }
  }

  async function loadApplications() {
    try {
      setLoadingApps(true);
      const res = await fetch("/api/dealer-dashboard", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.reason || "Failed to load submissions");
        setApplications([]);
        return;
      }
      setApplications(Array.isArray(data?.applications) ? data.applications : []);
    } catch {
      setMessage("Failed to load submissions");
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  }

  useEffect(() => {
    loadVehicles();
    loadApplications();
  }, []);

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    setSelectedVehicleId(vehicleId);

    if (!vehicleId) {
      setForm((prev) => ({
        ...prev,
        stockNumber: "",
        vin: "",
        vehicleYear: "",
        vehicleMake: "",
        vehicleModel: "",
        vehiclePrice: "",
        mileage: "",
      }));
      return;
    }

    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (vehicle) {
      setForm((prev) => ({
        ...prev,
        stockNumber: vehicle.stockNumber || "",
        vin: vehicle.vin || "",
        vehicleYear: vehicle.year?.toString() || "",
        vehicleMake: vehicle.make || "",
        vehicleModel: vehicle.model || "",
        vehiclePrice: vehicle.askingPrice?.toString() || "",
        mileage: vehicle.mileage?.toString() || "",
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const stats = useMemo(() => {
    const submitted = applications.filter(
      (app) => String(app.status ?? "").toUpperCase() === "SUBMITTED"
    ).length;
    const approved = applications.filter(
      (app) => String(app.status ?? "").toUpperCase() === "APPROVED"
    ).length;
    const declined = applications.filter(
      (app) => String(app.status ?? "").toUpperCase() === "DECLINED"
    ).length;
    const funded = applications.filter(
      (app) => String(app.status ?? "").toUpperCase() === "FUNDED"
    ).length;
    return { submitted, approved, declined, funded };
  }, [applications]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setMessage("");
    setDecision(null);

    try {
      const res = await fetch("/api/test-submit-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.reason || "Submission failed");
        setSubmitting(false);
        return;
      }

      if (data?.decision) {
        setDecision(data.decision);
      }

      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        creditScore: "",
        monthlyIncome: "",
        stockNumber: "",
        vin: "",
        vehicleYear: "",
        vehicleMake: "",
        vehicleModel: "",
        vehiclePrice: "",
        mileage: "",
      });
      setSelectedVehicleId("");
      await loadApplications();
    } catch {
      setMessage("Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
            Smart Drive Elite
          </div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">
            Dealer Dashboard
          </h1>
          <p className="mt-3 text-base text-black/60">
            Submit new deals and track live application status in one place.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">Submitted</div>
            <div className="mt-3 text-3xl font-semibold">{stats.submitted}</div>
          </div>
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">Approved</div>
            <div className="mt-3 text-3xl font-semibold">{stats.approved}</div>
          </div>
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">Declined</div>
            <div className="mt-3 text-3xl font-semibold">{stats.declined}</div>
          </div>
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">Funded</div>
            <div className="mt-3 text-3xl font-semibold">{stats.funded}</div>
          </div>
        </div>

        {/* Decision Result Panel */}
        {decision && (
          <div className={`mb-8 rounded-[28px] border p-8 ${
            decision.status === "APPROVED"
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/40 mb-2">
                  Smart Drive Elite Decision
                </div>
                <div className={`text-4xl font-bold tracking-tight ${
                  decision.status === "APPROVED" ? "text-green-700" : "text-red-700"
                }`}>
                  {decision.status === "APPROVED" ? "APPROVED" : "DECLINED"}
                </div>
                <div className="mt-3 text-sm text-black/60 max-w-xl">
                  {decision.decisionReason}
                </div>
              </div>
              <div className={`rounded-[20px] px-6 py-5 min-w-[200px] text-center ${
                decision.status === "APPROVED" ? "bg-green-100" : "bg-red-100"
              }`}>
                <div className="text-[11px] uppercase tracking-[0.22em] text-black/40 mb-1">Deal Strength</div>
                <div className={`text-5xl font-bold ${
                  decision.dealStrength >= 70 ? "text-green-700" :
                  decision.dealStrength >= 45 ? "text-yellow-700" : "text-red-700"
                }`}>
                  {decision.dealStrength}
                </div>
                <div className="text-xs text-black/40 mt-1">out of 100</div>
              </div>
            </div>

            {decision.status === "APPROVED" && (
              <>
                {/* Deal Type Recommendation */}
                <div className="mt-6 rounded-[20px] bg-white border border-black/8 px-6 py-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/40 mb-3">
                    Recommended Structure
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="inline-flex items-center rounded-full bg-black text-white px-4 py-1.5 text-sm font-semibold">
                      {decision.recommendedDealType}
                    </span>
                    {decision.alternateDealType && (
                      <span className="inline-flex items-center rounded-full border border-black/20 text-black/60 px-4 py-1.5 text-sm">
                        Alt: {decision.alternateDealType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-black/60">{decision.dealTypeReason}</p>
                </div>

                {/* Key Numbers */}
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-[18px] bg-white border border-black/8 px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-black/38 mb-1">Lender</div>
                    <div className="font-semibold text-sm">{decision.lender}</div>
                    <div className="text-xs text-black/50 mt-0.5">{decision.lenderTier}</div>
                  </div>
                  <div className="rounded-[18px] bg-white border border-black/8 px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-black/38 mb-1">Max Payment</div>
                    <div className="font-semibold text-lg">{formatCurrency(decision.maxPayment)}/mo</div>
                    <div className="text-xs text-black/50 mt-0.5">PTI: {decision.pti.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-[18px] bg-white border border-black/8 px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-black/38 mb-1">Max Vehicle</div>
                    <div className="font-semibold text-lg">{formatCurrency(decision.maxVehicle)}</div>
                    <div className="text-xs text-black/50 mt-0.5">Est. DTI: {decision.estimatedDTI.toFixed(1)}%</div>
                  </div>
                  <div className="rounded-[18px] bg-white border border-black/8 px-5 py-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-black/38 mb-1">Terms</div>
                    <div className="font-semibold text-sm">{(decision.apr * 100).toFixed(2)}% APR</div>
                    <div className="text-xs text-black/50 mt-0.5">{decision.termMonths} months</div>
                  </div>
                </div>

                {/* Lender Waterfall */}
                <div className="mt-4 rounded-[20px] bg-white border border-black/8 px-6 py-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/40 mb-4">
                    Lender Waterfall
                  </div>
                  <div className="space-y-2">
                    {decision.lenderWaterfall.map((l, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${l.eligible ? "bg-green-500" : "bg-black/20"}`} />
                          <span className={l.eligible ? "font-semibold" : "text-black/40"}>
                            {l.lender}
                          </span>
                          <span className="text-black/40 text-xs">{l.tier}</span>
                        </div>
                        <span className={`text-xs ${l.eligible ? "text-green-600 font-medium" : "text-black/35"}`}>
                          {l.eligible ? "Eligible" : l.reason}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => setDecision(null)}
              className="mt-4 text-sm text-black/40 hover:text-black/70 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {message && !decision && (
          <div className="mb-6 rounded-[18px] border border-black/8 bg-white px-5 py-4 text-[14px] text-black/70">
            {message}
          </div>
        )}

        <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">
              New submission
            </div>
            <h2 className="text-[32px] font-semibold tracking-[-0.04em]">Deal Intake</h2>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Customer</div>
              <input name="firstName" placeholder="First Name" className="rounded-[18px] border border-black/10 px-5 py-4 outline-none" onChange={handleChange} value={form.firstName} />
              <input name="lastName" placeholder="Last Name" className="rounded-[18px] border border-black/10 px-5 py-4 outline-none" onChange={handleChange} value={form.lastName} />
              <input name="phone" placeholder="Phone" className="rounded-[18px] border border-black/10 px-5 py-4 outline-none" onChange={handleChange} value={form.phone} />
              <input name="email" placeholder="Email" className="rounded-[18px] border border-black/10 px-5 py-4 outline-none" onChange={handleChange} value={form.email} />
              <input name="creditScore" placeholder="Credit Score" className="rounded-[18px] border border-black/10 px-5 py-4 outline-none" onChange={handleChange} value={form.creditScore} />
              <input name="monthlyIncome" placeholder="Monthly Income" className="rounded-[18px] border border-black/10 px-5 py-4 outline-none" onChange={handleChange} value={form.monthlyIncome} />

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Vehicle</div>
              <select value={selectedVehicleId} onChange={handleVehicleSelect} className="rounded-[18px] border border-black/10 px-5 py-4 outline-none bg-white">
                <option value="">{loadingVehicles ? "Loading inventory..." : "Select a vehicle from inventory"}</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.year} {v.make} {v.model} — Stock #{v.stockNumber} — {v.vin || "N/A"} — {formatCurrency(v.askingPrice)}
                  </option>
                ))}
              </select>

              {selectedVehicleId && (
                <div className="rounded-[18px] border border-black/8 bg-[#faf7f1] px-5 py-4 space-y-2">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mb-3">Auto-filled from inventory</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-black/50">Stock #</span><span className="font-medium">{form.stockNumber || "—"}</span>
                    <span className="text-black/50">VIN</span><span className="font-medium text-xs">{form.vin || "—"}</span>
                    <span className="text-black/50">Year</span><span className="font-medium">{form.vehicleYear || "—"}</span>
                    <span className="text-black/50">Make</span><span className="font-medium">{form.vehicleMake || "—"}</span>
                    <span className="text-black/50">Model</span><span className="font-medium">{form.vehicleModel || "—"}</span>
                    <span className="text-black/50">Price</span><span className="font-medium">{formatCurrency(Number(form.vehiclePrice))}</span>
                    <span className="text-black/50">Mileage</span><span className="font-medium">{form.mileage ? Number(form.mileage).toLocaleString() + " mi" : "—"}</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleSubmit} disabled={submitting} className="mt-6 w-full rounded-[18px] bg-black px-6 py-4 text-white disabled:opacity-60">
              {submitting ? "Running decision engine..." : "Submit Deal"}
            </button>
          </section>

          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">Live pipeline</div>
                <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.04em]">Recent Applications</h2>
              </div>
              <button onClick={loadApplications} className="rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm font-semibold">
                Refresh
              </button>
            </div>

            {loadingApps ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">No applications submitted yet.</div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app.id} className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="text-[20px] font-semibold">
                          {[app.firstName, app.lastName].filter(Boolean).join(" ") || "Unnamed Applicant"}
                        </div>
                        <div className="mt-1 text-sm text-black/55">{app.email || "No email"} · {app.phone || "No phone"}</div>
                        <div className="mt-3 text-sm text-black/55">{app.vehicleMake || "Vehicle"} {app.vehicleModel || ""} · {formatCurrency(app.vehiclePrice)}</div>
                        <div className="mt-1 text-sm text-black/50">Submitted: {formatDate(app.createdAt)}</div>
                      </div>
                      <div className="min-w-[220px]">
                        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          String(app.status).toUpperCase() === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : String(app.status).toUpperCase() === "DECLINED"
                            ? "bg-red-100 text-red-700"
                            : "border border-black/8 bg-white text-black/65"
                        }`}>
                          {app.status || "UNKNOWN"}
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-black/60">
                          <div>Tier: {app.tier || "—"}</div>
                          <div>Lender: {app.lender || "—"}</div>
                          <div>Max Payment: {formatCurrency(app.maxPayment)}</div>
                          <div>Max Vehicle: {formatCurrency(app.maxVehicle)}</div>
                          <div>Deal Strength: {app.dealStrength ?? "—"}</div>
                        </div>
                      </div>
                    </div>
                    {app.decisionReason && (
                      <div className="mt-4 rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-black/65">
                        {app.decisionReason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}