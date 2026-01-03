import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// 1. Force dynamic behavior
export const dynamic = "force-dynamic";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

