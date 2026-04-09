import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    const application = await prisma.application.findUnique({
      where: { id },
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

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const updated = await prisma.application.update({
      where: { id },
      data: {
        status: body.status ?? undefined,
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
