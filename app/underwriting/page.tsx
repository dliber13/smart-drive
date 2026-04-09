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

// ---------- LOGIC (UNCHANGED) ----------
function getTier(creditScore: number): Tier {
  if (creditScore >= 600) return "Tier 1";
  if (creditScore >= 520) return "Tier 2";
  if (creditScore >= 450) return "Tier 3";
  return "Decline";
}

function getDecision(income: number, creditScore: number, downPayment: number) {
  const tier = getTier(creditScore);

  if (tier === "Decline") {
    return {
      tier,
      decision: "DENIED" as Decision,
      lender: "Manual Review" as Lender,
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
      reason: "Tier 3 requires stronger cash down.",
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

// ---------- UI ----------
export default function UnderwritingPage() {
  const [dealId, setDealId] = useState("");
  const [deal, setDeal] = useState<Deal | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setDealId(params.get("id") || "");
  }, []);

  useEffect(() => {
    if (!dealId) return;

    const fetchDeal = async () => {
      const res = await fetch("/api/deals");
      const data = await res.json();

      const found = data?.find((d: any) => d.id === dealId);

      if (found) {
        setDeal({
          id: found.id,
          customerName: `${found.firstName || ""} ${found.lastName || ""}`,
          income: Number(found.monthlyIncome || 0),
          creditScore: Number(found.creditScore || 0),
          downPayment: Number(found.downPayment || 0),
        });
      }
    };

    fetchDeal();
  }, [dealId]);

  const result = useMemo(() => {
    if (!deal) return null;
    return getDecision(
      deal.income || 0,
      deal.creditScore || 0,
      deal.downPayment || 0
    );
  }, [deal]);

  async function updateDeal(status: Decision) {
    if (!dealId || !result) return;

    await fetch(`/api/deals/${dealId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        tier: result.tier,
        lender: result.lender,
        maxPayment: result.maxPayment,
        maxVehicle: result.maxVehicle,
        decisionReason: result.reason,
      }),
    });

    setMessage(`Saved: ${status}`);
  }

  if (!deal || !result) {
    return <div className="p-10 text-white">Loading deal...</div>;
  }

  return (
    <main className="min-h-screen bg-[#05070b] text-white p-8">
      <h1 className="text-3xl font-bold mb-8">
        SmartDrive Financial — Underwriting
      </h1>

      {/* TOP DECISION PANEL */}
      <div className="mb-8 p-6 rounded-2xl border border-gray-800 bg-[#0c111b]">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400">Customer</div>
            <div className="text-xl font-semibold">{deal.customerName}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-400">Decision</div>
            <div
              className={`text-2xl font-bold ${
                result.decision === "APPROVED"
                  ? "text-green-400"
                  : result.decision === "DENIED"
                  ? "text-red-400"
                  : "text-yellow-400"
              }`}
            >
              {result.decision}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-4 gap-6 text-sm">
          <div>
            <div className="text-gray-400">Tier</div>
            <div className="font-semibold">{result.tier}</div>
          </div>
          <div>
            <div className="text-gray-400">Lender</div>
            <div className="font-semibold">{result.lender}</div>
          </div>
          <div>
            <div className="text-gray-400">Max Payment</div>
            <div className="font-semibold">${result.maxPayment}</div>
          </div>
          <div>
            <div className="text-gray-400">Max Vehicle</div>
            <div className="font-semibold">${result.maxVehicle}</div>
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* BORROWER CARD */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#0c111b]">
          <h2 className="text-lg font-semibold mb-4">Borrower Profile</h2>

          <div className="space-y-3 text-sm">
            <div>Income: ${deal.income}</div>
            <div>Credit Score: {deal.creditScore}</div>
            <div>Down Payment: ${deal.downPayment}</div>
          </div>
        </div>

        {/* DECISION CARD */}
        <div className="p-6 rounded-2xl border border-gray-800 bg-[#0c111b]">
          <h2 className="text-lg font-semibold mb-4">Decision Reason</h2>
          <p className="text-gray-300">{result.reason}</p>
        </div>

      </div>

      {/* ACTION BAR */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => updateDeal("APPROVED")}
          className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold"
        >
          Approve & Lock
        </button>

        <button
          onClick={() => updateDeal("DOCS_NEEDED")}
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl font-semibold"
        >
          Request Stips
        </button>

        <button
          onClick={() => updateDeal("DENIED")}
          className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-xl font-semibold"
        >
          Decline
        </button>
      </div>

      {message && (
        <div className="mt-4 text-green-400 font-semibold">{message}</div>
      )}
    </main>
  );
}
