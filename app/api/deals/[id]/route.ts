import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  forbiddenResponse,
  getRequestUser,
  unauthorizedResponse,
} from "@/lib/auth"

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

async function getAuthorizedApplication(req: NextRequest, id: string) {
  const user = await getRequestUser(req)
  if (!user) return { error: unauthorizedResponse(), user: null, application: null }

  const application = await prisma.application.findUnique({
    where: { id },
  })

  if (!application) {
    return {
      error: NextResponse.json({ error: "Deal not found" }, { status: 404 }),
      user,
      application: null,
    }
  }

  if (user.role !== "ADMIN" && application.teamId !== user.teamId) {
    return { error: forbiddenResponse(), user, application: null }
  }

  return { error: null, user, application }
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const result = await getAuthorizedApplication(req, id)
    if (result.error) return result.error
    return NextResponse.json(result.application)
  } catch (error) {
    console.error("GET DEAL ERROR:", error)
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
    const result = await getAuthorizedApplication(req, id)
    if (result.error) return result.error

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
        dealStrength: body.dealStrength ?? undefined,
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
