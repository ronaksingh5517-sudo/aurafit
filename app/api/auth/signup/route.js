import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 409 });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = hashPassword(password, salt);
    const userId = "user_" + Date.now();

    const newUser = {
      userId,
      name,
      email: email.toLowerCase(),
      salt,
      password: hashedPassword,
      goal: "Fat Loss & Muscle Building",
      dailyCalories: 2000,
      currentWeight: 70,
      workoutPreference: "home",
      equipment: "None",
      createdAt: new Date(),
    };

    await db.collection("users").insertOne(newUser);

    return NextResponse.json({
      success: true,
      user: { userId, name, email: newUser.email },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ success: false, error: "Server error during registration" }, { status: 500 });
  }
}