import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const application = await prisma.application.create({
      data: {
        // Applicant
        firstName: body.firstName || null,
        lastName: body.lastName || null,
        phone: body.phone || null,
        email: body.email || null,

        // Identity
        identityType: body.identityType || null,
        identityValue: body.identityValue || null,
        issuingCountry: body.issuingCountry || null,
        identityStatus: body.identityStatus || null,

        // Vehicle (🔥 FIXED TYPES)
        stockNumber: body.stockNumber || null,
        vin: body.vin || null,
        vehicleYear: body.vehicleYear ? Number(body.vehicleYear) : null,
        vehicleMake: body.vehicleMake || null,
        vehicleModel: body.vehicleModel || null,
        vehiclePrice: body.vehiclePrice ? Number(body.vehiclePrice) : null,

        // Financials (🔥 FIXED TYPES)
        downPayment: body.downPayment ? Number(body.downPayment) : null,
        tradeIn: body.tradeIn ? Number(body.tradeIn) : null,
        amountFinanced: body.amountFinanced ? Number(body.amountFinanced) : null,
        creditScore: body.creditScore ? Number(body.creditScore) : null,
        monthlyIncome: body.monthlyIncome ? Number(body.monthlyIncome) : null,

        status: "DRAFT",
      },
    })

    return NextResponse.json({
      success: true,
      application,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
