import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { userId, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key in .env.local" }, { status: 500 });
    }

    // Optional: User ke pichle scanned meals ya body stats MongoDB se nikal kar AI ko context de sakte hain
    let userContext = "";
    try {
      const client = await clientPromise;
      const db = client.db("aurafit");
      const recentMeal = await db.collection("meals").findOne({ userId: userId || "default_user" }, { sort: { createdAt: -1 } });
      if (recentMeal) {
        userContext = ` User's last scanned meal was ${recentMeal.dishName} with ${recentMeal.totalCalories || recentMeal.calories} calories.`;
      }
    } catch (dbErr) {
      console.log("DB Context fetch error (non-blocking):", dbErr);
    }

    const prompt = `You are AuraFit AI, an expert, friendly personal fitness and nutrition coach.${userContext}
User's message: "${message}"
Give a concise, highly motivating, and accurate fitness/diet response.`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey.trim(),
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok || !data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const errMessage = data?.error?.message || "AI Coach failed to respond.";
      return NextResponse.json({ reply: `⚠️ Error: ${errMessage}` }, { status: 200 });
    }

    const reply = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("AI Coach Exception:", error);
    return NextResponse.json({ error: "Network error connecting to AI coach." }, { status: 500 });
  }
}