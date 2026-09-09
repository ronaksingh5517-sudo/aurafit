import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { userId, id, collectionName } = await req.json();

    if (!id || !collectionName) {
      return NextResponse.json({ success: false, error: "Missing id or collection name" }, { status: 400 });
    }

    const validCollections = ["meals", "workouts", "body_scans"];
    if (!validCollections.includes(collectionName)) {
      return NextResponse.json({ success: false, error: "Invalid collection" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    await db.collection(collectionName).deleteOne({
      _id: new ObjectId(id),
      userId: userId || "default_user",
    });

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error) {
    console.error("Delete history error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete record" }, { status: 500 });
  }
}