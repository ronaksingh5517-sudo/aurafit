"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function DashboardView() {
  const pathname = usePathname();
  const { user, streak, waterGlasses, addWaterGlass, completedWorkouts, loggedMeals } = useApp();

  const isWorkoutDone = completedWorkouts.length > 0;
  const isFoodLogged = loggedMeals.length > 0;
  const isWaterDone = waterGlasses >= 8;

  const missions = [
    {
      id: "workout",
      title: "Daily Workout",
      sub: isWorkoutDone ? "Completed 15 min session" : "15 min · High Intensity Split",
      done: isWorkoutDone,
      link: "/workout",
      icon: "🏋️",
    },
    {
      id: "food",
      title: "Log Meal with AI",
      sub: isFoodLogged ? `${loggedMeals[0]?.dishName || "Meal"} logged` : "Take a picture of food",
      done: isFoodLogged,
      link: "/food-scanner",
      icon: "📸",
    },
    {
      id: "water",
      title: "Drink Water",
      sub: `Current: ${waterGlasses * 250}ml / 2000ml target`,
      done: isWaterDone,
      isWater: true,
      icon: "💧",
    },
  ];

  const completedCount = missions.filter((m) => m.done).length;
  const progressPercent = Math.round((completedCount / missions.length) * 100);

  return (
    <>
      <style jsx>{`
        .dash-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: #080a0e;
          color: #ffffff;
          padding-bottom: 110px;
          font-family: system-ui, sans-serif;
          box-sizing: border-box;
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
          font-size: 14px;
        }
        .nav-scan-cta {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 75, 43, 0.15);
          border: 1px solid rgba(255, 75, 43, 0.35);
          color: #ff5232;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12.5px;
          font-weight: 700;
          text-decoration: none;
        }

        .dash-body {
          max-width: 840px;
          margin: 0 auto;
          padding: 18px 16px 0;
          box-sizing: border-box;
          width: 100%;
        }

        .welcome-card {
          background: linear-gradient(135deg, rgba(35, 25, 40, 0.7) 0%, rgba(18, 22, 34, 0.8) 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 18px;
          padding: clamp(16px, 4vw, 22px);
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .welcome-text h1 {
          font-size: clamp(18px, 4vw, 24px);
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        .welcome-text p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
        }
        .streak-pill {
          background: rgba(255, 75, 43, 0.15);
          border: 1px solid rgba(255, 75, 43, 0.35);
          padding: 8px 14px;
          border-radius: 12px;
          text-align: center;
        }
        .streak-val {
          font-size: 18px;
          font-weight: 900;
          color: #ff5232;
        }
        .streak-lbl {
          font-size: 10.5px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }

        .card-block {
          background: rgba(18, 22, 34, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: clamp(16px, 4vw, 22px);
          margin-bottom: 18px;
        }
        .card-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .card-head h2 {
          font-size: 16.5px;
          font-weight: 800;
          margin: 0;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff416c, #ff4b2b, #ffe600);
          transition: width 0.3s ease;
        }

        .mission-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 12px 14px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }
        .m-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .m-icon {
          font-size: 20px;
          flex-shrink: 0;
        }
        .m-title {
          font-size: 13.5px;
          font-weight: 700;
          color: #f1f5f9;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .m-sub {
          font-size: 11.5px;
          color: #94a3b8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .btn-action {
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
          border: none;
          flex-shrink: 0;
        }
        .btn-action-primary {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
        }
        .btn-action-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .dash-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 18px;
        }
        .stat-card {
          background: rgba(18, 22, 34, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 12px;
          text-align: center;
        }
        .sc-val {
          font-size: clamp(16px, 3.5vw, 20px);
          font-weight: 800;
          margin: 4px 0 2px 0;
        }
        .sc-lbl {
          font-size: 10px;
          color: #94a3b8;
          text-transform: uppercase;
          font-weight: 700;
        }

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
          transition: color 0.2s ease;
        }
        .b-link.active, .b-link:hover {
          color: #ff5232;
        }
        .b-icon {
          font-size: 18px;
        }

        @media (max-width: 480px) {
          .dash-stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          .stat-card {
            padding: 8px 4px;
          }
        }
      `}</style>

      <div className="dash-container">
        <nav className="dash-navbar">
          <div className="dash-nav-content">
            <Link href="/" className="logo-box">
              <div className="logo-badge">🔥</div>
              <span>AURA FIT</span>
            </Link>

            <Link href="/food-scanner" className="nav-scan-cta">
              <span>📸</span> Scan Meal
            </Link>
          </div>
        </nav>

        <div className="dash-body">
          <div className="welcome-card">
            <div className="welcome-text">
              <h1>Welcome Back, {user.name} 👋</h1>
              <p>Day 1 of your 30-day transformation.</p>
            </div>
            <div className="streak-pill">
              <div className="streak-val">{streak} 🔥</div>
              <div className="streak-lbl">Day Streak</div>
            </div>
          </div>

          <div className="card-block">
            <div className="card-head">
              <h2>🎯 Daily Missions</h2>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#ff5232" }}>
                {completedCount} / {missions.length} Complete
              </span>
            </div>

            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>

            <div style={{ marginTop: "14px" }}>
              {missions.map((m) => (
                <div key={m.id} className="mission-item">
                  <div className="m-left">
                    <span className="m-icon">{m.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div className="m-title">{m.title}</div>
                      <div className="m-sub">{m.sub}</div>
                    </div>
                  </div>

                  <div>
                    {m.isWater ? (
                      <button className="btn-action btn-action-secondary" onClick={addWaterGlass}>
                        + Glass ({waterGlasses}/8)
                      </button>
                    ) : m.done ? (
                      <span style={{ color: "#22c55e", fontWeight: 700, fontSize: "12px" }}>✓ Done</span>
                    ) : (
                      <Link href={m.link} className="btn-action btn-action-primary">
                        Start
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-stats-grid">
            <div className="stat-card">
              <span style={{ fontSize: "16px" }}>⚡</span>
              <div className="sc-val" style={{ color: "#ffe600" }}>{user.dailyCalories}</div>
              <div className="sc-lbl">Calories Left</div>
            </div>

            <div className="stat-card">
              <span style={{ fontSize: "16px" }}>🥩</span>
              <div className="sc-val" style={{ color: "#ff5232" }}>{loggedMeals.length > 0 ? "38 / 145g" : "0 / 145g"}</div>
              <div className="sc-lbl">Protein Target</div>
            </div>

            <div className="stat-card">
              <span style={{ fontSize: "16px" }}>💧</span>
              <div className="sc-val" style={{ color: "#38bdf8" }}>{waterGlasses * 250} ml</div>
              <div className="sc-lbl">Water Logged</div>
            </div>
          </div>
        </div>

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