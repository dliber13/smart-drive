import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req);
    const rl = rateLimit(`request-access:${ip}`, 3, 60 * 60 * 1000);
    if (!rl.allowed) return rateLimitResponse(rl.resetAt);

    const body = await req.json();
    const { firstName, lastName, dealerName, email, phone, city, state, monthlyUnits, message } = body;

    if (!firstName || !lastName || !dealerName || !email) {
      return NextResponse.json({ error: "First name, last name, dealership, and email are required." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    await prisma.dealerRequest.create({
      data: {
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        dealerName: String(dealerName).trim(),
        email: String(email).toLowerCase().trim(),
        phone: phone ? String(phone).trim() : null,
        city: city ? String(city).trim() : null,
        state: state ? String(state).trim() : null,
        monthlyUnits: monthlyUnits ? String(monthlyUnits).trim() : null,
        message: message ? String(message).trim() : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("REQUEST ACCESS ERROR:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
