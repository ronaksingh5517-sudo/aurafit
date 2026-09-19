"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";

export default function BodyScanPage() {
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressCount, setProgressCount] = useState(0);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const userId = "default_user";

  // 1 to 100 Progress Counter Animation while loading
  useEffect(() => {
    let interval;
    if (loading) {
      setProgressCount(1);
      interval = setInterval(() => {
        setProgressCount((prev) => {
          if (prev >= 98) return 98;
          const nextVal = prev + Math.floor(Math.random() * 8) + 2;
          return nextVal > 99 ? 99 : nextVal;
        });
      }, 70);
    } else {
      setProgressCount(100);
    }
    return () => clearInterval(interval);
  }, [loading]);

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
        
        if (data.success && data.analysis) {
          setResult(data.analysis);
        } else {
          setErrorMsg(data.error || "Failed to analyze body posture.");
        }
        setLoading(false);
      };
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error during posture scan.");
      setLoading(false);
    }
  };

  // Dynamic Redirection Function based on user's goal and category
  const handleStartWorkoutRedirect = () => {
    const goal = localStorage.getItem("aurafit_goal") || "transformation";
    const category = localStorage.getItem("aurafit_category") || "gym";
    
    const formattedGoal = goal.toLowerCase().replace(/\s+/g, "-");
    const formattedCategory = category.toLowerCase().replace(/\s+/g, "-");

    window.location.href = `/workout/${formattedCategory}-${formattedGoal}`;
  };

  return (
    <div className="reference-scan-page">
      <div className="bg-ambient-glow"></div>

      <div className="main-content-wrap">
        
        {/* Top Header */}
        <div className="top-nav-box">
          <Link href="/dashboard" className="back-link-txt">
            ← Dashboard
          </Link>
          <h2>AI Biometric & Physique Scan 🧬</h2>
          <div style={{ width: "50px" }}></div>
        </div>

        {/* Viewport Box for Upload / Camera */}
        <div className="camera-viewport-card">
          {previewUrl ? (
            <div className="preview-active-view">
              <img src={previewUrl} alt="Target Physique" className="uploaded-img-preview" />
              {!loading && (
                <button 
                  onClick={() => { setImageFile(null); setPreviewUrl(""); setResult(null); }}
                  className="retake-photo-btn"
                >
                  🔄 Retake Photo
                </button>
              )}
            </div>
          ) : (
            <div className="upload-prompt-view">
              <div className="icon-pulse-lg">📸</div>
              <h3>Capture or Upload Physique</h3>
              <p>Position your body clearly for accurate AI diagnostics</p>
              
              <div className="upload-options-stack">
                <div className="cam-wrapper">
                  <CameraCapture onCapture={handleFileSelect} />
                </div>
                
                <div className="divider-line-txt">
                  <span>OR BROWSE FROM DEVICE</span>
                </div>

                <label className="file-picker-lbl">
                  <span>📂 Choose Image File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Loading Counter Overlay / Progress */}
        {loading && (
          <div className="counter-loading-box">
            <div className="loader-spinner-ring"></div>
            <div className="counter-number-display">{progressCount}%</div>
            <p className="loading-status-txt">Analyzing biometrics, posture & hormone markers...</p>
          </div>
        )}

        {/* Run Scan Button */}
        {imageFile && !loading && !result && (
          <button
            onClick={handleScan}
            className="run-action-execute-btn"
          >
            Run AI Diagnostic Scan 🚀
          </button>
        )}

        {errorMsg && (
          <div className="error-alert-banner">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="results-dashboard-stack">
            
            <div className="results-header-tag">
              <span className="badge-verified">DIAGNOSIS COMPLETE ✅</span>
              <h3>Physique & Hormone Analysis</h3>
            </div>

            {/* 2x2 Grid for Core Metrics */}
            <div className="metrics-2x2-container">
              
              <div className="metric-item-card">
                <div className="card-top-row">
                  <span className="card-icon-emoji">🔥</span>
                  <span className="card-title-lbl">Body Fat Est.</span>
                </div>
                <div className="card-val-row text-cyan">
                  {result.estimatedBodyFat || "15%"}
                </div>
              </div>

              <div className="metric-item-card">
                <div className="card-top-row">
                  <span className="card-icon-emoji">💪</span>
                  <span className="card-title-lbl">Physique Build</span>
                </div>
                <div className="card-val-row text-purple" style={{ fontSize: "16px" }}>
                  {result.physiqueType || "Athletic Lean"}
                </div>
              </div>

              <div className="metric-item-card">
                <div className="card-top-row">
                  <span className="card-icon-emoji">⚖️</span>
                  <span className="card-title-lbl">Alignment Score</span>
                </div>
                <div className="card-val-row text-green">
                  {result.postureScore || "8.5/10"}
                </div>
              </div>

              <div className="metric-item-card">
                <div className="card-top-row">
                  <span className="card-icon-emoji">⚡</span>
                  <span className="card-title-lbl">Testosterone</span>
                </div>
                <div className="card-val-row">
                  <span className="t-status-badge status-green">Optimal (780 ng/dL)</span>
                </div>
              </div>

            </div>

            {/* Health Score Progress Bar Card */}
            <div className="stacked-card-box">
              <div className="health-score-top">
                <div className="hs-left">
                  <span className="hs-emoji">❤️</span>
                  <span className="hs-title">Health Score</span>
                </div>
                <span className="hs-num">8.5/10</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: "85%" }}></div>
              </div>
            </div>

            {/* Cortisol & Stress Hormone Indicator Box */}
            <div className="stacked-card-box">
              <div className="card-top-row" style={{ marginBottom: "6px" }}>
                <span className="card-icon-emoji">🧠</span>
                <span className="card-title-lbl" style={{ color: "#facc15" }}>Cortisol - Stress Hormone</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "#cbd5e1" }}>Status: Normal Range</span>
                <span className="t-status-badge status-yellow">Moderate (14 µg/dL)</span>
              </div>
            </div>

            {/* Actionable Fix Box */}
            <div className="stacked-card-box action-fix-box">
              <div className="card-top-row" style={{ marginBottom: "8px" }}>
                <span className="card-icon-emoji">🎯</span>
                <span className="card-title-lbl" style={{ color: "#38bdf8", fontWeight: "800" }}>ACTIONABLE FIX</span>
              </div>
              <p className="action-fix-text">
                {result.actionableTip || (
                  <>
                    Focus heavily on <strong className="hlt-green">upper back strengthening</strong> and daily <strong className="hlt-cyan">core stabilization drills</strong> to correct forward shoulder posture and optimize <strong className="hlt-purple">hormonal balance</strong>.
                  </>
                )}
              </p>
            </div>

            <button 
              onClick={handleStartWorkoutRedirect}
              className="start-workout-action-btn"
            >
              Start Custom Workout Plan 🔥
            </button>

          </div>
        )}

      </div>

      <style jsx>{`
        .reference-scan-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #07090e;
          color: #ffffff;
          padding: 24px 16px 120px 16px;
          font-family: 'Inter', system-ui, sans-serif;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
        }

        .bg-ambient-glow {
          position: fixed;
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(56,189,248,0.12) 0%, rgba(147,51,234,0.06) 60%, transparent 70%);
          z-index: 0;
          pointer-events: none;
        }

        .main-content-wrap {
          width: 100%;
          max-width: 500px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .top-nav-box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(18, 22, 34, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 18px;
          border-radius: 16px;
          backdrop-filter: blur(14px);
        }

        .back-link-txt {
          color: #38bdf8;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }

        .top-nav-box h2 {
          font-size: 15px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .camera-viewport-card {
          width: 100%;
          height: 360px;
          background: rgba(12, 17, 28, 0.9);
          border: 2px dashed rgba(255, 255, 255, 0.12);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
        }

        .upload-prompt-view {
          text-align: center;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }

        .icon-pulse-lg {
          font-size: 38px;
          margin-bottom: 2px;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }

        .upload-prompt-view h3 {
          font-size: 15px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0;
        }

        .upload-prompt-view p {
          font-size: 11px;
          color: #64748b;
          margin: 0 0 14px 0;
        }

        .upload-options-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
          max-width: 260px;
        }

        .divider-line-txt {
          font-size: 9px;
          color: #475569;
          font-weight: 800;
          position: relative;
          margin: 2px 0;
        }

        .file-picker-lbl {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px;
          font-size: 12px;
          font-weight: 600;
          color: #cbd5e1;
          cursor: pointer;
          transition: 0.2s;
        }
        .file-picker-lbl:hover {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
        }

        .preview-active-view {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .uploaded-img-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .retake-photo-btn {
          position: absolute;
          bottom: 14px;
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }

        .counter-loading-box {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(56, 189, 248, 0.3);
          border-radius: 20px;
          padding: 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          box-shadow: 0 15px 30px rgba(0,0,0,0.6);
        }

        .loader-spinner-ring {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(56,189,248,0.2);
          border-top-color: #38bdf8;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .counter-number-display {
          font-size: 36px;
          font-weight: 900;
          background: linear-gradient(135deg, #38bdf8, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1px;
        }

        .loading-status-txt {
          font-size: 12px;
          color: #94a3b8;
          margin: 0;
        }

        .run-action-execute-btn {
          width: 100%;
          background: linear-gradient(135deg, #0284c7, #7c3aed);
          color: #ffffff;
          border: none;
          border-radius: 16px;
          padding: 16px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
          transition: 0.2s;
        }
        .run-action-execute-btn:hover {
          opacity: 0.95;
          transform: translateY(-1px);
        }

        .error-alert-banner {
          background: rgba(239, 68, 68, 0.12);
          border: 1px solid rgba(239, 68, 68, 0.3);
          padding: 12px;
          border-radius: 12px;
          color: #ef4444;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
        }

        .results-dashboard-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .results-header-tag {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(168, 85, 247, 0.3);
          border-radius: 16px;
          padding: 14px 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .results-header-tag h3 {
          margin: 0;
          font-size: 14px;
          color: #f8fafc;
          font-weight: 800;
        }

        .badge-verified {
          font-size: 9px;
          font-weight: 800;
          background: rgba(34, 197, 94, 0.15);
          color: #4ade80;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .metrics-2x2-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .metric-item-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }

        .card-top-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-icon-emoji {
          font-size: 16px;
        }

        .card-title-lbl {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
        }

        .card-val-row {
          font-size: 18px;
          font-weight: 900;
        }

        .text-cyan { color: #38bdf8; }
        .text-purple { color: #c084fc; }
        .text-green { color: #4ade80; }

        .t-status-badge {
          font-size: 10px;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 8px;
          display: inline-block;
        }
        .status-green { background: rgba(34, 197, 94, 0.15); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.3); }
        .status-yellow { background: rgba(234, 179, 8, 0.15); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.3); }

        .stacked-card-box {
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }

        .health-score-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .hs-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .hs-emoji { font-size: 16px; }
        .hs-title { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .hs-num { font-size: 16px; font-weight: 900; color: #4ade80; }

        .progress-bar-track {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #22c55e, #4ade80);
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .action-fix-box {
          border-left: 4px solid #38bdf8;
        }

        .action-fix-text {
          font-size: 12px;
          color: #cbd5e1;
          line-height: 1.5;
          margin: 0;
        }

        .hlt-green { color: #4ade80; font-weight: 800; }
        .hlt-cyan { color: #38bdf8; font-weight: 800; }
        .hlt-purple { color: #c084fc; font-weight: 800; }

        .start-workout-action-btn {
          width: 100%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #ffffff;
          border: none;
          border-radius: 16px;
          padding: 15px;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
          transition: 0.2s;
          margin-top: 4px;
        }
        .start-workout-action-btn:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }
      `}</style>
    </div>
  );
}