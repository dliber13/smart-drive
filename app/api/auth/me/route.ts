import { NextRequest, NextResponse } from "next/server"
import { getRequestUser } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const user = await getRequestUser(req)

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      teamId: user.teamId,
      teamName: user.team?.name ?? null,
    },
  })
}
