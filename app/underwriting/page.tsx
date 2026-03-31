"use client";

import { useMemo, useState } from "react";

type Decision = "Approve" | "Send to Stips" | "Decline";
type Tier = "Tier 1" | "Tier 2" | "Tier 3" | "Outside Program";
type VehicleStatus = "Recommended" | "Conditional" | "Blocked";

type Vehicle = {
  name: string;
  price: number;
  minDown: number;
  apr: number;
  term: number;
  estimatedPayment: number;
  status: VehicleStatus;
  reason: string;
};

type UnderwritingResult = {
  tier: Tier;
  decision: Decision;
  color: string;
  maxPayment: number;
  apr: number;
  term: number;
  financeAmount: number;
  monthlyPayment: number;
  pti: number;
  totalOfPayments: number;
  totalInterest: number;
  warnings: string[];
  reasons: string[];
  selectedVehicle: Vehicle;
  vehicles: Vehicle[];
};

const INVENTORY = [
  { name: "2017 Chevrolet Malibu", price: 10995, minDown: 2200, category: "safe" },
  { name: "2018 Ford Escape", price: 16295, minDown: 2800, category: "mid" },
  { name: "2019 Dodge Charger", price: 19995, minDown: 3500, category: "high" },
] as const;

export default function UnderwritingPage() {
  const [customerName, setCustomerName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [jobTime, setJobTime] = useState("");
  const [residenceTime, setResidenceTime] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const result = useMemo<UnderwritingResult | null>(() => {
    const income = toNumber(monthlyIncome);
    const credit = toNumber(creditScore);
    const jobMonths = toNumber(jobTime);
    const residenceMonths = toNumber(residenceTime);
    const down = toNumber(downPayment);

    if (
      !income &&
      !credit &&
      !jobMonths &&
      !residenceMonths &&
      !down
    ) {
      return null;
    }

    const warnings: string[] = [];
    const reasons: string[] = [];

    let tier: Tier = "Tier 3";
    let decision: Decision = "Decline";
    let color = "#dc3545";
    let apr = 24.9;
    let term = 30;
    let maxPayment = Math.round(income * 0.12);

    if (income >= 2500) {
      maxPayment = Math.round(income * 0.18);
    } else if (income >= 2000) {
      maxPayment = Math.round(income * 0.15);
    } else if (income >= 1800) {
      maxPayment = Math.round(income * 0.12);
    } else {
      maxPayment = Math.round(income * 0.1);
    }

    if (income < 1800) reasons.push("Income below minimum program threshold.");
    if (credit > 0 && credit < 450) warnings.push("Very low credit score.");
    if (jobMonths < 3) warnings.push("Job time under 3 months.");
    if (residenceMonths < 3) warnings.push("Residence time under 3 months.");
    if (down < 1500) warnings.push("Down payment below preferred minimum.");

    if (
      income >= 2500 &&
      (credit >= 500 || credit === 0) &&
      jobMonths >= 6 &&
      residenceMonths >= 6 &&
      down >= 2000
    ) {
      tier = "Tier 1";
      decision = "Approve";
      color = "#28a745";
      apr = 19.9;
      term = 36;
    } else if (
      income >= 2000 &&
      credit >= 450 &&
      jobMonths >= 3 &&
      residenceMonths >= 3 &&
      down >= 1500
    ) {
      tier = "Tier 2";
      decision = "Send to Stips";
      color = "#007bff";
      apr = 22.9;
      term = 33;
    } else if (income >= 1800) {
      tier = "Tier 3";
      decision = warnings.length >= 3 ? "Decline" : "Send to Stips";
      color = decision === "Decline" ? "#dc3545" : "#007bff";
      apr = 24.9;
      term = 30;
    } else {
      tier = "Outside Program";
      decision = "Decline";
      color = "#dc3545";
      apr = 24.9;
      term = 24;
    }

    const vehicles = buildVehicleMatches({
      down,
      maxPayment,
      decision,
      apr,
      term,
      tier,
    });

    const selectedVehicle =
      vehicles.find((v) => v.status === "Recommended") ?? vehicles[0];

    const financeAmount = Math.max(selectedVehicle.price - down, 0);
    const monthlyPayment = calcPayment(financeAmount, apr, term);
    const pti = income > 0 ? (monthlyPayment / income) * 100 : 0;
    const totalOfPayments = monthlyPayment * term;
    const totalInterest = Math.max(totalOfPayments - financeAmount, 0);

    if (monthlyPayment > maxPayment) {
      warnings.push("Estimated payment exceeds suggested payment cap.");
    }

    return {
      tier,
      decision,
      color,
      maxPayment,
      apr,
      term,
      financeAmount,
      monthlyPayment,
      pti,
      totalOfPayments,
      totalInterest,
      warnings,
      reasons,
      selectedVehicle,
      vehicles,
    };
  }, [monthlyIncome, creditScore, jobTime, residenceTime, downPayment]);

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Underwriting Engine</h1>
      <p style={subStyle}>Smart Drive Decision System</p>

      <div style={layoutStyle}>
        <section style={panelStyle}>
          <h2 style={sectionHeading}>Deal Input</h2>

          <input
            placeholder="Customer Name"
            style={inputStyle}
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            placeholder="Monthly Income ($)"
            style={inputStyle}
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
          />
          <input
            placeholder="Credit Score"
            style={inputStyle}
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
          />
          <input
            placeholder="Job Time (months)"
            style={inputStyle}
            value={jobTime}
            onChange={(e) => setJobTime(e.target.value)}
          />
          <input
            placeholder="Residence Time (months)"
            style={inputStyle}
            value={residenceTime}
            onChange={(e) => setResidenceTime(e.target.value)}
          />
          <input
            placeholder="Down Payment ($)"
            style={inputStyle}
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />

          <div style={{ marginTop: 18 }}>
            <button style={approveBtn}>Approve Deal</button>
            <button style={stipBtn}>Send to Stips</button>
            <button style={declineBtn}>Decline</button>
          </div>
        </section>

        {result && (
          <section style={panelStyle}>
            <h2 style={sectionHeading}>Decision Output</h2>
            <p><strong>Customer:</strong> {customerName || "N/A"}</p>
            <p><strong>Tier:</strong> {result.tier}</p>
            <p>
              <strong>Decision:</strong>{" "}
              <span style={{ color: result.color, fontWeight: 700 }}>
                {result.decision}
              </span>
            </p>
            <p><strong>Max Suggested Payment:</strong> ${result.maxPayment}/mo</p>

            {result.warnings.length > 0 && (
              <>
                <h3 style={miniHeading}>Warnings</h3>
                <ul>
                  {result.warnings.map((warning, i) => (
                    <li key={i}>{warning}</li>
                  ))}
                </ul>
              </>
            )}

            {result.reasons.length > 0 && (
              <>
                <h3 style={miniHeading}>Decline Reasons</h3>
                <ul>
                  {result.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}
      </div>

      {result && (
        <>
          <section style={resultCardStyle}>
            <h2 style={sectionHeading}>Calculation Results Card</h2>
            <p><strong>Selected Vehicle:</strong> {result.selectedVehicle.name}</p>
            <p><strong>Vehicle Price:</strong> ${result.selectedVehicle.price.toLocaleString()}</p>
            <p><strong>Down Payment:</strong> ${toNumber(downPayment).toLocaleString()}</p>
            <p><strong>Estimated Finance Amount:</strong> ${Math.round(result.financeAmount).toLocaleString()}</p>
            <p><strong>APR Used:</strong> {result.apr}%</p>
            <p><strong>Term Used:</strong> {result.term} months</p>
            <p><strong>Estimated Monthly Payment:</strong> ${result.monthlyPayment.toLocaleString()}</p>
            <p><strong>PTI:</strong> {result.pti.toFixed(1)}%</p>
            <p><strong>Total of Payments:</strong> ${Math.round(result.totalOfPayments).toLocaleString()}</p>
            <p><strong>Total Interest:</strong> ${Math.round(result.totalInterest).toLocaleString()}</p>
          </section>

          <section style={{ marginTop: 28 }}>
            <h2 style={sectionHeading}>Vehicle Match Output</h2>
            <p style={subStyle}>Best structure recommendations based on affordability and risk.</p>

            <div style={vehicleGridStyle}>
              {result.vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  style={{
                    ...vehicleCardStyle,
                    background:
                      vehicle.status === "Recommended"
                        ? "#eef9f0"
                        : vehicle.status === "Conditional"
                        ? "#f9f6ea"
                        : "#faeded",
                  }}
                >
                  <h3 style={{ marginTop: 0 }}>{vehicle.name}</h3>
                  <p><strong>Status:</strong> {vehicle.status}</p>
                  <p><strong>Price:</strong> ${vehicle.price.toLocaleString()}</p>
                  <p><strong>Down Needed:</strong> ${vehicle.minDown.toLocaleString()}</p>
                  <p><strong>APR:</strong> {vehicle.apr}%</p>
                  <p><strong>Term:</strong> {vehicle.term} months</p>
                  <p><strong>Estimated Payment:</strong> ${vehicle.estimatedPayment}/mo</p>
                  <p><strong>Why:</strong> {vehicle.reason}</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function buildVehicleMatches({
  down,
  maxPayment,
  decision,
  apr,
  term,
  tier,
}: {
  down: number;
  maxPayment: number;
  decision: Decision;
  apr: number;
  term: number;
  tier: Tier;
}): Vehicle[] {
  return INVENTORY.map((item, index) => {
    const financeAmount = Math.max(item.price - down, 0);
    const estimatedPayment = calcPayment(financeAmount, apr, term);

    let status: VehicleStatus = "Blocked";
    let reason = "Outside current structure limits.";

    const paymentFits = estimatedPayment <= maxPayment;
    const downFits = down >= item.minDown;

    if (decision === "Approve" && paymentFits && downFits && item.category === "safe") {
      status = "Recommended";
      reason = "Best fit for approval, affordability, and lower-risk structure.";
    } else if (
      (decision === "Approve" || decision === "Send to Stips") &&
      item.category !== "high" &&
      estimatedPayment <= maxPayment + 40
    ) {
      status = "Conditional";
      reason = downFits
        ? "Close to approval range but may need stips or tighter structure."
        : "Requires more down payment or shorter term.";
    } else {
      status = "Blocked";
      reason =
        tier === "Outside Program"
          ? "Customer profile falls outside minimum program standards."
          : "Vehicle exceeds payment tolerance or risk guidelines.";
    }

    if (index === 0 && decision !== "Decline" && paymentFits) {
      status = "Recommended";
      reason = "Primary approval fit based on current borrower profile.";
    }

    return {
      name: item.name,
      price: item.price,
      minDown: item.minDown,
      apr,
      term,
      estimatedPayment,
      status,
      reason,
    };
  });
}

function calcPayment(financeAmount: number, apr: number, term: number) {
  if (financeAmount <= 0 || term <= 0) return 0;
  const monthlyRate = apr / 100 / 12;
  if (monthlyRate === 0) return Math.round(financeAmount / term);

  const payment =
    (financeAmount * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -term));

  return Math.round(payment);
}

function toNumber(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

const pageStyle: React.CSSProperties = {
  padding: 40,
  fontFamily: "Arial, sans-serif",
};

const headingStyle: React.CSSProperties = {
  marginBottom: 8,
};

const subStyle: React.CSSProperties = {
  color: "#333",
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
  gap: 24,
  marginTop: 24,
};

const panelStyle: React.CSSProperties = {
  border: "1px solid #d9d9d9",
  borderRadius: 10,
  padding: 20,
  background: "#fff",
};

const resultCardStyle: React.CSSProperties = {
  marginTop: 28,
  padding: 20,
  border: "1px solid #c7d8f5",
  borderRadius: 10,
  background: "#eef6ff",
  maxWidth: 560,
};

const sectionHeading: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 14,
};

const miniHeading: React.CSSProperties = {
  marginBottom: 8,
};

const vehicleGridStyle: React.CSSProperties = {
  display: "grid",
  gap: 16,
  maxWidth: 900,
};

const vehicleCardStyle: React.CSSProperties = {
  border: "1px solid #ccc",
  borderRadius: 8,
  padding: 18,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 12,
  padding: 12,
  width: 320,
  border: "1px solid #ccc",
  borderRadius: 6,
};

const approveBtn: React.CSSProperties = {
  padding: 12,
  marginRight: 10,
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const stipBtn: React.CSSProperties = {
  padding: 12,
  marginRight: 10,
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};

const declineBtn: React.CSSProperties = {
  padding: 12,
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
};
