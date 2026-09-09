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

    const prompt = `You are an expert food & nutrition recognition vision AI.
Look at this image carefully.
First, check: Is there any actual edible food, drink, fruit, or cooked meal visible in this image?

CRITICAL RULE:
If the image is of a laptop, computer screen, thumbnail, room, furniture, human selfie, vehicle, phone, or any NON-FOOD item:
Return strictly valid JSON:
{
  "isFood": false,
  "errorMessage": "No food detected! Please capture a real edible meal or snack."
}

If the image DOES contain food or drink:
Return strictly valid JSON:
{
  "isFood": true,
  "dishName": "Exact Food Name",
  "confidence": 94,
  "calories": 420,
  "macros": {
    "protein": "26g",
    "carbs": "45g",
    "fat": "14g"
  },
  "coachTip": "One encouraging practical nutrition tip."
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

    // Call Gemini 3.6 Flash API for Vision analysis
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
      const errMessage = data?.error?.message || "Could not analyze image.";
      return NextResponse.json(
        {
          apiError: true,
          errorMessage: `AI Vision Error: ${errMessage}`,
        },
        { status: 200 }
      );
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const resultJson = JSON.parse(cleaned);

    // Agar food detect ho gaya hai, toh securely MongoDB mein save kar do
    if (resultJson.isFood === true) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        
        await db.collection("meals").insertOne({
          userId: userId || "default_user",
          dishName: resultJson.dishName,
          calories: resultJson.calories,
          macros: resultJson.macros,
          coachTip: resultJson.coachTip,
          createdAt: new Date(),
        });
      } catch (dbError) {
        console.error("Failed to save meal to MongoDB:", dbError);
        // Database save fail hone par bhi user ko result dikhta rahega (non-blocking)
      }
    }

    return NextResponse.json(resultJson);
  } catch (error) {
    console.error("Food Scanner Exception:", error);
    return NextResponse.json(
      {
        apiError: true,
        errorMessage: "Network issue while uploading image. Please try again.",
      },
      { status: 500 }
    );
  }
}