import prisma from "@/lib/prisma"

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
  if (value === null || value === undefined) return "-"
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
    year: "numeric",
  }).format(value)
}

function buildVehicleLabel(app: RecentApplication) {
  const parts = [app.vehicleYear, app.vehicleMake, app.vehicleModel].filter(Boolean)
  return parts.length ? parts.join(" ") : "-"
}

export default async function DashboardPage() {
  let totalApplications = 0
  let pending = 0
  let approved = 0
  let declined = 0
  let funded = 0
  let recentApplications: RecentApplication[] = []

  try {
    totalApplications = await prisma.application.count()
    pending = await prisma.application.count({ where: { status: "PENDING" } })
    approved = await prisma.application.count({ where: { status: "APPROVED" } })
    declined = await prisma.application.count({ where: { status: "DECLINED" } })
    funded = await prisma.application.count({ where: { status: "FUNDED" } })

    recentApplications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
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
  } catch (error) {
    console.error("DASHBOARD PAGE ERROR:", error)
  }

  return (
    <main className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-bold">Dashboard</h1>
        <p className="mb-8 text-sm text-gray-600">
          Underwriting overview and recent deal activity
        </p>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Deals</p>
            <p className="mt-2 text-3xl font-bold">{totalApplications}</p>
          </div>

          <div className="rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="mt-2 text-3xl font-bold">{pending}</p>
          </div>

          <div className="rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Approved</p>
            <p className="mt-2 text-3xl font-bold">{approved}</p>
          </div>

          <div className="rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Declined</p>
            <p className="mt-2 text-3xl font-bold">{declined}</p>
          </div>

          <div className="rounded-2xl border p-5 shadow-sm">
            <p className="text-sm text-gray-500">Funded</p>
            <p className="mt-2 text-3xl font-bold">{funded}</p>
          </div>
        </div>

        <div className="rounded-2xl border shadow-sm">
          <div className="border-b px-5 py-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 font-medium text-gray-600">Applicant</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Income</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Credit Score</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Vehicle</th>
                  <th className="px-5 py-3 font-medium text-gray-600">Created</th>
                </tr>
              </thead>

              <tbody>
                {recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-6 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  recentApplications.map((app) => (
                    <tr key={app.id} className="border-t">
                      <td className="px-5 py-4">
                        {(app.firstName || "") + " " + (app.lastName || "")}
                      </td>
                      <td className="px-5 py-4">{app.status}</td>
                      <td className="px-5 py-4">{formatCurrency(app.monthlyIncome)}</td>
                      <td className="px-5 py-4">{app.creditScore ?? "-"}</td>
                      <td className="px-5 py-4">{buildVehicleLabel(app)}</td>
                      <td className="px-5 py-4">{formatDate(app.createdAt)}</td>
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
