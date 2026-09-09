"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function WaterTrackerPage() {
  const [glasses, setGlasses] = useState(0);
  const [target, setTarget] = useState(8);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userId = "default_user";

  useEffect(() => {
    fetch(`/api/water?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGlasses(data.glasses || 0);
          setTarget(data.target || 8);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const updateWater = async (newCount) => {
    if (newCount < 0) return;
    setGlasses(newCount);
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/water", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, glasses: newCount }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("💧 Water log updated in MongoDB!");
      } else {
        setMessage("Failed to update water log.");
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
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Hydration Tracker 💧</h1>
          <div style={{ width: "60px" }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>Loading hydration data from MongoDB...</div>
        ) : (
          <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px", textAlign: "center" }}>
            
            {message && (
              <div style={{ padding: "10px", background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "10px", color: "#38bdf8", fontSize: "13px", marginBottom: "20px" }}>
                {message}
              </div>
            )}

            <div style={{ fontSize: "48px", fontWeight: 900, color: "#38bdf8", marginBottom: "6px" }}>
              {glasses} <span style={{ fontSize: "20px", color: "#94a3b8" }}>/ {target} Glasses</span>
            </div>
            <p style={{ margin: "0 0 24px 0", fontSize: "13px", color: "#94a3b8" }}>
              Goal: Stay hydrated to maximize muscle recovery & fat burning.
            </p>

            {/* Glass Icons Grid */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
              {Array.from({ length: target }).map((_, index) => {
                const isFilled = index < glasses;
                return (
                  <div
                    key={index}
                    onClick={() => updateWater(isFilled ? index : index + 1)}
                    style={{
                      width: "44px",
                      height: "56px",
                      background: isFilled ? "rgba(56, 189, 248, 0.25)" : "rgba(255,255,255,0.05)",
                      border: `2px solid ${isFilled ? "#38bdf8" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: "20px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {isFilled ? "🥛" : "🫙"}
                  </div>
                );
              })}
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={() => updateWater(glasses + 1)}
                style={{ background: "#38bdf8", color: "#000000", border: "none", borderRadius: "12px", padding: "12px 24px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}
              >
                + Add Glass 🥛
              </button>
              <button
                onClick={() => updateWater(Math.max(0, glasses - 1))}
                style={{ background: "rgba(255,255,255,0.1)", color: "#ffffff", border: "none", borderRadius: "12px", padding: "12px 20px", fontSize: "14px", fontWeight: 700, cursor: "pointer" }}
              >
                - Remove
              </button>
            </div>

            {saving && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "12px" }}>Saving to database...</div>}

          </div>
        )}

      </div>
    </div>
  );
}