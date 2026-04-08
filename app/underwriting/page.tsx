"use client";

import { useEffect, useMemo, useState } from "react";

type Deal = {
  id: string;
  customerName?: string;
  income?: number;
  creditScore?: number;
  downPayment?: number;
};

type Tier = "Tier 1" | "Tier 2" | "Tier 3" | "Decline";
type Decision = "APPROVED" | "DOCS_NEEDED" | "DENIED";
type Lender = "Westlake" | "CAC" | "Smart Drive" | "Manual Review";

function getTier(creditScore: number): Tier {
  if (creditScore >= 600) return "Tier 1";
  if (creditScore >= 520) return "Tier 2";
  if (creditScore >= 450) return "Tier 3";
  return "Decline";
}

function getDecision(
  income: number,
  creditScore: number,
  downPayment: number
): {
  tier: Tier;
  decision: Decision;
  lender: Lender;
  maxPayment: number;
  maxVehicle: number;
  reason: string;
} {
  const tier = getTier(creditScore);

  if (tier === "Decline") {
    return {
      tier,
      decision: "DENIED",
      lender: "Manual Review",
      maxPayment: 0,
      maxVehicle: 0,
      reason: "Credit score below minimum threshold.",
    };
  }

  if (income < 1800) {
    return {
      tier,
      decision: "DENIED",
      lender: "Manual Review",
      maxPayment: 0,
      maxVehicle: 0,
      reason: "Income below minimum threshold.",
    };
  }

  let maxPayment = 0;
  let lender: Lender = "Manual Review";

  if (tier === "Tier 1") {
    maxPayment = income * 0.18;
    lender = "Westlake";
  } else if (tier === "Tier 2") {
    maxPayment = income * 0.15;
    lender = "CAC";
  } else {
    maxPayment = income * 0.12;
    lender = "Smart Drive";
  }

  const maxVehicle = Math.round(maxPayment * 48);

  if (tier === "Tier 3" && downPayment < 1000) {
    return {
      tier,
      decision: "DOCS_NEEDED",
      lender,
      maxPayment: Math.round(maxPayment),
      maxVehicle,
      reason: "Tier 3 file requires stronger cash down.",
    };
  }

  if (creditScore < 560 || downPayment < 800) {
    return {
      tier,
      decision: "DOCS_NEEDED",
      lender,
      maxPayment: Math.round(maxPayment),
      maxVehicle,
      reason: "Conditional approval pending stipulations.",
    };
  }

  return {
    tier,
    decision: "APPROVED",
    lender,
    maxPayment: Math.round(maxPayment),
    maxVehicle,
    reason: "Meets score, income, and down payment requirements.",
  };
}

export default function UnderwritingPage() {
  const [dealId, setDealId] = useState("");
  const [deal, setDeal] = useState<Deal | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || "";
    setDealId(id);
  }, []);

  useEffect(() => {
    if (!dealId) return;

    const fetchDeal = async () => {
      try {
        const res = await fetch("/api/deals", { cache: "no-store" });
        const data = await res.json();

        const found = data?.applications?.find((d: any) => d.id === dealId) || null;

        if (found) {
          setDeal({
            id: found.id,
            customerName:
              `${found.customerFirstName || ""} ${found.customerLastName || ""}`.trim(),
            income: Number(found.grossIncome || 0),
            creditScore: Number(found.creditScore || 0),
            downPayment: Number(found.downPayment || 0),
          });
        } else {
          setMessage("Deal not found.");
        }
      } catch (error) {
        console.error("Failed to load deal:", error);
        setMessage("Failed to load deal.");
      }
    };

    fetchDeal();
  }, [dealId]);

  const decisionResult = useMemo(() => {
    if (!deal) return null;

    return getDecision(
      Number(deal.income || 0),
      Number(deal.creditScore || 0),
      Number(deal.downPayment || 0)
    );
  }, [deal]);

  async function updateDeal(payload: {
    status: Decision;
    tier?: Tier;
    lender?: Lender;
    maxPayment?: number;
    maxVehicle?: number;
    reason?: string;
  }) {
    if (!dealId) return;

    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update deal");
      }

      setMessage(`Deal updated: ${payload.status}`);
    } catch (error) {
      console.error("Failed to update deal:", error);
      setMessage("Failed to update deal.");
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Underwriting Workstation</h1>

      <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
        <div style={{ flex: 1 }}>
          <h2>Borrower Input</h2>

          <input
            value={deal?.customerName || ""}
            placeholder="Customer Name"
            readOnly
            style={inputStyle}
          />
          <input
            value={deal?.income ?? ""}
            placeholder="Monthly Income"
            readOnly
            style={inputStyle}
          />
          <input
            value={deal?.creditScore ?? ""}
            placeholder="Credit Score"
            readOnly
            style={inputStyle}
          />
          <input
            placeholder="Job Time (months)"
            readOnly
            style={inputStyle}
          />
          <input
            placeholder="Residence Time (months)"
            readOnly
            style={inputStyle}
          />
          <input
            value={deal?.downPayment ?? ""}
            placeholder="Down Payment"
            readOnly
            style={inputStyle}
          />

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <button
              style={approveBtn}
              onClick={() =>
                updateDeal({
                  status: "APPROVED",
                  tier: decisionResult?.tier,
                  lender: decisionResult?.lender,
                  maxPayment: decisionResult?.maxPayment,
                  maxVehicle: decisionResult?.maxVehicle,
                  reason: decisionResult?.reason,
                })
              }
            >
              Approve & Lock
            </button>

            <button
              style={stipBtn}
              onClick={() =>
                updateDeal({
                  status: "DOCS_NEEDED",
                  tier: decisionResult?.tier,
                  lender: decisionResult?.lender,
                  maxPayment: decisionResult?.maxPayment,
                  maxVehicle: decisionResult?.maxVehicle,
                  reason: decisionResult?.reason,
                })
              }
            >
              Request Stips
            </button>

            <button
              style={declineBtn}
              onClick={() =>
                updateDeal({
                  status: "DENIED",
                  tier: decisionResult?.tier,
                  lender: decisionResult?.lender,
                  maxPayment: decisionResult?.maxPayment,
                  maxVehicle: decisionResult?.maxVehicle,
                  reason: decisionResult?.reason,
                })
              }
            >
              Decline
            </button>
          </div>

          {message && <p style={{ marginTop: 14, fontWeight: 700 }}>{message}</p>}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Decision Summary</h2>

          {deal && decisionResult ? (
            <div>
              <p>Customer: {deal.customerName}</p>
              <p>Income: ${deal.income}</p>
              <p>Credit: {deal.creditScore}</p>
              <p>Down: ${deal.downPayment}</p>
              <p>Tier: {decisionResult.tier}</p>
              <p>System Decision: {decisionResult.decision}</p>
              <p>Lender Route: {decisionResult.lender}</p>
              <p>Max Payment: ${decisionResult.maxPayment}</p>
              <p>Max Vehicle: ${decisionResult.maxVehicle}</p>
              <p>Reason: {decisionResult.reason}</p>
            </div>
          ) : (
            <p>Loading deal...</p>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  display: "block" as const,
  width: "100%",
  padding: 12,
  marginBottom: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box" as const,
};

const approveBtn = {
  background: "#16a34a",
  color: "white",
  padding: "10px 14px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const stipBtn = {
  background: "#f59e0b",
  color: "white",
  padding: "10px 14px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const declineBtn = {
  background: "#dc2626",
  color: "white",
  padding: "10px 14px",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
