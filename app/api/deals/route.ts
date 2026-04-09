import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET ALL DEALS
export async function GET() {
  try {
    const applications = await prisma.application.findMany({
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

// CREATE DEAL
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const application = await prisma.application.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,

        vehicleYear: body.vehicleYear,
        vehicleMake: body.vehicleMake,
        vehicleModel: body.vehicleModel,
        vehiclePrice: body.vehiclePrice,
        downPayment: body.downPayment,
        tradeIn: body.tradeIn,
        amountFinanced: body.amountFinanced,

        creditScore: body.creditScore,
        monthlyIncome: body.monthlyIncome,

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
