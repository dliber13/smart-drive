import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function GET() {
  const users = await prisma.user.findMany({
    include: { DealerUser: { include: { Dealer: true } } },
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, role, dealerId } = await req.json();
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      fullName: `${firstName} ${lastName}`,
      passwordHash,
      role,
      isActive: true,
      ...(dealerId ? {
        DealerUser: {
          create: {
            id: randomUUID(),
            dealerId: String(dealerId),
          }
        }
      } : {})
    }
  });
  return NextResponse.json({ user });
}
