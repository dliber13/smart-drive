import { PrismaClient } from "@prisma/client"
import { BRANDING, assertBrandName } from "@/lib/branding"

const prisma = new PrismaClient()

export default async function AdminPage() {
  const userCount = await prisma.user.count()
  const applicationCount = await prisma.application.count()

  const lockedName = assertBrandName(BRANDING.platformName)

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1>{lockedName} – Admin Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <h2>System Overview</h2>
        <p>Total Users: {userCount}</p>
        <p>Total Applications: {applicationCount}</p>
      </div>
    </div>
  )
}
