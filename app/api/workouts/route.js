import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Fetch user workouts history from MongoDB
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");

    const workouts = await db.collection("workouts")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ success: true, workouts });
  } catch (error) {
    console.error("Workouts GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch workouts" }, { status: 500 });
  }
}

// POST: Save completed workout session to MongoDB
export async function POST(req) {
  try {
    const { userId, title, durationMinutes, exercisesCompleted, notes } = await req.json();

    const client = await clientPromise;
    const db = client.db("aurafit");

    const newWorkout = {
      userId: userId || "default_user",
      title: title || "Interactive AI Workout Session",
      durationMinutes: Number(durationMinutes) || 30,
      exercisesCompleted: exercisesCompleted || [],
      notes: notes || "Completed via AuraFit Workout Tracker",
      createdAt: new Date(),
    };

    await db.collection("workouts").insertOne(newWorkout);

    return NextResponse.json({ success: true, message: "Workout saved to MongoDB successfully!" });
  } catch (error) {
    console.error("Workouts POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save workout" }, { status: 500 });
  }
}