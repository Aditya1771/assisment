import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "Email / Phone + OTP",
      credentials: {
        emailOrPhone: { label: "Email or Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.otp) return null;
        await connectDB();
        const user = await User.findOne({
          $or: [
            { email: credentials.emailOrPhone },
            { phone: credentials.emailOrPhone },
          ],
        });
        if (!user) return null;
        const { verifyOtp } = await import("@/utils/otp");
        const valid = await verifyOtp(credentials.emailOrPhone, credentials.otp);
        if (!valid) return null;
        return {
          id: user._id.toString(),
          email: user.email ?? undefined,
          name: user.name ?? user.email ?? user.phone,
          image: user.image ?? undefined,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        await connectDB();
        await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              email: user.email,
              name: user.name ?? user.email,
              image: user.image ?? undefined,
              updatedAt: new Date(),
            },
          },
          { upsert: true, new: true }
        );
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
        if (account?.provider === "credentials") {
          token.id = user.id;
        } else if (account?.provider === "google" && user.email) {
          await connectDB();
          const dbUser = await User.findOne({ email: user.email });
          token.id = dbUser?._id?.toString() ?? user.id;
        } else {
          token.id = user.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
