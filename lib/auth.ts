import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Note: ensure process.env.NEXT_PUBLIC_API_URL is available here
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const user = await res.json();

          if (res.ok && user) {
            return {
              id: user.id,
              name: user.firstname + ' ' + user.lastname,
              email: user.email,
              role: user.role,
              accessToken: user.token
            };
          }
          return null;
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        // @ts-ignore
        session.user.role = token.role;
        // @ts-ignore
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};