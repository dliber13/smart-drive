import prisma from "@/lib/prisma"
import Link from "next/link"

type RecentApplication = {
  id: string
  firstName: string | null
  lastName: string | null
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
      return "bg-green-100 text-green-700"
    case "DECLINED":
      return "bg-red-100 text-red-700"
    case "FUNDED":
      return "bg-blue-100 text-blue-700"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default async function DashboardPage() {
  let total = 0
  let pending = 0
  let approved = 0
  let funded = 0
  let declined = 0
  let recent: RecentApplication[] = []

  try {
    total = await prisma.application.count()
    pending = await prisma.application.count({ where: { status: "PENDING" } })
    approved = await prisma.application.count({ where: { status: "APPROVED" } })
    funded = await prisma.application.count({ where: { status: "FUNDED" } })
    declined = await prisma.application.count({ where: { status: "DECLINED" } })

    recent = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        firstName: true,
        lastName: true,
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
    console.error(e)
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              SmartDrive Financial
            </h1>
            <p className="text-sm text-gray-500">
              Underwriting Dashboard
            </p>
          </div>

          <Link
            href="/dealer"
            className="rounded-full bg-black px-5 py-2 text-sm text-white hover:opacity-90"
          >
            New Deal
          </Link>
        </div>

        {/* KPI ROW */}
        <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500">Total Deals</p>
            <p className="mt-2 text-3xl font-semibold">{total}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-semibold">{pending}</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500">Approved</p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              {approved}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500">Funded</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {funded}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-xs text-gray-500">Declined</p>
            <p className="mt-2 text-3xl font-semibold text-red-600">
              {declined}
            </p>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="rounded-3xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold">Recent Deals</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">Applicant</th>
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
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                      No deals yet
                    </td>
                  </tr>
                ) : (
                  recent.map((app) => (
                    <tr key={app.id} className="border-t">
                      <td className="px-6 py-4">
                        {(app.firstName || "") + " " + (app.lastName || "")}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
                            app.status
                          )}`}
                        >
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
