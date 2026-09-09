"use client";

import { useState } from "react";
import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";

export default function BodyScanPage() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
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

        const res = await fetch("/api/body-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, image: base64data }),
        });

        const data = await res.json();
        if (data.success) {
          setResult(data.analysis);
        } else {
          setErrorMsg("Failed to analyze body posture.");
        }
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during posture scan.");
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
          <h1 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>Body Posture Scanner 🧍‍♂️</h1>
          <div style={{ width: "40px" }}></div>
        </div>

        {/* Input Card */}
        <div style={{ background: "rgba(18,22,34,0.85)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 14px 0", fontSize: "15px", color: "#38bdf8" }}>Capture or Upload Physique Photo</h3>

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
              <img src={previewUrl} alt="Posture Preview" style={{ maxWidth: "100%", height: "200px", objectFit: "cover", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }} />
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={loading || !imageFile}
            style={{ width: "100%", background: loading ? "#64748b" : "linear-gradient(135deg, #a855f7, #6366f1)", color: "#ffffff", border: "none", borderRadius: "12px", padding: "14px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}
          >
            {loading ? "Gemini AI Analyzing Posture..." : "Analyze Posture & Save to MongoDB 🚀"}
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
            <h3 style={{ margin: "0 0 10px 0", fontSize: "16px", color: "#a855f7" }}>🧍 Posture & Alignment Report</h3>
            <p style={{ fontSize: "14px", color: "#ffffff", lineHeight: 1.5, margin: "0 0 12px 0" }}>{result.feedback || result.summary}</p>
            {result.score && (
              <div style={{ background: "rgba(0,0,0,0.3)", padding: "12px", borderRadius: "10px", textAlign: "center" }}>
                Posture Score: <span style={{ color: "#4ade80", fontWeight: 800, fontSize: "16px" }}>{result.score} / 100</span>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}