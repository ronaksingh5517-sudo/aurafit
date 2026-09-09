import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import clientPromise from "@/lib/mongodb";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");

        // Check if user already exists in MongoDB
        const existingUser = await db.collection("users").findOne({ email: user.email.toLowerCase() });

        if (!existingUser) {
          // Create default profile for Google login user
          const newUser = {
            userId: "user_" + Date.now(),
            name: user.name,
            email: user.email.toLowerCase(),
            image: user.image,
            goal: "Fat Loss & Muscle Building",
            dailyCalories: 2000,
            currentWeight: 70,
            workoutPreference: "home",
            equipment: "None",
            createdAt: new Date(),
          };
          await db.collection("users").insertOne(newUser);
        }
        return true;
      } catch (err) {
        console.error("Google sign-in database error:", err);
        return false;
      }
    },
    async session({ session }) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        const dbUser = await db.collection("users").findOne({ email: session.user.email.toLowerCase() });
        
        if (dbUser) {
          session.user.userId = dbUser.userId;
          session.user.goal = dbUser.goal;
        }
      } catch (err) {
        console.error("Session callback error:", err);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_fullyworkout",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };