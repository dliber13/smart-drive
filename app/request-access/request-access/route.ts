import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      email,
      phone,
      dealerName,
      city,
      state,
      monthlyUnits,
      message,
    } = body;

    if (!firstName || !lastName || !email || !dealerName) {
      return NextResponse.json(
        { error: "First name, last name, email, and dealership name are required." },
        { status: 400 }
      );
    }

    const request = await prisma.dealerRequest.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        dealerName,
        city: city || null,
        state: state || null,
        monthlyUnits: monthlyUnits || null,
        message: message || null,
      },
    });

    return NextResponse.json({ success: true, id: request.id }, { status: 201 });

  } catch (error) {
    console.error("Request access error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}