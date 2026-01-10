import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  if (!userId) {
    // If not logged in, we can only return an empty list or unauthorized
    // But since guest unlocks are stored in localStorage, the API handles authenticated user library
    return NextResponse.json({ items: [] });
  }

  try {
    const unlocks = await prisma.chapterUnlock.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const slugs = unlocks.map((u) => u.contentSlug);

    return NextResponse.json({ slugs });
  } catch (error) {
    console.error("Library API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
