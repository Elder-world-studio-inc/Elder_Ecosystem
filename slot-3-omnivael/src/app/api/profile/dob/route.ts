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

  const body = (await request.json()) as { dob?: string };

  if (!body.dob) {
    return NextResponse.json({ error: "Missing dob" }, { status: 400 });
  }

  const parsed = new Date(body.dob);
  if (Number.isNaN(parsed.getTime())) {
    return NextResponse.json({ error: "Invalid dob" }, { status: 400 });
  }

  const now = new Date();
  let age = now.getFullYear() - parsed.getFullYear();
  const monthDiff = now.getMonth() - parsed.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < parsed.getDate())) {
    age -= 1;
  }

  const isMature = age >= 18;

  await prisma.user.update({
    where: { id: userId },
    data: {
      dob: parsed,
      isMature,
    },
  });

  return NextResponse.json({ isMature });
}
