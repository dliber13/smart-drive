import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET SINGLE DEAL
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const application = await prisma.application.findUnique({
      where: { id: params.id },
    })

    if (!application) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 })
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error("GET DEAL ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    )
  }
}

// UPDATE DEAL (THIS IS THE IMPORTANT PART)
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const updated = await prisma.application.update({
      where: { id: params.id },
      data: {
        // status update (Approve / Decline / Stips)
        status: body.status ?? undefined,

        // ✅ UNDERWRITING FIELDS (NOW SAVED)
        tier: body.tier ?? undefined,
        lender: body.lender ?? undefined,
        maxPayment: body.maxPayment ?? undefined,
        maxVehicle: body.maxVehicle ?? undefined,
        decisionReason: body.decisionReason ?? undefined,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("UPDATE DEAL ERROR:", error)
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    )
  }
}
