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

    let mimeType = "image/jpeg";
    const mimeMatch = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,/);
    if (mimeMatch) {
      mimeType = mimeMatch[1];
    }

    const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, "");

    // 🚀 Detailed Item-by-Item Macro Breakdown Prompt
    const prompt = `You are a strict food and nutrition scanner AI. Analyze this image carefully.

STEP 1: Check if the image contains edible food, dishes, snacks, or drinks. 
If the image contains clothes, human body parts, shoes, rooms, laptops, or ANY non-food items, you MUST return ONLY this JSON:
{
  "isFood": false,
  "errorMessage": "Only scan a food item! Please upload a valid meal or snack."
}

STEP 2: If it IS food, break down EVERY individual item visible on the plate/bowl (e.g., Curd, Rice, Sabji, Dal, Roti) with its own specific macros.
Return ONLY valid JSON in this exact structure (no backticks, no markdown):
{
  "isFood": true,
  "dishName": "Overall Meal Name",
  "items": [
    {
      "name": "Curd / Dahi",
      "protein": "4g",
      "carbs": "5g",
      "fat": "3g",
      "calories": 60
    },
    {
      "name": "Rice / Chawal",
      "protein": "3g",
      "carbs": "35g",
      "fat": "1g",
      "calories": 160
    }
  ],
  "totalCalories": 450,
  "totalProtein": "15g",
  "totalCarbs": "60g",
  "totalFats": "12g",
  "coachTip": "A helpful nutrition tip for this meal."
}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
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
      const errMessage = data?.error?.message || "Could not analyze image.";
      return NextResponse.json({ success: false, error: errMessage }, { status: 200 });
    }

    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const resultJson = JSON.parse(cleaned);

    if (resultJson.isFood === false) {
      return NextResponse.json({ success: false, error: resultJson.errorMessage });
    }

    if (resultJson.isFood === true) {
      try {
        const client = await clientPromise;
        const db = client.db("aurafit");
        await db.collection("meals").insertOne({
          userId: userId || "default_user",
          dishName: resultJson.dishName,
          items: resultJson.items,
          totalCalories: resultJson.totalCalories,
          totalMacros: {
            protein: resultJson.totalProtein,
            carbs: resultJson.totalCarbs,
            fat: resultJson.totalFats,
          },
          coachTip: resultJson.coachTip,
          createdAt: new Date(),
        });
      } catch (dbError) {
        console.error("Failed to save meal to MongoDB:", dbError);
      }
    }

    return NextResponse.json({ success: true, analysis: resultJson });
  } catch (error) {
    console.error("Food Scanner Exception:", error);
    return NextResponse.json({ success: false, error: "Network issue while uploading image." }, { status: 500 });
  }
}