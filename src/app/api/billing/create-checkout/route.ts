import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2025-01-27.acacia" });

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("sde_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const user = verifySession(token) as any;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan } = await req.json();
    if (!plan || !["basic", "pro"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const priceId = plan === "basic"
      ? process.env.STRIPE_BASIC_PRICE_ID!
      : process.env.STRIPE_PRO_PRICE_ID!;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://smartdriveelite.com/billing?success=true&plan=${plan}`,
      cancel_url: `https://smartdriveelite.com/billing?cancelled=true`,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        dealerId: user.dealerId || "",
        plan,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          dealerId: user.dealerId || "",
          plan,
        },
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
