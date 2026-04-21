"use client"

import { CSSProperties, useEffect, useMemo, useState } from "react"

type ApplicationRecord = {
  id: string
  createdAt: string
  updatedAt: string

  firstName: string | null
  lastName: string | null
  phone: string | null
  email: string | null

  identityType: string | null
  identityValue: string | null
  issuingCountry: string | null
  identityStatus: string | null

  stockNumber: string | null
  vin: string | null
  vehicleYear: number | null
  vehicleMake: string | null
  vehicleModel: string | null
  vehiclePrice: number | null

  downPayment: number | null
  tradeIn: number | null
  amountFinanced: number | null

  creditScore: number | null
  monthlyIncome: number | null

  status: string | null
  lender: string | null
  tier: string | null
  maxPayment: number | null
  maxVehicle: number | null
  decisionReason: string | null
  dealStrength: number | null
}

type DashboardResponse = {
  success: boolean
  count: number
  applications: ApplicationRecord[]
}

export default function ControllerPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [selectedId, setSelectedId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  )

  const [decisionForm, setDecisionForm] = useState({
    lender: "",
    tier: "",
    maxPayment: "",
    maxVehicle: "",
    decisionReason: "",
    dealStrength: "",
  })

  useEffect(() => {
    loadApplications()
  }, [])

  async function loadApplications() {
    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/controller-dashboard", {
        headers: {
          "x-user-role": "CONTROLLER",
        },
      })

      const data: DashboardResponse | any = await response.json()

      if (!response.ok) {
        setMessageType("error")
        setMessage(data?.reason || data?.message || "Failed to load dashboard")
        return
      }

      const rows: ApplicationRecord[] = Array.isArray(data?.applications)
        ? data.applications
        : []

      setApplications(rows)

      if (rows.length > 0) {
        setSelectedId((current: string) => {
          const stillExists = rows.some((row: ApplicationRecord) => row.id === current)
          return stillExists ? current : rows[0].id
        })
      } else {
        setSelectedId("")
      }

      setMessageType("success")
      setMessage("Controller dashboard loaded")
    } catch (error) {
      console.error(error)
      setMessageType("error")
      setMessage("Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  const selectedApplication = useMemo(() => {
    return applications.find((item: ApplicationRecord) => item.id === selectedId) || null
  }, [applications, selectedId])

  function updateDecisionField(
    key:
      | "lender"
      | "tier"
      | "maxPayment"
      | "maxVehicle"
      | "decisionReason"
      | "dealStrength",
    value: string
  ) {
    setDecisionForm((prev) => ({ ...prev, [key]: value }))
  }

  async function runCreditPullCheck() {
    try {
      const response = await fetch("/api/test-credit-pull", {
        headers: {
          "x-user-role": "CONTROLLER",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.reason || data?.message || "Credit pull blocked")
        return
      }

      alert("Credit pull allowed for CONTROLLER")
    } catch (error) {
      console.error(error)
      alert("Credit pull test failed")
    }
  }

  async function approveDeal() {
    if (!selectedApplication) {
      alert("No application selected")
      return
    }

    setProcessing(true)

    try {
      const response = await fetch("/api/controller-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "CONTROLLER",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          action: "APPROVE",
          lender: decisionForm.lender || null,
          tier: decisionForm.tier || null,
          maxPayment: toNumberOrNull(decisionForm.maxPayment),
          maxVehicle: toNumberOrNull(decisionForm.maxVehicle),
          decisionReason: decisionForm.decisionReason || "Approved by controller",
          dealStrength: toNumberOrNull(decisionForm.dealStrength),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.reason || data?.message || "Approval failed")
        return
      }

      alert("Deal approved")
      await loadApplications()
    } catch (error) {
      console.error(error)
      alert("Approval failed")
    } finally {
      setProcessing(false)
    }
  }

  async function rejectDeal() {
    if (!selectedApplication) {
      alert("No application selected")
      return
    }

    setProcessing(true)

    try {
      const response = await fetch("/api/controller-decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "CONTROLLER",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          action: "REJECT",
          decisionReason:
            decisionForm.decisionReason || "Rejected by controller review",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.reason || data?.message || "Rejection failed")
        return
      }

      alert("Deal rejected")
      await loadApplications()
    } catch (error) {
      console.error(error)
      alert("Rejection failed")
    } finally {
      setProcessing(false)
    }
  }

  async function markFunded() {
    if (!selectedApplication) {
      alert("No application selected")
      return
    }

    setProcessing(true)

    try {
      const response = await fetch("/api/application-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "CONTROLLER",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          newStatus: "FUNDED",
          decisionReason: decisionForm.decisionReason || "Marked funded by controller",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.reason || data?.message || "Funding update failed")
        return
      }

      alert("Deal marked FUNDED")
      await loadApplications()
    } catch (error) {
      console.error(error)
      alert("Funding update failed")
    } finally {
      setProcessing(false)
    }
  }

  async function moveBackToSubmitted() {
    if (!selectedApplication) {
      alert("No application selected")
      return
    }

    setProcessing(true)

    try {
      const response = await fetch("/api/application-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "CONTROLLER",
        },
        body: JSON.stringify({
          applicationId: selectedApplication.id,
          newStatus: "SUBMITTED",
          decisionReason:
            decisionForm.decisionReason || "Moved back to submitted for re-review",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data?.reason || data?.message || "Status reset failed")
        return
      }

      alert("Deal moved back to SUBMITTED")
      await loadApplications()
    } catch (error) {
      console.error(error)
      alert("Status reset failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.kicker}>Smart Drive Elite</div>
            <h1 style={styles.pageTitle}>Controller Dashboard</h1>
            <p style={styles.pageSubtitle}>
              Review submitted applications, enforce credit access control, and
              manage lifecycle from submitted through funding.
            </p>
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.statusPill}>
              {loading ? "LOADING" : `${applications.length} FILES`}
            </div>
            <div style={styles.roleBadge}>CONTROLLER</div>
          </div>
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
                <h2 style={styles.panelTitle}>Application Queue</h2>
                <p style={styles.panelSubtitle}>
                  Review and manage file progression
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
              <div style={styles.emptyState}>Loading applications...</div>
            ) : applications.length === 0 ? (
              <div style={styles.emptyState}>No applications found yet.</div>
            ) : (
              <div style={styles.queueList}>
                {applications.map((app: ApplicationRecord) => {
                  const active = app.id === selectedId
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
                              : app.status === "DECLINED"
                              ? styles.rejectedBadge
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
                          Score:{" "}
                          {app.dealStrength !== null && app.dealStrength !== undefined
                            ? app.dealStrength
                            : "N/A"}
                        </span>
                        <span>Tier: {app.tier ?? "N/A"}</span>
                      </div>

                      <div style={styles.queueMeta}>
                        <span>Decision: {app.decisionReason ?? "N/A"}</span>
                      </div>

                      <div style={styles.queueMeta}>
                        <span>Lenders: {app.lender ?? "N/A"}</span>
                      </div>

                      <div style={styles.queueMeta}>
                        <span>
                          Max Vehicle:{" "}
                          {app.maxVehicle != null
                            ? formatCurrency(app.maxVehicle)
                            : "N/A"}
                        </span>
                        <span>
                          Max Payment:{" "}
                          {app.maxPayment != null
                            ? formatCurrency(app.maxPayment)
                            : "N/A"}
                        </span>
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
                  )
                })}
              </div>
            )}
          </section>

          <section style={styles.rightPanel}>
            <div style={styles.panelHeader}>
              <div>
                <h2 style={styles.panelTitle}>Controller Review</h2>
                <p style={styles.panelSubtitle}>
                  Decision controls and funding workflow
                </p>
              </div>

              <button
                type="button"
                onClick={runCreditPullCheck}
                style={styles.primaryButton}
              >
                Test Credit Access
              </button>
            </div>

            {!selectedApplication ? (
              <div style={styles.emptyState}>Select a file to review.</div>
            ) : (
              <div style={styles.reviewStack}>
                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Applicant Snapshot</h3>
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
                          : "danger"
                      }
                    />
                    <InfoRow
                      label="Issuing Country"
                      value={selectedApplication.issuingCountry || "N/A"}
                    />
                  </div>
                </div>

                <div style={styles.detailCard}>
                  <h3 style={styles.detailTitle}>Deal Snapshot</h3>
                  <div style={styles.infoGrid}>
                    <InfoRow
                      label="Current Status"
                      value={selectedApplication.status || "N/A"}
                    />
                    <InfoRow
                      label="Tier"
                      value={selectedApplication.tier || "N/A"}
                    />
                    <InfoRow
                      label="Deal Strength"
                      value={
                        selectedApplication.dealStrength != null
                          ? String(selectedApplication.dealStrength)
                          : "N/A"
                      }
                    />
                    <InfoRow
                      label="Suggested Decision"
                      value={selectedApplication.decisionReason || "N/A"}
                    />
                    <InfoRow
                      label="Lenders"
                      value={selectedApplication.lender || "N/A"}
                    />
                    <InfoRow
                      label="Max Vehicle"
                      value={
                        selectedApplication.maxVehicle != null
                          ? formatCurrency(selectedApplication.maxVehicle)
                          : "N/A"
                      }
                    />
                    <InfoRow
                      label="Max Payment"
                      value={
                        selectedApplication.maxPayment != null
                          ? formatCurrency(selectedApplication.maxPayment)
                          : "N/A"
                      }
                    />
                    <InfoRow
                      label="Stock Number"
                      value={selectedApplication.stockNumber || "N/A"}
                    />
                    <InfoRow label="VIN" value={selectedApplication.vin || "N/A"} />
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
                      label="Credit Score"
                      value={
                        selectedApplication.creditScore != null
                          ? String(selectedApplication.creditScore)
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
                  <h3 style={styles.detailTitle}>Controller Decision</h3>

                  <div style={styles.formGrid}>
                    <InputField
                      label="Lender"
                      value={decisionForm.lender}
                      onChange={(v) => updateDecisionField("lender", v)}
                      placeholder="Westlake, Exeter, etc."
                    />
                    <InputField
                      label="Tier"
                      value={decisionForm.tier}
                      onChange={(v) => updateDecisionField("tier", v)}
                      placeholder="Tier 1, Tier 2, etc."
                    />
                    <InputField
                      label="Max Payment"
                      value={decisionForm.maxPayment}
                      onChange={(v) => updateDecisionField("maxPayment", v)}
                      placeholder="685"
                    />
                    <InputField
                      label="Max Vehicle"
                      value={decisionForm.maxVehicle}
                      onChange={(v) => updateDecisionField("maxVehicle", v)}
                      placeholder="32880"
                    />
                    <InputField
                      label="Deal Strength"
                      value={decisionForm.dealStrength}
                      onChange={(v) => updateDecisionField("dealStrength", v)}
                      placeholder="82"
                    />
                    <InputField
                      label="Decision Reason"
                      value={decisionForm.decisionReason}
                      onChange={(v) => updateDecisionField("decisionReason", v)}
                      placeholder="Reason for decision"
                    />
                  </div>

                  <div style={styles.actionBar}>
                    <button
                      type="button"
                      onClick={approveDeal}
                      disabled={processing}
                      style={{
                        ...styles.approveButton,
                        ...(processing ? styles.disabledButton : {}),
                      }}
                    >
                      {processing ? "Processing..." : "Approve Deal"}
                    </button>

                    <button
                      type="button"
                      onClick={rejectDeal}
                      disabled={processing}
                      style={{
                        ...styles.rejectButton,
                        ...(processing ? styles.disabledButton : {}),
                      }}
                    >
                      {processing ? "Processing..." : "Reject Deal"}
                    </button>

                    <button
                      type="button"
                      onClick={markFunded}
                      disabled={processing}
                      style={{
                        ...styles.fundedButton,
                        ...(processing ? styles.disabledButton : {}),
                      }}
                    >
                      {processing ? "Processing..." : "Mark Funded"}
                    </button>

                    <button
                      type="button"
                      onClick={moveBackToSubmitted}
                      disabled={processing}
                      style={{
                        ...styles.secondaryButton,
                        ...(processing ? styles.disabledButton : {}),
                      }}
                    >
                      {processing ? "Processing..." : "Move to Submitted"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <label style={styles.labelWrap}>
      <div style={styles.fieldLabel}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </label>
  )
}

function InfoRow({
  label,
  value,
  emphasize,
}: {
  label: string
  value: string
  emphasize?: "success" | "danger"
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
  )
}

function toNumberOrNull(value: string) {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
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
    marginBottom: "32px",
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
  primaryButton: {
    borderRadius: "18px",
    border: "none",
    backgroundColor: "#111111",
    padding: "12px 18px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
    cursor: "pointer",
  },
  fundedButton: {
    borderRadius: "18px",
    border: "none",
    backgroundColor: "#0b7f5b",
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
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
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  labelWrap: {
    display: "block",
  },
  fieldLabel: {
    marginBottom: "8px",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.22em",
    color: "rgba(17,17,17,0.45)",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    backgroundColor: "#ffffff",
    padding: "14px 16px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  actionBar: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "18px",
  },
  approveButton: {
    borderRadius: "18px",
    border: "none",
    backgroundColor: "#1f7a37",
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
    cursor: "pointer",
  },
  rejectButton: {
    borderRadius: "18px",
    border: "none",
    backgroundColor: "#b42318",
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#ffffff",
    cursor: "pointer",
  },
  disabledButton: {
    opacity: 0.45,
    cursor: "not-allowed",
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
}
