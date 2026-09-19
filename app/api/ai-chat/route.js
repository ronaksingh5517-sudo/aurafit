import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId") || "default_user";

    const client = await clientPromise;
    const db = client.db("aurafit");
    
    // User ki chat history fetch karo database se
    const chatSession = await db.collection("ai_chats").findOne({ userId });

    return NextResponse.json({
      success: true,
      messages: chatSession ? chatSession.messages : [],
    });
  } catch (error) {
    console.error("Get Chat Error:", error);
    return NextResponse.json({ success: false, messages: [] }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId, message } = await req.json();

    if (!message) {
      return NextResponse.json({ success: false, error: "No message provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "Missing API Key" }, { status: 500 });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");
    const chatsCollection = db.collection("ai_chats");

    // Pehle se stored history nikalo taaki AI context yaad rakhe
    let chatSession = await chatsCollection.findOne({ userId: userId || "default_user" });
    let previousMessages = chatSession ? chatSession.messages : [];

    // Gemini API ke format mein contents taiyar karo
    let contents = previousMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    // Naya message add karo
    contents.push({ role: "user", parts: [{ text: message }] });

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: "You are AuraFit AI, an expert, friendly personal fitness and nutrition coach. Give concise, highly motivating, and accurate workout/diet advice." }]
      }
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
      return NextResponse.json({ success: false, error: errMessage }, { status: 200 });
    }

    const reply = data.candidates[0].content.parts[0].text;

    // Naye messages ko list mein dalo
    const updatedMessages = [
      ...previousMessages,
      { role: "user", text: message },
      { role: "assistant", text: reply },
    ];

    // Database mein chat history update/save karo
    await chatsCollection.updateOne(
      { userId: userId || "default_user" },
      { $set: { messages: updatedMessages, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("AI Chat Exception:", error);
    return NextResponse.json({ success: false, error: "Network error connecting to AI coach." }, { status: 500 });
  }
}