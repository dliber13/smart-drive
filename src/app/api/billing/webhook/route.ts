import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret || !sig) return NextResponse.json({ error: "Missing webhook secret" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature error:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, dealerId, plan } = session.metadata || {};
        if (dealerId && plan) {
          await prisma.dealer.update({
            where: { id: dealerId },
            data: {
              stripeCustomerId: session.customer as string,
              planName: plan,
              planStatus: "ACTIVE",
              planActivatedAt: new Date(),
            },
          });
        }
        console.log("Checkout completed — dealer activated:", dealerId, plan);
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const { dealerId, plan } = sub.metadata || {};
        if (dealerId) {
          await prisma.dealer.update({
            where: { id: dealerId },
            data: {
              stripePlanId: sub.id,
              planStatus: sub.status === "active" ? "ACTIVE" : sub.status === "trialing" ? "TRIAL" : "INACTIVE",
              planName: plan || undefined,
            },
          });
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const { dealerId } = sub.metadata || {};
        if (dealerId) {
          await prisma.dealer.update({
            where: { id: dealerId },
            data: { planStatus: "CANCELLED", planCancelledAt: new Date() },
          });
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        if (customerId) {
          await prisma.dealer.updateMany({
            where: { stripeCustomerId: customerId },
            data: { planStatus: "PAST_DUE" },
          });
        }
        break;
      }
    }
  } catch (err: any) {
    console.error("Webhook DB error:", err);
  }

  return NextResponse.json({ received: true });
}
