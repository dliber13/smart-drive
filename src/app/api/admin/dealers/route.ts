import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const dealers = await prisma.dealer.findMany({
    include: {
      DealerGroup: true,
      DealerUser: { include: { User: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ dealers });
}

export async function POST(req: NextRequest) {
  const { groupId, name, code, dealerNumber, phone, address, city, state, zip } = await req.json();
  const dealer = await prisma.dealer.create({
    data: { groupId, name, code, dealerNumber, phone, address, city, state, zip, authorityLevel: "STANDARD" }
  });
  return NextResponse.json({ dealer });
}
