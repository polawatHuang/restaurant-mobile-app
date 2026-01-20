// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (path.startsWith("/chef") && token?.role !== "CHEF") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = { matcher: ["/admin/:path*", "/chef/:path*"] }