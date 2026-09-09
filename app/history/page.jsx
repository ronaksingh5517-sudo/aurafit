"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HistoryPage() {
  const [data, setData] = useState({ meals: [], bodyScans: [], workouts: [] });
  const [loading, setLoading] = useState(true);

  const userId = "default_user";

  const fetchHistory = () => {
    setLoading(true);
    fetch(`/api/history?userId=${userId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData((prev) => ({ ...prev, meals: resData.meals || [], bodyScans: resData.bodyScans || [] }));
        }
      })
      .catch((err) => console.error("History fetch error:", err));

    fetch(`/api/workouts?userId=${userId}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setData((prev) => ({ ...prev, workouts: resData.workouts || [] }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Workouts fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, collectionName) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch("/api/history/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, id, collectionName }),
      });
      const result = await res.json();
      if (result.success) {
        fetchHistory(); // Refresh logs
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error while deleting.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", padding: "24px 16px", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Progress & History Logs</h1>
          <div style={{ width: "60px" }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>Loading logs from MongoDB...</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Scanned Meals Section */}
            <div>
              <h3 style={{ fontSize: "16px", color: "#4ade80", marginBottom: "12px" }}>🍽️ Scanned Meals</h3>
              {data.meals.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "13px" }}>No meals scanned yet.</p>
              ) : (
                data.meals.map((meal) => (
                  <div key={meal._id} style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", gap: "12px", fontWeight: 700 }}>
                        <span>{meal.dishName}</span>
                        <span style={{ color: "#38bdf8" }}>{meal.calories} kcal</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        Protein: {meal.macros?.protein} | Carbs: {meal.macros?.carbs} | Fat: {meal.macros?.fat}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(meal._id, "meals")}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Workouts Section */}
            <div>
              <h3 style={{ fontSize: "16px", color: "#ffc107", marginBottom: "12px" }}>🏋️‍♂️ Completed Workouts</h3>
              {data.workouts.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "13px" }}>No workouts logged yet.</p>
              ) : (
                data.workouts.map((workout) => (
                  <div key={workout._id} style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", gap: "12px", fontWeight: 700 }}>
                        <span>{workout.title}</span>
                        <span style={{ color: "#ffc107" }}>{workout.durationMinutes} mins</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        Exercises: {workout.exercisesCompleted?.join(", ") || "None"}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(workout._id, "workouts")}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Body Scans Section */}
            <div>
              <h3 style={{ fontSize: "16px", color: "#38bdf8", marginBottom: "12px" }}>🧍‍♂️ Body Posture Scans</h3>
              {data.bodyScans.length === 0 ? (
                <p style={{ color: "#64748b", fontSize: "13px" }}>No body scans recorded yet.</p>
              ) : (
                data.bodyScans.map((scan) => (
                  <div key={scan._id} style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "14px", marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ display: "flex", gap: "12px", fontWeight: 700 }}>
                        <span>{scan.physiqueType}</span>
                        <span style={{ color: "#4ade80" }}>Score: {scan.postureScore}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                        Est. Body Fat: {scan.estimatedBodyFat}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(scan._id, "body_scans")}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", cursor: "pointer", fontWeight: 700 }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}