import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const app = await prisma.application.create({
      data: {
        firstName: "Test",
        lastName: "User",
        identityType: "SSN",
        identityValue: "123456789",
        issuingCountry: "US",
        identityStatus: "PENDING",
      },
    })

    return NextResponse.json(app)
  } catch (error: any) {
    console.error("TEST APPLICATION ERROR:", error)

    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Unknown error",
        code: error?.code || null,
        meta: error?.meta || null,
      },
      { status: 500 }
    )
  }
}
