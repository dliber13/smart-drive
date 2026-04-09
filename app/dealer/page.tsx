"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Deal = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
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
  status: string;
  createdAt?: string;
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  stockNumber: string;
  vin: string;
  vehicleYear: string;
  vehicleMake: string;
  vehicleModel: string;
  vehiclePrice: string;
  downPayment: string;
  tradeIn: string;
  amountFinanced: string;
  creditScore: string;
  monthlyIncome: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  stockNumber: "",
  vin: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vehiclePrice: "",
  downPayment: "",
  tradeIn: "",
  amountFinanced: "",
  creditScore: "",
  monthlyIncome: "",
};

function formatCurrency(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function buildVehicleLabel(deal: Deal) {
  const parts = [deal.vehicleYear, deal.vehicleMake, deal.vehicleModel].filter(Boolean);
  return parts.length ? parts.join(" ") : "—";
}

function statusClasses(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-[#eef6f2] text-[#2f6f55] border-[#d7e9df]";
    case "DENIED":
    case "DECLINED":
      return "bg-[#f8ece8] text-[#8a4a3d] border-[#edd8d1]";
    case "DOCS_NEEDED":
      return "bg-[#f8f2e8] text-[#8a6a3d] border-[#eadfcf]";
    case "FUNDED":
      return "bg-[#edf2f8] text-[#415a77] border-[#d6e0eb]";
    default:
      return "bg-white text-black/65 border-black/10";
  }
}

export default function DealerPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loadingDeals, setLoadingDeals] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  async function loadDeals() {
    try {
      setLoadingDeals(true);
      const res = await fetch("/api/deals", { cache: "no-store" });
      const data = await res.json();
      setDeals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load deals:", error);
      setMessage("Failed to load deals.");
    } finally {
      setLoadingDeals(false);
    }
  }

  useEffect(() => {
    loadDeals();
  }, []);

  const totals = useMemo(() => {
    return {
      total: deals.length,
      pending: deals.filter((d) => d.status === "PENDING").length,
      approved: deals.filter((d) => d.status === "APPROVED").length,
      docs: deals.filter((d) => d.status === "DOCS_NEEDED").length,
    };
  }, [deals]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toNumberOrNull(value: string) {
    if (!value.trim()) return null;
    const num = Number(value);
    return Number.isNaN(num) ? null : num;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const payload = {
        firstName: form.firstName || null,
        lastName: form.lastName || null,
        email: form.email || null,
        phone: form.phone || null,
        stockNumber: form.stockNumber || null,
        vin: form.vin || null,
        vehicleYear: toNumberOrNull(form.vehicleYear),
        vehicleMake: form.vehicleMake || null,
        vehicleModel: form.vehicleModel || null,
        vehiclePrice: toNumberOrNull(form.vehiclePrice),
        downPayment: toNumberOrNull(form.downPayment),
        tradeIn: toNumberOrNull(form.tradeIn),
        amountFinanced: toNumberOrNull(form.amountFinanced),
        creditScore: toNumberOrNull(form.creditScore),
        monthlyIncome: toNumberOrNull(form.monthlyIncome),
      };

      const res = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit deal");
      }

      setMessage("Deal submitted successfully.");
      setForm(initialForm);
      await loadDeals();
    } catch (error) {
      console.error("Failed to submit deal:", error);
      setMessage("Failed to submit deal.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#111111]">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#fcfaf6_0%,#f7f4ee_42%,#f1ece4_100%)]" />
        <div className="absolute left-[-12%] top-[-8%] h-[560px] w-[560px] rounded-full bg-white/95 blur-3xl" />
        <div className="absolute left-[18%] top-[8%] h-[420px] w-[420px] rounded-full bg-[#e9dece] blur-3xl opacity-80" />
        <div className="absolute right-[-8%] top-[4%] h-[460px] w-[460px] rounded-full bg-white/80 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(17,17,17,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(17,17,17,0.16)_1px,transparent_1px)] [background-size:88px_88px]" />
      </div>

      <header className="relative z-10 border-b border-black/8">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] border border-black/8 bg-white/95 shadow-[0_14px_40px_rgba(0,0,0,0.06)]">
              <span className="text-[15px] font-bold tracking-[0.24em] text-[#111111]">
                SDF
              </span>
            </div>

            <div>
              <div className="text-[38px] font-semibold leading-none tracking-[-0.05em] text-[#111111]">
                SmartDrive Financial
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.42em] text-black/38">
                Dealer Intake
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <Link href="/" className="text-[15px] font-medium text-black/55 transition hover:text-black">
              Home
            </Link>
            <Link href="/dashboard" className="text-[15px] font-medium text-black/55 transition hover:text-black">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto max-w-7xl px-8 pb-16 pt-10">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/80 px-5 py-3 text-[12px] font-medium uppercase tracking-[0.28em] text-black/50 shadow-[0_12px_30px_rgba(0,0,0,0.04)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#c6a96b] to-[#a8894f]" />
              Dealer workflow
            </div>

            <h1 className="mt-6 max-w-4xl text-[64px] font-semibold leading-[0.92] tracking-[-0.065em] text-[#111111] sm:text-[74px] xl:text-[88px]">
              Submit deals cleanly.
              <br />
              Move files faster.
            </h1>

            <p className="mt-6 max-w-2xl text-[21px] leading-[1.55] tracking-[-0.02em] text-black/62">
              Enter borrower and vehicle details, including stock number and VIN,
              push files into underwriting, and keep visibility across every deal
              from intake to decision.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-[24px] border border-black/8 bg-white/74 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">Total</div>
              <div className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em]">
                {totals.total}
              </div>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-white/74 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">Pending</div>
              <div className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em]">
                {totals.pending}
              </div>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-white/74 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">Approved</div>
              <div className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em]">
                {totals.approved}
              </div>
            </div>
            <div className="rounded-[24px] border border-black/8 bg-white/74 p-5 shadow-[0_18px_42px_rgba(0,0,0,0.05)]">
              <div className="text-[11px] uppercase tracking-[0.28em] text-black/36">Stips</div>
              <div className="mt-3 text-[30px] font-semibold leading-none tracking-[-0.05em]">
                {totals.docs}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.02fr_0.98fr]">
          <div className="relative overflow-hidden rounded-[36px] border border-black/10 bg-white/86 p-8 shadow-[0_45px_120px_rgba(0,0,0,0.14)] ring-1 ring-black/5 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-[140px] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0))]" />

            <div className="relative">
              <div className="mb-8">
                <div className="text-[12px] uppercase tracking-[0.30em] text-black/38">
                  New application
                </div>
                <div className="mt-3 text-[42px] font-semibold leading-none tracking-[-0.06em] text-[#111111]">
                  Dealer Submission
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="First Name" value={form.firstName} onChange={(v) => updateField("firstName", v)} placeholder="Douglas" />
                  <Field label="Last Name" value={form.lastName} onChange={(v) => updateField("lastName", v)} placeholder="Liber" />
                  <Field label="Email" value={form.email} onChange={(v) => updateField("email", v)} placeholder="name@email.com" />
                  <Field label="Phone" value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="(555) 555-5555" />
                  <Field label="Stock Number" value={form.stockNumber} onChange={(v) => updateField("stockNumber", v)} placeholder="A12345" />
                  <Field label="VIN" value={form.vin} onChange={(v) => updateField("vin", v.toUpperCase())} placeholder="1HGCM82633A123456" />
                  <Field label="Vehicle Year" value={form.vehicleYear} onChange={(v) => updateField("vehicleYear", v)} placeholder="2022" />
                  <Field label="Vehicle Make" value={form.vehicleMake} onChange={(v) => updateField("vehicleMake", v)} placeholder="Honda" />
                  <Field label="Vehicle Model" value={form.vehicleModel} onChange={(v) => updateField("vehicleModel", v)} placeholder="Accord" />
                  <Field label="Vehicle Price" value={form.vehiclePrice} onChange={(v) => updateField("vehiclePrice", v)} placeholder="24995" />
                  <Field label="Down Payment" value={form.downPayment} onChange={(v) => updateField("downPayment", v)} placeholder="2000" />
                  <Field label="Trade In" value={form.tradeIn} onChange={(v) => updateField("tradeIn", v)} placeholder="1500" />
                  <Field label="Amount Financed" value={form.amountFinanced} onChange={(v) => updateField("amountFinanced", v)} placeholder="21495" />
                  <Field label="Credit Score" value={form.creditScore} onChange={(v) => updateField("creditScore", v)} placeholder="620" />
                </div>

                <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Monthly Income" value={form.monthlyIncome} onChange={(v) => updateField("monthlyIncome", v)} placeholder="4200" />

                  <div className="rounded-[24px] border border-black/8 bg-[#fcfbf8] p-5 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)]">
                    <div className="text-[12px] uppercase tracking-[0.28em] text-black/38">
                      Vehicle identification
                    </div>
                    <p className="mt-3 text-[16px] leading-7 text-black/60">
                      Capture stock number and VIN on every file so the system stays tied
                      to the exact unit being structured and underwritten.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center rounded-[20px] bg-[#111111] px-8 py-4 text-[16px] font-semibold text-white shadow-[0_16px_36px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? "Submitting..." : "Submit Deal"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setForm(initialForm);
                      setMessage("");
                    }}
                    className="inline-flex items-center justify-center rounded-[20px] border border-black/10 bg-white px-8 py-4 text-[16px] font-semibold text-black/72 transition hover:text-black"
                  >
                    Clear Form
                  </button>
                </div>

                {message && (
                  <div className="mt-6 rounded-[22px] border border-black/8 bg-white/76 px-5 py-4 text-[15px] font-medium text-black/70">
                    {message}
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[36px] border border-black/10 bg-white/86 p-8 shadow-[0_45px_120px_rgba(0,0,0,0.14)] ring-1 ring-black/5 backdrop-blur-xl">
            <div className="absolute inset-x-0 top-0 h-[140px] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,255,255,0))]" />

            <div className="relative">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.30em] text-black/38">
                    Live queue
                  </div>
                  <div className="mt-3 text-[42px] font-semibold leading-none tracking-[-0.06em] text-[#111111]">
                    Deal Pipeline
                  </div>
                </div>

                <button
                  type="button"
                  onClick={loadDeals}
                  className="rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold text-black/70 transition hover:text-black"
                >
                  Refresh
                </button>
              </div>

              {loadingDeals ? (
                <div className="rounded-[28px] border border-black/8 bg-[#fcfbf8] px-6 py-10 text-[17px] text-black/55">
                  Loading deals...
                </div>
              ) : deals.length === 0 ? (
                <div className="rounded-[28px] border border-black/8 bg-[#fcfbf8] px-6 py-10 text-[17px] text-black/55">
                  No deals submitted yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {deals.map((deal) => (
                    <div
                      key={deal.id}
                      className="rounded-[28px] border border-black/8 bg-[#fcfbf8] p-6 shadow-[inset_0_1px_0_rgba(0,0,0,0.03)]"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="text-[28px] font-semibold leading-none tracking-[-0.05em] text-[#111111]">
                              {`${deal.firstName || ""} ${deal.lastName || ""}`.trim() || "Unnamed Applicant"}
                            </div>

                            <span
                              className={`inline-flex items-center rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] ${statusClasses(
                                deal.status
                              )}`}
                            >
                              {deal.status}
                            </span>
                          </div>

                          <div className="mt-4 grid grid-cols-1 gap-3 text-[15px] text-black/62 sm:grid-cols-2">
                            <div>
                              <span className="text-black/36">Stock #:</span>{" "}
                              {deal.stockNumber || "—"}
                            </div>
                            <div>
                              <span className="text-black/36">VIN:</span>{" "}
                              {deal.vin || "—"}
                            </div>
                            <div>
                              <span className="text-black/36">Vehicle:</span>{" "}
                              {buildVehicleLabel(deal)}
                            </div>
                            <div>
                              <span className="text-black/36">Income:</span>{" "}
                              {formatCurrency(deal.monthlyIncome)}
                            </div>
                            <div>
                              <span className="text-black/36">Credit:</span>{" "}
                              {deal.creditScore ?? "—"}
                            </div>
                            <div>
                              <span className="text-black/36">Created:</span>{" "}
                              {formatDate(deal.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="rounded-[18px] border border-black/8 bg-white px-4 py-3 text-[15px] font-semibold text-black/72">
                            {formatCurrency(deal.vehiclePrice)}
                          </div>

                          <Link
                            href={`/underwriting?id=${deal.id}`}
                            className="inline-flex items-center justify-center rounded-[18px] bg-[#111111] px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-black"
                          >
                            Open UW
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <div className="mb-3 text-[12px] uppercase tracking-[0.28em] text-black/38">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[20px] border border-black/10 bg-white/88 px-5 py-4 text-[16px] text-[#111111] outline-none transition placeholder:text-black/28 focus:border-black/18"
      />
    </label>
  );
}
