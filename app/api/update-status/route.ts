import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { id, status } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, message: "Missing fields" })
    }

    const updated = await prisma.application.update({
      where: { id },
      data: { status }
    })

    return NextResponse.json({
      success: true,
      message: "Status updated",
      app: updated
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Update failed",
      error: err
    })
  }
}
