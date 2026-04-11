import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { canMoveToReady, getNextStatus } from "@/lib/status"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const app = await prisma.application.create({
      data: {
        firstName: "Status",
        lastName: "Test",
        identityType: "SSN",
        identityValue: "999999999",
        issuingCountry: "US",
        identityStatus: "VERIFIED",
        status: "DRAFT",
      },
    })

    let nextStatus = app.status

    if (app.status === "DRAFT" && canMoveToReady(app)) {
      nextStatus = "READY"
    } else {
      nextStatus = getNextStatus(app.status)
    }

    const updated = await prisma.application.update({
      where: { id: app.id },
      data: {
        status: nextStatus,
      },
    })

    return NextResponse.json({
      success: true,
      originalStatus: app.status,
      newStatus: updated.status,
      applicationId: app.id,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Unknown error",
      },
      { status: 500 }
    )
  }
}
