import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body?.userId || "user_1788771654076";
    const action = body?.action;
    const dayNumber = body?.dayNumber;

    const client = await clientPromise;
    const db = client.db("aurafit");

    let progressCollection = db.collection("user_progress");
    let userProgress = await progressCollection.findOne({ userId });

    if (!userProgress) {
      userProgress = {
        userId,
        programId: "fit30_program",
        currentDayUnlocked: 1,
        completedDays: [],
        updatedAt: new Date(),
      };
      await progressCollection.insertOne(userProgress);
    }

    if (action === "complete_day" && dayNumber) {
      if (dayNumber === userProgress.currentDayUnlocked && dayNumber < 30) {
        const nextDay = dayNumber + 1;
        await progressCollection.updateOne(
          { userId },
          { 
            $set: { currentDayUnlocked: nextDay, updatedAt: new Date() },
            $addToSet: { completedDays: dayNumber }
          }
        );
        userProgress.currentDayUnlocked = nextDay;
        if (!userProgress.completedDays.includes(dayNumber)) {
          userProgress.completedDays.push(dayNumber);
        }
      }
    }

    let program = await db.collection("programs").findOne({ programId: "fit30_program" });

    if (!program) {
      const routineTemplates = [
        { title: "Chest & Triceps Hypertrophy", focus: "Chest, Triceps, Anterior Delts", exercises: [{ name: "Dumbbell Bench Press", sets: 3, reps: "10-12", rest: "60s" }, { name: "Dumbbell Fly", sets: 3, reps: "12", rest: "60s" }, { name: "Overhead Tricep Extension", sets: 3, reps: "12", rest: "45s" }] },
        { title: "Back & Biceps Power", focus: "Lats, Upper Back, Biceps", exercises: [{ name: "Dumbbell Row", sets: 3, reps: "10-12", rest: "60s" }, { name: "Dumbbell Pullover", sets: 3, reps: "12", rest: "60s" }, { name: "Dumbbell Bicep Curl", sets: 3, reps: "12", rest: "45s" }] },
        { title: "Lower Body & Core Burn", focus: "Quads, Hamstrings, Abs", exercises: [{ name: "Goblet Squat", sets: 4, reps: "10-12", rest: "90s" }, { name: "Dumbbell Romanian Deadlift", sets: 3, reps: "10-12", rest: "90s" }, { name: "Plank Hold", sets: 3, reps: "45s", rest: "30s" }] },
        { title: "Active Recovery & Mobility", focus: "Full Body Flexibility", exercises: [{ name: "Dynamic Stretching Routine", sets: 1, reps: "15 mins", rest: "0s" }] },
        { title: "Shoulders & Arms Sculpt", focus: "Side Delts, Biceps, Triceps", exercises: [{ name: "Dumbbell Shoulder Press", sets: 3, reps: "10-12", rest: "60s" }, { name: "Lateral Raise", sets: 4, reps: "15", rest: "45s" }, { name: "Hammer Curl", sets: 3, reps: "12", rest: "45s" }] },
        { title: "Full Body Functional Circuit", focus: "Cardio & Strength", exercises: [{ name: "Dumbbell Thrusters", sets: 3, reps: "10", rest: "60s" }, { name: "Dumbbell Reverse Lunges", sets: 3, reps: "10 per leg", rest: "60s" }] },
        { title: "Rest & Muscle Repair", focus: "Recovery", exercises: [] }
      ];

      const defaultDays = [];
      for (let i = 1; i <= 30; i++) {
        const template = routineTemplates[(i - 1) % routineTemplates.length];
        defaultDays.push({
          day: i,
          title: `Day ${i < 10 ? "0" + i : i}: ${template.title}`,
          focus: template.focus,
          exercises: template.exercises
        });
      }

      program = {
        programId: "fit30_program",
        name: "FIT30 Transformation Program",
        days: defaultDays
      };

      await db.collection("programs").insertOne(program);
    }

    const enrichedDays = program.days.map((d) => ({
      ...d,
      isUnlocked: d.day <= userProgress.currentDayUnlocked,
      isCompleted: userProgress.completedDays.includes(d.day)
    }));

    const totalCompleted = userProgress.completedDays.length;
    const progressPercentage = Math.round((totalCompleted / 30) * 100);

    return NextResponse.json({
      success: true,
      programName: program.name,
      currentDayUnlocked: userProgress.currentDayUnlocked,
      completedDays: userProgress.completedDays,
      stats: {
        totalCompleted,
        progressPercentage,
        streak: totalCompleted
      },
      days: enrichedDays
    });

  } catch (error) {
    console.error("FIT30 API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}