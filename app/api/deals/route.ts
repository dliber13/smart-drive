import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getRequestUser, unauthorizedResponse } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req)
  if (!user) return unauthorizedResponse()

  try {
    const where =
      user.role === "ADMIN"
        ? {}
        : { teamId: user.teamId ?? "__no_team__" }

    const applications = await prisma.application.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error("GET DEALS ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const user = await getRequestUser(req)
  if (!user) return unauthorizedResponse()

  try {
    const body = await req.json()

    const application = await prisma.application.create({
      data: {
        ownerId: user.id,
        teamId: user.teamId,

        firstName: body.firstName ?? null,
        lastName: body.lastName ?? null,
        email: body.email ?? null,
        phone: body.phone ?? null,

        stockNumber: body.stockNumber ?? null,
        vin: body.vin ?? null,
        vehicleYear: body.vehicleYear ?? null,
        vehicleMake: body.vehicleMake ?? null,
        vehicleModel: body.vehicleModel ?? null,
        vehiclePrice: body.vehiclePrice ?? null,

        downPayment: body.downPayment ?? null,
        tradeIn: body.tradeIn ?? null,
        amountFinanced: body.amountFinanced ?? null,

        creditScore: body.creditScore ?? null,
        monthlyIncome: body.monthlyIncome ?? null,

        status: "PENDING",
      },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error("CREATE DEAL ERROR:", error)
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    )
  }
}
