import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const token = (await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })) as
    | (JWT & { userId?: string; role?: string; isMature?: boolean; dob?: string | null })
    | null;
  const user = token
    ? {
        id: token.userId,
        role: token.role,
        isMature: token.isMature,
        dob: token.dob,
      }
    : null;

  const isDobRoute = pathname.startsWith("/onboarding/dob") || pathname.startsWith("/api/profile/dob");

  if (user && !user.dob && !isDobRoute) {
    url.pathname = "/onboarding/dob";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/reader")) {
    const isMatureRoute = url.searchParams.get("mature") === "1";
    if (isMatureRoute && (!user || !user.isMature)) {
      url.pathname = "/age-gate";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/reader/:path*"],
};
