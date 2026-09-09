"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function ProfileView() {
  const router = useRouter();
  const pathname = usePathname();

  const [userProfile, setUserProfile] = useState({
    name: "Rahul Sharma",
    email: "rahul.fit@aura.ai",
    membership: "30-Day Pro Trial",
    weight: 71.2,
    height: 176,
    targetWeight: 68.0,
    dailyCalories: 2180,
    goal: "Build Muscle & Lean Down",
  });

  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <>
      <style jsx>{`
        .profile-container {
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

        .dash-navbar {
          background: rgba(18, 22, 34, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .dash-nav-content {
          max-width: 840px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo-box {
          display: flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          color: #ffffff;
          font-weight: 800;
          font-size: 17px;
        }
        .logo-badge {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .profile-body {
          max-width: 840px;
          margin: 0 auto;
          padding: 18px 16px 0;
          box-sizing: border-box;
          width: 100%;
        }

        /* Hero Profile Card */
        .profile-hero-card {
          background: linear-gradient(135deg, rgba(35, 25, 40, 0.75) 0%, rgba(18, 22, 34, 0.85) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: clamp(20px, 4.5vw, 28px);
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        .user-main-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .avatar-box {
          width: 64px;
          height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          box-shadow: 0 8px 24px rgba(255, 75, 43, 0.4);
          flex-shrink: 0;
        }
        .user-names h1 {
          font-size: clamp(19px, 4vw, 24px);
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        .user-names p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
        }

        .tier-badge {
          background: rgba(255, 230, 0, 0.12);
          border: 1px solid rgba(255, 230, 0, 0.35);
          color: #ffe600;
          font-size: 11.5px;
          font-weight: 800;
          padding: 6px 14px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Metric Grid */
        .metrics-grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }
        .metric-cell {
          background: rgba(18, 22, 34, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 14px 10px;
          text-align: center;
        }
        .metric-val {
          font-size: clamp(16px, 3.5vw, 20px);
          font-weight: 800;
          margin: 4px 0 2px 0;
        }
        .metric-lbl {
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }

        /* Settings Card Sections */
        .section-card {
          background: rgba(18, 22, 34, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: clamp(16px, 4vw, 22px);
          margin-bottom: 18px;
        }
        .section-card h2 {
          font-size: 16px;
          font-weight: 800;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pref-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          font-size: 14px;
        }
        .pref-row:last-child {
          border-bottom: none;
        }
        .pref-label {
          color: #94a3b8;
        }
        .pref-val {
          color: #f1f5f9;
          font-weight: 700;
        }

        /* Toggle switch */
        .toggle-switch {
          position: relative;
          width: 44px;
          height: 24px;
          background: ${notifications ? "#ff4b2b" : "rgba(255,255,255,0.15)"};
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .toggle-knob {
          position: absolute;
          top: 2px;
          left: ${notifications ? "22px" : "3px"};
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          transition: all 0.25s ease;
        }

        .btn-logout {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(239, 68, 68, 0.4);
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          font-weight: 800;
          font-size: 14.5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
          color: #ffffff;
        }

        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(12, 15, 24, 0.96);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 8px 0;
          z-index: 100;
        }
        .bottom-nav-list {
          display: flex;
          justify-content: space-around;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          max-width: 500px;
          margin: 0 auto;
        }
        .b-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          color: #94a3b8;
          font-size: 10.5px;
          font-weight: 600;
          text-decoration: none;
        }
        .b-link.active, .b-link:hover {
          color: #ff5232;
        }
        .b-icon {
          font-size: 18px;
        }

        @media (max-width: 480px) {
          .metrics-grid-3 {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .metric-cell {
            padding: 10px 4px;
          }
        }
      `}</style>

      <div className="profile-container">
        {/* Navigation Top Bar */}
        <nav className="dash-navbar">
          <div className="dash-nav-content">
            <Link href="/" className="logo-box">
              <div className="logo-badge">🔥</div>
              <span>AURA FIT</span>
            </Link>

            <Link
              href="/dashboard"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#f1f5f9",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12.5px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              ← Dashboard
            </Link>
          </div>
        </nav>

        <div className="profile-body">
          {/* User Hero Banner */}
          <div className="profile-hero-card">
            <div className="user-main-info">
              <div className="avatar-box">👤</div>
              <div className="user-names">
                <h1>{userProfile.name}</h1>
                <p>{userProfile.email}</p>
              </div>
            </div>
            <div className="tier-badge">⭐ {userProfile.membership}</div>
          </div>

          {/* Quick Body Metrics Summary */}
          <div className="metrics-grid-3">
            <div className="metric-cell">
              <span style={{ fontSize: "16px" }}>⚖️</span>
              <div className="metric-val" style={{ color: "#ffe600" }}>{userProfile.weight} kg</div>
              <div className="metric-lbl">Current Weight</div>
            </div>

            <div className="metric-cell">
              <span style={{ fontSize: "16px" }}>🎯</span>
              <div className="metric-val" style={{ color: "#4ade80" }}>{userProfile.targetWeight} kg</div>
              <div className="metric-lbl">Goal Weight</div>
            </div>

            <div className="metric-cell">
              <span style={{ fontSize: "16px" }}>⚡</span>
              <div className="metric-val" style={{ color: "#ff5232" }}>{userProfile.dailyCalories}</div>
              <div className="metric-lbl">Daily Budget</div>
            </div>
          </div>

          {/* AI Plan Settings */}
          <div className="section-card">
            <h2>🎯 Active Training Program</h2>
            <div className="pref-row">
              <span className="pref-label">Primary Objective</span>
              <span className="pref-val">{userProfile.goal}</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">AI Model Engine</span>
              <span className="pref-val" style={{ color: "#4ade80" }}>AuraNet Vision v2.6</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Daily Workout Split</span>
              <span className="pref-val">20 Min High Intensity</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Next Silhouette Scan</span>
              <span className="pref-val" style={{ color: "#ffe600" }}>Day 7 (6 Days Left)</span>
            </div>
          </div>

          {/* Account & Notification Preferences */}
          <div className="section-card">
            <h2>⚙️ Preferences</h2>
            <div className="pref-row">
              <span className="pref-label">Daily Mission Push Alerts</span>
              <div
                className="toggle-switch"
                onClick={() => setNotifications(!notifications)}
              >
                <div className="toggle-knob"></div>
              </div>
            </div>
            <div className="pref-row">
              <span className="pref-label">Metric Units</span>
              <span className="pref-val">Kilograms & Centimeters</span>
            </div>
            <div className="pref-row">
              <span className="pref-label">Data Privacy</span>
              <span className="pref-val" style={{ color: "#38bdf8" }}>Strictly Local Protected</span>
            </div>
          </div>

          {/* Sign Out Action */}
          <button className="btn-logout" onClick={handleLogout}>
            Sign Out of Account
          </button>
        </div>

        {/* Global Bottom Navigation */}
        <nav className="bottom-nav">
          <ul className="bottom-nav-list">
            <li>
              <Link href="/dashboard" className={`b-link ${pathname === "/dashboard" ? "active" : ""}`}>
                <span className="b-icon">🏠</span>
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link href="/workout" className={`b-link ${pathname === "/workout" ? "active" : ""}`}>
                <span className="b-icon">🏋️</span>
                <span>Workout</span>
              </Link>
            </li>
            <li>
              <Link href="/food-scanner" className={`b-link ${pathname === "/food-scanner" ? "active" : ""}`}>
                <span className="b-icon">📸</span>
                <span>Scan</span>
              </Link>
            </li>
            <li>
              <Link href="/progress" className={`b-link ${pathname === "/progress" ? "active" : ""}`}>
                <span className="b-icon">📈</span>
                <span>Progress</span>
              </Link>
            </li>
            <li>
              <Link href="/profile" className={`b-link ${pathname === "/profile" ? "active" : ""}`}>
                <span className="b-icon">👤</span>
                <span>Profile</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}