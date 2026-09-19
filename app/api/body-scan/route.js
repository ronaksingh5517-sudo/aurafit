import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const imageBase64 = body.imageBase64 || body.image;
    const userId = body.userId;

    if (!imageBase64) {
      return NextResponse.json({ success: false, error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Missing API Key in .env.local" }, { status: 500 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are an expert AI fitness coach and physique analyst. Look at this image very carefully.
Determine if there is a human body, person, or physical posture visible in this image. 

CRITICAL RULES:
1. If the image contains ONLY clothes (like shirts/pants hanging or laid out), inanimate objects, landscapes, cars, rooms, or animals without a clear human body:
Return strictly valid JSON:
{
  "isBody": false,
  "errorMessage": "No human physique detected! Please upload a clear photo of a person or fitness posture. Clothes or objects are not allowed."
}

2. If the image DOES contain a human body/person:
Return strictly valid JSON:
{
  "isBody": true,
  "physiqueType": "Estimated Build (e.g., Lean / Athletic / Bulking / Average)",
  "estimatedBodyFat": "14-16%",
  "postureScore": "8.5/10",
  "feedback": "Good core engagement and shoulder alignment. Slight forward head posture noted.",
  "actionableTip": "Focus on upper back strengthening and daily stretching to fix shoulder alignment."
}

DO NOT include markdown backticks like \`\`\`json. Return ONLY the raw JSON string.`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Data,
              },
            },
          ],
        },
      ],
    };

    // Google ke naye aur latest model par update kar diya hai
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
      const errMessage = data?.error?.message || "Could not analyze body scan. Check API key or quota.";
      return NextResponse.json({ success: false, error: errMessage }, { status: 200 });
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    
    let resultJson;
    try {
      resultJson = JSON.parse(cleaned);
    } catch (parseErr) {
      return NextResponse.json({ success: false, error: "AI returned invalid response format. Try again." }, { status: 200 });
    }

    if (resultJson.isBody === false) {
      return NextResponse.json({ 
        success: false, 
        error: resultJson.errorMessage || "No human physique detected! Please upload a clear photo of a person." 
      });
    }

    if (resultJson.isBody === true) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        await db.collection("body_scans").insertOne({
          userId: userId || "default_user",
          physiqueType: resultJson.physiqueType,
          estimatedBodyFat: resultJson.estimatedBodyFat,
          postureScore: resultJson.postureScore,
          feedback: resultJson.feedback,
          actionableTip: resultJson.actionableTip,
          createdAt: new Date(),
        });
      } catch (dbError) {
        console.error("Failed to save body scan to MongoDB:", dbError);
      }
    }

    return NextResponse.json({ success: true, analysis: resultJson });
  } catch (error) {
    console.error("Body Scan Exception:", error);
    return NextResponse.json({ success: false, error: "Network issue during body scan." }, { status: 500 });
  }
}