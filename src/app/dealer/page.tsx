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

export default function DealerPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    creditScore: "",
    monthlyIncome: "",
    vehiclePrice: "",
    vehicleMake: "",
    vehicleModel: "",
  });

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

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
    loadApplications();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    try {
      const res = await fetch("/api/test-submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data?.reason || "Submission failed");
        setSubmitting(false);
        return;
      }

      setMessage("Application submitted successfully.");
      setForm({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        creditScore: "",
        monthlyIncome: "",
        vehiclePrice: "",
        vehicleMake: "",
        vehicleModel: "",
      });

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

        {message && (
          <div className="mb-6 rounded-[18px] border border-black/8 bg-white px-5 py-4 text-[14px] text-black/70">
            {message}
          </div>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Submitted
            </div>
            <div className="mt-3 text-3xl font-semibold">{stats.submitted}</div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Approved
            </div>
            <div className="mt-3 text-3xl font-semibold">{stats.approved}</div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Declined
            </div>
            <div className="mt-3 text-3xl font-semibold">{stats.declined}</div>
          </div>

          <div className="rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
            <div className="text-[12px] uppercase tracking-[0.22em] text-black/38">
              Funded
            </div>
            <div className="mt-3 text-3xl font-semibold">{stats.funded}</div>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 text-[12px] uppercase tracking-[0.28em] text-black/40">
              New submission
            </div>
            <h2 className="text-[32px] font-semibold tracking-[-0.04em]">
              Deal Intake
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.firstName}
              />

              <input
                name="lastName"
                placeholder="Last Name"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.lastName}
              />

              <input
                name="phone"
                placeholder="Phone"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.phone}
              />

              <input
                name="email"
                placeholder="Email"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.email}
              />

              <input
                name="creditScore"
                placeholder="Credit Score"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.creditScore}
              />

              <input
                name="monthlyIncome"
                placeholder="Monthly Income"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.monthlyIncome}
              />

              <input
                name="vehiclePrice"
                placeholder="Vehicle Price"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.vehiclePrice}
              />

              <input
                name="vehicleMake"
                placeholder="Vehicle Make"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.vehicleMake}
              />

              <input
                name="vehicleModel"
                placeholder="Vehicle Model"
                className="rounded-[18px] border border-black/10 px-5 py-4 outline-none"
                onChange={handleChange}
                value={form.vehicleModel}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-6 w-full rounded-[18px] bg-black px-6 py-4 text-white disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Deal"}
            </button>
          </section>

          <section className="rounded-[30px] border border-black/10 bg-white p-8 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
                  Live pipeline
                </div>
                <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.04em]">
                  Recent Applications
                </h2>
              </div>

              <button
                onClick={loadApplications}
                className="rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm font-semibold"
              >
                Refresh
              </button>
            </div>

            {loadingApps ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-[20px] border border-black/8 bg-[#faf7f1] px-5 py-10 text-center text-black/55">
                No applications submitted yet.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="rounded-[22px] border border-black/8 bg-[#fcfbf8] p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="text-[20px] font-semibold">
                          {[app.firstName, app.lastName].filter(Boolean).join(" ") || "Unnamed Applicant"}
                        </div>
                        <div className="mt-1 text-sm text-black/55">
                          {app.email || "No email"} · {app.phone || "No phone"}
                        </div>
                        <div className="mt-3 text-sm text-black/55">
                          {app.vehicleMake || "Vehicle"} {app.vehicleModel || ""} ·{" "}
                          {formatCurrency(app.vehiclePrice)}
                        </div>
                        <div className="mt-1 text-sm text-black/50">
                          Submitted: {formatDate(app.createdAt)}
                        </div>
                      </div>

                      <div className="min-w-[220px]">
                        <div className="inline-flex rounded-full border border-black/8 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black/65">
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