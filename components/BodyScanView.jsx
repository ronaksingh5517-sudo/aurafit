"use client";

import { useState, useRef } from "react";
import Link from "next/link";

export default function BodyScanView() {
  const fileInputRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [activeViewTab, setActiveViewTab] = useState("front"); // 'front' | 'side'

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setCapturedImage(url);
    triggerNeuralScan();
  };

  const triggerNeuralScan = () => {
    setIsScanning(true);
    setScanData(null);

    // Simulated 3.2-sec 3D Landmark & Posture Computation
    setTimeout(() => {
      setIsScanning(false);
      setScanData({
        postureScore: 84,
        bodyFatEstimate: "16.4%",
        symmetryIndex: "92%",
        leanMass: "59.8 kg",
        alignment: {
          shoulders: "Balanced (0.4° deviation)",
          pelvis: "Neutral Spine Tilt",
          neck: "Mild Forward Head Shift (+8mm)",
        },
        focusAreas: [
          "Upper Trapezius & Neck Mobility",
          "Glute Medius Stability on Leg Drives",
          "Lower Pec Hypertrophy Potential",
        ],
        coachRecommendation: "Overall athletic symmetry is high. Add 2 sets of chin tucks & doorway pec stretches daily to correct the minor forward head shift.",
      });
    }, 3200);
  };

  const resetScan = () => {
    setCapturedImage(null);
    setScanData(null);
    setIsScanning(false);
  };

  return (
    <>
      <style jsx>{`
        .scan-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 10%, #151824 0%, #080a0e 85%);
          color: #ffffff;
          padding-bottom: 90px;
          box-sizing: border-box;
          font-family: system-ui, sans-serif;
          width: 100%;
          overflow-x: hidden;
        }

        .scan-navbar {
          background: rgba(18, 22, 34, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .nav-content {
          max-width: 800px;
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

        .scan-body {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 16px 0;
          box-sizing: border-box;
          width: 100%;
        }

        .scan-card {
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: clamp(20px, 4.5vw, 28px);
          backdrop-filter: blur(16px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
        }

        .view-switch {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .view-btn {
          padding: 8px;
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 13px;
          font-weight: 700;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .view-btn.active {
          background: rgba(255, 75, 43, 0.2);
          color: #ffffff;
          border: 1px solid rgba(255, 75, 43, 0.35);
        }

        /* Viewfinder Frame */
        .viewfinder {
          position: relative;
          width: 100%;
          aspect-ratio: 3 / 4;
          max-height: 420px;
          border-radius: 18px;
          background: #000;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px dashed rgba(255, 75, 43, 0.3);
          cursor: pointer;
        }
        .viewfinder-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Silhouette outline hint */
        .silhouette-guide {
          position: absolute;
          inset: 12px;
          border: 1px dashed rgba(255, 255, 255, 0.25);
          border-radius: 14px;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
        }
        .guide-tag {
          background: rgba(0, 0, 0, 0.6);
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          color: #cbd5e1;
          font-weight: 600;
        }

        /* Grid Scanning Animation */
        .laser-matrix {
          position: absolute;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ffe600, #ff416c, #ffe600, transparent);
          box-shadow: 0 0 20px 4px rgba(255, 75, 43, 0.9);
          animation: matrixScan 2.4s infinite ease-in-out alternate;
        }
        @keyframes matrixScan {
          0% { top: 4%; }
          100% { top: 96%; }
        }

        /* Metrics Display */
        .stats-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 20px 0 16px;
        }
        .stat-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px 6px;
          text-align: center;
        }
        .stat-val {
          font-size: clamp(16px, 4vw, 22px);
          font-weight: 900;
          margin: 4px 0 2px 0;
        }
        .stat-lbl {
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }

        .alignment-list {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 14px;
          margin-bottom: 16px;
        }
        .align-row {
          display: flex;
          justify-content: space-between;
          font-size: 13px;
          padding: 6px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .align-row:last-child {
          border-bottom: none;
        }

        .cta-btn {
          width: 100%;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          border: none;
          color: #ffffff;
          padding: 14px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .cta-btn:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }
      `}</style>

      <div className="scan-container">
        {/* Navigation Bar */}
        <nav className="scan-navbar">
          <div className="nav-content">
            <Link href="/dashboard" className="btn-back">
              ← Dashboard
            </Link>
            <span style={{ fontWeight: 800, fontSize: "16px" }}>AI Body Scan Studio</span>
            <div style={{ width: "60px" }}></div>
          </div>
        </nav>

        <div className="scan-body">
          <div className="scan-card">
            {/* Front / Side View Toggle */}
            <div className="view-switch">
              <button
                type="button"
                className={`view-btn ${activeViewTab === "front" ? "active" : ""}`}
                onClick={() => setActiveViewTab("front")}
              >
                🧍 Front View Angle
              </button>
              <button
                type="button"
                className={`view-btn ${activeViewTab === "side" ? "active" : ""}`}
                onClick={() => setActiveViewTab("side")}
              >
                🚶 Side Profile Angle
              </button>
            </div>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            {/* Viewfinder Target */}
            {!capturedImage && (
              <div className="viewfinder" onClick={() => fileInputRef.current?.click()}>
                <div className="silhouette-guide">
                  <span className="guide-tag">Stand 6-8 ft away · Full Body</span>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "44px", marginBottom: "8px" }}>📸</div>
                    <div style={{ fontWeight: 800, fontSize: "16px" }}>Tap to Capture or Upload</div>
                    <div style={{ fontSize: "12.5px", color: "#94a3b8", marginTop: "4px" }}>
                      Natural posture · Good ambient light
                    </div>
                  </div>
                  <span className="guide-tag">Feet Shoulder Width</span>
                </div>
              </div>
            )}

            {capturedImage && (
              <div>
                <div className="viewfinder" style={{ borderStyle: "solid" }}>
                  <img src={capturedImage} alt="Body Silhouette" className="viewfinder-img" />
                  {isScanning && <div className="laser-matrix"></div>}
                </div>

                {isScanning && (
                  <div style={{ textAlign: "center", marginTop: "16px" }}>
                    <div style={{ color: "#ffe600", fontWeight: 800, fontSize: "14px" }}>
                      ⚡ AuraNet Vision 3D Mesh Mapping...
                    </div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                      Analyzing pelvic tilt, shoulder symmetry & muscular balance
                    </div>
                  </div>
                )}

                {scanData && (
                  <div style={{ marginTop: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "18px", margin: 0 }}>Biomechanical Analysis</h3>
                      <span style={{ color: "#4ade80", fontSize: "12px", fontWeight: 800 }}>
                        Accuracy 98.2%
                      </span>
                    </div>

                    <div className="stats-grid-3">
                      <div className="stat-card">
                        <div className="stat-lbl">Posture Score</div>
                        <div className="stat-val" style={{ color: "#ffe600" }}>
                          {scanData.postureScore}/100
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-lbl">Body Fat Est.</div>
                        <div className="stat-val" style={{ color: "#ff5232" }}>
                          {scanData.bodyFatEstimate}
                        </div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-lbl">Symmetry</div>
                        <div className="stat-val" style={{ color: "#4ade80" }}>
                          {scanData.symmetryIndex}
                        </div>
                      </div>
                    </div>

                    <div className="alignment-list">
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#cbd5e1", marginBottom: "8px", textTransform: "uppercase" }}>
                        Kinetic Chain Alignment:
                      </div>
                      <div className="align-row">
                        <span style={{ color: "#94a3b8" }}>Shoulders</span>
                        <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{scanData.alignment.shoulders}</span>
                      </div>
                      <div className="align-row">
                        <span style={{ color: "#94a3b8" }}>Pelvis & Hip</span>
                        <span style={{ color: "#f1f5f9", fontWeight: 700 }}>{scanData.alignment.pelvis}</span>
                      </div>
                      <div className="align-row">
                        <span style={{ color: "#94a3b8" }}>Cervical Spine</span>
                        <span style={{ color: "#ffe600", fontWeight: 700 }}>{scanData.alignment.neck}</span>
                      </div>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.04)", padding: "14px", borderRadius: "14px", marginBottom: "18px" }}>
                      <div style={{ fontSize: "12px", fontWeight: 800, color: "#cbd5e1" }}>🤖 AI Coach Prescription:</div>
                      <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0 0", lineHeight: 1.5 }}>
                        {scanData.coachRecommendation}
                      </p>
                    </div>

                    <button className="cta-btn" onClick={resetScan}>
                      Save & Scan Next Angle →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}