import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!;
    const baseUrl = process.env.DOCUSIGN_BASE_URL!;
    const redirectUri = "https://smartdriveelite.com/api/docusign/callback";
    const scopes = "signature impersonation";

    const authUrl = `${baseUrl}/oauth/auth?response_type=code&scope=${encodeURIComponent(scopes)}&client_id=${integrationKey}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return NextResponse.json({ authUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
