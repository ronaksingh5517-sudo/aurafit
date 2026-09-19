"use client";

import { useState } from "react";
import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";

export default function FoodScannerPage() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // <-- Yeh state variable missing tha
  const [errorMsg, setErrorMsg] = useState("");

  const userId = "default_user";

  const handleFileSelect = (file) => {
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setErrorMsg("");
  };

  const handleScan = async () => {
    if (!imageFile) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = async () => {
        const base64data = reader.result;

        const res = await fetch("/api/food-scanner", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, image: base64data }),
        });

        const data = await res.json();
        if (data.success) {
          setResult(data.analysis);
        } else {
          setErrorMsg(data.error || "Failed to analyze food image.");
        }
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during scan.");
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
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Vision Food Scanner 📸</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* Input Card */}
        <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 14px 0", fontSize: "15px", color: "#38bdf8" }}>Capture or Upload Meal Photo</h3>

          <CameraCapture onCapture={handleFileSelect} />

          <div style={{ textAlign: "center", margin: "12px 0", color: "#64748b", fontSize: "12px" }}>- OR UPLOAD FROM DEVICE -</div>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files[0])}
            style={{ width: "100%", background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "10px", color: "#ffffff", fontSize: "13px", boxSizing: "border-box", marginBottom: "16px" }}
          />

          {previewUrl && (
            <div style={{ marginBottom: "16px", textAlign: "center" }}>
              <img src={previewUrl} alt="Meal Preview" style={{ maxWidth: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading || !imageFile}
            style={{ width: "100%", background: loading ? "#64748b" : "linear-gradient(135deg, #38bdf8, #2563eb)", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}
          >
            {loading ? "Gemini AI is Analyzing Macros..." : "Analyze Food & Save to MongoDB 🚀"}
          </button>
        </div>

        {errorMsg && (
          <div style={{ padding: "12px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "12px", color: "#ef4444", fontSize: "13px", textAlign: "center", marginBottom: "20px" }}>
            {errorMsg}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#4ade80" }}>🍽️ Detailed Item Breakdown</h3>
            <p style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 12px 0", color: "#fff" }}>{result.dishName}</p>

            {/* Item by Item List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {result.items && result.items.map((item, index) => (
                <div key={index} style={{ background: "rgba(0,0,0,0.4)", padding: "10px 14px", borderRadius: "10px", borderLeft: "4px solid #38bdf8" }}>
                  <div style={{ fontWeight: 700, fontSize: "14px", color: "#38bdf8", marginBottom: "4px" }}>{item.name}</div>
                  <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#cbd5e1" }}>
                    <span>Protein: <strong style={{ color: "#4ade80" }}>{item.protein}</strong></span>
                    <span>Carbs: <strong style={{ color: "#facc15" }}>{item.carbs}</strong></span>
                    <span>Fat: <strong style={{ color: "#ef4444" }}>{item.fat}</strong></span>
                    <span>Cal: <strong style={{ color: "#fff" }}>{item.calories}</strong></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary */}
            <div style={{ background: "rgba(56,189,248,0.1)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(56,189,248,0.2)" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#38bdf8", marginBottom: "6px" }}>Total Meal Macros:</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px", color: "#94a3b8" }}>
                <div>Calories: <span style={{ color: "#fff", fontWeight: 700 }}>{result.totalCalories} kcal</span></div>
                <div>Protein: <span style={{ color: "#4ade80", fontWeight: 700 }}>{result.totalProtein}</span></div>
                <div>Carbs: <span style={{ color: "#facc15", fontWeight: 700 }}>{result.totalCarbs}</span></div>
                <div>Fats: <span style={{ color: "#ef4444", fontWeight: 700 }}>{result.totalFats}</span></div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}