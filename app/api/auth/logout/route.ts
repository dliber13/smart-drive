import { NextRequest, NextResponse } from "next/server"

export async function POST(_req: NextRequest) {
  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: "sdf_session",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
  return response
}
