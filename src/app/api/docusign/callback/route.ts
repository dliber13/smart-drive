import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/dealer?docusign=error", req.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL("/dealer?docusign=error", req.url));
    }

    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY!;
    const secretKey = process.env.DOCUSIGN_SECRET_KEY!;
    const baseUrl = process.env.DOCUSIGN_BASE_URL!;
    const redirectUri = "https://smartdriveelite.com/api/docusign/callback";

    const credentials = Buffer.from(`${integrationKey}:${secretKey}`).toString("base64");

    const tokenRes = await fetch(`${baseUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) {
      console.error("DocuSign token error:", await tokenRes.text());
      return NextResponse.redirect(new URL("/dealer?docusign=error", req.url));
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in || 3600;

    const res = NextResponse.redirect(new URL("/dealer?docusign=connected", req.url));
    res.cookies.set("ds_access_token", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: expiresIn,
      path: "/",
    });

    return res;
  } catch (error: any) {
    console.error("DocuSign callback error:", error);
    return NextResponse.redirect(new URL("/dealer?docusign=error", req.url));
  }
}
