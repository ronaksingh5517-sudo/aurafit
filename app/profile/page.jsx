"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [goal, setGoal] = useState("");
  const [dailyCalories, setDailyCalories] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [workoutPreference, setWorkoutPreference] = useState("home");
  const [equipment, setEquipment] = useState("None");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userId = "default_user";

  useEffect(() => {
    fetch(`/api/profile?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setGoal(data.profile.goal || "");
          setDailyCalories(data.profile.dailyCalories || "");
          setCurrentWeight(data.profile.currentWeight || "");
          setWorkoutPreference(data.profile.workoutPreference || "home");
          setEquipment(data.profile.equipment || "None");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, goal, dailyCalories, currentWeight, workoutPreference, equipment }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Profile & Workout preferences saved successfully!");
      } else {
        setMessage("Failed to save profile.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", padding: "24px 16px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Fitness Profile & Setup ⚙️</h1>
          <div style={{ width: "60px" }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>Loading profile from MongoDB...</div>
        ) : (
          <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" }}>
            
            {message && (
              <div style={{ padding: "12px", background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", borderRadius: "12px", color: "#4ade80", fontSize: "13px", marginBottom: "20px", textAlign: "center" }}>
                {message}
              </div>
            )}

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Fitness Goal</label>
                <input
                  type="text"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Muscle Building & Fat Loss"
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Daily Calorie Target</label>
                  <input
                    type="number"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(e.target.value)}
                    style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Current Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Workout Environment</label>
                <select
                  value={workoutPreference}
                  onChange={(e) => setWorkoutPreference(e.target.value)}
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                >
                  <option value="home">Home Workout (Bodyweight / Minimal)</option>
                  <option value="gym">Gym Workout (Full Instruments & Weights)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px" }}>Available Equipment / Instruments</label>
                <input
                  type="text"
                  value={equipment}
                  onChange={(e) => setEquipment(e.target.value)}
                  placeholder="e.g. Dumbbells, Resistance Bands, Pull-up Bar or None"
                  style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px", color: "#ffffff", fontSize: "14px", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                style={{ width: "100%", background: "linear-gradient(135deg, #ff416c, #ff4b2b)", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontWeight: 800, fontSize: "15px", cursor: "pointer", marginTop: "10px" }}
              >
                {saving ? "Saving to MongoDB..." : "Save Profile & Preferences 🚀"}
              </button>

            </form>

          </div>
        )}

      </div>
    </div>
  );
}