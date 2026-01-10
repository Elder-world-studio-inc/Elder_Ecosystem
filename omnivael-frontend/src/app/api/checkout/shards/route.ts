import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePriceId = process.env.STRIPE_PRICE_SHARDS_1999;

const stripe =
  stripeSecretKey &&
  new Stripe(stripeSecretKey, {
    apiVersion: "2024-06-20",
  });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!stripe || !stripePriceId) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  const origin = url.origin;

  const shardsPerPurchase =
    Number.parseInt(process.env.SHARDS_PER_1999 ?? "", 10) || 0;

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/?purchase=success`,
      cancel_url: `${origin}/?purchase=cancelled`,
      metadata: {
        userId,
      },
    });

    await prisma.shardPurchase.create({
      data: {
        userId,
        status: "PENDING",
        amountUsd: 1999,
        shardsGranted: shardsPerPurchase,
        stripeSessionId: checkoutSession.id,
        stripeCustomerId:
          typeof checkoutSession.customer === "string"
            ? checkoutSession.customer
            : checkoutSession.customer?.id ?? null,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
