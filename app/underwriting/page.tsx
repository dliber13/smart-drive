"use client";

import { useMemo, useState } from "react";

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

    const reasons: string[] = [];
    const warnings: string[] = [];

    let tier = "Tier 3";
    let decision = "Decline";
    let color = "#dc3545";

    const maxPayment =
      income >= 2500 ? income * 0.18 :
      income >= 2000 ? income * 0.15 :
      income >= 1800 ? income * 0.12 :
      income * 0.10;

    if (income < 1800) {
      reasons.push("Income below minimum program threshold.");
    }

    if (credit > 0 && credit < 450) {
      warnings.push("Very low credit score.");
    }

    if (job < 3) {
      warnings.push("Job time under 3 months.");
    }

    if (residence < 3) {
      warnings.push("Residence time under 3 months.");
    }

    if (down < 1500) {
      warnings.push("Low down payment.");
    }

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
      decision = "Decline";
      tier = "Outside Program";
      color = "#dc3545";
    }

    return {
      tier,
      decision,
      color,
      maxPayment: Math.round(maxPayment),
      warnings,
      reasons,
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

      <div style={{ marginTop: 30 }}>
        <button style={approveBtn}>Approve Deal</button>
        <button style={stipBtn}>Send to Stips</button>
        <button style={declineBtn}>Decline</button>
      </div>

      {result && (
        <div
          style={{
            marginTop: 40,
            padding: 20,
            border: "1px solid #ccc",
            width: 420,
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
      )}
    </div>
  );
}

const inputStyle = {
  display: "block",
  marginBottom: 12,
  padding: 12,
  width: 320,
  border: "1px solid #ccc",
};

const approveBtn = {
  padding: 12,
  marginRight: 10,
  background: "#28a745",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const stipBtn = {
  padding: 12,
  marginRight: 10,
  background: "#007bff",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const declineBtn = {
  padding: 12,
  background: "#dc3545",
  color: "white",
  border: "none",
  cursor: "pointer",
};
