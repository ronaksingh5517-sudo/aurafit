import { gymTransformationData } from "@/data/gym-transformation";

export function getWorkoutPlan(parentChoice, childGoal) {
  // Check karo ki user ne strict "gym" aur "transformation" select kiya hai ya nahi
  const isGymTransformation = parentChoice === "gym" && childGoal === "transformation";

  if (!isGymTransformation) {
    return {
      title: "🚧 Program Coming Soon",
      isComingSoon: true,
      days: []
    };
  }

  // Agar gym transformation hai toh asli 30 days ka data bhej do
  return {
    title: gymTransformationData?.title || "🏋️‍♂️ Gym 30-Day Ultimate Transformation",
    isComingSoon: false,
    days: gymTransformationData?.days || []
  };
}