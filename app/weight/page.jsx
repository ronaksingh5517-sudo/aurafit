"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function WeightTrackerPage() {
  const [weightInput, setWeightInput] = useState("");
  const [unit, setUnit] = useState("kg");
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userId = "default_user";

  const fetchWeights = () => {
    setLoading(true);
    fetch(`/api/weight?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Sort ascending by date for the chart graph
          const sorted = (data.weights || []).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setHistory(sorted);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!weightInput || saving) return;

    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, weight: weightInput, unit }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("⚖️ Weight logged to MongoDB successfully!");
        setWeightInput("");
        fetchWeights();
      } else {
        setMessage("Failed to save weight.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Network error while saving weight.");
    } finally {
      setSaving(false);
    }
  };

  // Simple SVG Chart data calculation
  const weightsOnly = history.map((h) => h.weight);
  const minWeight = weightsOnly.length ? Math.min(...weightsOnly) - 2 : 50;
  const maxWeight = weightsOnly.length ? Math.max(...weightsOnly) + 2 : 100;
  const range = maxWeight - minWeight || 1;

  const points = history.map((item, index) => {
    const x = history.length === 1 ? 150 : (index / (history.length - 1)) * 280 + 10;
    const y = 130 - ((item.weight - minWeight) / range) * 100;
    return { x, y, ...item };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", padding: "24px 16px 90px 16px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
            ← Back
          </Link>
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Weight Progress & Graph ⚖️</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* Input Form Card */}
        <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 14px 0", fontSize: "15px", color: "#38bdf8" }}>Log Today's Body Weight</h3>

          {message && (
            <div style={{ padding: "10px", background: "rgba(74, 222, 128, 0.1)", border: "1px solid rgba(74, 222, 128, 0.3)", borderRadius: "10px", color: "#4ade80", fontSize: "13px", marginBottom: "14px" }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSave} style={{ display: "flex", gap: "10px" }}>
            <input
              type="number"
              step="0.1"
              placeholder="e.g. 72.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              style={{ flex: 1, background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 16px", color: "#ffffff", fontSize: "14px", outline: "none" }}
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{ background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "0 14px", color: "#ffffff", fontSize: "14px", outline: "none" }}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              style={{ background: "#38bdf8", color: "#000000", border: "none", borderRadius: "12px", padding: "0 20px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}
            >
              Log
            </button>
          </form>
        </div>

        {/* Visual Graph Section */}
        {history.length > 1 && (
          <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", color: "#4ade80" }}>📈 Weight Trend Graph</h3>
            <div style={{ width: "100%", overflowX: "auto" }}>
              <svg viewBox="0 0 300 150" style={{ width: "100%", height: "140px" }}>
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3"
                  points={polylinePoints}
                />
                {points.map((p, idx) => (
                  <circle key={idx} cx={p.x} cy={p.y} r="4" fill="#4ade80" />
                ))}
              </svg>
            </div>
          </div>
        )}

        {/* History List */}
        <h3 style={{ fontSize: "15px", color: "#94a3b8", marginBottom: "12px" }}>Weight Log History</h3>
        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", padding: "20px" }}>Loading logs from MongoDB...</div>
        ) : history.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "13px" }}>No weight logs recorded yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {history.slice().reverse().map((item) => (
              <div key={item._id} style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff" }}>
                  {item.weight} {item.unit}
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                  {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}