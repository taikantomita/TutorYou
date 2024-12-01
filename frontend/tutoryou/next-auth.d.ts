import NextAuth, { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      role: string // Add role to the session
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    id: number
    role: string // Add role to the user
  }

  interface JWT {
    id: number
    role: string // Add role to the token
  }
}
