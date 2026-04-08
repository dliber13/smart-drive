"use client";

import { useEffect, useState } from "react";

type Deal = {
  id: string;
  customerName?: string;
  income?: number;
  creditScore?: number;
  downPayment?: number;
};

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
        }
      } catch (error) {
        console.error("Failed to load deal:", error);
        setMessage("Failed to load deal.");
      }
    };

    fetchDeal();
  }, [dealId]);

  async function updateDeal(status: string) {
    if (!dealId) return;

    try {
      const res = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to update deal");
      }

      setMessage(`Deal updated: ${status}`);
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
            <button style={approveBtn} onClick={() => updateDeal("APPROVED")}>
              Approve & Lock
            </button>
            <button style={stipBtn} onClick={() => updateDeal("DOCS_NEEDED")}>
              Request Stips
            </button>
            <button style={declineBtn} onClick={() => updateDeal("DENIED")}>
              Decline
            </button>
          </div>

          {message && <p style={{ marginTop: 14, fontWeight: 700 }}>{message}</p>}
        </div>

        <div style={{ flex: 1 }}>
          <h2>Decision Summary</h2>

          {deal ? (
            <div>
              <p>Customer: {deal.customerName}</p>
              <p>Income: ${deal.income}</p>
              <p>Credit: {deal.creditScore}</p>
              <p>Down: ${deal.downPayment}</p>
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
