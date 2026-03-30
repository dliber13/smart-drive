import { NextRequest, NextResponse } from "next/server";

export function requireJobSecret(request: NextRequest) {
  const secret = request.headers.get("x-job-secret");
  if (!process.env.JOB_SECRET || secret !== process.env.JOB_SECRET) {
    return NextResponse.json({ error: "Unauthorized job request" }, { status: 401 });
  }
  return null;
}
