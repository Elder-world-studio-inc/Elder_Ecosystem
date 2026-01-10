import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe =
  stripeSecretKey &&
  new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId) {
      const shardsPerPurchase =
        Number.parseInt(process.env.SHARDS_PER_1999 ?? "", 10) || 0;

      await prisma.$transaction(async (tx) => {
        const existing = await tx.shardPurchase.findFirst({
          where: { stripeEventId: event.id },
        });
        if (existing) {
          return;
        }

        await tx.shardPurchase.create({
          data: {
            userId,
            status: "COMPLETED",
            amountUsd: 1999,
            shardsGranted: shardsPerPurchase,
            stripeCustomerId:
              typeof session.customer === "string"
                ? session.customer
                : session.customer?.id ?? null,
            stripePaymentIntentId:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
            stripeSessionId: session.id,
            stripeEventId: event.id,
          },
        });

        await tx.user.update({
          where: { id: userId },
          data: {
            shardBalance: {
              increment: shardsPerPurchase,
            },
          },
        });
      });
    }
  }

  return NextResponse.json({ received: true });
}

