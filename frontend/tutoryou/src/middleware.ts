// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

interface AuthToken {
  role?: string
}

export async function middleware(req: NextRequest) {
  // Retrieve the token
  const rawToken = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Assert token type to AuthToken
  const token = rawToken as AuthToken

  const { pathname } = req.nextUrl

  // Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  // Role-based redirection
  const userRole = token.role as string | undefined // Type assertion to avoid errors

  if (pathname.startsWith('/tutors') && userRole !== 'Tutor') {
    // Redirect non-tutors trying to access tutor pages
    const forbiddenUrl = new URL('/login', req.url)
    return NextResponse.redirect(forbiddenUrl)
  }

  if (pathname.startsWith('/students') && userRole !== 'Learner') {
    // Redirect non-learners trying to access learner pages
    const forbiddenUrl = new URL('/login', req.url)
    return NextResponse.redirect(forbiddenUrl)
  }
}

// protected routes
export const config = {
  matcher: ['/user-landing', '/students/:path*', '/tutors/:path*'],
}
