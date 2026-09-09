import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");

    // 1. Fetch user profile for daily calorie goal
    const profile = await db.collection("users").findOne({ userId });
    const targetCalories = profile?.dailyCalories || 2000;

    // 2. Fetch today's meals to calculate consumed calories
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayMeals = await db.collection("meals")
      .find({ userId, createdAt: { $gte: startOfDay } })
      .toArray();

    const totalConsumedCalories = todayMeals.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0);

    // 3. Fetch completed workouts count
    const totalWorkouts = await db.collection("workouts").countDocuments({ userId });

    // 4. Fetch body scans count
    const totalScans = await db.collection("body_scans").countDocuments({ userId });

    return NextResponse.json({
      success: true,
      stats: {
        targetCalories,
        totalConsumedCalories,
        caloriesRemaining: Math.max(0, targetCalories - totalConsumedCalories),
        totalWorkouts,
        totalScans,
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    return NextResponse.json({ success: false, error: "Failed to load summary stats" }, { status: 500 });
  }
}