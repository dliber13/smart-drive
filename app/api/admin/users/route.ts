import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  forbiddenResponse,
  getRequestUser,
  hashPassword,
  unauthorizedResponse,
} from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req)
  if (!user) return unauthorizedResponse()
  if (user.role !== "ADMIN") return forbiddenResponse()

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { team: true },
  })

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      teamId: u.teamId,
      teamName: u.team?.name ?? null,
      createdAt: u.createdAt,
    }))
  )
}

export async function POST(req: NextRequest) {
  const currentUser = await getRequestUser(req)
  if (!currentUser) return unauthorizedResponse()
  if (currentUser.role !== "ADMIN") return forbiddenResponse()

  try {
    const body = await req.json()

    const email = String(body.email || "").trim().toLowerCase()
    const fullName = String(body.fullName || "").trim()
    const password = String(body.password || "")
    const role = body.role === "ADMIN" ? "ADMIN" : "SALES"
    const teamId =
      body.teamId && String(body.teamId).trim() ? String(body.teamId) : null

    if (!email || !fullName || !password) {
      return NextResponse.json(
        { error: "Email, full name, and password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.create({
      data: {
        email,
        fullName,
        passwordHash: hashPassword(password),
        role,
        teamId,
      },
      include: { team: true },
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      teamId: user.teamId,
      teamName: user.team?.name ?? null,
    })
  } catch (error) {
    console.error("CREATE USER ERROR:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
