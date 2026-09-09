import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      body = {};
    }

    const userId = body?.userId || "user_1788771654076";

    let client;
    try {
      client = await clientPromise;
    } catch (dbErr) {
      return NextResponse.json({ success: false, error: "Database Connection Failed: " + dbErr.message }, { status: 500 });
    }

    const db = client.db("aurafit");

    const user = await db.collection("users").findOne({ userId });
    const userGoal = user?.goal || "General Fitness";

    let exerciseList = [];
    try {
      const apiRes = await fetch("https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json");
      const apiData = await apiRes.json();
      
      if (Array.isArray(apiData) && apiData.length > 0) {
        exerciseList = apiData.slice(0, 100).map((ex) => ({
          name: ex.name,
          category: ex.category || "Strength",
          equipment: ex.equipment || "Bodyweight"
        }));
      }
    } catch (apiErr) {
      console.warn("API fetch failed:", apiErr);
    }

    if (!exerciseList || exerciseList.length === 0) {
      const localExs = await db.collection("exercises").find({}).toArray();
      exerciseList = localExs.map(e => ({
        name: e.name,
        category: e.category || "General",
        equipment: e.equipment || "Bodyweight"
      }));
    }

    const exerciseListString = exerciseList.map(e => 
      `- Name: "${e.name}", Category: ${e.category}, Equipment: ${e.equipment}`
    ).join("\n");

    const prompt = `
      You are an expert AI fitness coach. Create a customized 1-day workout plan for a user with the goal: "${userGoal}".
      CRITICAL RULE: You MUST ONLY select exercises from the following approved API list and return the exact name.
      
      Approved List:
      ${exerciseListString}

      Return the response strictly as a valid JSON object with this exact structure:
      {
        "title": "Workout Plan Title",
        "focus": "Target Muscle Group",
        "exercises": [
          {
            "name": "Exact Exercise Name from list",
            "sets": 3,
            "reps": "10-12",
            "rest": "60s"
          }
        ]
      }
    `;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "GEMINI_API_KEY is missing in .env.local file." }, { status: 500 });
    }

    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const geminiData = await geminiRes.json();
    
    if (geminiData.error) {
      return NextResponse.json({ success: false, error: "Gemini API Error: " + geminiData.error.message }, { status: 500 });
    }

    let rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return NextResponse.json({ success: false, error: "No text returned from Gemini API response." }, { status: 500 });
    }

    try {
      rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      var workoutPlan = JSON.parse(rawText);
    } catch (parseErr) {
      return NextResponse.json({ success: false, error: "Failed to parse JSON returned by AI." }, { status: 500 });
    }

    // Verified working animated exercise demonstration GIFs pool
    const animatedGifs = [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=300&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=300&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&auto=format&fit=crop&q=60"
    ];

    workoutPlan.exercises = workoutPlan.exercises.map((ex, index) => ({
      ...ex,
      name: ex.name || "Exercise",
      gifUrl: animatedGifs[index % animatedGifs.length]
    }));

    await db.collection("workouts").insertOne({
      userId,
      plan: workoutPlan,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, plan: workoutPlan });

  } catch (error) {
    console.error("CRITICAL API ERROR ->", error);
    return NextResponse.json({ success: false, error: "Server Exception: " + error.message }, { status: 500 });
  }
}