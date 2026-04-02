"use client";

import { useMemo, useState } from "react";

type Decision = "Approve" | "Send to Stips" | "Decline";
type Tier = "Tier 1" | "Tier 2" | "Tier 3" | "Outside Program";

type UnderwritingResult = {
  tier: Tier;
  decision: Decision;
  color: string;
  maxPayment: number;
  maxVehiclePrice: number;
  vehicleRecommendation: string;
  warnings: string[];
  reasons: string[];
};

export default function UnderwritingPage() {
  const [customerName, setCustomerName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [jobTime, setJobTime] = useState("");
  const [residenceTime, setResidenceTime] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const [locked, setLocked] = useState(false);
  const [decisionedAt, setDecisionedAt] = useState("");
  const [decisionBy, setDecisionBy] = useState("");
  const [finalDecision, setFinalDecision] = useState<Decision | "">("");

  const result = useMemo<UnderwritingResult | null>(() => {
    const income = Number(monthlyIncome) || 0;
    const credit = Number(creditScore) || 0;
    const jobMonths = Number(jobTime) || 0;
    const residenceMonths = Number(residenceTime) || 0;
    const down = Number(downPayment) || 0;

    if (!income && !credit && !jobMonths && !residenceMonths && !down) {
      return null;
    }

    const warnings: string[] = [];
    const reasons: string[] = [];

    let tier: Tier = "Tier 3";
    let decision: Decision = "Decline";
    let color = "#dc3545";
    let maxPayment = income * 0.12;
    let maxVehiclePrice = maxPayment * 36;

    if (income < 1800) {
      reasons.push("Income below minimum program threshold.");
    }
    if (credit > 0 && credit < 450) {
      warnings.push("Low credit score.");
    }
    if (jobMonths < 3) {
      warnings.push("Job time under 3 months.");
    }
    if (residenceMonths < 3) {
      warnings.push("Residence time under 3 months.");
    }
    if (down < 1500) {
      warnings.push("Down payment below preferred minimum.");
    }

    if (income >= 2500 && credit >= 500 && down >= 2000) {
      tier = "Tier 1";
      decision = "Approve";
      color = "#28a745";
      maxPayment = income * 0.18;
      maxVehiclePrice = maxPayment * 48;
    } else if (income >= 2000 && credit >= 450) {
      tier = "Tier 2";
      decision = "Send to Stips";
      color = "#007bff";
      maxPayment = income * 0.15;
      maxVehiclePrice = maxPayment * 42;
    } else if (income >= 1800) {
      tier = "Tier 3";
      decision = "Decline";
      color = "#dc3545";
      maxPayment = income * 0.12;
      maxVehiclePrice = maxPayment * 36;
    } else {
      tier = "Outside Program";
      decision = "Decline";
      color = "#dc3545";
      maxPayment = income * 0.1;
      maxVehiclePrice = maxPayment * 30;
    }

    let vehicleRecommendation = "Budget";
    if (maxVehiclePrice >= 20000) {
      vehicleRecommendation = "Premium";
    } else if (maxVehiclePrice >= 12000) {
      vehicleRecommendation = "Mid Tier";
    } else {
      vehicleRecommendation = "Budget";
    }

    if (decision === "Approve" && down < 2000) {
      warnings.push("Deal is approvable, but stronger down payment is recommended.");
    }

    if (decision === "Send to Stips") {
      reasons.push("Additional stipulations required before final approval.");
    }

    if (decision === "Decline" && income >= 1800 && credit >= 400) {
      reasons.push("Structure currently exceeds acceptable risk tolerance.");
    }

    return {
      tier,
      decision,
      color,
      maxPayment,
      maxVehiclePrice,
      vehicleRecommendation,
      warnings,
      reasons,
    };
  }, [monthlyIncome, creditScore, jobTime, residenceTime, downPayment]);

  function lockDecision(decision: Decision) {
    if (locked) return;
    setFinalDecision(decision);
    setDecisionedAt(new Date().toLocaleString());
    setDecisionBy("Underwriter");
    setLocked(decision === "Approve" || decision === "Decline");
  }

  function resetCase() {
    setCustomerName("");
    setMonthlyIncome("");
    setCreditScore("");
    setJobTime("");
    setResidenceTime("");
    setDownPayment("");
    setLocked(false);
    setDecisionedAt("");
    setDecisionBy("");
    setFinalDecision("");
  }

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Underwriting Workstation</h1>
      <p style={subStyle}>
        Smart Drive centralized underwriting and decision engine.
      </p>

      <div style={layoutStyle}>
        <section style={panelStyle}>
          <h2 style={sectionHeading}>Borrower Input</h2>

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

          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              style={approveBtn}
              disabled={locked}
              onClick={() => lockDecision("Approve")}
            >
              Approve & Lock
            </button>

            <button
              style={stipBtn}
              disabled={locked}
              onClick={() => lockDecision("Send to Stips")}
            >
              Request Stips
            </button>

            <button
              style={declineBtn}
              disabled={locked}
              onClick={() => lockDecision("Decline")}
            >
              Decline
            </button>

            <button
              style={deleteBtn}
              onClick={resetCase}
            >
              Reset Case
            </button>
          </div>
        </section>

        <section style={panelStyle}>
          <h2 style={sectionHeading}>Decision Summary</h2>

          {!result ? (
            <p>No borrower data entered yet.</p>
          ) : (
            <>
              <div style={{ lineHeight: 1.9 }}>
                <div>
                  <strong>Customer:</strong> {customerName || "N/A"}
                </div>
                <div>
                  <strong>Tier:</strong> {result.tier}
                </div>
                <div>
                  <strong>System Decision:</strong>{" "}
                  <span style={{ color: result.color, fontWeight: 700 }}>
                    {result.decision}
                  </span>
                </div>
                <div>
                  <strong>Max Payment:</strong> ${Math.round(result.maxPayment)}
                </div>
                <div>
                  <strong>Max Vehicle:</strong> ${Math.round(result.maxVehiclePrice)}
                </div>
                <div>
                  <strong>Vehicle Fit:</strong> {result.vehicleRecommendation}
                </div>
                <div>
                  <strong>Locked:</strong> {locked ? "Yes" : "No"}
                </div>
                {finalDecision && (
                  <div>
                    <strong>Final Decision:</strong> {finalDecision}
                  </div>
                )}
                {decisionedAt && (
                  <div>
                    <strong>Decision Time:</strong> {decisionedAt}
                  </div>
                )}
                {decisionBy && (
                  <div>
                    <strong>Decision By:</strong> {decisionBy}
                  </div>
                )}
              </div>

              {result.warnings.length > 0 && (
                <div style={warningBoxStyle}>
                  <h3 style={miniHeading}>Risk Flags</h3>
                  <ul style={listStyle}>
                    {result.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              {result.reasons.length > 0 && (
                <div style={reasonBoxStyle}>
                  <h3 style={miniHeading}>Decision Notes</h3>
                  <ul style={listStyle}>
                    {result.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {result && (
        <section style={{ ...panelStyle, marginTop: 24 }}>
          <h2 style={sectionHeading}>Underwriter Recommendation</h2>

          <div style={recommendationGrid}>
            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Recommended Tier</div>
              <div style={metricValueStyle}>{result.tier}</div>
            </div>

            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Recommended Payment Cap</div>
              <div style={metricValueStyle}>${Math.round(result.maxPayment)}</div>
            </div>

            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Recommended Vehicle Band</div>
              <div style={metricValueStyle}>${Math.round(result.maxVehiclePrice)}</div>
            </div>

            <div style={metricCardStyle}>
              <div style={metricLabelStyle}>Vehicle Class</div>
              <div style={metricValueStyle}>{result.vehicleRecommendation}</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  padding: 40,
  fontFamily: "Arial, sans-serif",
  background: "#f5f7fb",
  minHeight: "100vh",
};

const headingStyle: React.CSSProperties = {
  marginBottom: 8,
};

const subStyle: React.CSSProperties = {
  color: "#444",
  marginBottom: 24,
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(320px, 420px) 1fr",
  gap: 24,
  alignItems: "start",
};

const panelStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 20,
};

const sectionHeading: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 16,
};

const miniHeading: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
};

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box",
};

const approveBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const stipBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#f0ad4e",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const declineBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const deleteBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const warningBoxStyle: React.CSSProperties = {
  marginTop: 20,
  padding: 16,
  borderRadius: 10,
  background: "#fff8e6",
  border: "1px solid #f0d27a",
};

const reasonBoxStyle: React.CSSProperties = {
  marginTop: 16,
  padding: 16,
  borderRadius: 10,
  background: "#eef6ff",
  border: "1px solid #b6d4fe",
};

const listStyle: React.CSSProperties = {
  margin: 0,
  paddingLeft: 20,
  lineHeight: 1.8,
};

const recommendationGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const metricCardStyle: React.CSSProperties = {
  background: "#fcfdff",
  border: "1px solid #d9e2f1",
  borderRadius: 10,
  padding: 16,
};

const metricLabelStyle: React.CSSProperties = {
  color: "#5f6f86",
  fontSize: 13,
  fontWeight: 700,
  marginBottom: 8,
};

const metricValueStyle: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 800,
};
