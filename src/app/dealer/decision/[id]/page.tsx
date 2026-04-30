"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Application = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  status: string | null;
  lender: string | null;
  tier: string | null;
  apr: number | null;
  maxPayment: number | null;
  maxVehicle: number | null;
  dealStrength: number | null;
  decisionReason: string | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehicleYear: number | null;
  vehiclePrice: number | null;
  monthlyIncome: number | null;
  creditScore: number | null;
  identityStatus: string | null;
  downPayment: number | null;
  createdAt: string;
};

type MatchedVehicle = {
  id: string;
  stockNumber: string;
  year: number | null;
  make: string | null;
  model: string | null;
  trim: string | null;
  mileage: number | null;
  askingPrice: number | null;
  matchScore: number;
  priceVsBudget: number;
};

function formatCurrency(v: number | null | undefined) {
  if (v == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);
}

function DealStrengthBar({ value }: { value: number | null }) {
  if (value == null) return <span style={{ color: "var(--color-text-tertiary)" }}>—</span>;
  const color = value >= 70 ? "#1D9E75" : value >= 45 ? "#BA7517" : "#A32D2D";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: 8, borderRadius: 999, background: color }} />
      </div>
      <span style={{ fontSize: 20, fontWeight: 500, color, minWidth: 32 }}>{value}</span>
    </div>
  );
}

export default function DecisionPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [vehicles, setVehicles] = useState<MatchedVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetch(`/api/applications/${id}`).then(r => r.json()),
      fetch("/api/match-vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: id }),
      }).then(r => r.json()),
    ])
      .then(([appData, matchData]) => {
        if (appData?.application) setApplication(appData.application);
        else setError("Application not found.");
        if (matchData?.matches) setVehicles(matchData.matches);
      })
      .catch(() => setError("Failed to load decision."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#888" }}>Loading decision...</div>
    </main>
  );

  if (error || !application) return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 16, color: "#b42318" }}>{error || "Not found"}</div>
    </main>
  );

  const approved = String(application.status ?? "").toUpperCase() === "APPROVED";
  const declined = String(application.status ?? "").toUpperCase() === "DECLINED";
  const weeklyPayment = application.maxPayment ? Math.round(application.maxPayment * 12 / 52) : null;
  const biweeklyPayment = application.maxPayment ? Math.round(application.maxPayment * 12 / 26) : null;

  return (
    <main style={{ minHeight: "100vh", background: "#f7f4ee", padding: "2rem 1.5rem", color: "#111" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        <div style={{ marginBottom: "2rem" }}>
          <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Smart Drive Elite · Decision Engine</div>
          <h1 style={{ fontSize: 42, fontWeight: 500, letterSpacing: "-0.04em", margin: 0 }}>
            {[application.firstName, application.lastName].filter(Boolean).join(" ") || "Applicant"}
          </h1>
          <div style={{ fontSize: 14, color: "rgba(0,0,0,0.55)", marginTop: 6 }}>
            {application.email || "No email"} · {application.phone || "No phone"} · Submitted {new Date(application.createdAt).toLocaleString()}
          </div>
        </div>

        <div style={{
          borderRadius: 24, padding: "2rem",
          background: approved ? "#eef6f2" : declined ? "#fbefee" : "#f5f3ee",
          border: `1px solid ${approved ? "#d7e9df" : declined ? "#f0c8c4" : "#e2ddd4"}`,
          marginBottom: "1.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.24em", color: approved ? "#2f6f55" : "#b42318", marginBottom: 8, opacity: 0.7 }}>Engine Decision</div>
              <div style={{ fontSize: 48, fontWeight: 500, letterSpacing: "-0.04em", color: approved ? "#2f6f55" : declined ? "#b42318" : "#111" }}>
                {application.status || "PENDING"}
              </div>
              <div style={{ fontSize: 14, color: "rgba(0,0,0,0.6)", marginTop: 8, maxWidth: 500, lineHeight: 1.6 }}>
                {application.decisionReason || "Decision pending."}
              </div>
            </div>
            <div style={{ textAlign: "center", minWidth: 120 }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>Deal Strength</div>
              <div style={{ fontSize: 56, fontWeight: 500, color: (application.dealStrength ?? 0) >= 70 ? "#1D9E75" : (application.dealStrength ?? 0) >= 45 ? "#BA7517" : "#A32D2D" }}>
                {application.dealStrength ?? "—"}
              </div>
              <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>out of 100</div>
            </div>
          </div>
        </div>

        {approved && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
              {[
                { label: "Lender", value: application.lender || "—", sub: application.tier || "" },
                { label: "Max Monthly", value: formatCurrency(application.maxPayment), sub: "payment" },
                { label: "Max Weekly", value: formatCurrency(weeklyPayment), sub: "payment" },
                { label: "Max Bi-Weekly", value: formatCurrency(biweeklyPayment), sub: "payment" },
                { label: "Max Vehicle", value: formatCurrency(application.maxVehicle), sub: "price" },
                { label: "APR", value: application.apr ? `${(application.apr * 100).toFixed(2)}%` : "—", sub: "rate" },
              ].map(item => (
                <div key={item.label} style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 16, padding: "1rem 1.25rem" }}>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 6 }}>{item.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 500 }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 11, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>{item.sub}</div>}
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 12 }}>Deal Strength</div>
              <DealStrengthBar value={application.dealStrength} />
            </div>

            <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 12 }}>Applicant Profile</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
                {[
                  { label: "Monthly Income", value: formatCurrency(application.monthlyIncome) },
                  { label: "Credit Score", value: String(application.creditScore ?? "Not provided") },
                  { label: "Down Payment", value: formatCurrency(application.downPayment) },
                  { label: "Identity Status", value: application.identityStatus || "PENDING" },
                  { label: "Vehicle Selected", value: [application.vehicleYear, application.vehicleMake, application.vehicleModel].filter(Boolean).join(" ") || "—" },
                  { label: "Vehicle Price", value: formatCurrency(application.vehiclePrice) },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {vehicles.length > 0 && (
              <div style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.1)", borderRadius: 20, padding: "1.25rem 1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.18em", color: "rgba(0,0,0,0.38)", marginBottom: 12 }}>
                  Eligible Inventory — {vehicles.length} vehicles within program limits
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {vehicles.map(v => (
                    <div key={v.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "0.75rem 1rem", background: "#faf7f1", borderRadius: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>{v.year} {v.make} {v.model} {v.trim || ""}</div>
                        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 2 }}>Stock #{v.stockNumber} · {v.mileage?.toLocaleString()} mi</div>
                      </div>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 16, fontWeight: 500 }}>{formatCurrency(v.askingPrice)}</div>
                          <div style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>{v.priceVsBudget}% of budget</div>
                        </div>
                        <div style={{
                          background: v.matchScore >= 80 ? "#eef6f2" : v.matchScore >= 60 ? "#f8f2e8" : "#f5f3ee",
                          color: v.matchScore >= 80 ? "#2f6f55" : v.matchScore >= 60 ? "#9a6700" : "#5f5a52",
                          borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 500, minWidth: 60, textAlign: "center"
                        }}>
                          {v.matchScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div style={{ textAlign: "center", fontSize: 12, color: "rgba(0,0,0,0.4)", marginBottom: "1.5rem" }}>
          This decision is read-only and generated by the Smart Drive Elite engine. No fields may be edited by dealership staff.
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            onClick={() => router.push("/dealer")}
            style={{ background: "#fff", border: "0.5px solid rgba(0,0,0,0.2)", borderRadius: 999, padding: "10px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#111" }}
          >
            Back to Dealer Dashboard
          </button>
        </div>

      </div>
    </main>
  );
}
