import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

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
    data: {
      id: randomUUID(),
      name: name as string,
      code: code as string,
      dealerNumber: dealerNumber || undefined,
      phone: phone || undefined,
      address: address || undefined,
      city: city || undefined,
      state: state || undefined,
      zip: zip || undefined,
      groupId: groupId || undefined,
      authorityLevel: "STANDARD",
      updatedAt: new Date(),
    }
  });
  return NextResponse.json({ dealer });
}
