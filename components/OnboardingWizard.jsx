"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    goal: "Fat Loss & Muscle Building",
    dailyCalories: 2000,
    currentWeight: 70,
    workoutPreference: "home",
    equipment: "None (Bodyweight only)",
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handlePrev = () => setStep((prev) => Math.max(1, prev - 1));

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFinish = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "default_user", ...formData }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/dashboard");
      } else {
        alert("Failed to save profile.");
        setIsGenerating(false);
      }
    } catch (err) {
      console.error(err);
      alert("Network error while saving.");
      setIsGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", padding: "24px 16px", fontFamily: "system-ui, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box" }}>
      <div style={{ width: "100%", maxWidth: "480px", background: "rgba(18,22,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", padding: "24px" }}>
        
        <div style={{ fontSize: "12px", fontWeight: 700, color: "#38bdf8", marginBottom: "8px", textTransform: "uppercase" }}>
          Step {step} of 3 - FullyWorkout Setup
        </div>

        {step === 1 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 16px 0" }}>What is your primary fitness goal?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {["Fat Loss & Weight Cut", "Muscle Building & Hypertrophy", "Overall Fitness & Endurance"].map((g) => (
                <button
                  key={g}
                  onClick={() => handleChange("goal", g)}
                  style={{
                    background: formData.goal === g ? "rgba(56, 189, 248, 0.2)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${formData.goal === g ? "#38bdf8" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px",
                    padding: "14px",
                    color: "#ffffff",
                    textAlign: "left",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 16px 0" }}>Set your targets & current weight</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Daily Calories Target (kcal)</label>
                <input
                  type="number"
                  value={formData.dailyCalories}
                  onChange={(e) => handleChange("dailyCalories", e.target.value)}
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", boxSizing: "border-box", outline: "none" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Current Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) => handleChange("currentWeight", e.target.value)}
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", boxSizing: "border-box", outline: "none" }}
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 16px 0" }}>Where do you prefer to train?</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Workout Environment</label>
                <select
                  value={formData.workoutPreference}
                  onChange={(e) => handleChange("workoutPreference", e.target.value)}
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", boxSizing: "border-box", outline: "none" }}
                >
                  <option value="home">Home Workout (Bodyweight)</option>
                  <option value="gym">Gym Workout (Full Instruments)</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Available Equipment</label>
                <input
                  type="text"
                  value={formData.equipment}
                  onChange={(e) => handleChange("equipment", e.target.value)}
                  placeholder="e.g. Dumbbells, Resistance Bands"
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", boxSizing: "border-box", outline: "none" }}
                />
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "24px" }}>
          {step > 1 ? (
            <button
              onClick={handlePrev}
              style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}
            >
              Back
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={handleNext}
              style={{ background: "#38bdf8", color: "#000000", border: "none", borderRadius: "10px", padding: "10px 24px", fontWeight: 800, cursor: "pointer" }}
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isGenerating}
              style={{ background: "linear-gradient(135deg, #ff416c, #ff4b2b)", color: "#ffffff", border: "none", borderRadius: "10px", padding: "10px 24px", fontWeight: 800, cursor: "pointer" }}
            >
              {isGenerating ? "Saving..." : "Finish & Start 🚀"}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}