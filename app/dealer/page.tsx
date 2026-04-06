"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type DealStatus = "New Submission" | "Needs Stips" | "Approved" | "Declined";

type FundingStage =
  | "New Submission"
  | "In Underwriting"
  | "Needs Stips"
  | "Approved Pending Stips"
  | "Ready to Fund"
  | "Submitted to Lender"
  | "Lender Approved"
  | "Lender Declined"
  | "Funded"
  | "Declined";

type LenderRoute =
  | "Smart Drive"
  | "Westlake"
  | "CAC"
  | "RouteOne Lane"
  | "Manual Review";

type LenderDecision = "Pending" | "Approved" | "Declined";

type StipChecklist = {
  poi: boolean;
  por: boolean;
  insurance: boolean;
  gps: boolean;
  references: boolean;
  signedDocs: boolean;
};

type Deal = {
  id: string;
  dealerName: string;
  customerName: string;
  vehicle: string;
  monthlyIncome: number;
  creditScore: number;
  downPayment: number;
  systemRecommendation: DealStatus;
  finalDecision?: DealStatus;
  status: DealStatus;
  submittedAt: string;
  tier: string;
  maxPayment: number;
  maxVehiclePrice: number;
  vehicleRecommendation: string;
  lenderRoute: LenderRoute;
  lenderSubmittedAt?: string;
  lenderSubmittedBy?: string;
  lenderDecision: LenderDecision;
  lenderDecisionAt?: string;
  lenderDecisionBy?: string;
  fundingStage: FundingStage;
  fundedAt?: string;
  fundedBy?: string;
  stips: StipChecklist;
  notes: string;
  decisionedAt?: string;
  locked?: boolean;
  decisionBy?: string;
};

type InventoryVehicle = {
  stock: string;
  year: number;
  make: string;
  model: string;
  price: number;
};

const INVENTORY: InventoryVehicle[] = [
  {
    stock: "7731AA",
    year: 2014,
    make: "NISSAN",
    model: "ALTIMA",
    price: 6250,
  },
  {
    stock: "7760",
    year: 2017,
    make: "RAM",
    model: "1500",
    price: 20175,
  },
  {
    stock: "7757",
    year: 2017,
    make: "GMC",
    model: "ACADIA",
    price: 6820,
  },
  {
    stock: "7623",
    year: 2015,
    make: "CHEVROLET",
    model: "MALIBU",
    price: 8400,
  },
  {
    stock: "7780",
    year: 2022,
    make: "FORD",
    model: "ESCAPE",
    price: 15775,
  },
];

function getMatches(maxVehiclePrice: number) {
  return INVENTORY.map((car) => {
    if (car.price <= maxVehiclePrice) {
      return { ...car, match: "Best Fit" };
    } else if (car.price <= maxVehiclePrice * 1.15) {
      return { ...car, match: "Stretch" };
    } else {
      return { ...car, match: "Over Budget" };
    }
  }).sort((a, b) => a.price - b.price);
}

const STORAGE_KEY = "smartdrive_deal_queue_v4";

export default function DealerSubmissionPage() {
  const [dealerName, setDealerName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [creditScore, setCreditScore] = useState("");
  const [downPayment, setDownPayment] = useState("");

  const [queue, setQueue] = useState<Deal[]>([]);
  const [message, setMessage] = useState("");
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

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
      newSubmissions: queue.filter((d) => d.fundingStage === "New Submission").length,
      inUnderwriting: queue.filter((d) => d.fundingStage === "In Underwriting").length,
      needsStips: queue.filter((d) => d.fundingStage === "Needs Stips").length,
      approvedPending: queue.filter((d) => d.fundingStage === "Approved Pending Stips").length,
      readyToFund: queue.filter((d) => d.fundingStage === "Ready to Fund").length,
      submittedToLender: queue.filter((d) => d.fundingStage === "Submitted to Lender").length,
      lenderApproved: queue.filter((d) => d.fundingStage === "Lender Approved").length,
      funded: queue.filter((d) => d.fundingStage === "Funded").length,
      declined: queue.filter(
        (d) => d.fundingStage === "Declined" || d.fundingStage === "Lender Declined"
      ).length,
    };
  }, [queue]);

  function getLenderRoute(income: number, score: number, tier: string): LenderRoute {
    if (tier === "Tier 1" && score >= 550) return "Westlake";
    if (tier === "Tier 2" && score >= 500) return "CAC";
    if (tier === "Tier 3") return "Smart Drive";
    if (income >= 1800) return "RouteOne Lane";
    return "Manual Review";
  }

  function allStipsComplete(stips: StipChecklist) {
    return Object.values(stips).every(Boolean);
  }

  function getFundingStage(deal: Deal): FundingStage {
    if (deal.fundedAt) return "Funded";
    if (deal.lenderDecision === "Declined") return "Lender Declined";
    if (deal.lenderDecision === "Approved") return "Lender Approved";
    if (deal.lenderSubmittedAt) return "Submitted to Lender";
    if (deal.finalDecision === "Declined") return "Declined";
    if (!deal.finalDecision) return "In Underwriting";
    if (deal.finalDecision === "Needs Stips") return "Needs Stips";
    if (deal.finalDecision === "Approved") {
      return allStipsComplete(deal.stips) ? "Ready to Fund" : "Approved Pending Stips";
    }
    return "New Submission";
  }

  async function submitDeal() {
    if (!dealerName || !customerName || !vehicle) {
      setMessage("Dealer, customer, and vehicle are required.");
      return;
    }

    const income = Number(monthlyIncome) || 0;
    const score = Number(creditScore) || 0;
    const down = Number(downPayment) || 0;

    let systemRecommendation: DealStatus = "Needs Stips";
    let tier = "Tier 3";
    let maxPayment = income * 0.12;
    let maxVehiclePrice = maxPayment * 36;

    if (income >= 2500 && score >= 500) {
      tier = "Tier 1";
      maxPayment = income * 0.18;
      maxVehiclePrice = maxPayment * 48;
      systemRecommendation = "Approved";
    } else if (income >= 2000 && score >= 450) {
      tier = "Tier 2";
      maxPayment = income * 0.15;
      maxVehiclePrice = maxPayment * 42;
      systemRecommendation = "Needs Stips";
    } else {
      tier = "Tier 3";
      maxPayment = income * 0.12;
      maxVehiclePrice = maxPayment * 36;
      systemRecommendation = "Declined";
    }

    let vehicleRecommendation = "Economy";
    if (maxVehiclePrice >= 20000) {
      vehicleRecommendation = "Premium";
    } else if (maxVehiclePrice >= 12000) {
      vehicleRecommendation = "Mid Tier";
    } else {
      vehicleRecommendation = "Budget";
    }

    const lenderRoute = getLenderRoute(income, score, tier);

    const newDeal: Deal = {
      id: Date.now().toString(),
      dealerName,
      customerName,
      vehicle,
      monthlyIncome: income,
      creditScore: score,
      downPayment: down,
      systemRecommendation,
      finalDecision: undefined,
      status: systemRecommendation,
      submittedAt: new Date().toLocaleString(),
      tier,
      maxPayment,
      maxVehiclePrice,
      vehicleRecommendation,
      lenderRoute,
      lenderSubmittedAt: undefined,
      lenderSubmittedBy: undefined,
      lenderDecision: "Pending",
      lenderDecisionAt: undefined,
      lenderDecisionBy: undefined,
      fundingStage: "New Submission",
      fundedAt: undefined,
      fundedBy: undefined,
      stips: {
        poi: false,
        por: false,
        insurance: false,
        gps: false,
        references: false,
        signedDocs: false,
      },
      notes: "",
      decisionedAt: undefined,
      locked: false,
      decisionBy: undefined,
    };

    try {
      const nameParts = customerName.trim().split(" ");
      const customerFirstName = nameParts[0] || "";
      const customerLastName = nameParts.slice(1).join(" ") || "Unknown";

      const response = await fetch("/api/deals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealerName,
          customerFirstName,
          customerLastName,
          grossIncome: income,
          creditScore: score,
          employmentMonths: 0,
          residenceMonths: 0,
          requestedVehicle: vehicle,
          downPayment: down,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to save deal");
      }

      setQueue((prev) => [newDeal, ...prev]);
      setMessage(`Deal submitted and saved. System recommendation: ${systemRecommendation}`);

      setDealerName("");
      setCustomerName("");
      setVehicle("");
      setMonthlyIncome("");
      setCreditScore("");
      setDownPayment("");
    } catch (error) {
      console.error(error);
      setMessage("Deal was not saved to database.");
    }
  }

  function setUnderwritingOpen(id: string) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        if (deal.fundingStage === "New Submission") {
          const updated = { ...deal, fundingStage: "In Underwriting" as FundingStage };
          if (selectedDeal?.id === id) setSelectedDeal(updated);
          return updated;
        }
        return deal;
      })
    );
  }

  function applyDecision(id: string, decision: DealStatus) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        if (deal.locked) return deal;

        const shouldLock = decision === "Approved" || decision === "Declined";

        const updated: Deal = {
          ...deal,
          finalDecision: decision,
          status: decision,
          decisionedAt: new Date().toLocaleString(),
          decisionBy: "Underwriter",
          locked: shouldLock,
        };

        updated.fundingStage = getFundingStage(updated);

        if (selectedDeal?.id === id) {
          setSelectedDeal(updated);
        }

        return updated;
      })
    );
  }

  function updateStip(id: string, stipKey: keyof StipChecklist, value: boolean) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;

        const updated: Deal = {
          ...deal,
          stips: {
            ...deal.stips,
            [stipKey]: value,
          },
        };

        updated.fundingStage = getFundingStage(updated);

        if (selectedDeal?.id === id) {
          setSelectedDeal(updated);
        }

        return updated;
      })
    );
  }

  function updateNotes(id: string, notes: string) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;

        const updated = { ...deal, notes };

        if (selectedDeal?.id === id) {
          setSelectedDeal(updated);
        }

        return updated;
      })
    );
  }

  function submitToLender(id: string) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        if (deal.fundingStage !== "Ready to Fund") return deal;

        const updated: Deal = {
          ...deal,
          lenderSubmittedAt: new Date().toLocaleString(),
          lenderSubmittedBy: "Underwriter",
        };

        updated.fundingStage = getFundingStage(updated);

        if (selectedDeal?.id === id) {
          setSelectedDeal(updated);
        }

        return updated;
      })
    );
  }

  function setLenderDecision(id: string, decision: LenderDecision) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        if (!deal.lenderSubmittedAt) return deal;
        if (deal.fundedAt) return deal;

        const updated: Deal = {
          ...deal,
          lenderDecision: decision,
          lenderDecisionAt: new Date().toLocaleString(),
          lenderDecisionBy: "Lender Desk",
        };

        updated.fundingStage = getFundingStage(updated);

        if (selectedDeal?.id === id) {
          setSelectedDeal(updated);
        }

        return updated;
      })
    );
  }

  function markFunded(id: string) {
    setQueue((prev) =>
      prev.map((deal) => {
        if (deal.id !== id) return deal;
        if (deal.lenderDecision !== "Approved") return deal;

        const updated: Deal = {
          ...deal,
          fundedAt: new Date().toLocaleString(),
          fundedBy: "Funding Desk",
        };

        updated.fundingStage = getFundingStage(updated);

        if (selectedDeal?.id === id) {
          setSelectedDeal(updated);
        }

        return updated;
      })
    );
  }

  function removeDeal(id: string) {
    setQueue((prev) => prev.filter((deal) => deal.id !== id));
    if (selectedDeal?.id === id) {
      setSelectedDeal(null);
    }
  }

  function openDeal(deal: Deal) {
    setSelectedDeal(deal);
    setUnderwritingOpen(deal.id);
  }

  return (
    <div style={pageStyle}>
      <h1 style={headingStyle}>Dealer Submission System</h1>
      <p style={subStyle}>
        Centralized intake, underwriting workflow, lender routing, stip tracking,
        and funding readiness for Smart Drive Financial.
      </p>

      <div style={statsGrid}>
        <StatCard label="Total Queue" value={totals.total} />
        <StatCard label="New Submission" value={totals.newSubmissions} />
        <StatCard label="In Underwriting" value={totals.inUnderwriting} />
        <StatCard label="Needs Stips" value={totals.needsStips} />
        <StatCard label="Approved Pending" value={totals.approvedPending} />
        <StatCard label="Ready to Fund" value={totals.readyToFund} />
        <StatCard label="Submitted to Lender" value={totals.submittedToLender} />
        <StatCard label="Lender Approved" value={totals.lenderApproved} />
        <StatCard label="Funded" value={totals.funded} />
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

        <div style={{ display: "grid", gap: 24 }}>
          <section style={panelStyle}>
            <h2 style={sectionHeading}>Queue</h2>

            {queue.length === 0 ? (
              <p>No deals submitted yet.</p>
            ) : (
              <div style={{ display: "grid", gap: 14 }}>
                {queue.map((deal) => (
                  <div
                    key={deal.id}
                    onClick={() => openDeal(deal)}
                    style={{ ...dealCardStyle, cursor: "pointer" }}
                  >
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
                      <div><strong>Tier:</strong> {deal.tier}</div>
                      <div><strong>System Recommendation:</strong> {deal.systemRecommendation}</div>
                      <div><strong>Final Decision:</strong> {deal.finalDecision || "Pending"}</div>
                      <div><strong>Max Payment:</strong> ${Math.round(deal.maxPayment)}</div>
                      <div><strong>Max Vehicle:</strong> ${Math.round(deal.maxVehiclePrice)}</div>
                      <div><strong>Vehicle Fit:</strong> {deal.vehicleRecommendation}</div>
                      <div><strong>Lender Route:</strong> {deal.lenderRoute}</div>
                      <div><strong>Workflow Stage:</strong> {deal.fundingStage}</div>
                    </div>

                    <div style={actionRowStyle}>
                      <button
                        style={approveBtn}
                        disabled={!!deal.locked}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyDecision(deal.id, "Approved");
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={stipBtn}
                        disabled={!!deal.locked}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyDecision(deal.id, "Needs Stips");
                        }}
                      >
                        Needs Stips
                      </button>
                      <button
                        style={declineBtn}
                        disabled={!!deal.locked}
                        onClick={(e) => {
                          e.stopPropagation();
                          applyDecision(deal.id, "Declined");
                        }}
                      >
                        Decline
                      </button>
                      <button
                        style={deleteBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          removeDeal(deal.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {selectedDeal && (
            <section style={panelStyle}>
              <h2 style={sectionHeading}>Underwriting Review</h2>

              <div style={{ lineHeight: 1.9 }}>
                <div><strong>Customer:</strong> {selectedDeal.customerName}</div>
                <div><strong>Dealer:</strong> {selectedDeal.dealerName}</div>
                <div><strong>Vehicle:</strong> {selectedDeal.vehicle}</div>
                <div><strong>Income:</strong> ${selectedDeal.monthlyIncome.toLocaleString()}</div>
                <div><strong>Credit:</strong> {selectedDeal.creditScore}</div>
                <div><strong>Down Payment:</strong> ${selectedDeal.downPayment.toLocaleString()}</div>
                <div><strong>Tier:</strong> {selectedDeal.tier}</div>
                <div><strong>System Recommendation:</strong> {selectedDeal.systemRecommendation}</div>
                <div><strong>Final Decision:</strong> {selectedDeal.finalDecision || "Pending"}</div>
                <div><strong>Max Payment:</strong> ${Math.round(selectedDeal.maxPayment)}</div>
                <div><strong>Max Vehicle:</strong> ${Math.round(selectedDeal.maxVehiclePrice)}</div>
                <div><strong>Vehicle Fit:</strong> {selectedDeal.vehicleRecommendation}</div>
                <div><strong>Lender Route:</strong> {selectedDeal.lenderRoute}</div>
                <div><strong>Workflow Stage:</strong> {selectedDeal.fundingStage}</div>
                <div><strong>Submitted:</strong> {selectedDeal.submittedAt}</div>
                {selectedDeal.decisionedAt && (
                  <>
                    <div><strong>Decision Time:</strong> {selectedDeal.decisionedAt}</div>
                    <div><strong>Decision By:</strong> {selectedDeal.decisionBy}</div>
                  </>
                )}
                {selectedDeal.lenderSubmittedAt && (
                  <>
                    <div><strong>Lender Submitted:</strong> {selectedDeal.lenderSubmittedAt}</div>
                    <div><strong>Submitted By:</strong> {selectedDeal.lenderSubmittedBy}</div>
                  </>
                )}
                {selectedDeal.lenderDecisionAt && (
                  <>
                    <div><strong>Lender Decision:</strong> {selectedDeal.lenderDecision}</div>
                    <div><strong>Lender Decision Time:</strong> {selectedDeal.lenderDecisionAt}</div>
                    <div><strong>Lender Decision By:</strong> {selectedDeal.lenderDecisionBy}</div>
                  </>
                )}
                {selectedDeal.fundedAt && (
                  <>
                    <div><strong>Funded At:</strong> {selectedDeal.fundedAt}</div>
                    <div><strong>Funded By:</strong> {selectedDeal.fundedBy}</div>
                  </>
                )}
                <div><strong>Locked:</strong> {selectedDeal.locked ? "Yes" : "No"}</div>
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 style={miniHeading}>Stip Checklist</h3>
                <div style={stipGridStyle}>
                  {(
                    [
                      ["poi", "Proof of Income"],
                      ["por", "Proof of Residence"],
                      ["insurance", "Insurance"],
                      ["gps", "GPS Installed"],
                      ["references", "References"],
                      ["signedDocs", "Signed Docs"],
                    ] as Array<[keyof StipChecklist, string]>
                  ).map(([key, label]) => (
                    <label key={key} style={stipItemStyle}>
                      <input
                        type="checkbox"
                        checked={selectedDeal.stips[key]}
                        onChange={(e) => updateStip(selectedDeal.id, key, e.target.checked)}
                      />{" "}
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 style={miniHeading}>Underwriter Notes</h3>
                <textarea
                  style={textareaStyle}
                  value={selectedDeal.notes}
                  onChange={(e) => updateNotes(selectedDeal.id, e.target.value)}
                  placeholder="Add underwriter notes here..."
                />
              </div>

              <div style={{ marginTop: 20 }}>
                <h3 style={miniHeading}>Recommended Vehicles</h3>

                {getMatches(selectedDeal.maxVehiclePrice).map((car) => (
                  <div
                    key={car.stock}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: 10,
                      marginBottom: 8,
                      background:
                        car.match === "Best Fit"
                          ? "#e7f7ea"
                          : car.match === "Stretch"
                          ? "#fff4d6"
                          : "#fdeaea",
                    }}
                  >
                    <strong>
                      {car.year} {car.make} {car.model}
                    </strong>
                    <div>Stock: {car.stock}</div>
                    <div>Price: ${car.price.toLocaleString()}</div>
                    <div>Match: {car.match}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  style={approveBtn}
                  disabled={!!selectedDeal.locked}
                  onClick={() => applyDecision(selectedDeal.id, "Approved")}
                >
                  Approve & Lock
                </button>

                <button
                  style={stipBtn}
                  disabled={!!selectedDeal.locked}
                  onClick={() => applyDecision(selectedDeal.id, "Needs Stips")}
                >
                  Request Stips
                </button>

                <button
                  style={declineBtn}
                  disabled={!!selectedDeal.locked}
                  onClick={() => applyDecision(selectedDeal.id, "Declined")}
                >
                  Decline
                </button>

                <button
                  style={primaryBtn}
                  disabled={selectedDeal.fundingStage !== "Ready to Fund"}
                  onClick={() => submitToLender(selectedDeal.id)}
                >
                  Submit to Lender
                </button>

                <button
                  style={approveBtn}
                  disabled={!selectedDeal.lenderSubmittedAt || !!selectedDeal.fundedAt}
                  onClick={() => setLenderDecision(selectedDeal.id, "Approved")}
                >
                  Lender Approved
                </button>

                <button
                  style={declineBtn}
                  disabled={!selectedDeal.lenderSubmittedAt || !!selectedDeal.fundedAt}
                  onClick={() => setLenderDecision(selectedDeal.id, "Declined")}
                >
                  Lender Declined
                </button>

                <button
                  style={primaryBtn}
                  disabled={selectedDeal.lenderDecision !== "Approved" || !!selectedDeal.fundedAt}
                  onClick={() => markFunded(selectedDeal.id)}
                >
                  Mark Funded
                </button>

                <button style={deleteBtn} onClick={() => setSelectedDeal(null)}>
                  Close
                </button>
              </div>
            </section>
          )}
        </div>
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
  const colors: Record<DealStatus, CSSProperties> = {
    "New Submission": { background: "#e8f1fd", color: "#0b4ea2" },
    "Needs Stips": { background: "#fff4d6", color: "#946200" },
    Approved: { background: "#e7f7ea", color: "#1f7a35" },
    Declined: { background: "#fdeaea", color: "#b42318" },
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

const pageStyle: CSSProperties = {
  padding: 40,
  fontFamily: "Arial, sans-serif",
  background: "#f5f7fb",
  minHeight: "100vh",
};

const headingStyle: CSSProperties = {
  marginBottom: 8,
};

const subStyle: CSSProperties = {
  color: "#444",
  marginBottom: 24,
};

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 16,
  marginBottom: 24,
};

const statCardStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 18,
};

const layoutStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(320px, 420px) 1fr",
  gap: 24,
  alignItems: "start",
};

const panelStyle: CSSProperties = {
  background: "#fff",
  border: "1px solid #d9e2f1",
  borderRadius: 12,
  padding: 20,
};

const sectionHeading: CSSProperties = {
  marginTop: 0,
  marginBottom: 16,
};

const miniHeading: CSSProperties = {
  marginTop: 0,
  marginBottom: 10,
};

const inputStyle: CSSProperties = {
  display: "block",
  width: "100%",
  padding: 12,
  marginBottom: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box",
};

const textareaStyle: CSSProperties = {
  width: "100%",
  minHeight: 90,
  padding: 12,
  border: "1px solid #ccc",
  borderRadius: 8,
  boxSizing: "border-box",
  resize: "vertical",
};

const primaryBtn: CSSProperties = {
  padding: "10px 14px",
  background: "#007bff",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const dealCardStyle: CSSProperties = {
  border: "1px solid #ddd",
  borderRadius: 10,
  padding: 16,
  background: "#fcfdff",
};

const dealHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  alignItems: "start",
};

const actionRowStyle: CSSProperties = {
  display: "flex",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 16,
};

const stipGridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 10,
};

const stipItemStyle: CSSProperties = {
  display: "block",
  padding: 10,
  border: "1px solid #e2e8f0",
  borderRadius: 8,
  background: "#fafcff",
};

const approveBtn: CSSProperties = {
  padding: "10px 14px",
  background: "#28a745",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const stipBtn: CSSProperties = {
  padding: "10px 14px",
  background: "#f0ad4e",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const declineBtn: CSSProperties = {
  padding: "10px 14px",
  background: "#dc3545",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const deleteBtn: CSSProperties = {
  padding: "10px 14px",
  background: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};
