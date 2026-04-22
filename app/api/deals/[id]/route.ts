import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

function canAccessDeal(role: string | null | undefined) {
  const normalized = String(role ?? "").toUpperCase()
  return (
    normalized === "ADMIN" ||
    normalized === "CONTROLLER" ||
    normalized === "SALES"
  )
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (!canAccessDeal(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized to access this deal",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const { id } = await context.params

    const application = await prisma.application.findUnique({
      where: { id },
    })

    if (!application) {
      return NextResponse.json(
        {
          success: false,
          reason: "Application not found",
          id,
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      application,
      currentUserRole,
    })
  } catch (error) {
    console.error("DEAL DETAILS ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to load deal",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
