"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const EXERCISES = [
  {
    id: 1,
    name: "Bodyweight Squats",
    target: "Quadriceps, Glutes, Core",
    reps: "12 Reps × 3 Sets",
    duration: 45,
    icon: "🏋️",
    instructions: "Feet shoulder-width apart. Keep chest proud, push hips back like sitting in a chair, and drive through heels.",
  },
  {
    id: 2,
    name: "Wall / Incline Push-ups",
    target: "Chest, Triceps, Anterior Deltoids",
    reps: "10 Reps × 3 Sets",
    duration: 40,
    icon: "💪",
    instructions: "Place hands shoulder-width against wall/incline. Keep body in a straight plank line and lower chest smoothly.",
  },
  {
    id: 3,
    name: "Core Glute Bridges",
    target: "Gluteus Maximus, Hamstrings",
    reps: "15 Reps × 2 Sets",
    duration: 35,
    icon: "🧘",
    instructions: "Lie flat on back with knees bent. Squeeze glutes and raise hips towards ceiling until thighs and torso align.",
  },
  {
    id: 4,
    name: "Static Plank Hold",
    target: "Transverse Abdominis, Core",
    reps: "Hold for Time",
    duration: 30,
    icon: "⚡",
    instructions: "Forearms on ground, elbows below shoulders. Keep spine straight without letting your lower back sag.",
  },
];

export default function WorkoutView() {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(EXERCISES[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSets, setCompletedSets] = useState([false, false, false]);
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  const activeExercise = EXERCISES[currentIdx];

  // Timer Countdown Engine
  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(activeExercise.duration);
  };

  const nextExercise = () => {
    if (currentIdx < EXERCISES.length - 1) {
      const nextIdx = currentIdx + 1;
      setCurrentIdx(nextIdx);
      setTimeLeft(EXERCISES[nextIdx].duration);
      setIsRunning(false);
      setCompletedSets([false, false, false]);
    } else {
      setShowFinishedModal(true);
    }
  };

  const prevExercise = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      setCurrentIdx(prevIdx);
      setTimeLeft(EXERCISES[prevIdx].duration);
      setIsRunning(false);
      setCompletedSets([false, false, false]);
    }
  };

  const toggleSet = (index) => {
    setCompletedSets((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <>
      <style jsx>{`
        .workout-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 10%, #151824 0%, #080a0e 85%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px 16px 80px;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
          font-family: system-ui, sans-serif;
        }

        .workout-header {
          width: 100%;
          max-width: 540px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
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

        .workout-card {
          width: 100%;
          max-width: 540px;
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: clamp(20px, 4.5vw, 32px);
          backdrop-filter: blur(14px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
          box-sizing: border-box;
        }

        /* Exercise Display Box */
        .exercise-hero {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 18px;
          padding: 24px 16px;
          text-align: center;
          margin-bottom: 20px;
          position: relative;
        }

        .exercise-badge-pill {
          display: inline-block;
          background: rgba(255, 75, 43, 0.15);
          color: #ff5232;
          font-size: 11.5px;
          font-weight: 800;
          padding: 4px 12px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .exercise-name {
          font-size: clamp(20px, 4.5vw, 26px);
          font-weight: 800;
          margin: 0 0 6px 0;
        }

        .exercise-target {
          font-size: 13px;
          color: #94a3b8;
          margin-bottom: 16px;
        }

        /* Digital Timer Ring */
        .timer-display {
          font-size: clamp(48px, 12vw, 64px);
          font-weight: 900;
          font-family: monospace;
          color: ${timeLeft === 0 ? "#ef4444" : "#ffe600"};
          letter-spacing: 2px;
          margin: 12px 0;
          text-shadow: 0 0 25px rgba(255, 230, 0, 0.3);
        }

        .timer-actions {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 10px;
        }

        .btn-ctrl {
          padding: 10px 22px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-ctrl-primary {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          box-shadow: 0 6px 18px rgba(255, 75, 43, 0.35);
        }
        .btn-ctrl-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        /* Sets Tracker Row */
        .sets-row {
          display: flex;
          justify-content: space-around;
          margin: 20px 0;
          gap: 8px;
        }

        .set-box {
          flex: 1;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 10px 6px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .set-box.completed {
          background: rgba(34, 197, 94, 0.15);
          border-color: #22c55e;
        }
        .set-title {
          font-size: 11px;
          color: #94a3b8;
          font-weight: 700;
          text-transform: uppercase;
        }
        .set-status {
          font-size: 14px;
          font-weight: 800;
          margin-top: 4px;
          color: #ffffff;
        }

        /* Instructions Accordion Box */
        .guide-box {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          padding: 14px 16px;
          margin-bottom: 22px;
          text-align: left;
        }
        .guide-title {
          font-size: 12px;
          font-weight: 800;
          color: #cbd5e1;
          margin-bottom: 6px;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .guide-desc {
          font-size: 13px;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0;
        }

        /* Footer Navigation Arrows */
        .footer-flow {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 12px;
        }

        .btn-flow {
          padding: 14px;
          border-radius: 12px;
          font-size: 14.5px;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-flow-back {
          background: rgba(255, 255, 255, 0.06);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .btn-flow-next {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          box-shadow: 0 8px 24px rgba(255, 75, 43, 0.3);
        }

        /* Finished Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 200;
        }
        .modal-card {
          background: #121622;
          border: 1px solid rgba(255, 75, 43, 0.4);
          border-radius: 20px;
          padding: 32px 24px;
          max-width: 440px;
          width: 100%;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
        }
      `}</style>

      <div className="workout-container">
        {/* Header */}
        <header className="workout-header">
          <Link href="/dashboard" className="btn-back">
            ← Dashboard
          </Link>
          <span style={{ fontWeight: 800, fontSize: "15px" }}>
            Day 1 · Exercise {currentIdx + 1} / {EXERCISES.length}
          </span>
          <div style={{ width: "60px" }}></div>
        </header>

        {/* Workout Card */}
        <div className="workout-card">
          <div className="exercise-hero">
            <span className="exercise-badge-pill">{activeExercise.reps}</span>
            <div style={{ fontSize: "40px", marginBottom: "8px" }}>{activeExercise.icon}</div>
            <h2 className="exercise-name">{activeExercise.name}</h2>
            <div className="exercise-target">Targets: {activeExercise.target}</div>

            {/* Timer Screen */}
            <div className="timer-display">{formatTime(timeLeft)}</div>

            <div className="timer-actions">
              <button
                className={`btn-ctrl ${isRunning ? "btn-ctrl-secondary" : "btn-ctrl-primary"}`}
                onClick={toggleTimer}
              >
                {isRunning ? "⏸ PAUSE" : "▶ START TIMER"}
              </button>
              <button className="btn-ctrl btn-ctrl-secondary" onClick={resetTimer}>
                🔄 RESET
              </button>
            </div>
          </div>

          {/* Interactive Set Checkmarks */}
          <div className="sets-row">
            {[1, 2, 3].map((num, i) => (
              <div
                key={num}
                className={`set-box ${completedSets[i] ? "completed" : ""}`}
                onClick={() => toggleSet(i)}
              >
                <div className="set-title">SET {num}</div>
                <div className="set-status">
                  {completedSets[i] ? "✓ DONE" : "PENDING"}
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="guide-box">
            <div className="guide-title">
              <span>💡</span> Form & Technique Instruction:
            </div>
            <p className="guide-desc">{activeExercise.instructions}</p>
          </div>

          {/* Navigation Flow */}
          <div className="footer-flow">
            <button
              className="btn-flow btn-flow-back"
              disabled={currentIdx === 0}
              style={{ opacity: currentIdx === 0 ? 0.4 : 1, cursor: currentIdx === 0 ? "not-allowed" : "pointer" }}
              onClick={prevExercise}
            >
              ← Previous
            </button>
            <button className="btn-flow btn-flow-next" onClick={nextExercise}>
              {currentIdx === EXERCISES.length - 1 ? "Complete Workout 🎉" : "Next Exercise →"}
            </button>
          </div>
        </div>

        {/* Completion Modal */}
        {showFinishedModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div style={{ fontSize: "56px", marginBottom: "12px" }}>🔥</div>
              <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 8px 0" }}>
                Workout Completed!
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
                Day 1 training successfully recorded. 180 kcal burned & daily mission complete!
              </p>
              <button
                className="btn-ctrl btn-ctrl-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px" }}
                onClick={() => router.push("/dashboard")}
              >
                Return to Dashboard →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}