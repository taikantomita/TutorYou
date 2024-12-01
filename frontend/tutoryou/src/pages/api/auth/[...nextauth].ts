import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          console.log('Received credentials:', credentials)

          const res = await fetch(`http://localhost:8000/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          })

          console.log('Response status:', res.status)

          if (!res.ok) {
            const contentType = res.headers.get('content-type')
            if (contentType?.includes('application/json')) {
              const errorData = await res.json()
              console.error('Error data:', errorData)
              throw new Error(errorData.detail || 'Invalid credentials')
            } else {
              const errorText = await res.text()
              console.error('Error text:', errorText)
              throw new Error(`Unexpected response: ${errorText}`)
            }
          }

          const data = await res.json()
          console.log('Parsed response data:', data)

          if (data?.user?.role) {
            console.log('User successfully authorized:', data.user)
            return data.user
          }

          console.error('Invalid user data:', data)
          return null
        } catch (e) {
          console.error('Error during authorization:', e)
          throw new Error('Authorization failed')
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
        console.log('User in jwt callback:', user)
        token.id = user.id
        token.role = user.role
      }
      console.log('Token in jwt callback:', token)
      return token
    },
    async session({ session, token }) {
      console.log('Token in session callback:', token)
      console.log('Session before modification:', session)

      // Safely modify session.user
      session.user = {
        ...session.user,
        id: token.id as number, // Type assertion to ensure proper typing
        role: token.role as string, // Type assertion for role
      }

      console.log('Session in session callback:', session)
      return session
    },
  },
}

export default NextAuth(authOptions)
