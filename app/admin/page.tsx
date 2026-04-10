import { PrismaClient } from "@prisma/client"
import { calculateDealStrength } from "@/lib/dealStrength"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const userCount = await prisma.user.count()
  const applicationCount = await prisma.application.count()

  const applications = await prisma.application.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
  })

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>System Overview</h2>
        <p>Total Users: {userCount}</p>
        <p>Total Applications: {applicationCount}</p>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Quick Actions</h2>
        <ul>
          <li>View Underwriting Queue</li>
          <li>Manage Users</li>
          <li>Review Deals</li>
        </ul>
      </div>

      <div style={{ marginTop: "40px" }}>
        <h2>Recent Deals</h2>

        {applications.length === 0 ? (
          <p>No deals yet.</p>
        ) : (
          applications.map((app) => {
            const result = calculateDealStrength(app)

            return (
              <div key={app.id} style={{ marginBottom: "16px" }}>
                <p>
                  <strong>Deal ID:</strong> {app.id}
                </p>
                <p>
                  <strong>Score:</strong> {result.score} ({result.tier})
                </p>
                <p>
                  <strong>Credit Score:</strong> {app.creditScore ?? "N/A"}
                </p>
                <p>
                  <strong>Monthly Income:</strong> {app.monthlyIncome ?? "N/A"}
                </p>
                <hr style={{ marginTop: "12px", opacity: 0.2 }} />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
