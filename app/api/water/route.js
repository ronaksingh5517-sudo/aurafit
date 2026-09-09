import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: Fetch today's water intake
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const log = await db.collection("water_logs").findOne({
      userId,
      createdAt: { $gte: startOfDay },
    });

    return NextResponse.json({
      success: true,
      glasses: log ? log.glasses : 0,
      target: log ? log.target : 8,
    });
  } catch (error) {
    console.error("Water GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch water log" }, { status: 500 });
  }
}

// POST: Update or add water glasses
export async function POST(req) {
  try {
    const { userId, glasses } = await req.json();

    const client = await clientPromise;
    const db = client.db("aurafit");

    const activeUserId = userId || "default_user";
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // Upsert today's water log
    await db.collection("water_logs").updateOne(
      { userId: activeUserId, createdAt: { $gte: startOfDay } },
      {
        $set: {
          userId: activeUserId,
          glasses: Number(glasses) || 0,
          target: 8,
          updatedAt: new Date(),
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Water intake updated successfully!" });
  } catch (error) {
    console.error("Water POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to update water intake" }, { status: 500 });
  }
}