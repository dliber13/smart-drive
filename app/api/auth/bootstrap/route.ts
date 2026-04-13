import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  return NextResponse.json({
    success: true,
    bootstrapped: false, 
    message: "Auth bootstrap is not configured in the current database schema.",
  });
}
