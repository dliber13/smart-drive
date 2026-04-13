import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      message: "Login is not configured for the current database schema.",
    },
    { status: 501 }
  );
}
 
