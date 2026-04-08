"use client";

import { useEffect, useState } from "react";

type Deal = {
  id: string;
  customerName: string;
  vehicle: string;
  income: number;
  creditScore: number;
  downPayment: number;
  status: string;
};

export default function DealerPage() {
  const [deals, setDeals] = useState<Deal[]>([]);

  const fetchDeals = async () => {
    const res = await fetch("/api/deals");
    const data = await res.json();
    setDeals(data.applications || []);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const updateDeal = async (id: string, status: string) => {
    await fetch(`/api/deals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchDeals();
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Dealer Submission System</h1>

      <div style={{ marginTop: 40 }}>
        <h2>Queue</h2>

        {deals.map((deal) => (
          <div
            key={deal.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <h3>{deal.customerName}</h3>
            <p>{deal.vehicle}</p>
            <p>Income: ${deal.income}</p>
            <p>Credit: {deal.creditScore}</p>
            <p>Down: ${deal.downPayment}</p>

            <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
              {/* 🔵 OPEN UW BUTTON */}
              <button
                style={{ background: "#2563eb", color: "white", padding: "8px 12px", borderRadius: 6 }}
                onClick={() => {
                  window.location.href = `/underwriting?id=${deal.id}`;
                }}
              >
                Open UW
              </button>

              <button
                style={{ background: "green", color: "white", padding: "8px 12px", borderRadius: 6 }}
                onClick={() => updateDeal(deal.id, "APPROVED")}
              >
                Approve
              </button>

              <button
                style={{ background: "orange", color: "white", padding: "8px 12px", borderRadius: 6 }}
                onClick={() => updateDeal(deal.id, "STIPS")}
              >
                Needs Stips
              </button>

              <button
                style={{ background: "red", color: "white", padding: "8px 12px", borderRadius: 6 }}
                onClick={() => updateDeal(deal.id, "DECLINED")}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
