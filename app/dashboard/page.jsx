"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Fit30Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [activeDay, setActiveDay] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [completedSets, setCompletedSets] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const userId = session?.user?.email || "user_1788771654076";

  const fetchProgram = async (action = null, dayNumber = null) => {
    try {
      setLoading(true);
      const res = await fetch("/api/fit30-program", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, dayNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setProgram(data);
        if (!activeDay && data.days) {
          const firstUnlocked = data.days.find(d => d.day === data.currentDayUnlocked) || data.days[0];
          setActiveDay(firstUnlocked);
        } else if (activeDay) {
          const updatedActive = data.days.find(d => d.day === activeDay.day);
          setActiveDay(updatedActive);
        }
      } else {
        setErrorMsg(data.error || "Failed to load program");
      }
    } catch (err) {
      setErrorMsg("Network error loading FIT30 program.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProgram();
    }
  }, [status]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleSet = (exerciseIndex, setNum) => {
    const key = `${activeDay.day}-${exerciseIndex}-${setNum}`;
    const isNowChecked = !completedSets[key];

    setCompletedSets(prev => ({
      ...prev,
      [key]: isNowChecked
    }));

    if (isNowChecked) {
      setTimerSeconds(60);
      setIsTimerRunning(true);
    }
  };

  const handleCompleteDay = async (dayNum) => {
    setCompleting(true);
    await fetchProgram("complete_day", dayNum);
    setCompleting(false);
    setCompletedSets({});
  };

  if (status === "loading" || (loading && !program)) {
    return (
      <div style={{ minHeight: "100vh", background: "#05070b", color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", fontFamily: "system-ui, sans-serif" }}>
        <p style={{ fontSize: "16px", color: "#38bdf8" }}>Authenticating & Loading FIT30 Engine...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#05070b", color: "#fff", padding: "30px 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
          <div>
            <span style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>FIT30 Program Engine</span>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", marginTop: "6px" }}>{program?.programName || "30-Day Transformation"}</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span style={{ fontSize: "13px", color: "#94a3b8" }}>👤 {session.user?.name || session.user?.email}</span>
            <a href="/login" style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444", padding: "8px 14px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600, border: "1px solid rgba(239,68,68,0.2)" }}>Logout</a>
          </div>
        </div>

        {program?.stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginBottom: "25px" }}>
            <div style={{ background: "rgba(18,22,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "12px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Completed Workouts</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#38bdf8", marginTop: "4px" }}>{program.stats.totalCompleted} / 30</div>
            </div>
            <div style={{ background: "rgba(18,22,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "12px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Overall Progress</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#34d399", marginTop: "4px" }}>{program.stats.progressPercentage}%</div>
            </div>
            <div style={{ background: "rgba(18,22,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", padding: "16px", borderRadius: "12px" }}>
              <div style={{ fontSize: "12px", color: "#94a3b8" }}>Current Streak</div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#fbbf24", marginTop: "4px" }}>🔥 {program.stats.streak} Days</div>
            </div>
          </div>
        )}

        {timerSeconds !== null && (
          <div style={{ background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.3)", borderRadius: "12px", padding: "14px 20px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" }}>⏱️ Rest Timer Active</span>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff" }}>{timerSeconds}s remaining</div>
            </div>
            <button 
              onClick={() => { setIsTimerRunning(false); setTimerSeconds(null); }}
              style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
            >
              Dismiss
            </button>
          </div>
        )}

        {errorMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "12px", borderRadius: "8px", color: "#ef4444", marginBottom: "20px", fontSize: "14px" }}>
            {errorMsg}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "25px", alignItems: "start" }}>
          
          <div style={{ background: "rgba(18,22,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "20px", maxHeight: "70vh", overflowY: "auto" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "15px", color: "#38bdf8" }}>30-Day Roadmap</h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "8px" }}>
              {program?.days?.map((d) => {
                const isSelected = activeDay?.day === d.day;
                let bg = "#0b0f17";
                let borderColor = "rgba(255,255,255,0.08)";
                let textColor = "#94a3b8";

                if (d.isCompleted) {
                  bg = "rgba(16, 185, 129, 0.15)";
                  borderColor = "rgba(16, 185, 129, 0.4)";
                  textColor = "#34d399";
                } else if (d.isUnlocked) {
                  bg = "rgba(56, 189, 248, 0.15)";
                  borderColor = "rgba(56, 189, 248, 0.4)";
                  textColor = "#38bdf8";
                }

                if (isSelected) {
                  borderColor = "#fff";
                }

                return (
                  <button
                    key={d.day}
                    onClick={() => { setActiveDay(d); setTimerSeconds(null); }}
                    style={{
                      background: bg,
                      border: `1px solid ${borderColor}`,
                      borderRadius: "8px",
                      padding: "10px 0",
                      color: textColor,
                      fontWeight: 700,
                      fontSize: "13px",
                      cursor: d.isUnlocked ? "pointer" : "not-allowed",
                      opacity: d.isUnlocked ? 1 : 0.5,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "2px"
                    }}
                  >
                    <span>{d.day}</span>
                    <span style={{ fontSize: "10px" }}>
                      {d.isCompleted ? "✅" : d.isUnlocked ? "🔓" : "🔒"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ background: "rgba(18,22,34,0.9)", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: "16px", padding: "25px" }}>
            {activeDay ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "15px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#38bdf8", fontWeight: 700, textTransform: "uppercase" }}>Day {activeDay.day} Routine</span>
                    <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", marginTop: "4px" }}>{activeDay.title}</h2>
                    <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>🎯 Focus: {activeDay.focus}</p>
                  </div>
                  
                  <div>
                    {activeDay.isCompleted ? (
                      <span style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
                        Completed ✅
                      </span>
                    ) : activeDay.isUnlocked ? (
                      <button
                        onClick={() => handleCompleteDay(activeDay.day)}
                        disabled={completing}
                        style={{ background: "#10b981", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}
                      >
                        {completing ? "Saving..." : "Finish Day & Unlock Next 🔓"}
                      </button>
                    ) : (
                      <span style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", padding: "6px 14px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
                        Locked 🔒
                      </span>
                    )}
                  </div>
                </div>

                <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px", color: "#fff" }}>Scheduled Exercises & Set Tracker</h3>
                
                {activeDay.exercises && activeDay.exercises.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    {activeDay.exercises.map((ex, idx) => {
                      const totalSets = Number(ex.sets) || 3;
                      return (
                        <div key={idx} style={{ background: "#0b0f17", border: "1px solid rgba(255,255,255,0.06)", padding: "16px", borderRadius: "12px" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <h4 style={{ fontSize: "15px", fontWeight: 600, color: "#fff" }}>{idx + 1}. {ex.name}</h4>
                            <span style={{ fontSize: "12px", color: "#94a3b8" }}>Target Reps: <strong style={{ color: "#38bdf8" }}>{ex.reps}</strong></span>
                          </div>

                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {Array.from({ length: totalSets }).map((_, setIdx) => {
                              const setNum = setIdx + 1;
                              const isChecked = completedSets[`${activeDay.day}-${idx}-${setNum}`];
                              return (
                                <button
                                  key={setNum}
                                  onClick={() => toggleSet(idx, setNum)}
                                  style={{
                                    background: isChecked ? "#10b981" : "rgba(255,255,255,0.05)",
                                    border: isChecked ? "none" : "1px solid rgba(255,255,255,0.15)",
                                    color: isChecked ? "#fff" : "#94a3b8",
                                    padding: "6px 14px",
                                    borderRadius: "6px",
                                    fontSize: "12px",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    transition: "all 0.1s ease"
                                  }}
                                >
                                  Set {setNum} {isChecked ? "✓" : ""}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: "#94a3b8", fontSize: "14px" }}>Rest day! No exercises scheduled. Mark as complete to move forward.</p>
                )}
              </div>
            ) : (
              <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Select a day from the roadmap to view details.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}