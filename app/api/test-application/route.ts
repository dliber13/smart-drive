import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const app = await prisma.application.create({
      data: {
        firstName: "Allowed",
        lastName: "Test",

        identityType: "SSN",
        identityValue: "123456789",
        issuingCountry: "US",
        identityStatus: "VERIFIED",
      },
    })

    // 🔒 LOCK CHECK
    if (!app.identityType || app.identityStatus !== "VERIFIED") {
      return NextResponse.json({
        error: "APPLICATION BLOCKED",
        reason: "Identity verification required before submission",
      })
    }

    return NextResponse.json({
      success: true,
      message: "Application allowed",
      app,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
