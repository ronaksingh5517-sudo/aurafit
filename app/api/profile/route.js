import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");

    const profile = await db.collection("users").findOne({ userId });

    return NextResponse.json({
      success: true,
      profile: profile || {
        goal: "Fat Loss & Muscle Building",
        dailyCalories: 2000,
        currentWeight: 70,
        workoutPreference: "home", // default: home or gym
        equipment: "None (Bodyweight only)",
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, goal, dailyCalories, currentWeight, workoutPreference, equipment } = await req.json();

    const client = await clientPromise;
    const db = client.db("aurafit");
    const activeUserId = userId || "default_user";

    await db.collection("users").updateOne(
      { userId: activeUserId },
      {
        $set: {
          userId: activeUserId,
          goal: goal || "Fat Loss",
          dailyCalories: Number(dailyCalories) || 2000,
          currentWeight: Number(currentWeight) || 70,
          workoutPreference: workoutPreference || "home",
          equipment: equipment || "None",
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Profile updated successfully!" });
  } catch (error) {
    console.error("Profile POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}