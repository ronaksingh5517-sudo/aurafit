"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function SettingsView() {
  const router = useRouter();
  const { user, updateUser, triggerToast } = useApp();

  const [editName, setEditName] = useState(user.name);
  const [editCalories, setEditCalories] = useState(user.dailyCalories);
  const [editTargetWeight, setEditTargetWeight] = useState(user.targetWeight);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({
      name: editName,
      dailyCalories: Number(editCalories),
      targetWeight: Number(editTargetWeight),
    });
    triggerToast("Settings & targets saved successfully!");
  };

  const handleHardReset = () => {
    localStorage.clear();
    triggerToast("App data wiped clean. Restarting...", "error");
    setShowResetModal(false);
    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  return (
    <>
      <style jsx>{`
        .settings-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: #080a0e;
          color: #ffffff;
          padding-bottom: 110px;
          box-sizing: border-box;
          font-family: system-ui, sans-serif;
          width: 100%;
          overflow-x: hidden;
        }

        .settings-nav {
          background: rgba(18, 22, 34, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .nav-inner {
          max-width: 640px;
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

        .settings-body {
          max-width: 640px;
          margin: 0 auto;
          padding: 20px 16px 0;
          box-sizing: border-box;
          width: 100%;
        }

        .settings-card {
          background: rgba(18, 22, 34, 0.75);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: clamp(18px, 4.5vw, 24px);
          margin-bottom: 20px;
        }
        .settings-card h2 {
          font-size: 16.5px;
          font-weight: 800;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-group {
          margin-bottom: 16px;
        }
        .input-label {
          display: block;
          font-size: 12.5px;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .custom-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 12px 14px;
          color: #ffffff;
          font-size: 14.5px;
          font-weight: 600;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .custom-input:focus {
          border-color: #ff4b2b;
          background: rgba(255, 75, 43, 0.04);
        }

        .btn-save {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          border: none;
          color: #ffffff;
          padding: 12px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: opacity 0.2s ease;
          width: 100%;
        }
        .btn-save:hover {
          opacity: 0.92;
        }

        .quick-nav-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          color: #cbd5e1;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
        }
        .quick-nav-row:last-child {
          border-bottom: none;
        }
        .quick-nav-row:hover {
          color: #ff5232;
        }

        /* Danger Zone Card */
        .danger-card {
          background: rgba(239, 68, 68, 0.06);
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .danger-card h2 {
          color: #f87171;
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 8px 0;
        }
        .btn-danger {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #f87171;
          padding: 12px;
          border-radius: 10px;
          font-size: 13.5px;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s ease;
        }
        .btn-danger:hover {
          background: rgba(239, 68, 68, 0.3);
          color: #ffffff;
        }

        /* Confirmation Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 200;
        }
        .modal-box {
          background: #121622;
          border: 1px solid rgba(239, 68, 68, 0.4);
          border-radius: 20px;
          padding: 28px 22px;
          max-width: 420px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }
      `}</style>

      <div className="settings-container">
        <nav className="settings-nav">
          <div className="nav-inner">
            <Link href="/profile" className="btn-back">
              ← Profile
            </Link>
            <span style={{ fontWeight: 800, fontSize: "16px" }}>App Settings</span>
            <div style={{ width: "60px" }}></div>
          </div>
        </nav>

        <div className="settings-body">
          {/* Target Adjustments Card */}
          <div className="settings-card">
            <h2>🎯 Adjust Goals & Targets</h2>
            <form onSubmit={handleSaveProfile}>
              <div className="input-group">
                <label className="input-label">Display Name</label>
                <input
                  type="text"
                  className="custom-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Target Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  className="custom-input"
                  value={editTargetWeight}
                  onChange={(e) => setEditTargetWeight(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Daily Caloric Budget (kcal)</label>
                <input
                  type="number"
                  className="custom-input"
                  value={editCalories}
                  onChange={(e) => setEditCalories(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </form>
          </div>

          {/* Quick Shortcuts Card */}
          <div className="settings-card">
            <h2>⚡ Membership & App</h2>
            <Link href="/checkout" className="quick-nav-row">
              <span>💳 Manage Subscription / Upgrade</span>
              <span>→</span>
            </Link>
            <Link href="/ai-coach" className="quick-nav-row">
              <span>🤖 AuraNet Vision AI Preferences</span>
              <span>→</span>
            </Link>
            <Link href="/progress" className="quick-nav-row">
              <span>📈 30-Day Milestone Export</span>
              <span>→</span>
            </Link>
          </div>

          {/* Danger Zone */}
          <div className="danger-card">
            <h2>⚠️ Danger Zone</h2>
            <p style={{ color: "#94a3b8", fontSize: "12.5px", lineHeight: 1.5, margin: "0 0 14px 0" }}>
              Clearing stored local data will permanently reset your active streak, workout logs, and daily targets.
            </p>
            <button className="btn-danger" onClick={() => setShowResetModal(true)}>
              Reset All Progress & App Data
            </button>
          </div>
        </div>

        {/* Modal */}
        {showResetModal && (
          <div className="modal-overlay">
            <div className="modal-box">
              <div style={{ fontSize: "44px", marginBottom: "8px" }}>⚠️</div>
              <h3 style={{ fontSize: "19px", fontWeight: 800, margin: "0 0 8px 0" }}>
                Confirm Factory Reset?
              </h3>
              <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.5, marginBottom: "20px" }}>
                This will delete your local profile, workout streak, and photo scans. You will need to start onboarding again.
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.06)",
                    color: "#ffffff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => setShowResetModal(false)}
                >
                  Cancel
                </button>
                <button
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#ef4444",
                    color: "#ffffff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                  onClick={handleHardReset}
                >
                  Yes, Wipe
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}