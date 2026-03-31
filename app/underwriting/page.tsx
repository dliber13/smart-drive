"use client";

import { useMemo, useState } from "react";

type Vehicle = {
  name: string;
  price: number;
  downNeeded: number;
  apr: number;
  term: number;
  payment: number;
  status: "Recommended" | "Conditional" | "Blocked";
  reason: string;
};

export default function UnderwritingPage() {
  const [customerName, setCustomerName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [jobTime, setJobTime] = useState("");
  const [residenceTime, setResidenceTime] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const result = useMemo(() => {
    const income = Number(monthlyIncome) || 0;
    const credit = Number(creditScore) || 0;
    const job = Number(jobTime) || 0;
    const residence = Number(residenceTime) || 0;
    const down = Number(downPayment) || 0;

    if (!income && !credit && !job && !residence && !down) return null;

    const warnings: string[] = [];
    const reasons: string[] = [];

    let tier = "Tier 3";
    let decision = "Decline";
    let color = "#dc3545";

    const maxPayment =
      income >= 2500 ? income * 0.18 :
      income >= 2000 ? income * 0.15 :
      income >= 1800 ? income * 0.12 :
      income * 0.10;

    if (income < 1800) reasons.push("Income below minimum program threshold.");
    if (credit > 0 && credit < 450) warnings.push("Very low credit score.");
    if (job < 3) warnings.push("Job time under 3 months.");
    if (residence < 3) warnings.push("Residence time under 3 months.");
    if (down < 1500) warnings.push("Low down payment.");

    if (
      income >= 2500 &&
      (credit >= 500 || credit === 0) &&
      job >= 6 &&
      residence >= 6 &&
      down >= 2000
    ) {
      tier = "Tier 1";
      decision = "Approve";
      color = "#28a745";
    } else if (
      income >= 2000 &&
      credit >= 450 &&
      job >= 3 &&
      residence >= 3 &&
      down >= 1500
    ) {
      tier = "Tier 2";
      decision = "Send to Stips";
      color = "#007bff";
    } else if (income >= 1800) {
      tier = "Tier 3";
      decision = warnings.length >= 3 ? "Decline" : "Send to Stips";
      color = decision === "Decline" ? "#dc3545" : "#007bff";
    }

    if (income < 1800) {
      tier = "Outside Program";
      decision = "Decline";
      color = "#dc3545";
    }

    const vehicles: Vehicle[] = buildVehicleMatches({
      income,
      maxPayment,
      down,
      decision,
      tier,
    });

    return {
      tier,
      decision,
      color,
      maxPayment: Math.round(maxPayment),
      warnings,
      reasons,
      vehicles,
    };
  }, [monthlyIncome, creditScore, jobTime, residenceTime, downPayment]);

  return (
    <div style={{ padding: 40, fontFamily: "Arial, sans-serif" }}>
      <h1>Underwriting Engine</h1>
      <p>Smart Drive Decision System</p>

      <div style={{ marginTop: 30 }}>
        <h2>Deal Input</h2>

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
      </div>

      {result && (
        <>
          <div
            style={{
              marginTop: 40,
              padding: 20,
              border: "1px solid #ccc",
              width: 460,
              borderRadius: 8,
              background: "#f9f9f9",
            }}
          >
            <h2>Decision Output</h2>
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
                <h3>Warnings</h3>
                <ul>
                  {result.warnings.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </>
            )}

            {result.reasons.length > 0 && (
              <>
                <h3>Decline Reasons</h3>
                <ul>
                  {result.reasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div style={{ marginTop: 40 }}>
            <h2>Vehicle Match Output</h2>
            <p>Best structure recommendations based on affordability and risk.</p>

            <div style={{ display: "grid", gap: 16, maxWidth: 900 }}>
              {result.vehicles.map((vehicle, index) => (
                <div
                  key={index}
                  style={{
                    border: "1px solid #ccc",
                    borderRadius: 8,
                    padding: 18,
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
                  <p><strong>Down Needed:</strong> ${vehicle.downNeeded.toLocaleString()}</p>
                  <p><strong>APR:</strong> {vehicle.apr}%</p>
                  <p><strong>Term:</strong> {vehicle.term} months</p>
                  <p><strong>Estimated Payment:</strong> ${vehicle.payment}/mo</p>
                  <p><strong>Why:</strong> {vehicle.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function buildVehicleMatches({
  income,
  maxPayment,
  down,
  decision,
  tier,
}: {
  income: number;
  maxPayment: number;
  down: number;
  decision: string;
  tier: string;
}): Vehicle[] {
  const inventory = [
    {
      name: "2017 Chevrolet Malibu",
      price: 10995,
      basePayment: 398,
      apr: 21.9,
      term: 36,
      minDown: 2200,
      category: "safe",
    },
    {
      name: "2018 Ford Escape",
      price: 16295,
      basePayment: 432,
      apr: 23.5,
      term: 36,
      minDown: 2800,
      category: "mid",
    },
    {
      name: "2019 Dodge Charger",
      price: 19995,
      basePayment: 510,
      apr: 24.9,
      term: 36,
      minDown: 3500,
      category: "high",
    },
  ];

  return inventory.map((item, index) => {
    let status: Vehicle["status"] = "Blocked";
    let reason = "Outside current structure limits.";

    const paymentFits = item.basePayment <= maxPayment;
    const downFits = down >= item.minDown;

    if (decision === "Approve" && paymentFits && downFits && item.category === "safe") {
      status = "Recommended";
      reason = "Best fit for approval, affordability, and low-risk structure.";
    } else if (
      (decision === "Approve" || decision === "Send to Stips") &&
      item.category !== "high" &&
      item.basePayment <= maxPayment + 40
    ) {
      status = "Conditional";
      reason = downFits
        ? "Close to approval range but may need structure tightening."
        : "Requires more down payment or shorter term.";
    } else {
      status = "Blocked";
      reason =
        tier === "Outside Program"
          ? "Customer profile falls outside minimum program standards."
          : "Vehicle exceeds payment tolerance or risk guidelines.";
    }

    if (index === 0 && decision !== "Decline") {
      status = "Recommended";
      reason = "Primary approval fit based on current borrower profile.";
    }

    return {
      name: item.name,
      price: item.price,
      downNeeded: item.minDown,
      apr: item.apr,
      term: item.term,
      payment: item.basePayment,
      status,
      reason,
    };
  });
}

const inputStyle = {
  display: "block",
  marginBottom: 12,
  padding: 12,
  width: 320,
  border: "1px solid #ccc",
};
