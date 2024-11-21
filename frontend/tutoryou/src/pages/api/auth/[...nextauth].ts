import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          },
        )

        if (!res.ok) {
          throw new Error('Invalid credentials')
        }

        const data = await res.json()

        if (data.user && data.user.role) {
          return data.user // User with role
        } else {
          return null // Invalid user data
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as number // Explicitly cast to number
        token.role = user.role as string // Explicitly cast to string
      }
      return token
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as number, // Explicitly cast to number
        role: token.role as string, // Explicitly cast to string
      }
      return session
    },
  },
})
