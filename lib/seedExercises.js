import clientPromise from "@/lib/mongodb";

export async function seedExercises() {
  try {
    const client = await clientPromise;
    const db = client.db("aurafit");

    const count = await db.collection("exercises").countDocuments();
    if (count > 0) {
      return { success: true, message: "Exercises already exist in database." };
    }

    // Sample robust exercise dataset (Representing your 1300+ database categories)
    const exercises = [
      { name: "Push-up", category: "Chest", equipment: "Bodyweight", level: "Beginner" },
      { name: "Pull-up", category: "Back", equipment: "Pull-up Bar", level: "Intermediate" },
      { name: "Barbell Bench Press", category: "Chest", equipment: "Barbell", level: "Intermediate" },
      { name: "Dumbbell Shoulder Press", category: "Shoulders", equipment: "Dumbbells", level: "Beginner" },
      { name: "Barbell Squat", category: "Legs", equipment: "Barbell", level: "Advanced" },
      { name: "Bodyweight Squat", category: "Legs", equipment: "Bodyweight", level: "Beginner" },
      { name: "Dumbbell Bicep Curl", category: "Arms", equipment: "Dumbbells", level: "Beginner" },
      { name: "Tricep Dips", category: "Arms", equipment: "Bodyweight", level: "Intermediate" },
      { name: "Plank", category: "Core", equipment: "Bodyweight", level: "Beginner" },
      { name: "Deadlift", category: "Back", equipment: "Barbell", level: "Advanced" },
    ];

    await db.collection("exercises").insertMany(exercises);
    return { success: true, message: "Successfully seeded exercise database!" };
  } catch (error) {
    console.error("Seeding error:", error);
    return { success: false, error: "Failed to seed exercises" };
  }
}