import { NextResponse } from "next/server";
import crypto from "crypto";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("aurafit");

    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered!" }, { status: 400 });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");

    await db.collection("users").insertOne({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      salt,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup backend error:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}