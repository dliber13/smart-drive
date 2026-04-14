import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          user: null,
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        team: null,
      },
    });
  } catch (error: any) {
    console.error("Auth me route error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to load current user",
      },
      { status: 500 }
    );
  }
}
