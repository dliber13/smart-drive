import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dealer = await prisma.dealer.findUnique({
      where: { id: user.dealerId },
      select: { id: true, name: true },
    });

    if (!dealer) return NextResponse.json({ error: "Dealer not found" }, { status: 404 });

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: dealer.name,
        metadata: { dealerId: dealer.id, userId: user.id },
      });
      customerId = customer.id;
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: "https://smartdriveelite.com/billing",
    });

    return NextResponse.json({ success: true, url: portalSession.url });
  } catch (error: any) {
    console.error("Stripe portal error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
