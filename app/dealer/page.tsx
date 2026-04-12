"use client"

import { useMemo, useState } from "react"

type IdentityType = "SSN" | "ITIN" | "PASSPORT" | "MATRICULA" | "OTHER" | ""
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
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "SALES",
        },
        body: JSON.stringify({
          ...buildPayload(form),
          identityStatus: form.identityStatus || "PENDING",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessageType("error")
        setMessage(data?.reason || data?.message || "Draft save failed")
        return
      }

      setMessageType("success")
      setMessage("Draft saved successfully")
    } catch (error) {
      console.error(error)
      setMessageType("error")
      setMessage("Draft save failed")
    } finally {
      setSaving(false)
    }
  }

  async function submitApplication() {
    setSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/submit-application", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-role": "SALES",
        },
        body: JSON.stringify({
          ...buildPayload(form),
          identityStatus: "VERIFIED",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessageType("error")
        setMessage(
          data?.reason ||
            data?.message ||
            "Application blocked. Review submission requirements."
        )
        return
      }

      setMessageType("success")
      setMessage("Application submitted successfully")
      setForm(initialForm)
    } catch (error) {
      console.error(error)
      setMessageType("error")
      setMessage("Application submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-6 py-8 text-[#111111]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[12px] uppercase tracking-[0.28em] text-black/40">
              Smart Drive Elite
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">
              Deal Intake
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-7 text-black/60">
              Create a structured application for controller review and
              underwriting. Identity must be complete and verified before a file
              can be submitted.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StatusPill label={currentStatus} />
            <RoleBadge label="SALES" />
          </div>
        </div>

        {message ? (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm ${
              messageType === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : messageType === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-black/10 bg-white text-black/70"
            }`}
          >
            {message}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <SectionCard
              title="Applicant Information"
              subtitle="Core borrower details"
            >
              <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 md:grid-cols-2">
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
              <div className="grid gap-4 md:grid-cols-3">
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
              <div className="grid gap-4 md:grid-cols-2">
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

            <div className="flex flex-col gap-3 rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.04)] md:flex-row">
              <button
                type="button"
                onClick={saveDraft}
                disabled={saving}
                className="rounded-[18px] border border-black/10 bg-white px-6 py-4 text-sm font-semibold text-black/75 transition hover:bg-black/5 disabled:opacity-60"
              >
                {saving ? "Saving Draft..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={submitApplication}
                disabled={!canSubmit || submitting}
                className="rounded-[18px] bg-[#111111] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <SectionCard
              title="Submission Readiness"
              subtitle="Everything the file must prove"
            >
              <div className="space-y-3">
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
              <div className="space-y-4">
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
              <div className="space-y-2">
                {canSubmit ? (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    File meets submission requirements.
                  </div>
                ) : (
                  blockReasons.map((reason) => (
                    <div
                      key={reason}
                      className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {reason}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard title="Access Control" subtitle="Role restrictions">
              <div className="space-y-3 text-sm text-black/70">
                <div className="rounded-2xl border border-black/8 bg-[#faf7f1] px-4 py-3">
                  Sales can create and save intake files.
                </div>
                <div className="rounded-2xl border border-black/8 bg-[#faf7f1] px-4 py-3">
                  Sales cannot pull credit.
                </div>
                <div className="rounded-2xl border border-black/8 bg-[#faf7f1] px-4 py-3">
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
      className={`rounded-[28px] border p-6 shadow-[0_18px_50px_rgba(0,0,0,0.04)] ${
        highlight
          ? "border-[#d8c7a1] bg-[#fffaf1]"
          : "border-black/8 bg-white"
      }`}
    >
      <div className="mb-5">
        <h2 className="text-xl font-semibold tracking-[-0.02em]">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-black/55">{subtitle}</p>
        ) : null}
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
    <label className="block">
      <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-black/40">
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
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
    <label className="block">
      <div className="mb-2 text-[11px] uppercase tracking-[0.22em] text-black/40">
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/25"
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
    <div className="flex items-center justify-between rounded-2xl border border-black/8 bg-[#faf7f1] px-4 py-3 text-sm">
      <span className="text-black/75">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
          complete
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
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
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-black/8 bg-[#faf7f1] px-4 py-3">
      <div className="text-sm text-black/50">{label}</div>
      <div
        className={`text-right text-sm font-semibold ${
          emphasize === "success"
            ? "text-green-700"
            : emphasize === "danger"
            ? "text-red-700"
            : "text-black/80"
        }`}
      >
        {value}
      </div>
    </div>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/70">
      {label}
    </div>
  )
}

function RoleBadge({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
      {label}
    </div>
  )
}
