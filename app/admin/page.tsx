import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const userCount = await prisma.user.count()
  const applicationCount = await prisma.application.count()
  const applications = await prisma.application.findMany({
    take: 10,
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
        <h2>Applications Debug View</h2>

        {applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          applications.map((app: any) => (
            <div key={app.id} style={{ marginBottom: "16px" }}>
              <p><strong>ID:</strong> {app.id}</p>
              <p><strong>Credit Score:</strong> {String(app.creditScore ?? "N/A")}</p>
              <p><strong>Monthly Income:</strong> {String(app.monthlyIncome ?? "N/A")}</p>
              <p><strong>LTV:</strong> {String(app.ltv ?? "N/A")}</p>
              <p><strong>Employment Months:</strong> {String(app.employmentMonths ?? "N/A")}</p>
              <hr style={{ marginTop: "12px", opacity: 0.2 }} />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
