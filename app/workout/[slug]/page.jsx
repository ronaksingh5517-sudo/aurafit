"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { gymTransformationData } from "@/data/gym-transformation";

export default function WorkoutSlugPage() {
  const params = useParams();
  const slug = params?.slug || "gym-transformation";
  
  const [completedDays, setCompletedDays] = useState([1]);
  const [selectedDayData, setSelectedDayData] = useState(null);

  // Active Interactive Workout Player States
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [playerMode, setPlayerMode] = useState("exercise"); // "exercise" | "rest"
  const [timeLeft, setTimeLeft] = useState(40);
  const [isStarted, setIsStarted] = useState(false);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef(null);
  const totalDays = gymTransformationData.days?.length || 30;
  const progressPercentage = Math.round((completedDays.length / totalDays) * 100);

  const getTotalSets = (setsString) => {
    const match = setsString?.match(/\d+/);
    return match ? parseInt(match[0]) : 3;
  };

  const currentExercise = selectedDayData?.exercises[activeExerciseIndex];
  const totalSetsCount = currentExercise ? getTotalSets(currentExercise.sets) : 3;

  // --- LIVE SESSION PROGRESS CALCULATION ---
  let totalSetsInDay = 0;
  let completedSetsInDay = 0;

  if (selectedDayData?.exercises) {
    selectedDayData.exercises.forEach((ex, idx) => {
      const sCount = getTotalSets(ex.sets);
      totalSetsInDay += sCount;
      if (idx < activeExerciseIndex) {
        completedSetsInDay += sCount;
      } else if (idx === activeExerciseIndex) {
        completedSetsInDay += Math.min(currentSet - 1, sCount);
      }
    });
  }

  const sessionProgressPercent = totalSetsInDay > 0 ? Math.min(Math.round((completedSetsInDay / totalSetsInDay) * 100), 100) : 0;

  // Bulletproof Timer Logic without any jump glitches
  useEffect(() => {
    if (!selectedDayData || !isStarted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        const nextTime = prevTime - speed;

        if (nextTime > 0) {
          return nextTime;
        }

        // Time khatam hone par yeh block chalega (Sirf Ek Baar)
        if (playerMode === "exercise") {
          if (currentSet < totalSetsCount) {
            // Strictly Next Set (+1 only)
            setCurrentSet((prevSet) => prevSet + 1);
            return 40; // Reset timer for next set
          } else {
            // Saare sets khatam, agar aur exercise hai toh rest par jao
            if (activeExerciseIndex < selectedDayData.exercises.length - 1) {
              setPlayerMode("rest");
              return 30; // 30s rest
            } else {
              clearInterval(timerRef.current);
              alert("🎉 Workout Completed Successfully!");
              handleCompleteWorkout(selectedDayData.day || 1);
              return 0;
            }
          }
        } else if (playerMode === "rest") {
          // Rest khatam, agli exercise par jao aur set ko 1 se shuru karo
          setActiveExerciseIndex((prevIdx) => prevIdx + 1);
          setCurrentSet(1);
          setPlayerMode("exercise");
          return 40;
        }

        return 0;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [selectedDayData, isStarted, playerMode, currentSet, activeExerciseIndex, speed, totalSetsCount]);

  const handleOpenModal = (item) => {
    setSelectedDayData(item);
    setActiveExerciseIndex(0);
    setCurrentSet(1);
    setPlayerMode("exercise");
    setTimeLeft(40);
    setIsStarted(false);
    setSpeed(1);
  };

  const handleCompleteWorkout = (dayNum) => {
    if (!completedDays.includes(dayNum)) {
      setCompletedDays([...completedDays, dayNum]);
    }
    setSelectedDayData(null);
    setIsStarted(false);
  };

  const handlePrevExercise = () => {
    if (activeExerciseIndex > 0) {
      setActiveExerciseIndex(activeExerciseIndex - 1);
      setCurrentSet(1);
      setPlayerMode("exercise");
      setTimeLeft(40);
      setIsStarted(false);
    }
  };

  const handleNextExercise = () => {
    if (selectedDayData && activeExerciseIndex < selectedDayData.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setCurrentSet(1);
      setPlayerMode("exercise");
      setTimeLeft(40);
      setIsStarted(false);
    }
  };

  const handleAddTenSeconds = () => {
    setTimeLeft((prev) => prev + 10);
  };

  const handleSkipRest = () => {
    if (activeExerciseIndex < selectedDayData.exercises.length - 1) {
      setActiveExerciseIndex(activeExerciseIndex + 1);
      setCurrentSet(1);
      setPlayerMode("exercise");
      setTimeLeft(40);
      setIsStarted(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc", padding: "20px 16px 100px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "540px", margin: "0 auto" }}>
        
        {/* Top Navigation Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <Link href="/body-scan" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "12px", fontWeight: 700, background: "rgba(56,189,248,0.08)", padding: "8px 14px", borderRadius: "12px", border: "1px solid rgba(56,189,248,0.2)", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>←</span> Back
          </Link>
          <div style={{ background: "rgba(34,197,94,0.1)", padding: "6px 12px", borderRadius: "20px", border: "1px solid rgba(34,197,94,0.3)", fontSize: "11px", fontWeight: 800, color: "#4ade80", letterSpacing: "0.5px" }}>
            ⚡ AURA ENGINE v3.9 (STRICT FIX)
          </div>
        </div>

        {/* Hero Banner */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #020617 100%)", border: "1px solid rgba(56,189,248,0.25)", padding: "22px", borderRadius: "24px", marginBottom: "24px", boxShadow: "0 12px 35px rgba(0,0,0,0.6)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div>
              <span style={{ fontSize: "10px", color: "#38bdf8", fontWeight: 900, textTransform: "uppercase", letterSpacing: "1.5px" }}>Active Protocol</span>
              <h1 style={{ fontSize: "18px", color: "#fff", margin: "4px 0 2px 0", fontWeight: 900 }}>{gymTransformationData.title}</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "20px", fontWeight: 900, color: "#4ade80" }}>{progressPercentage}%</span>
              <div style={{ fontSize: "9px", color: "#94a3b8", fontWeight: 800, letterSpacing: "0.5px" }}>OVERALL</div>
            </div>
          </div>

          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 16px 0", lineHeight: "1.5" }}>{gymTransformationData.description}</p>

          <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", overflow: "hidden" }}>
            <div style={{ width: `${progressPercentage}%`, height: "100%", background: "linear-gradient(90deg, #38bdf8, #22c55e)", borderRadius: "6px", transition: "width 0.4s ease" }}></div>
          </div>
        </div>

        {/* Section Header */}
        <div style={{ fontSize: "12px", fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📅</span> 30-Day Training Roadmap
        </div>

        {/* Days List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "30px" }}>
          {gymTransformationData.days.map((item, index) => {
            const dayNum = item.day || index + 1;
            const isCompleted = completedDays.includes(dayNum);
            const isUnlocked = dayNum === 1 || completedDays.includes(dayNum - 1);
            const isToday = isUnlocked && !isCompleted;

            return (
              <div
                key={dayNum}
                onClick={() => {
                  if (isUnlocked) handleOpenModal(item);
                  else alert("🔒 Complete the previous day's workout to unlock this day!");
                }}
                style={{
                  background: isCompleted ? "rgba(34, 197, 94, 0.04)" : isToday ? "rgba(56, 189, 248, 0.07)" : "rgba(15, 23, 42, 0.35)",
                  border: isToday ? "1.5px solid #38bdf8" : isCompleted ? "1.5px solid rgba(34, 197, 94, 0.3)" : "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "20px",
                  padding: "16px 18px",
                  color: "#fff",
                  cursor: isUnlocked ? "pointer" : "not-allowed",
                  opacity: isUnlocked ? 1 : 0.45,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.2s ease"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ 
                    background: isCompleted ? "#22c55e" : isToday ? "linear-gradient(135deg, #38bdf8, #0284c7)" : "#1e293b", 
                    color: isCompleted || isToday ? "#020617" : "#94a3b8",
                    width: "46px", height: "46px", borderRadius: "14px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", fontWeight: 900, fontSize: "14px"
                  }}>
                    <span style={{ fontSize: "7px", lineHeight: "1", opacity: 0.8, fontWeight: 700 }}>DAY</span>
                    <span>{dayNum}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#fff", marginBottom: "3px" }}>{item.title}</div>
                    <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                      <span>⚡ {item.exercises?.length || 0} Exercises</span>
                      <span>•</span>
                      <span>⏱️ {item.duration}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <span style={{ fontSize: "11px", background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "6px 12px", borderRadius: "20px", fontWeight: 800 }}>✅ Done</span>
                  ) : isToday ? (
                    <span style={{ fontSize: "11px", background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "6px 12px", borderRadius: "20px", fontWeight: 800 }}>🔥 Start</span>
                  ) : (
                    <span style={{ fontSize: "11px", background: "rgba(255, 255, 255, 0.04)", color: "#64748b", padding: "6px 12px", borderRadius: "20px", fontWeight: 700 }}>🔒 Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* COMPACT NO-SCROLL WORKOUT PLAYER MODAL */}
        {selectedDayData && currentExercise && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(14px)", zIndex: 100, display: "flex", justifyContent: "center", alignItems: "center", padding: "12px" }}>
            <div style={{ background: "#0b101d", width: "100%", maxWidth: "480px", borderRadius: "24px", border: "1px solid rgba(56,189,248,0.3)", padding: "16px 18px", boxSizing: "border-box", boxShadow: "0 10px 40px rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "96vh", overflow: "hidden" }}>
              
              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "8px" }}>
                <div>
                  <span style={{ fontSize: "9px", color: playerMode === "rest" ? "#f59e0b" : "#38bdf8", fontWeight: 900, letterSpacing: "1px" }}>
                    {playerMode === "rest" ? "☕ REST TIME" : `⚡ SET ${currentSet} OF ${totalSetsCount}`}
                  </span>
                  <h2 style={{ fontSize: "14px", margin: "1px 0 0 0", color: "#fff", fontWeight: 900 }}>
                    {playerMode === "rest" ? "Get Ready for Next Exercise..." : currentExercise.name}
                  </h2>
                </div>
                
                {/* Live Percentage Badge */}
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: "#4ade80", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "8px", border: "1px solid rgba(34,197,94,0.3)" }}>
                    {sessionProgressPercent}% / 100%
                  </span>
                </div>
              </div>

              {/* COMPACT PLAYER CARD / REST LOADER SCREEN */}
              <div style={{ background: "rgba(18, 24, 38, 0.9)", border: playerMode === "rest" ? "1.5px solid #f59e0b" : "1.5px solid #38bdf8", borderRadius: "18px", padding: "12px", display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center" }}>
                
                {playerMode === "exercise" ? (
                  <>
                    <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 2px" }}>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#94a3b8" }}>EXERCISE {activeExerciseIndex + 1} / {selectedDayData.exercises.length}</span>
                      <span style={{ fontSize: "10px", fontWeight: 800, color: "#38bdf8", background: "rgba(56,189,248,0.1)", padding: "2px 8px", borderRadius: "6px" }}>{currentExercise.target}</span>
                    </div>

                    <div style={{ width: "100%", display: "flex", justifyContent: "center", background: "#030712", borderRadius: "12px", padding: "6px", border: "1px solid rgba(56,189,248,0.15)" }}>
                      <img 
                        src={currentExercise.gifUrl || "/exercises/gif/1.gif"} 
                        alt="Exercise Visual" 
                        onError={(e) => {
                          e.target.src = "/exercises/gif/1.gif";
                        }}
                        style={{ 
                          width: "100%", 
                          maxWidth: "160px", 
                          height: "130px", 
                          borderRadius: "10px", 
                          objectFit: "cover", 
                          imageRendering: "crisp-edges",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.6)"
                        }} 
                      />
                    </div>
                  </>
                ) : (
                  <div style={{ width: "100%", padding: "16px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "42px", height: "42px", border: "4px solid rgba(245,158,11,0.2)", borderTop: "4px solid #f59e0b", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#f59e0b" }}>Breathe & Get Ready! Next Exercise Coming Up</div>
                  </div>
                )}

                {/* TIMER & CONTROLS SECTION */}
                <div style={{ width: "100%", background: "rgba(3, 7, 18, 0.7)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "10px", display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ fontSize: "24px", fontWeight: 900, color: playerMode === "rest" ? "#f59e0b" : "#38bdf8", fontFamily: "monospace" }}>
                      {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: "10px", fontWeight: 800, background: playerMode === "rest" ? "rgba(245,158,11,0.15)" : "rgba(56, 189, 248, 0.15)", color: playerMode === "rest" ? "#f59e0b" : "#38bdf8", padding: "3px 8px", borderRadius: "10px" }}>
                      {playerMode === "rest" ? "☕ Rest Countdown" : `🔥 Set ${currentSet} Running`}
                    </span>
                  </div>

                  {/* TIMER SPEED SELECTOR */}
                  <div style={{ display: "flex", gap: "4px", width: "100%", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontSize: "9px", fontWeight: 800, color: "#94a3b8", marginRight: "2px" }}>SPEED:</span>
                    {[1, 2, 3, 4].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSpeed(s)}
                        style={{
                          background: speed === s ? "#38bdf8" : "rgba(255,255,255,0.06)",
                          color: speed === s ? "#030712" : "#cbd5e1",
                          border: speed === s ? "1px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "6px",
                          padding: "2px 8px",
                          fontWeight: 900,
                          fontSize: "10px",
                          cursor: "pointer"
                        }}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>

                  {/* START/PAUSE BUTTON WITH ARROWS */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%" }}>
                    
                    <button
                      onClick={handlePrevExercise}
                      disabled={activeExerciseIndex === 0}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: activeExerciseIndex === 0 ? "#475569" : "#fff", width: "36px", height: "36px", borderRadius: "10px", cursor: activeExerciseIndex === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900 }}
                    >
                      ‹
                    </button>

                    <button
                      onClick={() => setIsStarted(!isStarted)}
                      style={{ flex: 1, background: isStarted ? "#eab308" : "#22c55e", color: "#030712", border: "none", borderRadius: "10px", padding: "10px", fontWeight: 900, fontSize: "12px", cursor: "pointer" }}
                    >
                      {isStarted ? "⏸ Pause" : "▶ Start Exercise"}
                    </button>

                    <button
                      onClick={handleNextExercise}
                      disabled={activeExerciseIndex === selectedDayData.exercises.length - 1}
                      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: activeExerciseIndex === selectedDayData.exercises.length - 1 ? "#475569" : "#fff", width: "36px", height: "36px", borderRadius: "10px", cursor: activeExerciseIndex === selectedDayData.exercises.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 900 }}
                    >
                      ›
                    </button>

                  </div>

                  {/* Rest Phase Extra Actions (+10s and Skip Rest) */}
                  {playerMode === "rest" && (
                    <div style={{ display: "flex", gap: "6px", width: "100%", marginTop: "4px" }}>
                      <button
                        onClick={handleAddTenSeconds}
                        style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.4)", borderRadius: "8px", padding: "6px 10px", fontWeight: 900, fontSize: "11px", cursor: "pointer" }}
                      >
                        +10s Rest
                      </button>
                      <button
                        onClick={handleSkipRest}
                        style={{ flex: 1, background: "#38bdf8", color: "#030712", border: "none", borderRadius: "8px", padding: "6px", fontWeight: 900, fontSize: "11px", cursor: "pointer" }}
                      >
                        ⏭ Skip Rest
                      </button>
                    </div>
                  )}

                </div>

              </div>

              {/* Finish Workout Action Button */}
              <button
                onClick={() => handleCompleteWorkout(selectedDayData.day || 1)}
                style={{ width: "100%", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", border: "none", borderRadius: "12px", padding: "12px", fontWeight: 900, fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 15px rgba(34,197,94,0.4)" }}
              >
                Finish Workout 🎉
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}