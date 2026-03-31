"use client";

import { useEffect, useMemo, useState } from "react";

type DealStatus = "New Submission" | "Needs Stips" | "Approved" | "Declined";

type Deal = {
  id: string;
  dealerName: string;
  customerName: string;
  vehicle: string;
  monthlyIncome: number;
  creditScore: number;
  downPayment: number;
  status: DealStatus;
  submittedAt: string;
};

const STORAGE_KEY = "smartdrive_deal_queue_v1";

export default function DealerSubmissionPage() {
  const [dealerName, setDealerName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [queue, setQueue] = useState<Deal[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setQueue(JSON.parse(raw));
      } catch {
        setQueue([]);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  }, [queue]);

  const totals = useMemo(() => {
    return {
      total: queue.length,
      newSubmissions: queue.filter((d) => d.status === "New Submission").length,
      needsStips: queue.filter((d) => d.status === "Needs Stips").length,
      approved: queue.filter((d) => d.status === "Approved").length,
      declined: queue.filter((d) => d.status === "Declined").length,
    };
  }, [queue]);

  function submitDeal() {
    if (!dealerName || !customerName || !vehicle) {
      setMessage("Dealer, customer, and vehicle are required.");
      return;
    }

    const income = Number(monthlyIncome) || 0;
    const score = Number(creditScore) || 0;
    const down = Number(downPayment) || 0;

let status: DealStatus = "Needs Stips";
let tier = "Tier 3";
let maxPayment = income * 0.12;
let maxVehiclePrice = maxPayment * 36;

if (income >= 2500 && score >= 500) {
  tier = "Tier 1";
  maxPayment = income * 0.18;
  maxVehiclePrice = maxPayment * 48;
  status = "Approved";
} else if (income >= 2000 && score >= 450) {
  tier = "Tier 2";
  maxPayment = income * 0.15;
  maxVehiclePrice = maxPayment * 42;
  status = "Needs Stips";
} else {
  tier = "Tier 3";
  maxPayment = income * 0.12;
  maxVehiclePrice = maxPayment * 36;
  status = "Declined";
}

const newDeal: Deal = {
  id: Date.now().toString(),
  dealerName,
  customerName,
  vehicle,
  monthlyIncome: income,
  creditScore: score,
  downPayment: down,
  status,
  submittedAt: new Date().toLocaleString(),

  // NEW DATA 👇
  tier,
  maxPayment,
  maxVehiclePrice,
};

    setQueue((prev) => [newDeal, ...prev]);
    setMessage(`Deal submitted: ${status}`);

    setDealerName("");
    setCustomerName("");
    setVehicle("");
    setMonthlyIncome("");
    setCreditScore("");
    setDownPayment("");
  }

  function updateStatus(id: string, status: DealStatus) {
    setQueue((prev) =>
      prev.map((deal) => (deal.id === id ? { ...deal, status } : deal))
    );
  }

  function removeDeal(id: string) {
    setQueue((prev) => prev.filter((deal) => deal.id !== id));
  }

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Dealer Submission System</h1>
      <p style={subStyle}>
        Centralized intake for Smart Drive Financial deal submissions.
      </p>

      <div style={statsGrid}>
        <StatCard label="Total Queue" value={totals.total} />
        <StatCard label="New Submissions" value={totals.newSubmissions} />
        <StatCard label="Needs Stips" value={totals.needsStips} />
        <StatCard label="Approved" value={totals.approved} />
        <StatCard label="Declined" value={totals.declined} />
      </div>

      <div style={layoutStyle}>
        <section style={panelStyle}>
          <h2 style={sectionHeading}>Submit a Deal</h2>

          <input
            style={inputStyle}
            placeholder="Dealer Name"
            value={dealerName}
            onChange={(e) => setDealerName(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Vehicle"
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Monthly Income ($)"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Credit Score"
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
          />
          <input
            style={inputStyle}
            placeholder="Down Payment ($)"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
          />

          <div style={{ marginTop: 16 }}>
            <button style={primaryBtn} onClick={submitDeal}>
              Submit Deal
            </button>
          </div>

          {message && <p style={{ marginTop: 14, fontWeight: 700 }}>{message}</p>}
        </section>

        <section style={panelStyle}>
          <h2 style={sectionHeading}>Queue</h2>

          {queue.length === 0 ? (
            <p>No deals submitted yet.</p>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {queue.map((deal) => (
                <div key={deal.id} style={dealCardStyle}>
                  <div style={dealHeaderStyle}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 18 }}>
                        {deal.customerName}
                      </div>
                      <div style={{ color: "#555", marginTop: 4 }}>
                        {deal.dealerName} • {deal.vehicle}
                      </div>
                    </div>
                    <StatusBadge status={deal.status} />
                  </div>

                  <div style={{ marginTop: 12, lineHeight: 1.8 }}>
                    <div><strong>Income:</strong> ${deal.monthlyIncome.toLocaleString()}</div>
                    <div><strong>Credit:</strong> {deal.creditScore}</div>
                    <div><strong>Down:</strong> ${deal.downPayment.toLocaleString()}</div>
                    <div><strong>Submitted:</strong> {deal.submittedAt}</div>
                  </div>

                  <div style={actionRowStyle}>
                    <button
                      style={approveBtn}
                      onClick={() => updateStatus(deal.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      style={stipBtn}
                      onClick={() => updateStatus(deal.id, "Needs Stips")}
                    >
                      Needs Stips
                    </button>
                    <button
                      style={declineBtn}
                      onClick={() => updateStatus(deal.id, "Declined")}
                    >
                      Decline
                    </button>
                    <button
                      style={deleteBtn}
                      onClick={() => removeDeal(deal.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={statCardStyle}>
      <div style={{ color: "#5f6f86", fontSize: 13, fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 800, marginTop: 8 }}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: DealStatus }) {
  const colors: Record<DealStatus, React.CSSProperties> = {
    "New Submission": {
      background: "#e8f1fd",
      color: "#0b4ea2",
    },
    "Needs Stips": {
      background: "#fff4d6",
      color: "#946200",
    },
    Approved: {
      background: "#e7f7ea",
      color: "#1f7a35",
    },
    Declined: {
      background: "#fdeaea",
      color: "#b42318",
    },
  };

  return (
    <span
      style={{
        ...colors[status],
        padding: "8px 12px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 12,
      }}
    >
      {status}
    </span>
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

const statsGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const statCardStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 18,
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

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box",
};

const primaryBtn: React.CSSProperties = {
  padding: "12px 18px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 700,
};

const dealCardStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  background: "#fcfdff",
};

const dealHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "start",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 16,
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
