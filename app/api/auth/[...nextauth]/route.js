import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Yeh terminal mein asli error print karega
  pages: {
    signIn: "/login",
    error: "/login", // Agar error aaye toh wapas login page par bhej kar error catch karega
  },
});

export { handler as GET, handler as POST };