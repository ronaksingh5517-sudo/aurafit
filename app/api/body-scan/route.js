import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { imageBase64, userId } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing API Key in .env.local" }, { status: 500 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    const prompt = `You are an expert AI fitness coach and physique analyst.
Look at this image carefully.
First, check: Is there a human body, physique, or posture visible in this image?

CRITICAL RULE:
If the image is NOT of a human body/posture (e.g., an object, animal, room, landscape, random screenshot):
Return strictly valid JSON:
{
  "isBody": false,
  "errorMessage": "No human physique detected! Please upload a clear posture or fitness progress photo."
}

If the image DOES contain a human body/physique:
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
      const errMessage = data?.error?.message || "Could not analyze body scan.";
      return NextResponse.json(
        {
          apiError: true,
          errorMessage: `Body Scan Error: ${errMessage}`,
        },
        { status: 200 }
      );
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const resultJson = JSON.parse(cleaned);

    // Agar body detect ho gayi hai, toh MongoDB mein save kar do
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

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("Body Scan Exception:", error);
    return NextResponse.json(
      {
        apiError: true,
        errorMessage: "Network issue during body scan. Please try again.",
      },
      { status: 500 }
    );
  }
}