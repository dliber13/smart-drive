"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";

type TimelineItem = {
  label: string;
  complete: boolean;
  date: string;
};

type ApplicationRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;

  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;

  identityType: string | null;
  identityValue: string | null;
  issuingCountry: string | null;
  identityStatus: string | null;

  stockNumber: string | null;
  vin: string | null;
  vehicleYear: number | null;
  vehicleMake: string | null;
  vehicleModel: string | null;
  vehiclePrice: number | null;

  downPayment: number | null;
  tradeIn: number | null;
  amountFinanced: number | null;

  creditScore: number | null;
  monthlyIncome: number | null;

  status: string | null;
  lender: string | null;
  tier: string | null;
  maxPayment: number | null;
  maxVehicle: number | null;
  decisionReason: string | null;
  dealStrength: number | null;

  timeline: TimelineItem[];
};

type DashboardResponse = {
  success: boolean;
  count: number;
  applications: ApplicationRecord[];
  currentUserRole: string;
};

export default function DealerDashboardPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  );

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/dealer-dashboard", {
        headers: {
          "x-user-role": "SALES",
        },
      });

      const data: DashboardResponse | any = await response.json();

      if (!response.ok) {
        setMessageType("error");
        setMessage(data?.reason || data?.message || "Failed to load dashboard");
        return;
      }

      const rows: ApplicationRecord[] = Array.isArray(data?.applications)
        ? data.applications
        : [];

      setApplications(rows);

      if (rows.length > 0) {
        setSelectedId((current: string) => {
          const stillExists = rows.some(
            (row: ApplicationRecord) => row.id === current
          );
          return stillExists ? current : rows[0].id;
        });
      } else {
        setSelectedId("");
      }

      setMessageType("success");
      setMessage("Dealer dashboard loaded");
    } catch (error) {
      console.error(error);
      setMessageType("error");
      setMessage("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const selectedApplication = useMemo(() => {
    return (
      applications.find((item: ApplicationRecord) => item.id === selectedId) ||
      null
    );
  }, [applications, selectedId]);

  const counts = useMemo(() => {
    return {
      total: applications.length,
      submitted: applications.filter((a) => a.status === "SUBMITTED").length,
      approved: applications.filter((a) => a.status === "APPROVED").length,
      rejected: applications.filter((a) => a.status === "REJECTED").length,
      funded: applications.filter((a) => a.status === "FUNDED").length,
    };
  }, [applications]);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.kicker}>Smart Drive Elite</div>
            <h1 style={styles.pageTitle}>Dealer Dashboard</h1>
            <p style={styles.pageSubtitle}>
              Track deal progress, underwriting outcomes, and funded contracts in one place.
            </p>
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.statusPill}>
              {loading ? "LOADING" : `${applications.length} FILES`}
            </div>
            <div style={styles.roleBadge}>SALES</div>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <SummaryCard label="Total Deals" value={String(counts.total)} />
          <SummaryCard label="Submitted" value={String(counts.submitted)} />
          <SummaryCard label="Approved" value={String(counts.approved)} />
          <SummaryCard label="Rejected" value={String(counts.rejected)} />
          <SummaryCard label="Funded" value={String(counts.funded)} />
        </div>

        {message ? (
          <div
            style={{
              ...styles.messageBox,
              ...(messageType === "success"
                ? styles.messageSuccess
                : messageType === "error"
                ? styles.messageError
                : styles.messageInfo),
            }}
          >
            {message}
          </div>
        ) : null}

        <div style={styles.grid}>
          <section style={styles.leftPanel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>My Deal Queue</h2>
                <p style={styles.panelSubtitle}>
                  Submitted and in-progress applications
                </p>
              </div>

              <button
                type="button"
                onClick={loadApplications}
                style={styles.secondaryButton}
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div style={styles.emptyState}>Loading deals...</div>
            ) : applications.length === 0 ? (
              <div style={styles.emptyState}>No deals found yet.</div>
            ) : (
              <div style={styles.queueList}>
                {applications.map((app: ApplicationRecord) => {
                  const active = app.id === selectedId;

                  return (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedId(app.id)}
                      style={{
                        ...styles.queueCard,
                        ...(active ? styles.queueCardActive : {}),
                      }}
                    >
                      <div style={styles.queueTopRow}>
                        <div style={styles.queueName}>
                          {app.firstName || "Unknown"} {app.lastName || "Borrower"}
                        </div>
                        <div
                          style={{
                            ...styles.smallStatusBadge,
                            ...(app.status === "SUBMITTED"
                              ? styles.submittedBadge
                              : app.status === "APPROVED"
                              ? styles.approvedBadge
                              : app.status === "FUNDED"
                              ? styles.fundedBadge
                              : app.status === "REJECTED"
                              ? styles.rejectedBadge
                              : app.status === "READY"
                              ? styles.readyBadge
                              : styles.draftBadge),
                          }}
                        >
                          {app.status || "DRAFT"}
                        </div>
                      </div>

                      <div style={styles.queueMeta}>
                        <span>{app.identityType || "No ID Type"}</span>
                        <span>{app.identityStatus || "No ID Status"}</span>
                      </div>

                      <div style={styles.queueMeta}>
                        <span>
                          Vehicle:{" "}
                          {[app.vehicleYear, app.vehicleMake, app.vehicleModel]
                            .filter(Boolean)
                            .join(" ") || "N/A"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section style={styles.rightPanel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Deal Status</h2>
                <p style={styles.panelSubtitle}>
                  Outcome visibility and next steps
                </p>
              </div>
            </div>

            {!selectedApplication ? (
              <div style={styles.emptyState}>Select a deal to view details.</div>
            ) : (
              <div style={styles.reviewStack}>
                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Borrower Snapshot</h3>
                  <div style={styles.infoGrid}>
                    <InfoRow
                      label="Borrower"
                      value={`${selectedApplication.firstName || ""} ${
                        selectedApplication.lastName || ""
                      }`.trim() || "N/A"}
                    />
                    <InfoRow
                      label="Phone"
                      value={selectedApplication.phone || "N/A"}
                    />
                    <InfoRow
                      label="Email"
                      value={selectedApplication.email || "N/A"}
                    />
                    <InfoRow
                      label="Identity Type"
                      value={selectedApplication.identityType || "N/A"}
                    />
                    <InfoRow
                      label="Identity Status"
                      value={selectedApplication.identityStatus || "N/A"}
                      emphasize={
                        selectedApplication.identityStatus === "VERIFIED"
                          ? "success"
                          : selectedApplication.identityStatus === "REJECTED"
                          ? "danger"
                          : undefined
                      }
                    />
                    <InfoRow
                      label="Issuing Country"
                      value={selectedApplication.issuingCountry || "N/A"}
                    />
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Deal Structure</h3>
                  <div style={styles.infoGrid}>
                    <InfoRow
                      label="Current Status"
                      value={selectedApplication.status || "N/A"}
                      emphasize={
                        selectedApplication.status === "APPROVED" ||
                        selectedApplication.status === "FUNDED"
                          ? "success"
                          : selectedApplication.status === "REJECTED"
                          ? "danger"
                          : undefined
                      }
                    />
                    <InfoRow
                      label="Stock Number"
                      value={selectedApplication.stockNumber || "N/A"}
                    />
                    <InfoRow
                      label="Vehicle"
                      value={
                        [selectedApplication.vehicleYear, selectedApplication.vehicleMake, selectedApplication.vehicleModel]
                          .filter(Boolean)
                          .join(" ") || "N/A"
                      }
                    />
                    <InfoRow
                      label="Vehicle Price"
                      value={
                        selectedApplication.vehiclePrice != null
                          ? formatCurrency(selectedApplication.vehiclePrice)
                          : "N/A"
                      }
                    />
                    <InfoRow
                      label="Amount Financed"
                      value={
                        selectedApplication.amountFinanced != null
                          ? formatCurrency(selectedApplication.amountFinanced)
                          : "N/A"
                      }
                    />
                    <InfoRow
                      label="Monthly Income"
                      value={
                        selectedApplication.monthlyIncome != null
                          ? formatCurrency(selectedApplication.monthlyIncome)
                          : "N/A"
                      }
                    />
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Controller Outcome</h3>
                  <div style={styles.infoGrid}>
                    <InfoRow
                      label="Lender"
                      value={selectedApplication.lender || "Pending"}
                    />
                    <InfoRow
                      label="Tier"
                      value={selectedApplication.tier || "Pending"}
                    />
                    <InfoRow
                      label="Max Payment"
                      value={
                        selectedApplication.maxPayment != null
                          ? formatCurrency(selectedApplication.maxPayment)
                          : "Pending"
                      }
                    />
                    <InfoRow
                      label="Max Vehicle"
                      value={
                        selectedApplication.maxVehicle != null
                          ? formatCurrency(selectedApplication.maxVehicle)
                          : "Pending"
                      }
                    />
                    <InfoRow
                      label="Deal Strength"
                      value={
                        selectedApplication.dealStrength != null
                          ? String(selectedApplication.dealStrength)
                          : "Pending"
                      }
                    />
                    <InfoRow
                      label="Decision Reason"
                      value={selectedApplication.decisionReason || "Pending"}
                    />
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Status Timeline</h3>
                  <div style={styles.timelineStack}>
                    {selectedApplication.timeline?.map((item) => (
                      <div key={`${selectedApplication.id}-${item.label}`} style={styles.timelineRow}>
                        <div
                          style={{
                            ...styles.timelineDot,
                            ...(item.complete ? styles.timelineDotComplete : styles.timelineDotPending),
                          }}
                        />
                        <div style={styles.timelineContent}>
                          <div style={styles.timelineLabel}>{item.label}</div>
                          <div style={styles.timelineDate}>
                            {item.complete ? displayDate(item.date) : "Pending"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>What This Means</h3>
                  <div style={styles.noticeStack}>
                    <StatusNotice status={selectedApplication.status || "DRAFT"} />
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.summaryCard}>
      <div style={styles.summaryLabel}>{label}</div>
      <div style={styles.summaryValue}>{value}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  emphasize,
}: {
  label: string;
  value: string;
  emphasize?: "success" | "danger";
}) {
  return (
    <div style={styles.infoRow}>
      <div style={styles.infoLabel}>{label}</div>
      <div
        style={{
          ...styles.infoValue,
          ...(emphasize === "success"
            ? styles.successText
            : emphasize === "danger"
            ? styles.dangerText
            : {}),
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusNotice({ status }: { status: string }) {
  if (status === "FUNDED") {
    return (
      <div style={{ ...styles.noticeBox, ...styles.noticeSuccess }}>
        Deal is funded. File has completed the underwriting lifecycle.
      </div>
    );
  }

  if (status === "APPROVED") {
    return (
      <div style={{ ...styles.noticeBox, ...styles.noticeSuccess }}>
        Deal approved. Review lender, tier, max payment, and prepare for funding.
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div style={{ ...styles.noticeBox, ...styles.noticeError }}>
        Deal rejected. Review controller decision reason for next action.
      </div>
    );
  }

  if (status === "SUBMITTED") {
    return (
      <div style={{ ...styles.noticeBox, ...styles.noticeInfo }}>
        Deal has been submitted and is awaiting controller review.
      </div>
    );
  }

  if (status === "READY") {
    return (
      <div style={{ ...styles.noticeBox, ...styles.noticeInfo }}>
        Deal is ready and can move into the submitted underwriting queue.
      </div>
    );
  }

  return (
    <div style={{ ...styles.noticeBox, ...styles.noticeInfo }}>
      Deal is still in draft or pre-submission state.
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function displayDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f7f4ee",
    padding: "32px 24px",
    color: "#111111",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "16px",
    marginBottom: "24px",
  },
  kicker: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.28em",
    color: "rgba(17,17,17,0.45)",
  },
  pageTitle: {
    marginTop: "12px",
    marginBottom: "8px",
    fontSize: "56px",
    lineHeight: 1,
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  pageSubtitle: {
    maxWidth: "760px",
    fontSize: "16px",
    lineHeight: 1.7,
    color: "rgba(17,17,17,0.65)",
    margin: 0,
  },
  badgeRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  statusPill: {
    border: "1px solid rgba(17,17,17,0.1)",
    backgroundColor: "#ffffff",
    borderRadius: "999px",
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "rgba(17,17,17,0.75)",
  },
  roleBadge: {
    borderRadius: "999px",
    padding: "12px 16px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    color: "#ffffff",
    backgroundColor: "#111111",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  summaryCard: {
    backgroundColor: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "24px",
    padding: "20px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
  },
  summaryLabel: {
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "rgba(17,17,17,0.45)",
    fontWeight: 700,
    marginBottom: "10px",
  },
  summaryValue: {
    fontSize: "34px",
    fontWeight: 800,
    color: "#111111",
  },
  messageBox: {
    marginBottom: "24px",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    padding: "16px 18px",
    fontSize: "14px",
  },
  messageSuccess: {
    backgroundColor: "#eefaf1",
    borderColor: "#b7e3c2",
    color: "#1f7a37",
  },
  messageError: {
    backgroundColor: "#fff1f1",
    borderColor: "#efc0c0",
    color: "#b42318",
  },
  messageInfo: {
    backgroundColor: "#ffffff",
    borderColor: "rgba(17,17,17,0.1)",
    color: "rgba(17,17,17,0.75)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(340px, 0.9fr) minmax(0, 1.3fr)",
    gap: "24px",
    alignItems: "start",
  },
  leftPanel: {
    backgroundColor: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
    minHeight: "70vh",
  },
  rightPanel: {
    backgroundColor: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
    minHeight: "70vh",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "24px",
  },
  panelTitle: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  panelSubtitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "14px",
    color: "rgba(17,17,17,0.55)",
  },
  secondaryButton: {
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    backgroundColor: "#ffffff",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
    color: "rgba(17,17,17,0.75)",
    cursor: "pointer",
  },
  emptyState: {
    borderRadius: "18px",
    padding: "24px",
    backgroundColor: "#faf7f1",
    border: "1px solid rgba(17,17,17,0.08)",
    color: "rgba(17,17,17,0.65)",
    fontSize: "15px",
  },
  queueList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  queueCard: {
    width: "100%",
    textAlign: "left",
    borderRadius: "20px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#faf7f1",
    padding: "18px",
    cursor: "pointer",
  },
  queueCardActive: {
    backgroundColor: "#fffaf1",
    borderColor: "#d8c7a1",
    boxShadow: "0 10px 24px rgba(0,0,0,0.05)",
  },
  queueTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  },
  queueName: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#111111",
  },
  queueMeta: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "13px",
    color: "rgba(17,17,17,0.62)",
    marginTop: "6px",
    flexWrap: "wrap",
  },
  smallStatusBadge: {
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "10px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
  },
  submittedBadge: {
    backgroundColor: "#e8efff",
    color: "#2457d6",
  },
  approvedBadge: {
    backgroundColor: "#dff5e6",
    color: "#1f7a37",
  },
  fundedBadge: {
    backgroundColor: "#e6faf4",
    color: "#007a5a",
  },
  rejectedBadge: {
    backgroundColor: "#fde4e4",
    color: "#b42318",
  },
  readyBadge: {
    backgroundColor: "#ede9fe",
    color: "#5b21b6",
  },
  draftBadge: {
    backgroundColor: "#f1ece5",
    color: "#6f6557",
  },
  reviewStack: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  detailCard: {
    borderRadius: "24px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#faf7f1",
    padding: "20px",
  },
  detailTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#ffffff",
    padding: "14px 16px",
  },
  infoLabel: {
    fontSize: "14px",
    color: "rgba(17,17,17,0.5)",
  },
  infoValue: {
    fontSize: "14px",
    fontWeight: 700,
    textAlign: "right",
    color: "rgba(17,17,17,0.82)",
  },
  successText: {
    color: "#1f7a37",
  },
  dangerText: {
    color: "#b42318",
  },
  timelineStack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  timelineRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#ffffff",
    padding: "14px 16px",
  },
  timelineDot: {
    width: "14px",
    height: "14px",
    borderRadius: "999px",
    marginTop: "4px",
    flexShrink: 0,
  },
  timelineDotComplete: {
    backgroundColor: "#1f7a37",
  },
  timelineDotPending: {
    backgroundColor: "#d1d5db",
  },
  timelineContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  timelineLabel: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#111111",
  },
  timelineDate: {
    fontSize: "13px",
    color: "rgba(17,17,17,0.55)",
  },
  noticeStack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  noticeBox: {
    borderRadius: "18px",
    padding: "14px 16px",
    fontSize: "14px",
    border: "1px solid transparent",
  },
  noticeSuccess: {
    backgroundColor: "#eefaf1",
    borderColor: "#b7e3c2",
    color: "#1f7a37",
  },
  noticeError: {
    backgroundColor: "#fff1f1",
    borderColor: "#efc0c0",
    color: "#b42318",
  },
  noticeInfo: {
    backgroundColor: "#eef3ff",
    borderColor: "#c6d6ff",
    color: "#2457d6",
  },
};
