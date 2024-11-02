// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          });

          if (!res.ok) {
            console.error("Backend login failed:", res.status, await res.text());
            throw new Error("Invalid credentials");
          }

          const data = await res.json();
          console.log("Backend response data:", data); // Log the complete backend response

          // Ensure data has the expected structure
          const user = data.user;
          if (user && typeof user.id === 'number' && typeof user.username === 'string') {
            console.log("Valid user data received:", user);
            return user; // Successful login returns user data
          } else {
            console.error("User data is missing or malformed in the backend response.");
            return null; // Return null if user data is invalid or missing
          }
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
});
