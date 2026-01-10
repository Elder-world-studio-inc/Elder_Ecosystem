import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    slug?: string;
    priceShards?: number;
  };

  const slug = body.slug;
  const priceShards = body.priceShards;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  if (typeof priceShards !== "number" || !Number.isFinite(priceShards) || priceShards <= 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  try {
    const unlock = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { shardBalance: true },
      });

      if (!user || user.shardBalance < priceShards) {
        throw new Error("INSUFFICIENT_SHARDS");
      }

      const created = await tx.chapterUnlock.create({
        data: {
          userId,
          contentSlug: slug,
          shardsSpent: priceShards,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: {
          shardBalance: {
            decrement: priceShards,
          },
        },
      });

      return created;
    });

    return NextResponse.json({ success: true, unlockId: unlock.id });
  } catch (error) {
    if (error instanceof Error && error.message === "INSUFFICIENT_SHARDS") {
      return NextResponse.json({ error: "Insufficient shards" }, { status: 400 });
    }
    return NextResponse.json({ error: "Unable to unlock chapter" }, { status: 500 });
  }
}
