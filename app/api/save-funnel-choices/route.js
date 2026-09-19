import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, parentChoice, childGoal, bodyScanData } = await req.json();

    const client = await clientPromise;
    const db = client.db("aurafit");

    await db.collection("user_preferences").updateOne(
      { userId: userId || "default_user" },
      {
        $set: {
          parentChoice, // 'gym' or 'home'
          childGoal,    // 'fat_burn' or 'transformation'
          bodyScanData,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Funnel choices saved successfully!" });
  } catch (err) {
    console.error("Save funnel error:", err);
    return NextResponse.json({ success: false, error: "Failed to save preferences." }, { status: 500 });
  }
}