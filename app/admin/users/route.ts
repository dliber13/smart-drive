import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    users: [],
    message: "User management is not configured in the current database schema.",
  });
}
