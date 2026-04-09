import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { forbiddenResponse, getRequestUser, unauthorizedResponse } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req)
  if (!user) return unauthorizedResponse()
  if (user.role !== "ADMIN") return forbiddenResponse()

  const teams = await prisma.team.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          users: true,
          applications: true,
        },
      },
    },
  })

  return NextResponse.json(teams)
}

export async function POST(req: NextRequest) {
  const user = await getRequestUser(req)
  if (!user) return unauthorizedResponse()
  if (user.role !== "ADMIN") return forbiddenResponse()

  try {
    const body = await req.json()
    const name = String(body.name || "").trim()

    if (!name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    const team = await prisma.team.create({
      data: { name },
    })

    return NextResponse.json(team)
  } catch (error) {
    console.error("CREATE TEAM ERROR:", error)
    return NextResponse.json({ error: "Failed to create team" }, { status: 500 })
  }
}
