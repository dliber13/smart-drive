import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = req.cookies.get("sde_session")?.value;
    if (!session) return NextResponse.json({ user: null }, { status: 401 });
    const user = JSON.parse(session);
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
