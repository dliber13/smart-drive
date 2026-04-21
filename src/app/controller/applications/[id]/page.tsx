"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"

type Application = {
  id: string
  createdAt: string
  firstName?: string | null
  lastName?: string | null
  phone?: string | null
  email?: string | null

  identityType?: string | null
  identityValue?: string | null
  issuingCountry?: string | null
  identityStatus?: string | null

  stockNumber?: string | null
  vin?: string | null
  vehicleYear?: number | null
  vehicleMake?: string | null
  vehicleModel?: string | null
  vehiclePrice?: number | null

  downPayment?: number | null
  tradeIn?: number | null
  amountFinanced?: number | null

  creditScore?: number | null
  monthlyIncome?: number | null

  status?: string | null
  lender?: string | null
  tier?: string | null
  maxPayment?: number | null
  maxVehicle?: number | null
  dealStrength?: number | null
  decisionReason?: string | null
}

export default function ControllerApplicationDecisionPage() {
  const params = useParams()
  const router = useRouter()
  const applicationId = params.id as string

  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const [runningDecision, setRunningDecision] = useState(false)
  const [error, setError] = useState("")

  async function loadApplication() {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(`/api/applications/${applicationId}`)
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.reason || "Failed to load application")
      }

      setApplication(data.application)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load application")
    } finally {
      setLoading(false)
    }
  }

  async function runDecisionEngine() {
    try {
      setRunningDecision(true)
      setError("")

      const response = await fetch(`/api/applications/${applicationId}/decision`, {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.reason || "Failed to run decision engine")
      }

      setApplication(data.application)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run decision engine")
    } finally {
      setRunningDecision(false)
    }
  }

  useEffect(() => {
    if (applicationId) {
      loadApplication()
    }
  }, [applicationId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow">
          <p className="text-lg font-semibold">Loading application...</p>
        </div>
      </div>
    )
  }

  if (error && !application) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-6xl rounded-2xl bg-white p-6 shadow">
          <p className="text-lg font-semibold text-red-600">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-xl bg-black px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Decision Engine</h1>
              <p className="mt-2 text-sm text-slate-600">
                Application ID: {application?.id}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={loadApplication}
                className="rounded-xl border border-slate-300 px-4 py-2 font-medium"
              >
                Refresh
              </button>

              <button
                onClick={runDecisionEngine}
                disabled={runningDecision}
                className="rounded-xl bg-black px-4 py-2 font-medium text-white disabled:opacity-50"
              >
                {runningDecision ? "Running..." : "Run Decision Engine"}
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Applicant</h2>
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold">Name:</span> {application?.firstName || "-"} {application?.lastName || ""}</p>
              <p><span className="font-semibold">Phone:</span> {application?.phone || "-"}</p>
              <p><span className="font-semibold">Email:</span> {application?.email || "-"}</p>
              <p><span className="font-semibold">Credit Score:</span> {application?.creditScore ?? "-"}</p>
              <p><span className="font-semibold">Monthly Income:</span> ${application?.monthlyIncome ?? 0}</p>
              <p><span className="font-semibold">Identity Type:</span> {application?.identityType || "-"}</p>
              <p><span className="font-semibold">Identity Status:</span> {application?.identityStatus || "-"}</p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Vehicle / Structure</h2>
            <div className="space-y-3 text-sm">
              <p><span className="font-semibold">Vehicle:</span> {application?.vehicleYear || "-"} {application?.vehicleMake || "-"} {application?.vehicleModel || "-"}</p>
              <p><span className="font-semibold">Stock #:</span> {application?.stockNumber || "-"}</p>
              <p><span className="font-semibold">VIN:</span> {application?.vin || "-"}</p>
              <p><span className="font-semibold">Vehicle Price:</span> ${application?.vehiclePrice ?? 0}</p>
              <p><span className="font-semibold">Down Payment:</span> ${application?.downPayment ?? 0}</p>
              <p><span className="font-semibold">Trade In:</span> ${application?.tradeIn ?? 0}</p>
              <p><span className="font-semibold">Amount Financed:</span> ${application?.amountFinanced ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold">Decision Output</h2>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Status</p>
              <p className="mt-2 text-2xl font-bold">{application?.status || "-"}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Tier</p>
              <p className="mt-2 text-2xl font-bold">{application?.tier || "-"}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Deal Strength</p>
              <p className="mt-2 text-2xl font-bold">{application?.dealStrength ?? "-"}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Recommended Lender</p>
              <p className="mt-2 text-xl font-bold">{application?.lender || "-"}</p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Max Payment</p>
              <p className="mt-2 text-2xl font-bold">
                ${application?.maxPayment ?? 0}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Max Vehicle</p>
              <p className="mt-2 text-2xl font-bold">
                ${application?.maxVehicle ?? 0}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Decision Reason</p>
            <p className="mt-2 text-base font-medium">
              {application?.decisionReason || "No decision has been run yet."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
