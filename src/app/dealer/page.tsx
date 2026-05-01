"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Application = {
  id: string;
  dealNumber?: string | null;
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

type StipStatus = "empty" | "ready" | "uploading" | "uploaded" | "error";

type StipDoc = {
  file: File | null;
  status: StipStatus;
  fileKey?: string;
  error?: string;
};

type Stips = {
  identity: StipDoc;
  income: StipDoc;
  residence: StipDoc;
};

const EMPTY_STIP: StipDoc = { file: null, status: "empty" };

const STIP_CONFIG: Record<keyof Stips, { label: string; hint: string }> = {
  identity: { label: "Government-Issued ID", hint: "Driver's license (front & back), passport, or state ID" },
  income: { label: "Proof of Income", hint: "Last 2 pay stubs, bank statements, or tax return" },
  residence: { label: "Proof of Residence", hint: "Utility bill, lease agreement, or mortgage statement" },
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

function StipCard({ stipKey, doc, onChange }: { stipKey: keyof Stips; doc: StipDoc; onChange: (key: keyof Stips, file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { label, hint } = STIP_CONFIG[stipKey];

  const borderColor = {
    empty: "border-black/10",
    ready: "border-blue-300",
    uploading: "border-amber-300",
    uploaded: "border-green-300",
    error: "border-red-300",
  }[doc.status];

  const bgColor = {
    empty: "bg-white",
    ready: "bg-blue-50",
    uploading: "bg-amber-50",
    uploaded: "bg-green-50",
    error: "bg-red-50",
  }[doc.status];

  const badge = {
    empty: null,
    ready: <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-700">Ready</span>,
    uploading: <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">Uploading…</span>,
    uploaded: <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">✓ Uploaded</span>,
    error: <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700">Error</span>,
  }[doc.status];

  return (
    <div className={`rounded-[16px] border-2 p-4 transition-all ${borderColor} ${bgColor}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-[13px] text-black/80">{label}</div>
          <div className="text-[11px] text-black/45 mt-0.5">{hint}</div>
          {doc.file && <div className="text-[11px] text-black/55 mt-1.5 truncate">{doc.file.name}</div>}
          {doc.error && <div className="text-[11px] text-red-600 mt-1">{doc.error}</div>}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {badge}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={doc.status === "uploading"}
            className="rounded-[10px] border border-black/15 bg-white px-3 py-1.5 text-[12px] font-semibold text-black/70 hover:bg-black/5 disabled:opacity-50 transition-colors"
          >
            {doc.status === "empty" ? "Choose File" : "Replace"}
          </button>
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.heic"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onChange(stipKey, file);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export default function DealerPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", email: "",
    ssn: "", dob: "", dlNumber: "", dlState: "",
    creditScore: "", monthlyIncome: "", payFrequency: "BIWEEKLY",
    monthlyExpenses: "", downPayment: "",
    residenceMonths: "", residenceYears: "", residenceType: "RENT", employmentMonths: "", employmentYears: "",
    stockNumber: "", vin: "", vehicleYear: "",
    vehicleMake: "", vehicleModel: "", vehiclePrice: "", mileage: "",
  });

  const [stips, setStips] = useState<Stips>({
    identity: { ...EMPTY_STIP },
    income: { ...EMPTY_STIP },
    residence: { ...EMPTY_STIP },
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [decision, setDecision] = useState<DecisionResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const allStipsUploaded =
    stips.identity.status === "uploaded" &&
    stips.income.status === "uploaded" &&
    stips.residence.status === "uploaded";

  const stipsInProgress = Object.values(stips).some((s) => s.status === "uploading");

  const canSubmit =
    allStipsUploaded &&
    !submitting &&
    !stipsInProgress &&
    form.firstName.trim() !== "" &&
    form.lastName.trim() !== "" &&
    form.monthlyIncome.trim() !== "" &&
    selectedVehicleId !== "" &&
    (form.ssn === "" || form.ssn.replace(/\D/g, "").length === 9) &&
    form.dob.replace(/\D/g, "").length === 8 &&
    (form.phone === "" || form.phone.replace(/\D/g, "").length === 10);

  const stipsRemaining = Object.values(stips).filter((s) => s.status !== "uploaded").length;

  const filteredApplications = applications.filter(app => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = [app.firstName, app.lastName].filter(Boolean).join(" ").toLowerCase();
    const deal = (app.dealNumber || "").toLowerCase();
    return name.includes(q) || deal.includes(q);
  });

  async function loadVehicles() {
    try {
      setLoadingVehicles(true);
      const res = await fetch("/api/vehicle-options", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data?.vehicles)) setVehicles(data.vehicles);
    } catch { console.error("Failed to load vehicles"); }
    finally { setLoadingVehicles(false); }
  }

  async function loadApplications() {
    try {
      setLoadingApps(true);
      const res = await fetch("/api/dealer-dashboard", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) { setMessage(data?.reason || "Failed to load submissions"); setApplications([]); return; }
      setApplications(Array.isArray(data?.applications) ? data.applications : []);
    } catch { setMessage("Failed to load submissions"); setApplications([]); }
    finally { setLoadingApps(false); }
  }

  useEffect(() => { loadVehicles(); loadApplications(); }, []);

  const handleStipChange = async (key: keyof Stips, file: File) => {
    setStips((prev) => ({ ...prev, [key]: { file, status: "uploading" } }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", key);
      const res = await fetch("/api/upload-document", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setStips((prev) => ({ ...prev, [key]: { file, status: "error", error: data.error || "Upload failed" } }));
        return;
      }
      setStips((prev) => ({ ...prev, [key]: { file, status: "uploaded", fileKey: data.fileKey } }));
    } catch {
      setStips((prev) => ({ ...prev, [key]: { file, status: "error", error: "Upload failed" } }));
    }
  };

  const handleVehicleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vehicleId = e.target.value;
    setSelectedVehicleId(vehicleId);
    if (!vehicleId) {
      setForm((prev) => ({ ...prev, stockNumber: "", vin: "", vehicleYear: "", vehicleMake: "", vehicleModel: "", vehiclePrice: "", mileage: "" }));
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const stats = useMemo(() => {
    const submitted = applications.filter((app) => String(app.status ?? "").toUpperCase() === "SUBMITTED").length;
    const approved = applications.filter((app) => String(app.status ?? "").toUpperCase() === "APPROVED").length;
    const declined = applications.filter((app) => String(app.status ?? "").toUpperCase() === "DECLINED").length;
    const funded = applications.filter((app) => String(app.status ?? "").toUpperCase() === "FUNDED").length;
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
      if (!res.ok) { setMessage(data?.reason || "Submission failed"); setSubmitting(false); return; }
      if (data?.decision) setDecision(data.decision);
      if (data?.applicationId) {
        setTimeout(() => {
          window.location.href = `/dealer/decision/${data.applicationId}`;
        }, 2000);
      }
      if (data?.applicationId && stips.identity.fileKey) {
        fetch('/api/verify-identity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ applicationId: data.applicationId, fileKey: stips.identity.fileKey }),
        }).catch(() => {});
      }
      setForm({
        firstName: "", lastName: "", phone: "", email: "",
        ssn: "", dob: "", dlNumber: "", dlState: "",
        creditScore: "", monthlyIncome: "", payFrequency: "BIWEEKLY",
        monthlyExpenses: "", downPayment: "",
        residenceMonths: "", residenceYears: "", residenceType: "RENT", employmentMonths: "", employmentYears: "",
        stockNumber: "", vin: "", vehicleYear: "",
        vehicleMake: "", vehicleModel: "", vehiclePrice: "", mileage: "",
      });
      setSelectedVehicleId("");
      setStips({ identity: { ...EMPTY_STIP }, income: { ...EMPTY_STIP }, residence: { ...EMPTY_STIP } });
      await loadApplications();
    } catch { setMessage("Submission failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">Smart Drive Elite</div>
          <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em]">Dealer Dashboard</h1>
          <p className="mt-3 text-base text-black/60">Submit new deals and track live application status in one place.</p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          {[{ label: "Submitted", value: stats.submitted }, { label: "Approved", value: stats.approved }, { label: "Declined", value: stats.declined }, { label: "Funded", value: stats.funded }].map((s) => (
            <div key={s.label} className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
              <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">{s.label}</div>
              <div className="mt-3 text-3xl font-semibold">{s.value}</div>
            </div>
          ))}
        </div>

        {decision && (
          <div className={`mb-8 rounded-[28px] border p-8 ${decision.status === "APPROVED" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.28em] text-black/40 mb-2">Smart Drive Elite Decision</div>
                <div className={`text-4xl font-bold tracking-tight ${decision.status === "APPROVED" ? "text-green-700" : "text-red-700"}`}>
                  {decision.status === "APPROVED" ? "APPROVED" : "DECLINED"}
                </div>
                <div className="mt-3 text-sm text-black/60 max-w-xl">{decision.decisionReason}</div>
              </div>
              <div className={`rounded-[20px] px-6 py-5 min-w-[200px] text-center ${decision.status === "APPROVED" ? "bg-green-100" : "bg-red-100"}`}>
                <div className="text-[11px] uppercase tracking-[0.22em] text-black/40 mb-1">Deal Strength</div>
                <div className={`text-5xl font-bold ${decision.dealStrength >= 70 ? "text-green-700" : decision.dealStrength >= 45 ? "text-yellow-700" : "text-red-700"}`}>
                  {decision.dealStrength}
                </div>
                <div className="text-xs text-black/40 mt-1">out of 100</div>
              </div>
            </div>
            {decision.status === "APPROVED" && (
              <>
                <div className="mt-6 rounded-[20px] bg-white border border-black/8 px-6 py-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/40 mb-3">Recommended Structure</div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="inline-flex items-center rounded-full bg-black text-white px-4 py-1.5 text-sm font-semibold">{decision.recommendedDealType}</span>
                    {decision.alternateDealType && <span className="inline-flex items-center rounded-full border border-black/20 text-black/60 px-4 py-1.5 text-sm">Alt: {decision.alternateDealType}</span>}
                  </div>
                  <p className="text-sm text-black/60">{decision.dealTypeReason}</p>
                </div>
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
                <div className="mt-4 rounded-[20px] bg-white border border-black/8 px-6 py-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/40 mb-4">Lender Waterfall</div>
                  <div className="space-y-2">
                    {decision.lenderWaterfall.map((l, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${l.eligible ? "bg-green-500" : "bg-black/20"}`} />
                          <span className={l.eligible ? "font-semibold" : "text-black/40"}>{l.lender}</span>
                          <span className="text-black/40 text-xs">{l.tier}</span>
                        </div>
                        <span className={`text-xs ${l.eligible ? "text-green-600 font-medium" : "text-black/35"}`}>{l.eligible ? "Eligible" : l.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            <button onClick={() => setDecision(null)} className="mt-4 text-sm text-black/40 hover:text-black/70 underline">Dismiss</button>
          </div>
        )}

        {message && !decision && (
          <div className="mb-6 rounded-[18px] border border-black/8 bg-white px-5 py-4 text-[14px] text-black/70">{message}</div>
        )}

        <div className="grid gap-8 xl:grid-cols-[480px_minmax(0,1fr)]">
          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">New submission</div>
            <h2 className="text-[32px] font-semibold tracking-[-0.04em]">Deal Intake</h2>

            <div className="mt-6 flex flex-col gap-4">

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Customer</div>
              <div className="grid grid-cols-2 gap-3">
                <input name="firstName" placeholder="First Name" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.firstName} />
                <input name="lastName" placeholder="Last Name" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.lastName} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="phone"
                  placeholder="Phone (XXX-XXX-XXXX)"
                  className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm"
                  value={form.phone}
                  maxLength={12}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 10);
                    let formatted = raw;
                    if (raw.length > 6) formatted = raw.slice(0,3) + "-" + raw.slice(3,6) + "-" + raw.slice(6);
                    else if (raw.length > 3) formatted = raw.slice(0,3) + "-" + raw.slice(3);
                    setForm(prev => ({ ...prev, phone: formatted }));
                  }}
                />
                <input name="email" placeholder="Email" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.email} />
              </div>

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Identity</div>
              <input
                name="ssn"
                placeholder="SSN (XXX-XX-XXXX)"
                className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm font-mono tracking-wider"
                value={form.ssn}
                maxLength={11}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
                  let formatted = raw;
                  if (raw.length > 5) formatted = raw.slice(0,3) + "-" + raw.slice(3,5) + "-" + raw.slice(5);
                  else if (raw.length > 3) formatted = raw.slice(0,3) + "-" + raw.slice(3);
                  setForm(prev => ({ ...prev, ssn: formatted }));
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="dob"
                  placeholder="Date of Birth (MM/DD/YYYY) *"
                  className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm"
                  value={form.dob}
                  maxLength={10}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
                    let formatted = raw;
                    if (raw.length > 4) formatted = raw.slice(0,2) + "/" + raw.slice(2,4) + "/" + raw.slice(4);
                    else if (raw.length > 2) formatted = raw.slice(0,2) + "/" + raw.slice(2);
                    setForm(prev => ({ ...prev, dob: formatted }));
                  }}
                />
                <input name="dlNumber" placeholder="Driver's License #" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.dlNumber} />
              </div>
              <select name="dlState" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm bg-white" onChange={handleChange} value={form.dlState}>
                <option value="">DL State</option>
                {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Financial</div>
              <div className="grid grid-cols-2 gap-3">
                <input name="monthlyIncome" placeholder="Monthly Income ($)" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.monthlyIncome} />
                <select name="payFrequency" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm bg-white" onChange={handleChange} value={form.payFrequency}>
                  <option value="WEEKLY">Weekly</option>
                  <option value="BIWEEKLY">Bi-Weekly</option>
                  <option value="SEMIMONTHLY">Semi-Monthly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="monthlyExpenses" placeholder="Monthly Expenses ($)" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.monthlyExpenses} />
                <input name="downPayment" placeholder="Down Payment ($)" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.downPayment} />
              </div>
              <input name="creditScore" placeholder="Credit Score (if known)" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.creditScore} />

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Stability</div>
              <div className="grid grid-cols-2 gap-3">
                {/* Residence type */}
                <div className="col-span-2">
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Residence Type</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["RENT", "OWN", "FAMILY", "OTHER"].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm(prev => ({ ...prev, residenceType: type }))}
                        style={{
                          flex: 1, padding: "10px 4px", borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: "pointer",
                          background: form.residenceType === type ? "#0f0f0f" : "#fff",
                          color: form.residenceType === type ? "#C9A84C" : "rgba(0,0,0,0.5)",
                          border: form.residenceType === type ? "1px solid #0f0f0f" : "1px solid rgba(0,0,0,0.12)",
                        }}
                      >{type}</button>
                    ))}
                  </div>
                </div>
                {/* Residence time */}
                <div className="col-span-1">
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Time at Residence</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input name="residenceYears" placeholder="Years" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.residenceYears} style={{ flex: 1 }} />
                    <input name="residenceMonths" placeholder="Months" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.residenceMonths} style={{ flex: 1 }} />
                  </div>
                </div>
                {/* Employment time */}
                <div className="col-span-1">
                  <div style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>Time Employed</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input name="employmentYears" placeholder="Years" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.employmentYears} style={{ flex: 1 }} />
                    <input name="employmentMonths" placeholder="Months" className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm" onChange={handleChange} value={form.employmentMonths} style={{ flex: 1 }} />
                  </div>
                </div>
              </div>

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Vehicle</div>
              <select value={selectedVehicleId} onChange={handleVehicleSelect} className="rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm bg-white">
                <option value="">{loadingVehicles ? "Loading inventory..." : "Select a vehicle from inventory"}</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.year} {v.make} {v.model} — Stock #{v.stockNumber} — {formatCurrency(v.askingPrice)}</option>
                ))}
              </select>

              {selectedVehicleId && (
                <div className="rounded-[14px] border border-black/8 bg-[#faf7f1] px-4 py-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mb-3">Auto-filled from inventory</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <span className="text-black/50">Stock #</span><span className="font-medium">{form.stockNumber || "—"}</span>
                    <span className="text-black/50">VIN</span><span className="font-medium text-xs truncate">{form.vin || "—"}</span>
                    <span className="text-black/50">Year</span><span className="font-medium">{form.vehicleYear || "—"}</span>
                    <span className="text-black/50">Make / Model</span><span className="font-medium">{form.vehicleMake} {form.vehicleModel}</span>
                    <span className="text-black/50">Price</span><span className="font-medium">{formatCurrency(Number(form.vehiclePrice))}</span>
                    <span className="text-black/50">Mileage</span><span className="font-medium">{form.mileage ? Number(form.mileage).toLocaleString() + " mi" : "—"}</span>
                  </div>
                </div>
              )}

              <div className="text-[11px] uppercase tracking-[0.22em] text-black/35 mt-2">Required Documents</div>
              <div className="rounded-[18px] border border-black/10 bg-[#faf7f1] p-4 space-y-3">
                <div className="text-[12px] text-black/50 mb-1">All three documents must be uploaded before submission.</div>
                {(Object.keys(STIP_CONFIG) as (keyof Stips)[]).map((key) => (
                  <StipCard key={key} stipKey={key} doc={stips[key]} onChange={handleStipChange} />
                ))}
              </div>

              {!allStipsUploaded && (
                <div className="rounded-[14px] bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] text-amber-800 font-medium">
                  {stipsRemaining} document{stipsRemaining !== 1 ? "s" : ""} remaining before you can submit.
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`mt-2 w-full rounded-[18px] px-6 py-4 font-semibold text-sm transition-all ${
                  canSubmit
                    ? "bg-black text-white hover:bg-black/90"
                    : "bg-black/20 text-black/40 cursor-not-allowed"
                }`}
              >
                {submitting ? "Running decision engine…" : !allStipsUploaded ? `Upload ${stipsRemaining} more document${stipsRemaining !== 1 ? "s" : ""} to submit` : "Submit Deal"}
              </button>
            </div>
          </section>

          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">Live pipeline</div>
                <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.04em]">Recent Applications</h2>
              </div>
              <button onClick={loadApplications} className="rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm font-semibold">Refresh</button>
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by customer name or deal number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[14px] border border-black/10 px-4 py-3 outline-none text-sm"
              />
              {searchQuery && (
                <div className="mt-2 text-xs text-black/45">
                  {filteredApplications.length} result{filteredApplications.length !== 1 ? "s" : ""} for "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="ml-3 text-black/60 underline">Clear</button>
                </div>
              )}
            </div>
            {loadingApps ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">Loading applications…</div>
            ) : applications.length === 0 ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">No applications submitted yet.</div>
            ) : (
              <div className="space-y-4">
                {filteredApplications.map((app) => (
                  <div key={app.id} className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-5" style={{ cursor: "pointer" }} onClick={() => window.location.href = `/dealer/decision/${app.id}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <div className="text-[20px] font-semibold">{[app.firstName, app.lastName].filter(Boolean).join(" ") || "Unnamed Applicant"}</div>
                          {app.dealNumber && <span style={{ background: "#0f0f0f", color: "#C9A84C", borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700, fontFamily: "monospace" }}>{app.dealNumber}</span>}
                        </div>
                        <div className="mt-1 text-sm text-black/55">{app.email || "No email"} · {app.phone || "No phone"}</div>
                        <div className="mt-3 text-sm text-black/55">{app.vehicleMake || "Vehicle"} {app.vehicleModel || ""} · {formatCurrency(app.vehiclePrice)}</div>
                        <div className="mt-1 text-sm text-black/50">Submitted: {formatDate(app.createdAt)}</div>
                      </div>
                      <div className="min-w-[220px]">
                        <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
                          String(app.status).toUpperCase() === "APPROVED" ? "bg-green-100 text-green-700" :
                          String(app.status).toUpperCase() === "DECLINED" ? "bg-red-100 text-red-700" :
                          "border border-black/8 bg-white text-black/65"
                        }`}>{app.status || "UNKNOWN"}</div>
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
                      <div className="mt-4 rounded-[16px] border border-black/8 bg-white px-4 py-3 text-sm text-black/65">{app.decisionReason}</div>
                    )}
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); window.location.href = `/dealer/edit/${app.id}`; }}
                        className="rounded-[12px] border border-black/15 bg-white text-black/70 px-4 py-2 text-xs font-semibold hover:bg-black/5 transition-colors"
                      >
                        Edit & Resubmit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); window.location.href = `/dealer/decision/${app.id}`; }}
                        className="rounded-[12px] bg-black text-white px-4 py-2 text-xs font-semibold hover:bg-black/80 transition-colors"
                      >
                        View Decision →
                      </button>
                    </div>
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
