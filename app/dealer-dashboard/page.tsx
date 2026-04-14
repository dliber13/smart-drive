"use client";

import { useEffect, useMemo, useState } from "react";

type StatusHistoryItem = {
  id: string;
  createdAt: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
};

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
  statusHistory?: StatusHistoryItem[];
};

type DealerDashboardResponse = {
  success: boolean;
  count: number;
  counts: {
    draft: number;
    submitted: number;
    approved: number;
    declined: number;
    funded: number;
  };
  applications: Application[];
  currentUserRole: string;
  message?: string;
  reason?: string;
};

function formatCurrency(value: number | null | undefined) {
  if (value == null) return "N/A";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null | undefined) {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getApplicantName(application: Application) {
  const fullName = [application.firstName, application.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || "Unknown Applicant";
}

function getVehicleLabel(application: Application) {
  const vehicle = [
    application.vehicleYear,
    application.vehicleMake,
    application.vehicleModel,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return vehicle || "No vehicle selected";
}

function getStatusTone(status: string | null | undefined) {
  const normalized = String(status ?? "DRAFT").toUpperCase();

  if (normalized === "APPROVED") {
    return "bg-[#eef6f2] text-[#2f6f55] border-[#d7e9df]";
  }

  if (normalized === "DECLINED") {
    return "bg-[#fbefee] text-[#b42318] border-[#f0c8c4]";
  }

  if (normalized === "FUNDED") {
    return "bg-[#f3f0ff] text-[#5b3cc4] border-[#ddd2ff]";
  }

  if (normalized === "SUBMITTED") {
    return "bg-[#f8f2e8] text-[#9a6700] border-[#ead7b0]";
  }

  return "bg-[#f5f3ee] text-[#5f5a52] border-[#e2ddd4]";
}

export default function DealerDashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [counts, setCounts] = useState({
    draft: 0,
    submitted: 0,
    approved: 0,
    declined: 0,
    funded: 0,
  });
  const [selectedId, setSelectedId] = useState<string>("");
  const [currentUserRole, setCurrentUserRole] = useState("SALES");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function loadDashboard(refresh = false) {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage("");

      const response = await fetch("/api/dealer-dashboard", {
        cache: "no-store",
        headers: {
          "x-user-role": "SALES",
        },
      });

      const data: DealerDashboardResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.reason || "Failed to load dealer dashboard");
      }

      setApplications(data.applications || []);
      setCounts(
        data.counts || {
          draft: 0,
          submitted: 0,
          approved: 0,
          declined: 0,
          funded: 0,
        }
      );
      setCurrentUserRole(data.currentUserRole || "SALES");

      if (data.applications?.length) {
        setSelectedId((current) => {
          const stillExists = data.applications.some((app) => app.id === current);
          return stillExists ? current : data.applications[0].id;
        });
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

  useEffect(() => {
    loadDashboard();
  }, []);

  const selectedApplication = useMemo(() => {
    return applications.find((application) => application.id === selectedId) || null;
  }, [applications, selectedId]);

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
              Smart Drive Elite
            </div>
            <h1 className="mt-3 text-[64px] font-semibold leading-none tracking-[-0.06em]">
              Dealer Dashboard
            </h1>
            <p className="mt-4 max-w-3xl text-[18px] leading-8 text-black/60">
              Track submitted deals, approval movement, funding progress, and key
              underwriting metrics from one dealer-facing view.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-black/10 bg-white px-5 py-3 text-[14px] font-semibold tracking-[0.18em] text-black/70">
              {applications.length} FILES
            </div>
            <div className="rounded-full bg-black px-6 py-3 text-[14px] font-semibold tracking-[0.18em] text-white">
              {currentUserRole}
            </div>
          </div>
        </div>

        {errorMessage ? (
          <div className="mb-8 rounded-[24px] border border-[#f0c8c4] bg-[#fbefee] px-6 py-5 text-[16px] text-[#b42318]">
            {errorMessage}
          </div>
        ) : (
          <div className="mb-8 rounded-[24px] border border-[#d7e9df] bg-[#eef6f2] px-6 py-5 text-[16px] text-[#2f6f55]">
            Dealer dashboard loaded
          </div>
        )}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Draft
            </div>
            <div className="mt-3 text-[34px] font-semibold tracking-[-0.05em]">
              {counts.draft}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Submitted
            </div>
            <div className="mt-3 text-[34px] font-semibold tracking-[-0.05em]">
              {counts.submitted}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Approved
            </div>
            <div className="mt-3 text-[34px] font-semibold tracking-[-0.05em]">
              {counts.approved}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Declined
            </div>
            <div className="mt-3 text-[34px] font-semibold tracking-[-0.05em]">
              {counts.declined}
            </div>
          </div>

          <div className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_45px_rgba(0,0,0,0.05)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-black/36">
              Funded
            </div>
            <div className="mt-3 text-[34px] font-semibold tracking-[-0.05em]">
              {counts.funded}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.02fr_1.18fr]">
          <section className="rounded-[34px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.03em]">
                  Dealer Queue
                </h2>
                <p className="mt-2 text-[15px] text-black/55">
                  Live view of your submitted and decisioned files.
                </p>
              </div>

              <button
                onClick={() => loadDashboard(true)}
                className="rounded-[18px] border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-black/70 transition hover:bg-[#faf7f1]"
              >
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {isLoading ? (
              <div className="rounded-[22px] border border-black/8 bg-[#faf7f1] p-6 text-black/60">
                Loading dashboard...
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-[22px] border border-black/8 bg-[#faf7f1] p-6 text-black/60">
                No deals found yet.
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => {
                  const isSelected = selectedId === application.id;

                  return (
                    <button
                      key={application.id}
                      onClick={() => setSelectedId(application.id)}
                      className={`w-full rounded-[28px] border p-5 text-left transition ${
                        isSelected
                          ? "border-[#d8c19a] bg-[#fbf7ef] shadow-[0_18px_40px_rgba(0,0,0,0.04)]"
                          : "border-black/8 bg-white hover:bg-[#faf7f1]"
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <div className="text-[15px] font-semibold">
                            {getApplicantName(application)}
                          </div>
                          <div className="mt-1 text-[14px] text-black/55">
                            {getVehicleLabel(application)}
                          </div>
                        </div>

                        <div
                          className={`rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                            application.status
                          )}`}
                        >
                          {application.status || "DRAFT"}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px] text-black/60">
                        <div>
                          <span className="font-medium text-black/40">Created:</span>{" "}
                          {formatDate(application.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium text-black/40">Tier:</span>{" "}
                          {application.tier || "N/A"}
                        </div>
                        <div>
                          <span className="font-medium text-black/40">Max Payment:</span>{" "}
                          {formatCurrency(application.maxPayment)}
                        </div>
                        <div>
                          <span className="font-medium text-black/40">Vehicle Price:</span>{" "}
                          {formatCurrency(application.vehiclePrice)}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-[34px] border border-black/8 bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
            <div className="mb-6">
              <h2 className="text-[28px] font-semibold tracking-[-0.03em]">
                Deal Detail
              </h2>
              <p className="mt-2 text-[15px] text-black/55">
                Dealer-side file view with decision metrics and status history.
              </p>
            </div>

            {!selectedApplication ? (
              <div className="rounded-[22px] border border-black/8 bg-[#faf7f1] p-6 text-black/60">
                Select a deal to view details.
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-[28px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[13px] uppercase tracking-[0.20em] text-black/36">
                        Applicant
                      </div>
                      <div className="mt-2 text-[30px] font-semibold tracking-[-0.04em]">
                        {getApplicantName(selectedApplication)}
                      </div>
                    </div>

                    <div
                      className={`rounded-full border px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] ${getStatusTone(
                        selectedApplication.status
                      )}`}
                    >
                      {selectedApplication.status || "DRAFT"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Phone
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.phone || "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Email
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.email || "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Identity Type
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.identityType || "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Identity Status
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.identityStatus || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="mb-5 text-[13px] uppercase tracking-[0.20em] text-black/36">
                    Vehicle & Finance
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Vehicle
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {getVehicleLabel(selectedApplication)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Stock Number
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.stockNumber || "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Vehicle Price
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.vehiclePrice)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Amount Financed
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.amountFinanced)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Down Payment
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.downPayment)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Monthly Income
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.monthlyIncome)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="mb-5 text-[13px] uppercase tracking-[0.20em] text-black/36">
                    Controller Decision
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Lender
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.lender || "Pending"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Tier
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.tier || "Pending"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Max Payment
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.maxPayment)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Max Vehicle
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.maxVehicle)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Deal Strength
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.dealStrength ?? "N/A"}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Funding Amount
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatCurrency(selectedApplication.fundingAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[20px] border border-black/8 bg-white px-5 py-4">
                    <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                      Decision Reason
                    </div>
                    <div className="mt-2 text-[17px] font-semibold">
                      {selectedApplication.decisionReason || "No decision note yet."}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Funding Date
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {formatDate(selectedApplication.fundingDate)}
                      </div>
                    </div>

                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4">
                      <div className="text-[12px] uppercase tracking-[0.18em] text-black/36">
                        Lender Confirmation
                      </div>
                      <div className="mt-2 text-[18px] font-semibold">
                        {selectedApplication.lenderConfirmation || "Pending"}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-black/8 bg-[#fcfbf8] p-6">
                  <div className="mb-5 text-[13px] uppercase tracking-[0.20em] text-black/36">
                    Status Timeline
                  </div>

                  {!selectedApplication.statusHistory?.length ? (
                    <div className="rounded-[20px] border border-black/8 bg-white px-5 py-4 text-black/55">
                      No status history recorded yet.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedApplication.statusHistory.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-[20px] border border-black/8 bg-white px-5 py-4"
                        >
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div className="text-[16px] font-semibold">
                              {item.fromStatus || "START"} → {item.toStatus}
                            </div>
                            <div className="text-[14px] text-black/50">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>

                          <div className="mt-2 text-[14px] text-black/60">
                            {item.note || "No note provided."}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
