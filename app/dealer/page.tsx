"use client"

import { CSSProperties, useMemo, useState } from "react"

type IdentityType =
  | "SSN"
  | "ITIN"
  | "DRIVERS_LICENSE"
  | "STATE_ID"
  | "PASSPORT"
  | "MATRICULA"
  | "OTHER"
  | ""

type IdentityStatus = "PENDING" | "VERIFIED" | "REJECTED"

type FormState = {
  firstName: string
  lastName: string
  phone: string
  email: string

  identityType: IdentityType
  identityValue: string
  issuingCountry: string
  identityStatus: IdentityStatus

  stockNumber: string
  vin: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehiclePrice: string

  downPayment: string
  tradeIn: string
  amountFinanced: string

  creditScore: string
  monthlyIncome: string
}

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",

  identityType: "",
  identityValue: "",
  issuingCountry: "",
  identityStatus: "PENDING",

  stockNumber: "",
  vin: "",
  vehicleYear: "",
  vehicleMake: "",
  vehicleModel: "",
  vehiclePrice: "",

  downPayment: "",
  tradeIn: "",
  amountFinanced: "",

  creditScore: "",
  monthlyIncome: "",
}

type ChecklistItem = {
  label: string
  complete: boolean
}

function toNumberOrNull(value: string) {
  if (!value.trim()) return null
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

export default function DealerPage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">(
    "info"
  )

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function showTopMessage(type: "success" | "error" | "info", text: string) {
    setMessageType(type)
    setMessage(text)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const checklist = useMemo<ChecklistItem[]>(() => {
    return [
      { label: "First name entered", complete: !!form.firstName.trim() },
      { label: "Last name entered", complete: !!form.lastName.trim() },
      { label: "Identity type selected", complete: !!form.identityType },
      { label: "Identity value entered", complete: !!form.identityValue.trim() },
      { label: "Issuing country entered", complete: !!form.issuingCountry.trim() },
      { label: "Identity verified", complete: form.identityStatus === "VERIFIED" },
    ]
  }, [form])

  const readyForReview = useMemo(() => {
    return (
      !!form.firstName.trim() &&
      !!form.lastName.trim() &&
      !!form.identityType &&
      !!form.identityValue.trim() &&
      !!form.issuingCountry.trim()
    )
  }, [form])

  const canSubmit = useMemo(() => {
    return readyForReview && form.identityStatus === "VERIFIED"
  }, [form.identityStatus, readyForReview])

  const currentStatus = useMemo(() => {
    if (canSubmit) return "READY FOR SUBMISSION"
    if (readyForReview) return "READY FOR CONTROLLER REVIEW"
    return "DRAFT"
  }, [canSubmit, readyForReview])

  const blockReasons = useMemo(() => {
    const reasons: string[] = []

    if (!form.firstName.trim()) reasons.push("Missing first name")
    if (!form.lastName.trim()) reasons.push("Missing last name")
    if (!form.identityType) reasons.push("Missing identity type")
    if (!form.identityValue.trim()) reasons.push("Missing identity value")
    if (!form.issuingCountry.trim()) reasons.push("Missing issuing country")
    if (form.identityStatus !== "VERIFIED") {
      reasons.push("Identity verification required before submission")
    }

    return reasons
  }, [form])

  async function saveDraft() {
    setSaving(true)
    setMessage("")

    try {
      const response = await fetch("/api/save-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "SALES",
        },
        body: JSON.stringify({
          ...buildPayload(form),
          status: "DRAFT",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorText = data?.message || "Draft save failed"
        showTopMessage("error", errorText)
        return
      }

      showTopMessage("success", "Draft saved successfully")
    } catch (error) {
      console.error(error)
      showTopMessage("error", "Draft save failed")
    } finally {
      setSaving(false)
    }
  }

  async function submitApplication() {
    setSubmitting(true)
    setMessage("")

    try {
      const saveResponse = await fetch("/api/save-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "SALES",
        },
        body: JSON.stringify({
          ...buildPayload(form),
          status: "DRAFT",
        }),
      })

      const saveData = await saveResponse.json()

      if (!saveResponse.ok) {
        const errorText = saveData?.message || "Failed to save before submit"
        showTopMessage("error", errorText)
        return
      }

      const submitResponse = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "x-user-role": "SALES",
        },
      })

      const submitData = await submitResponse.json()

      if (!submitResponse.ok) {
        const errorText =
          submitData?.message ||
          submitData?.reason ||
          "Application blocked. Review submission requirements."
        showTopMessage("error", errorText)
        return
      }

      showTopMessage("success", "Application submitted successfully")
      setForm(initialForm)
    } catch (error) {
      console.error(error)
      showTopMessage("error", "Application submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.kicker}>Smart Drive Elite</div>
            <h1 style={styles.pageTitle}>Deal Intake</h1>
            <p style={styles.pageSubtitle}>
              Create a structured application for controller review and
              underwriting. Identity must be complete and verified before a file
              can be submitted.
            </p>
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.statusPill}>{currentStatus}</div>
            <div style={styles.roleBadge}>SALES</div>
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
          <div style={styles.leftColumn}>
            <SectionCard
              title="Applicant Information"
              subtitle="Core borrower details"
            >
              <div style={styles.twoColumnGrid}>
                <Field
                  label="First Name"
                  value={form.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  placeholder="First name"
                />
                <Field
                  label="Last Name"
                  value={form.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  placeholder="Last name"
                />
                <Field
                  label="Phone"
                  value={form.phone}
                  onChange={(v) => updateField("phone", v)}
                  placeholder="Phone number"
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => updateField("email", v)}
                  placeholder="Email address"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Identity Verification"
              subtitle="Required before submission"
              highlight
            >
              <div style={styles.twoColumnGrid}>
                <SelectField
                  label="Identity Type"
                  value={form.identityType}
                  onChange={(v) =>
                    updateField("identityType", v as IdentityType)
                  }
                  options={[
                    { label: "Select identity type", value: "" },
                    { label: "SSN", value: "SSN" },
                    { label: "ITIN", value: "ITIN" },
                    { label: "Driver's License", value: "DRIVERS_LICENSE" },
                    { label: "State ID (Non-Driver)", value: "STATE_ID" },
                    { label: "Passport", value: "PASSPORT" },
                    { label: "Matricula", value: "MATRICULA" },
                    { label: "Other", value: "OTHER" },
                  ]}
                />
                <Field
                  label="Identity Value"
                  value={form.identityValue}
                  onChange={(v) => updateField("identityValue", v)}
                  placeholder="Enter identity number/reference"
                />
                <Field
                  label="Issuing Country"
                  value={form.issuingCountry}
                  onChange={(v) => updateField("issuingCountry", v)}
                  placeholder="Country"
                />
                <SelectField
                  label="Identity Status"
                  value={form.identityStatus}
                  onChange={(v) =>
                    updateField("identityStatus", v as IdentityStatus)
                  }
                  options={[
                    { label: "PENDING", value: "PENDING" },
                    { label: "VERIFIED", value: "VERIFIED" },
                    { label: "REJECTED", value: "REJECTED" },
                  ]}
                />
              </div>
            </SectionCard>

            <SectionCard title="Vehicle Information" subtitle="Unit details">
              <div style={styles.twoColumnGrid}>
                <Field
                  label="Stock Number"
                  value={form.stockNumber}
                  onChange={(v) => updateField("stockNumber", v)}
                  placeholder="Stock #"
                />
                <Field
                  label="VIN"
                  value={form.vin}
                  onChange={(v) => updateField("vin", v)}
                  placeholder="VIN"
                />
                <Field
                  label="Vehicle Year"
                  value={form.vehicleYear}
                  onChange={(v) => updateField("vehicleYear", v)}
                  placeholder="Year"
                />
                <Field
                  label="Vehicle Make"
                  value={form.vehicleMake}
                  onChange={(v) => updateField("vehicleMake", v)}
                  placeholder="Make"
                />
                <Field
                  label="Vehicle Model"
                  value={form.vehicleModel}
                  onChange={(v) => updateField("vehicleModel", v)}
                  placeholder="Model"
                />
                <Field
                  label="Vehicle Price"
                  value={form.vehiclePrice}
                  onChange={(v) => updateField("vehiclePrice", v)}
                  placeholder="Vehicle price"
                />
              </div>
            </SectionCard>

            <SectionCard title="Deal Structure" subtitle="Financial structure">
              <div style={styles.threeColumnGrid}>
                <Field
                  label="Down Payment"
                  value={form.downPayment}
                  onChange={(v) => updateField("downPayment", v)}
                  placeholder="Down payment"
                />
                <Field
                  label="Trade In"
                  value={form.tradeIn}
                  onChange={(v) => updateField("tradeIn", v)}
                  placeholder="Trade in"
                />
                <Field
                  label="Amount Financed"
                  value={form.amountFinanced}
                  onChange={(v) => updateField("amountFinanced", v)}
                  placeholder="Amount financed"
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Borrower Financials"
              subtitle="Optional intake financials"
            >
              <div style={styles.twoColumnGrid}>
                <Field
                  label="Credit Score"
                  value={form.creditScore}
                  onChange={(v) => updateField("creditScore", v)}
                  placeholder="Credit score"
                />
                <Field
                  label="Monthly Income"
                  value={form.monthlyIncome}
                  onChange={(v) => updateField("monthlyIncome", v)}
                  placeholder="Monthly income"
                />
              </div>
            </SectionCard>

            <div style={styles.actionBar}>
              <button
                type="button"
                onClick={saveDraft}
                disabled={saving}
                style={{
                  ...styles.secondaryButton,
                  ...(saving ? styles.disabledButton : {}),
                }}
              >
                {saving ? "Saving Draft..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={submitApplication}
                disabled={!canSubmit || submitting}
                style={{
                  ...styles.primaryButton,
                  ...(!canSubmit || submitting ? styles.disabledButton : {}),
                }}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>

          <div style={styles.rightColumn}>
            <SectionCard
              title="Submission Readiness"
              subtitle="Everything the file must prove"
            >
              <div style={styles.stack}>
                {checklist.map((item) => (
                  <ChecklistRow
                    key={item.label}
                    label={item.label}
                    complete={item.complete}
                  />
                ))}
              </div>
            </SectionCard>

            <SectionCard
              title="Current Status"
              subtitle="Live workflow state"
            >
              <div style={styles.stack}>
                <InfoRow label="Current Status" value={currentStatus} />
                <InfoRow
                  label="Next Step"
                  value={
                    canSubmit
                      ? "Ready to submit into queue"
                      : readyForReview
                      ? "Ready for controller review"
                      : "Complete required intake fields"
                  }
                />
                <InfoRow
                  label="Submission Eligibility"
                  value={canSubmit ? "Allowed" : "Blocked"}
                  emphasize={canSubmit ? "success" : "danger"}
                />
              </div>
            </SectionCard>

            <SectionCard title="Block Reasons" subtitle="Why submission is held">
              <div style={styles.stack}>
                {canSubmit ? (
                  <div style={{ ...styles.noticeBox, ...styles.noticeSuccess }}>
                    File meets submission requirements.
                  </div>
                ) : (
                  blockReasons.map((reason) => (
                    <div
                      key={reason}
                      style={{ ...styles.noticeBox, ...styles.noticeError }}
                    >
                      {reason}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard title="Access Control" subtitle="Role restrictions">
              <div style={styles.stack}>
                <div style={styles.softCard}>
                  Sales can create and save intake files.
                </div>
                <div style={styles.softCard}>
                  Sales cannot pull credit.
                </div>
                <div style={styles.softCard}>
                  Identity must be verified before submission.
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  )
}

function buildPayload(form: FormState) {
  return {
    firstName: form.firstName || null,
    lastName: form.lastName || null,
    phone: form.phone || null,
    email: form.email || null,

    identityType: form.identityType || null,
    identityValue: form.identityValue || null,
    issuingCountry: form.issuingCountry || null,
    identityStatus: form.identityStatus || "PENDING",

    stockNumber: form.stockNumber || null,
    vin: form.vin || null,
    vehicleYear: toNumberOrNull(form.vehicleYear),
    vehicleMake: form.vehicleMake || null,
    vehicleModel: form.vehicleModel || null,
    vehiclePrice: toNumberOrNull(form.vehiclePrice),

    downPayment: toNumberOrNull(form.downPayment),
    tradeIn: toNumberOrNull(form.tradeIn),
    amountFinanced: toNumberOrNull(form.amountFinanced),

    creditScore: toNumberOrNull(form.creditScore),
    monthlyIncome: toNumberOrNull(form.monthlyIncome),
  }
}

function SectionCard({
  title,
  subtitle,
  children,
  highlight = false,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  highlight?: boolean
}) {
  return (
    <section
      style={{
        ...styles.sectionCard,
        ...(highlight ? styles.highlightCard : {}),
      }}
    >
      <div style={styles.sectionHeader}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {subtitle ? <p style={styles.sectionSubtitle}>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  )
}

function Field({
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

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <label style={styles.labelWrap}>
      <div style={styles.fieldLabel}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      >
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function ChecklistRow({
  label,
  complete,
}: {
  label: string
  complete: boolean
}) {
  return (
    <div style={styles.checkRow}>
      <span style={styles.checkRowLabel}>{label}</span>
      <span
        style={{
          ...styles.checkBadge,
          ...(complete ? styles.completeBadge : styles.missingBadge),
        }}
      >
        {complete ? "Complete" : "Missing"}
      </span>
    </div>
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
    maxWidth: "1280px",
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
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 0.8fr)",
    gap: "24px",
    alignItems: "start",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "sticky",
    top: "24px",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "28px",
    padding: "24px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
  },
  highlightCard: {
    backgroundColor: "#fffaf1",
    borderColor: "#d8c7a1",
  },
  sectionHeader: {
    marginBottom: "20px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.1,
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  sectionSubtitle: {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "14px",
    color: "rgba(17,17,17,0.55)",
  },
  twoColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "16px",
  },
  threeColumnGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
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
    backgroundColor: "#ffffff",
    border: "1px solid rgba(17,17,17,0.08)",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 18px 50px rgba(0,0,0,0.04)",
  },
  secondaryButton: {
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.1)",
    backgroundColor: "#ffffff",
    padding: "14px 24px",
    fontSize: "14px",
    fontWeight: 700,
    color: "rgba(17,17,17,0.75)",
    cursor: "pointer",
  },
  primaryButton: {
    borderRadius: "18px",
    border: "none",
    backgroundColor: "#111111",
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
  stack: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  checkRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#faf7f1",
    padding: "14px 16px",
  },
  checkRowLabel: {
    fontSize: "14px",
    color: "rgba(17,17,17,0.75)",
  },
  checkBadge: {
    borderRadius: "999px",
    padding: "6px 12px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
  },
  completeBadge: {
    backgroundColor: "#dff5e6",
    color: "#1f7a37",
  },
  missingBadge: {
    backgroundColor: "#fde4e4",
    color: "#b42318",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#faf7f1",
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
  softCard: {
    borderRadius: "18px",
    border: "1px solid rgba(17,17,17,0.08)",
    backgroundColor: "#faf7f1",
    padding: "14px 16px",
    fontSize: "14px",
    color: "rgba(17,17,17,0.72)",
  },
}
