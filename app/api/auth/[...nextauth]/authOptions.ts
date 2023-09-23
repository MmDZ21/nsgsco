import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "کد ملی",
          type: "text",
          placeholder: "کد ملی با صفر",
        },
        password: {
          label: "کلمه عبور",
          type: "password",
          placeholder: "به طور پیش فرض کد ملی",
        },
      },
      async authorize(credentials) {
        //check if credentials

        if (!credentials?.username || !credentials.password) {
          throw new Error("لطفا کد ملی و کلمه عبور را وارد کنید");
        }

        //check if user exists
        const user = await prisma.user.findUnique({
          where: {
            username: credentials?.username,
          },
        });
        if (!user || !user?.password) {
          throw new Error("کاربر پیدا نشذ");
        }
        //check password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("کلمه عبور صحیح نمی‌باشد");
        }

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, trigger, user, session }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.username = user.username;
        token.name = user.name;
        token.picture = user.image;
      }
      if (trigger === "update") {
        // Note, that `session` can be any arbitrary object, remember to validate it!
        token.picture = await session.user.image;
        console.log(token);
      }
      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
