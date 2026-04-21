import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      firstName,
      lastName,
      phone,
      email,
      acceptedTerms
    } = body

    // 🚨 HARD BLOCK: Terms must be accepted
    if (!acceptedTerms) {
      return NextResponse.json(
        {
          success: false,
          reason: "You must accept Terms of Service and Privacy Policy before submitting."
        },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        firstName,
        lastName,
        phone,
        email,
        status: "SUBMITTED",
        acceptedTerms: true
      }
    })

    return NextResponse.json({
      success: true,
      application
    })

  } catch (error) {
    console.error("Submission error:", error)

    return NextResponse.json(
      {
        success: false,
        reason: "Failed to submit application"
      },
      { status: 500 }
    )
  }
}
