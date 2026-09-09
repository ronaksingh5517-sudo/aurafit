"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function BodyScannerView() {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [errorType, setErrorType] = useState(null);
  const { triggerToast } = useApp();

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError(null);
    setErrorType(null);
    setScanResult(null);

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      runRealBodyScan(reader.result);
    };
  };

  const runRealBodyScan = async (base64Data) => {
    setIsScanning(true);
    setScanError(null);
    setErrorType(null);
    setScanResult(null);

    try {
      const res = await fetch("/api/body-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      const data = await res.json();

      if (data.apiError) {
        setErrorType("busy");
        setScanError(data.errorMessage);
      } else if (data.isBody === false) {
        setErrorType("not-body");
        setScanError(data.errorMessage || "No human body detected.");
      } else if (data.isBody === true) {
        setScanResult(data);
        triggerToast("📸 AI Body & Posture Analysis Complete!");
      }
    } catch (err) {
      console.error("Body scan client error:", err);
      setErrorType("busy");
      setScanError("Connection interrupted. Check network & try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setScanResult(null);
    setScanError(null);
    setErrorType(null);
    setIsScanning(false);
  };

  return (
    <>
      <style jsx>{`
        .scanner-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: #080a0e;
          color: #ffffff;
          padding-bottom: 90px;
          box-sizing: border-box;
          font-family: system-ui, sans-serif;
          width: 100%;
          overflow-x: hidden;
        }

        .scanner-navbar {
          background: rgba(18, 22, 34, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .nav-inner {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .btn-back {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          padding: 8px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .scanner-body {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 16px 0;
          box-sizing: border-box;
          width: 100%;
        }

        .viewfinder-card {
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 20px;
          backdrop-filter: blur(16px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
          text-align: center;
        }

        .camera-box {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          max-height: 400px;
          border-radius: 16px;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(56, 189, 248, 0.4);
          cursor: pointer;
        }
        .preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .laser-beam {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #38bdf8, #ffe600, #38bdf8, transparent);
          box-shadow: 0 0 16px 3px rgba(56, 189, 248, 0.9);
          animation: scanMotion 2.2s infinite ease-in-out alternate;
        }
        @keyframes scanMotion {
          0% { top: 4%; }
          100% { top: 96%; }
        }

        .error-card {
          margin-top: 18px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.35);
          border-radius: 14px;
          padding: 16px;
          text-align: center;
        }

        .result-box {
          margin-top: 20px;
          text-align: left;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin: 16px 0;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }
        .stat-val {
          font-size: 17px;
          font-weight: 800;
          margin-top: 2px;
          color: #38bdf8;
        }
        .stat-lbl {
          font-size: 10.5px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }
      `}</style>

      <div className="scanner-container">
        <header className="scanner-navbar">
          <div className="nav-inner">
            <Link href="/dashboard" className="btn-back">
              ← Dashboard
            </Link>
            <span style={{ fontWeight: 800, fontSize: "16px" }}>AI Body & Posture Scan</span>
            <div style={{ width: "60px" }}></div>
          </div>
        </header>

        <main className="scanner-body">
          <div className="viewfinder-card">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />

            {!selectedImage ? (
              <div className="camera-box" onClick={() => fileInputRef.current?.click()}>
                <div>
                  <div style={{ fontSize: "52px", marginBottom: "8px" }}>🧍‍♂️</div>
                  <div style={{ fontWeight: 800, fontSize: "16px" }}>Upload Physique / Posture Photo</div>
                  <div style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "4px" }}>
                    Analyze body composition & alignment via Gemini Vision
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="camera-box" style={{ borderStyle: "solid" }}>
                  <img src={selectedImage} alt="Body Scan" className="preview-img" />
                  {isScanning && <div className="laser-beam"></div>}
                </div>

                {isScanning && (
                  <div style={{ marginTop: "16px", color: "#38bdf8", fontWeight: 800, fontSize: "14px" }}>
                    ⚡ Analyzing Posture & Body Metrics with Gemini...
                  </div>
                )}

                {scanError && (
                  <div className="error-card">
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>⚠️</div>
                    <div style={{ color: "#f87171", fontWeight: 800, fontSize: "15px" }}>
                      Scan Notice
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: "13px", margin: "6px 0 14px 0" }}>
                      {scanError}
                    </p>
                    <button
                      onClick={handleReset}
                      style={{
                        background: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "#fff",
                        padding: "8px 18px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Try Another Photo
                    </button>
                  </div>
                )}

                {scanResult && !scanError && (
                  <div className="result-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: 800, margin: 0 }}>
                        {scanResult.physiqueType}
                      </h3>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: "#4ade80" }}>
                        Score: {scanResult.postureScore}
                      </span>
                    </div>

                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-lbl">Est. Body Fat</div>
                        <div className="stat-val">{scanResult.estimatedBodyFat}</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-lbl">Posture Status</div>
                        <div className="stat-val" style={{ color: "#facc15" }}>Optimized</div>
                      </div>
                    </div>

                    {scanResult.feedback && (
                      <div
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          padding: "12px",
                          marginBottom: "12px",
                          fontSize: "13px",
                          color: "#cbd5e1",
                        }}
                      >
                        🔍 <strong>Analysis:</strong> {scanResult.feedback}
                      </div>
                    )}

                    {scanResult.actionableTip && (
                      <div
                        style={{
                          background: "rgba(56, 189, 248, 0.08)",
                          border: "1px solid rgba(56, 189, 248, 0.2)",
                          borderRadius: "12px",
                          padding: "12px",
                          marginBottom: "16px",
                          fontSize: "13px",
                          color: "#e0f2fe",
                        }}
                      >
                        💡 <strong>Action Tip:</strong> {scanResult.actionableTip}
                      </div>
                    )}

                    <button
                      style={{
                        width: "100%",
                        padding: "14px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: "rgba(255,255,255,0.06)",
                        color: "#ffffff",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      onClick={handleReset}
                    >
                      Scan Another Photo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}