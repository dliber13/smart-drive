import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });

export const dynamic = "force-dynamic";

function generateDealerCode(name: string): string {
  const clean = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6);
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return clean + rand;
}

function generateDealerNumber(): string {
  return "D" + Math.floor(1000 + Math.random() * 9000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, dealerName, city, state, monthlyUnits, password, plan } = body;

    if (!firstName || !lastName || !email || !dealerName || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const priceMap: Record<string, string> = {
      basic: process.env.STRIPE_BASIC_PRICE_ID!,
      pro: process.env.STRIPE_PRO_PRICE_ID!,
      elite: process.env.STRIPE_ELITE_PRICE_ID!,
    };

    const selectedPlan = ["basic", "pro", "elite"].includes(plan) ? plan : "basic";
    const priceId = priceMap[selectedPlan];

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Generate unique dealer code
    const code = generateDealerCode(dealerName);
    const dealerNumber = generateDealerNumber();

    // Create dealer
    const dealer = await prisma.dealer.create({
      data: {
        id: crypto.randomUUID(),
        name: dealerName,
        code,
        dealerNumber,
        phone: phone || null,
        city: city || null,
        state: state || null,
        status: "ACTIVE",
        authorityLevel: "STANDARD",
        updatedAt: new Date(),
      },
    });

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: "DEALER_MANAGER",
        isActive: true,
      },
    });

    // Link user to dealer
    await prisma.dealerUser.create({
      data: {
        id: crypto.randomUUID(),
        dealerId: dealer.id,
        userId: user.id,
        title: "Owner",
      },
    });

    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
      metadata: {
        dealerId: dealer.id,
        userId: user.id,
        dealerName,
        plan: selectedPlan,
      },
    });

    // Create Stripe checkout session with 14-day trial + 50% off first month
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: customer.id,
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        coupon: process.env.STRIPE_TRIAL_COUPON_ID,
        metadata: {
          dealerId: dealer.id,
          userId: user.id,
          plan: selectedPlan,
        },
      },
      success_url: `https://smartdriveelite.com/login?signup=success&email=${encodeURIComponent(email)}`,
      cancel_url: `https://smartdriveelite.com/signup?cancelled=true`,
      customer_email: email,
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      dealerId: dealer.id,
      userId: user.id,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: error.message || "Signup failed" }, { status: 500 });
  }
}
