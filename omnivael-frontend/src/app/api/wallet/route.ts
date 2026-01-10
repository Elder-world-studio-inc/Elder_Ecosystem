import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    return NextResponse.json({ authenticated: false, shardBalance: 0 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { shardBalance: true },
  });

  return NextResponse.json({
    authenticated: true,
    shardBalance: user?.shardBalance ?? 0,
  });
}
