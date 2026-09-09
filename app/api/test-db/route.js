import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("aurafit"); // Database name
    
    // Ping the database to verify connection
    await db.command({ ping: 1 });

    return NextResponse.json({ 
      success: true, 
      message: "MongoDB connected successfully to AuraFit!" 
    });
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}