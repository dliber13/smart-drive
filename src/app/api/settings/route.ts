import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const settings = await prisma.platformSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach(s => map[s.key] = s.value);
    return NextResponse.json({ success: true, settings: map });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user || !["SUPER_ADMIN", "EXECUTIVE"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { key, value } = await req.json();
    if (!key || value === undefined) {
      return NextResponse.json({ error: "key and value required" }, { status: 400 });
    }

    const setting = await prisma.platformSetting.upsert({
      where: { key },
      update: { value: String(value), updatedBy: user.email },
      create: { key, value: String(value), updatedBy: user.email },
    });

    return NextResponse.json({ success: true, setting });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
