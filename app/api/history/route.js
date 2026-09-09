import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");

    // Fetch recent meals and body scans
    const meals = await db.collection("meals")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    const bodyScans = await db.collection("body_scans")
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json({ success: true, meals, bodyScans });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ success: false, error: "Failed to load history" }, { status: 500 });
  }
}