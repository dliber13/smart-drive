import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const groups = await prisma.dealerGroup.findMany({
    include: { Dealer: true },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ groups });
}

export async function POST(req: NextRequest) {
  const { name, groupNumber, contactName, contactEmail, contactPhone } = await req.json();
  const group = await prisma.dealerGroup.create({
    data: { name, groupNumber, contactName, contactEmail, contactPhone }
  });
  return NextResponse.json({ group });
}
