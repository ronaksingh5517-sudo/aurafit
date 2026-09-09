import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Fetch weight history logs
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");

    const weights = await db.collection("weight_logs")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(15)
      .toArray();

    return NextResponse.json({ success: true, weights });
  } catch (error) {
    console.error("Weight GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch weight logs" }, { status: 500 });
  }
}

// POST: Log new weight entry
export async function POST(req) {
  try {
    const { userId, weight, unit } = await req.json();

    if (!weight) {
      return NextResponse.json({ success: false, error: "Weight is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");
    const activeUserId = userId || "default_user";

    const newLog = {
      userId: activeUserId,
      weight: Number(weight),
      unit: unit || "kg",
      createdAt: new Date(),
    };

    await db.collection("weight_logs").insertOne(newLog);

    // Also update current weight in user profile
    await db.collection("users").updateOne(
      { userId: activeUserId },
      { $set: { currentWeight: Number(weight), updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Weight logged successfully!" });
  } catch (error) {
    console.error("Weight POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save weight log" }, { status: 500 });
  }
}