import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const t = token as JWT & {
        userId?: string;
        role?: string;
        isMature?: boolean;
        dob?: string | null;
      };
      if (user) {
        const u = user as {
          id: string;
          role?: string;
          isMature?: boolean;
          dob?: Date | null;
        };
        t.userId = u.id;
        t.role = u.role ?? "USER";
        t.isMature = Boolean(u.isMature);
        t.dob = u.dob ? u.dob.toISOString() : null;
      } else if (t.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: String(t.userId) },
          select: { id: true, role: true, isMature: true, dob: true },
        });
        if (dbUser) {
          t.role = dbUser.role;
          t.isMature = dbUser.isMature;
          t.dob = dbUser.dob ? dbUser.dob.toISOString() : null;
        }
      }
      return t;
    },
    async session({ session, token }) {
      const t = token as JWT & {
        userId?: string;
        role?: string;
        isMature?: boolean;
        dob?: string | null;
      };
      if (session.user) {
        (session.user as { id?: string; role?: string; isMature?: boolean; dob?: string | null }).id =
          t.userId ?? undefined;
        (session.user as { id?: string; role?: string; isMature?: boolean; dob?: string | null }).role =
          t.role ?? "USER";
        (session.user as { id?: string; role?: string; isMature?: boolean; dob?: string | null }).isMature =
          Boolean(t.isMature);
        (session.user as { id?: string; role?: string; isMature?: boolean; dob?: string | null }).dob =
          t.dob ?? null;
      }
      return session;
    },
  },
};
