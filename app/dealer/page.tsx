"use client";

import { useEffect, useState } from "react";

type Deal = {
  id: string;
  customerName: string;
  income: number;
  creditScore: number;
  downPayment: number;
  status: string;
};

export default function DealerPage() {
  const [deals, setDeals] = useState<Deal[]>([]);

  async function loadDeals() {
    try {
      const res = await fetch("/api/deals", { cache: "no-store" });
      const data = await res.json();

      const formatted =
        data?.applications?.map((d: any) => ({
          id: d.id,
          customerName:
            `${d.customerFirstName || ""} ${d.customerLastName || ""}`.trim(),
          income: Number(d.grossIncome || 0),
          creditScore: Number(d.creditScore || 0),
          downPayment: Number(d.downPayment || 0),
          status: d.status || "NEW",
        })) || [];

      setDeals(formatted);
    } catch (error) {
      console.error("Failed to load deals:", error);
    }
  }

  useEffect(() => {
    loadDeals();
  }, []);

  function openUW(id: string) {
    window.location.href = `/underwriting?id=${id}`;
  }

  async function updateDeal(id: string, status: string) {
    try {
      await fetch(`/api/deals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      loadDeals(); // refresh after update
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Dealer Submission System</h1>

      <h2 style={{ marginTop: 20 }}>Queue</h2>

      {deals.map((deal) => (
        <div key={deal.id} style={card}>
          <p><strong>{deal.customerName}</strong></p>
          <p>Income: ${deal.income}</p>
          <p>Credit: {deal.creditScore}</p>
          <p>Down: ${deal.downPayment}</p>
          <p>Status: <strong>{deal.status}</strong></p>

          <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
            <button style={blueBtn} onClick={() => openUW(deal.id)}>
              Open UW
            </button>

            <button
              style={greenBtn}
              onClick={() => updateDeal(deal.id, "APPROVED")}
            >
              Approve
            </button>

            <button
              style={yellowBtn}
              onClick={() => updateDeal(deal.id, "DOCS_NEEDED")}
            >
              Needs Stips
            </button>

            <button
              style={redBtn}
              onClick={() => updateDeal(deal.id, "DENIED")}
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  marginBottom: 12,
};

const blueBtn = {
  background: "#2563eb",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: 6,
};

const greenBtn = {
  background: "#16a34a",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: 6,
};

const yellowBtn = {
  background: "#f59e0b",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: 6,
};

const redBtn = {
  background: "#dc2626",
  color: "white",
  padding: "8px 12px",
  border: "none",
  borderRadius: 6,
};
