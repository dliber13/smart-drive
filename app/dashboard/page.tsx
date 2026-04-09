import prisma from "@/lib/prisma"
import Link from "next/link"
import { requireUser } from "@/lib/auth"

type RecentApplication = {
  id: string
  firstName: string | null
  lastName: string | null
  stockNumber: string | null
  vin: string | null
  status: string
  monthlyIncome: number | null
  creditScore: number | null
  vehicleYear: number | null
  vehicleMake: string | null
  vehicleModel: string | null
  createdAt: Date
}

function formatCurrency(value: number | null) {
  if (!value) return "-"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(value)
}

function buildVehicleLabel(app: RecentApplication) {
  const parts = [app.vehicleYear, app.vehicleMake, app.vehicleModel].filter(Boolean)
  return parts.length ? parts.join(" ") : "-"
}

function statusStyle(status: string) {
  switch (status) {
    case "APPROVED":
      return "bg-[#eef6f2] text-[#2f6f55]"
    case "DECLINED":
    case "DENIED":
      return "bg-[#f8ece8] text-[#8a4a3d]"
    case "FUNDED":
      return "bg-[#edf2f8] text-[#415a77]"
    case "DOCS_NEEDED":
      return "bg-[#f8f2e8] text-[#8a6a3d]"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default async function DashboardPage() {
  const user = await requireUser()

  const scope =
    user.role === "ADMIN"
      ? {}
      : { teamId: user.teamId ?? "__no_team__" }

  let total = 0
  let pending = 0
  let approved = 0
  let funded = 0
  let declined = 0
  let recent: RecentApplication[] = []

  try {
    total = await prisma.application.count({ where: scope })
    pending = await prisma.application.count({ where: { ...scope, status: "PENDING" } })
    approved = await prisma.application.count({ where: { ...scope, status: "APPROVED" } })
    funded = await prisma.application.count({ where: { ...scope, status: "FUNDED" } })
    declined = await prisma.application.count({
      where: {
        ...scope,
        OR: [{ status: "DECLINED" }, { status: "DENIED" }],
      },
    })

    recent = await prisma.application.findMany({
      where: scope,
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        stockNumber: true,
        vin: true,
        status: true,
        monthlyIncome: true,
        creditScore: true,
        vehicleYear: true,
        vehicleMake: true,
        vehicleModel: true,
        createdAt: true,
      },
    })
  } catch (e) {
    console.error("DASHBOARD PAGE ERROR:", e)
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              SmartDrive Financial
            </h1>
            <p className="text-sm text-gray-500">
              Underwriting Dashboard · {user.role} · {user.team?.name || "All Teams"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user.role === "ADMIN" && (
              <Link
                href="/admin"
                className="rounded-full border border-black/10 bg-white px-5 py-2 text-sm text-black/70"
              >
                Admin
              </Link>
            )}
            <Link
              href="/dealer"
              className="rounded-full bg-black px-5 py-2 text-sm text-white"
            >
              New Deal
            </Link>
          </div>
        </div>

        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <Kpi label="Total Deals" value={total} />
          <Kpi label="Pending" value={pending} />
          <Kpi label="Approved" value={approved} valueClass="text-[#2f6f55]" />
          <Kpi label="Funded" value={funded} valueClass="text-[#415a77]" />
          <Kpi label="Declined" value={declined} valueClass="text-[#8a4a3d]" />
        </div>

        <div className="rounded-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recent Deals</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Applicant</th>
                  <th className="px-6 py-3 text-left">Stock #</th>
                  <th className="px-6 py-3 text-left">VIN</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Income</th>
                  <th className="px-6 py-3 text-left">Score</th>
                  <th className="px-6 py-3 text-left">Vehicle</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {recent.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                      No deals yet
                    </td>
                  </tr>
                ) : (
                  recent.map((app) => (
                    <tr key={app.id} className="border-t">
                      <td className="px-6 py-4">
                        {(app.firstName || "") + " " + (app.lastName || "")}
                      </td>

                      <td className="px-6 py-4">{app.stockNumber || "-"}</td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-xs">
                          {app.vin || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(app.status)}`}>
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {formatCurrency(app.monthlyIncome)}
                      </td>

                      <td className="px-6 py-4">
                        {app.creditScore ?? "-"}
                      </td>

                      <td className="px-6 py-4">
                        {buildVehicleLabel(app)}
                      </td>

                      <td className="px-6 py-4">
                        {formatDate(app.createdAt)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/underwriting?id=${app.id}`}
                          className="rounded-lg border px-3 py-1 text-xs hover:bg-gray-50"
                        >
                          Open UW
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

function Kpi({
  label,
  value,
  valueClass = "",
}: {
  label: string
  value: number
  valueClass?: string
}) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${valueClass}`}>{value}</p>
    </div>
  )
}
