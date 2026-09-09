import { NextResponse } from "next/server";
import { seedExercises } from "@/lib/seedExercises";

export async function GET() {
  try {
    const result = await seedExercises();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Seed API error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}