import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

function canAccessDeals(role: string | null | undefined) {
  const normalized = String(role ?? "").toUpperCase()
  return (
    normalized === "ADMIN" ||
    normalized === "CONTROLLER" ||
    normalized === "SALES"
  )
}

export async function GET(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (!canAccessDeals(currentUserRole)) {
      return NextResponse.json(
        {
          success: false,
          reason: "Unauthorized to access deals",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const applications = await prisma.application.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
      currentUserRole,
    })
  } catch (error) {
    console.error("DEALS ROUTE ERROR:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to load deals",
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
