import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifySession } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // Verify session
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const documentType = formData.get("documentType") as string;
    const applicationId = formData.get("applicationId") as string | null;

    if (!file || !documentType) {
      return NextResponse.json({ error: "File and documentType required" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/heic", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. PDF, JPG, PNG, or HEIC only." }, { status: 400 });
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum 10MB." }, { status: 400 });
    }

    // Build a secure file path
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
