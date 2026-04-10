import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const userCount = await prisma.user.count()
  const applicationCount = await prisma.application.count()

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
    </div>
  )
}
