"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveUserId } from "@/lib/authHelper";

export default function WorkoutPage() {
  const [workouts, setWorkouts] = useState([]);
  const [aiPlan, setAiPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchWorkouts = (userId) => {
    fetch(`/api/workout?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setWorkouts(data.workouts || []);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const userId = getActiveUserId();
    fetchWorkouts(userId);
  }, []);

  const handleGenerateAIWorkout = async () => {
    setGenerating(true);
    setMessage("");

    try {
      const userId = getActiveUserId();
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planType: "workout" }),
      });

      const data = await res.json();
      if (data.success) {
        setAiPlan(data.plan);
        setMessage("⚡ AI custom workout routine generated successfully!");
        fetchWorkouts(userId);
      } else {
        setMessage("Failed to generate AI workout.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error during generation.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", padding: "24px 16px 90px 16px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
            ← Back
          </Link>
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Workout Tracker & AI Routine 🏋️‍♂️</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* AI Generator Action Card */}
        <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "15px", color: "#38bdf8" }}>Generate AI Workout Routine</h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#94a3b8" }}>
            Based on your profile preference (Home/Gym) and equipment availability.
          </p>

          {message && (
            <div style={{ padding: "10px", background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", borderRadius: "10px", color: "#4ade80", fontSize: "13px", marginBottom: "14px" }}>
              {message}
            </div>
          )}

          <button
            onClick={handleGenerateAIWorkout}
            disabled={generating}
            style={{ width: "100%", background: "linear-gradient(135deg, #38bdf8, #2563eb)", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}
          >
            {generating ? "Gemini AI Building Routine..." : "Generate Custom Workout Plan ⚡"}
          </button>
        </div>

        {/* Display Generated AI Routine */}
        {aiPlan && (
          <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(56,189,248,0.3)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#4ade80" }}>{aiPlan.title}</h3>
            <p style={{ margin: "0 0 14px 0", fontSize: "13px", color: "#94a3b8" }}>Focus: {aiPlan.focusArea}</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {aiPlan.exercises?.map((ex, idx) => (
                <div key={idx} style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>{ex.name}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Target: {ex.targetMuscle}</div>
                  </div>
                  <div style={{ fontSize: "13px", fontWeight: 800, color: "#38bdf8" }}>
                    {ex.sets} Sets × {ex.reps} Reps
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Saved Workouts History */}
        <h3 style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "12px" }}>Saved Workout History</h3>
        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>Loading workouts from MongoDB...</div>
        ) : workouts.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "13px" }}>No workout logs found for your account.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {workouts.map((w) => (
              <div key={w._id} style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px" }}>
                <div style={{ fontSize: "14px", fontWeight: 800, color: "#ffffff" }}>{w.title || "Workout Session"}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                  {new Date(w.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}