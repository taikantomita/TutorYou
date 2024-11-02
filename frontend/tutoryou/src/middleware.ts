// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { GetTokenParams } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Convert req to unknown first, then assert to the expected type
  const token = await getToken({ req: req as unknown as GetTokenParams["req"], secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow access if token exists or if on a public page (e.g., /login)
  if (token || pathname === "/login") {
    return NextResponse.next();
  }

  // Redirect to login if user is not authenticated
  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/user-landing"], // Specify protected routes
};
