import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getCurrentUserRole } from "@/lib/access"

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const currentUserRole = getCurrentUserRole(request)

    if (currentUserRole !== "ADMIN" && currentUserRole !== "CONTROLLER") {
      return NextResponse.json(
        {
          success: false,
          reason: "Only ADMIN or CONTROLLER can access the controller dashboard",
          currentUserRole,
        },
        { status: 403 }
      )
    }

    const applications = await prisma.application.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
      currentUserRole,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load controller dashboard",
      },
      { status: 500 }
    )
  }
}
