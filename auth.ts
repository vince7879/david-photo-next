import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const allowedEmails =
  process.env.ALLOWED_EMAILS?.split(",").map((email) =>
    email.trim().toLowerCase()
  ) || [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      return !!user.email && allowedEmails.includes(user.email.toLowerCase());
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated
      return !!auth;
    },
  },
  pages: {
    error: "/unauthorized", 
  },
  secret: process.env.AUTH_SECRET,
});
