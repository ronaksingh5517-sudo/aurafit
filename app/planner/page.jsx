"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getActiveUserId } from "@/lib/authHelper";

export default function PlannerPage() {
  const [mealPlan, setMealPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleGenerateMealPlan = async () => {
    setLoading(true);
    setMessage("");

    try {
      const userId = getActiveUserId();
      const res = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, planType: "meal" }),
      });

      const data = await res.json();
      if (data.success) {
        setMealPlan(data.plan);
        setMessage("🥗 AI personalized meal plan generated successfully!");
      } else {
        setMessage("Failed to generate meal plan.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error during meal plan generation.");
    } finally {
      setLoading(false);
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
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>AI Meal & Nutrition Planner 🥗</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* Generator Card */}
        <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "15px", color: "#38bdf8" }}>Generate Daily Nutrition Plan</h3>
          <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#94a3b8" }}>
            Tailored precisely to your profile's calorie target and fitness goals.
          </p>

          {message && (
            <div style={{ padding: "10px", background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", borderRadius: "10px", color: "#4ade80", fontSize: "13px", marginBottom: "14px" }}>
              {message}
            </div>
          )}

          <button
            onClick={handleGenerateMealPlan}
            disabled={loading}
            style={{ width: "100%", background: "linear-gradient(135deg, #10b981, #059669)", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}
          >
            {loading ? "Gemini AI Crafting Meal Plan..." : "Generate AI Meal Plan ⚡"}
          </button>
        </div>

        {/* Display Meal Plan */}
        {mealPlan && (
          <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "18px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#4ade80" }}>{mealPlan.title}</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#38bdf8" }}>Target Calories: {mealPlan.totalCalories} kcal</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {mealPlan.meals?.map((m, idx) => (
                <div key={idx} style={{ background: "rgba(0,0,0,0.3)", padding: "14px", borderRadius: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>{m.name}</span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8" }}>{m.calories} kcal</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Macros — Protein: <span style={{ color: "#4ade80" }}>{m.macros?.protein || 0}g</span> | Carbs: <span style={{ color: "#facc15" }}>{m.macros?.carbs || 0}g</span> | Fats: <span style={{ color: "#ef4444" }}>{m.macros?.fats || 0}g</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}