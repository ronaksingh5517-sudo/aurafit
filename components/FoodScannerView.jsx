"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function FoodScannerView() {
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);
  const [errorType, setErrorType] = useState(null); // 'non-food' | 'busy'
  const { recordMealDone, triggerToast } = useApp();

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
      runRealGeminiScan(reader.result);
    };
  };

  const runRealGeminiScan = async (base64Data) => {
    setIsScanning(true);
    setScanError(null);
    setErrorType(null);
    setScanResult(null);

    try {
      const res = await fetch("/api/scan-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data }),
      });

      const data = await res.json();

      if (data.apiError) {
        setErrorType("busy");
        setScanError(data.errorMessage);
      } else if (data.isFood === false) {
        setErrorType("non-food");
        setScanError(data.errorMessage || "No food detected! Please upload real food.");
      } else if (data.isFood === true) {
        setScanResult(data);
      } else {
        setErrorType("busy");
        setScanError("Server response incomplete. Please try again.");
      }
    } catch (err) {
      console.error("Scanner client error:", err);
      setErrorType("busy");
      setScanError("Connection interrupted. Check network & try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleLogMeal = () => {
    if (!scanResult) return;
    recordMealDone(scanResult);
    triggerToast(`Logged ${scanResult.dishName} to your daily budget!`);
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
          aspect-ratio: 4 / 3;
          max-height: 380px;
          border-radius: 16px;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255, 75, 43, 0.35);
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
          background: linear-gradient(90deg, transparent, #ff416c, #ffe600, #ff416c, transparent);
          box-shadow: 0 0 16px 3px rgba(255, 75, 43, 0.9);
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

        .busy-card {
          margin-top: 18px;
          background: rgba(234, 179, 8, 0.1);
          border: 1px solid rgba(234, 179, 8, 0.35);
          border-radius: 14px;
          padding: 16px;
          text-align: center;
        }

        .result-box {
          margin-top: 20px;
          text-align: left;
        }

        .macros-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 16px 0;
        }
        .macro-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          padding: 10px 6px;
          text-align: center;
        }
        .macro-val {
          font-size: 16px;
          font-weight: 800;
          margin-top: 2px;
        }
        .macro-lbl {
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }

        .btn-log {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }
      `}</style>

      <div className="scanner-container">
        <header className="scanner-navbar">
          <div className="nav-inner">
            <Link href="/dashboard" className="btn-back">
              ← Dashboard
            </Link>
            <span style={{ fontWeight: 800, fontSize: "16px" }}>Gemini Vision Food Scan</span>
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
                  <div style={{ fontSize: "52px", marginBottom: "8px" }}>📸</div>
                  <div style={{ fontWeight: 800, fontSize: "16px" }}>Tap to Click or Upload Food</div>
                  <div style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "4px" }}>
                    Identify calories, protein, carbs & fats via Gemini Vision
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="camera-box" style={{ borderStyle: "solid" }}>
                  <img src={selectedImage} alt="Food Scan" className="preview-img" />
                  {isScanning && <div className="laser-beam"></div>}
                </div>

                {isScanning && (
                  <div style={{ marginTop: "16px", color: "#ffe600", fontWeight: 800, fontSize: "14px" }}>
                    ⚡ Analyzing Image with Gemini Vision...
                  </div>
                )}

                {scanError && errorType === "non-food" && (
                  <div className="error-card">
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>🚫</div>
                    <div style={{ color: "#f87171", fontWeight: 800, fontSize: "15px" }}>
                      Not A Food Item!
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
                      Try Real Food Image
                    </button>
                  </div>
                )}

                {scanError && errorType === "busy" && (
                  <div className="busy-card">
                    <div style={{ fontSize: "28px", marginBottom: "6px" }}>⏳</div>
                    <div style={{ color: "#facc15", fontWeight: 800, fontSize: "15px" }}>
                      High Server Demand
                    </div>
                    <p style={{ color: "#cbd5e1", fontSize: "13px", margin: "6px 0 14px 0" }}>
                      {scanError}
                    </p>
                    <button
                      onClick={handleReset}
                      style={{
                        background: "rgba(250, 204, 21, 0.15)",
                        border: "1px solid rgba(250, 204, 21, 0.4)",
                        color: "#facc15",
                        padding: "8px 18px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Tap to Rescan
                    </button>
                  </div>
                )}

                {scanResult && !scanError && (
                  <div className="result-box">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: 800, margin: 0 }}>
                        {scanResult.dishName}
                      </h3>
                      <span style={{ fontSize: "22px", fontWeight: 900, color: "#ffe600" }}>
                        {scanResult.calories} kcal
                      </span>
                    </div>

                    <div className="macros-grid">
                      <div className="macro-card">
                        <div className="macro-lbl">Protein</div>
                        <div className="macro-val" style={{ color: "#ff5232" }}>
                          {scanResult.macros?.protein || "0g"}
                        </div>
                      </div>
                      <div className="macro-card">
                        <div className="macro-lbl">Carbs</div>
                        <div className="macro-val" style={{ color: "#38bdf8" }}>
                          {scanResult.macros?.carbs || "0g"}
                        </div>
                      </div>
                      <div className="macro-card">
                        <div className="macro-lbl">Fats</div>
                        <div className="macro-val" style={{ color: "#facc15" }}>
                          {scanResult.macros?.fat || "0g"}
                        </div>
                      </div>
                    </div>

                    {scanResult.coachTip && (
                      <div
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          padding: "12px",
                          marginBottom: "16px",
                          fontSize: "13px",
                          color: "#cbd5e1",
                        }}
                      >
                        🤖 <strong>Coach Tip:</strong> {scanResult.coachTip}
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        style={{
                          flex: 1,
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
                        Rescan
                      </button>
                      <button className="btn-log" style={{ flex: 2 }} onClick={handleLogMeal}>
                        Log Meal to Dashboard →
                      </button>
                    </div>
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