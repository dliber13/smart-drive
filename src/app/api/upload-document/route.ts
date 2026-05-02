import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySession } from "@/lib/session";
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 20 uploads per IP per hour
    const ip = getIP(req);
    const rl = rateLimit(`upload:${ip}`, 20, 60 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;

    if (!file || !documentType) {
      return NextResponse.json({ error: "File and documentType required" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/heic", "image/heif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. PDF, JPG, PNG, or HEIC only." }, { status: 400 });
    }

    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 20MB." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() || "bin";
    const safeName = `stips/${user.id}/${documentType}/${Date.now()}.${ext}`;
    const blob = await put(safeName, file, {
      access: "private",
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      fileKey: blob.url,
      documentType,
      pathname: blob.pathname,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  }
}
