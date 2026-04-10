import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json()

    // Check if ANY user already exists
    const existingUser = await prisma.user.findFirst()

    if (existingUser) {
      return NextResponse.json(
        { error: "Bootstrap is no longer available" },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: "ADMIN",
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to bootstrap admin user" },
      { status: 500 }
    )
  }
}
