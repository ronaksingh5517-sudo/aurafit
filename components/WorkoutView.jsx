"use client";
import { useState } from "react";

// Import all 6 flat data files from data folder
import { gymTransformationData } from "@/data/gym-transformation";
import { gymFatLossData } from "@/data/gym-fatloss";
import { gymGainWeightData } from "@/data/gym-gainweight";
import { homeTransformationData } from "@/data/home-transformation";
import { homeFatLossData } from "@/data/home-fatloss";
import { homeGainWeightData } from "@/data/home-gainweight";

export default function WorkoutView() {
  const [selectedCategory, setSelectedCategory] = useState(null); // "home" ya "gym"
  const [selectedGoal, setSelectedGoal] = useState(null); 
  const [bodyScanning, setBodyScanning] = useState(false);
  const [workoutUnlocked, setWorkoutUnlocked] = useState(false);
  const [currentWorkoutData, setCurrentWorkoutData] = useState(null);

  // Helper function to map category and goal to the correct data file
  const getSelectedWorkoutData = (category, goal) => {
    if (category === "gym") {
      if (goal.includes("Transformation")) return gymTransformationData;
      if (goal.includes("Fat Loss")) return gymFatLossData;
      if (goal.includes("Gain Weight")) return gymGainWeightData;
    } else if (category === "home") {
      if (goal.includes("Transformation")) return homeTransformationData;
      if (goal.includes("Fat Loss")) return homeFatLossData;
      if (goal.includes("Gain Weight")) return homeGainWeightData;
    }
    return null;
  };

const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
    // Goal select hote hi data save karo aur seedha body-scan route par redirect karo
    localStorage.setItem("aurafit_goal", goal);
    localStorage.setItem("aurafit_category", selectedCategory);
    
    // Seedha body-scan page par bhej do (Jaise pehle ho raha tha)
    window.location.href = "/body-scan";
  };
  return (
    <div className="workout-page">
      {/* Galaxy Background */}
      <div className="galaxy"></div>

      {/* STEP 1: Parent Images (Home vs Gym) with 3D Hover */}
      {!selectedCategory && (
        <div className="section-container">
          <h1 className="main-title">Select Your Workout</h1>
          <p className="subtitle">Choose where you want to perform your 30-day transformation.</p>
          
          <div className="cards-grid">
            <div className="image-card-wrapper" onClick={() => setSelectedCategory("home")}>
              <img src="/home.png" alt="Home Workout" className="interactive-3d-img" />
              <div className="img-title">🏠 Home Workout</div>
            </div>
            
            <div className="image-card-wrapper" onClick={() => setSelectedCategory("gym")}>
              <img src="/gym.png" alt="Gym Workout" className="interactive-3d-img" />
              <div className="img-title">🏢 Gym Workout</div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Children Images (3 Goals) with 3D Hover */}
      {selectedCategory && !selectedGoal && !bodyScanning && !workoutUnlocked && (
        <div className="section-container">
          <button className="back-btn" onClick={() => setSelectedCategory(null)}>← Back</button>
          <h1 className="main-title">Select Your 30-Day Goal ({selectedCategory.toUpperCase()}) 🔥</h1>
          <p className="subtitle">Pick your primary objective for the transformation engine.</p>

          <div className="cards-grid">
            {selectedCategory === "home" ? (
              <>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Home Transformation")}>
                  <img src="/home-transformation.png" alt="Transformation" className="interactive-3d-img" />
                  <div className="img-title">🔥 30 Days Transformation</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Home Fat Loss")}>
                  <img src="/home-fatloss.png" alt="Fat Loss" className="interactive-3d-img" />
                  <div className="img-title">⚡ Loss Fat</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Home Gain Weight")}>
                  <img src="/home-gainweight.png" alt="Gain Weight" className="interactive-3d-img" />
                  <div className="img-title">💪 Gain Weight</div>
                </div>
              </>
            ) : (
              <>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Gym Transformation")}>
                  <img src="/gym-transformation.png" alt="Transformation" className="interactive-3d-img" />
                  <div className="img-title">🔥 30 Days Transformation</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Gym Fat Loss")}>
                  <img src="/gym-fatloss.png" alt="Interactive 3D" className="interactive-3d-img" />
                  <div className="img-title">⚡ Loss Fat</div>
                </div>
                <div className="image-card-wrapper" onClick={() => handleGoalSelect("Gym Gain Weight")}>
                  <img src="/gym-gainweight.png" alt="Gain Weight" className="interactive-3d-img" />
                  <div className="img-title">💪 Gain Weight</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Body Scan Simulation State */}
      {bodyScanning && (
        <div className="scan-container">
          <div className="scanner-glow"></div>
          <h2 className="scan-text">🤖 AI Body Scan in Progress...</h2>
          <p className="subtitle">Analyzing your body composition for custom 30-day routine...</p>
        </div>
      )}

      {/* STEP 4: Unlocked 30-Day Workout Progression Panel with Data */}
      {workoutUnlocked && currentWorkoutData && (
        <div className="dashboard-panel">
          <h1 className="main-title">🚀 {currentWorkoutData.title}</h1>
          <p className="subtitle">{currentWorkoutData.description}</p>

          <div className="workout-days-grid">
            <div className="day-card unlocked">
              <h3>Day 1 Routine</h3>
              <p>Status: Unlocked ✅</p>
              <div style={{ marginTop: "10px", textAlign: "left", fontSize: "13px", color: "#cbd5e1" }}>
                {currentWorkoutData.exercises.map((ex, idx) => (
                  <div key={idx} style={{ marginBottom: "6px" }}>
                    • <b>{ex.name}</b> ({ex.sets})
                  </div>
                ))}
              </div>
              <button className="start-btn" onClick={() => window.location.href = "/body-scan"}>Start Exercise</button>
            </div>
            
            <div className="day-card locked">
              <h3>Day 2: Progression Split</h3>
              <p>Status: Locked 🔒 (Complete Day 1 first)</p>
            </div>
            <div className="day-card locked">
              <h3>Day 3: Endurance Core</h3>
              <p>Status: Locked 🔒</p>
            </div>
          </div>

          {/* Bottom Panel Features */}
          <div className="bottom-feature-bar">
            <button className="feature-btn" onClick={() => window.location.href = "/food-scan"}>🥗 Food Scanner</button>
            <button className="feature-btn ai-ask" onClick={() => window.location.href = "/chat"}>💬 Ask AI Coach</button>
            <button className="feature-btn" onClick={() => window.location.href = "/body-scan"}>📷 Body Scan</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .workout-page {
          position: relative;
          min-height: 100vh;
          width: 100vw;
          background-color: #121214;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: system-ui, sans-serif;
          overflow-x: hidden;
          box-sizing: border-box;
          z-index: 1;
        }

        .section-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          text-align: center;
          width: 100%;
          max-width: 1400px;
          z-index: 2;
        }

        .main-title {
          font-size: 32px;
          font-weight: 800;
          margin: 0;
          background: linear-gradient(135deg, #fff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #94a3b8;
          font-size: 15px;
          margin-bottom: 10px;
        }

        .cards-grid {
          display: flex;
          gap: 60px;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          margin-top: 30px;
          width: 100%;
          perspective: 1000px;
        }

        .image-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .interactive-3d-img {
          width: 280px;  
          height: 360px; 
          object-fit: cover;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(3, 192, 255, 0.4);
          transition: transform 0.5s ease, box-shadow 0.5s ease;
          transform-style: preserve-3d;
        }

        .image-card-wrapper:hover .interactive-3d-img {
          transform: rotateX(8deg) rotateY(-10deg) scale(1.04);
          box-shadow: -15px 30px 50px rgba(255, 75, 43, 0.4);
        }

        .img-title {
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          text-align: center;
          transition: color 0.3s;
        }

        .image-card-wrapper:hover .img-title {
          color: #e81cff;
        }

        .galaxy {
          height: 100vh;
          width: 100vw;
          background-image: radial-gradient(#ffffff 1px, transparent 1px),
            radial-gradient(#ffffff 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: 0 0, 25px 25px;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 0;
          opacity: 0.3;
          pointer-events: none;
          animation: twinkle 5s infinite;
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.5; }
        }

        .back-btn {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          align-self: flex-start;
          margin-bottom: 10px;
          z-index: 2;
        }

        .scan-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          z-index: 2;
        }

        .scan-text {
          font-size: 22px;
          color: #ffe600;
          animation: pulse 1.5s infinite;
        }

        .dashboard-panel {
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          z-index: 2;
        }

        .workout-days-grid {
          display: flex;
          gap: 20px;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }

        .day-card {
          background: #121622;
          border: 1px solid rgba(255,255,255,0.1);
          padding: 20px;
          border-radius: 12px;
          width: 260px;
          text-align: left;
        }

        .day-card.locked {
          opacity: 0.5;
          border-style: dashed;
          text-align: center;
        }

        .start-btn {
          margin-top: 15px;
          width: 100%;
          background: #22c55e;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .bottom-feature-bar {
          position: fixed;
          bottom: 20px;
          display: flex;
          gap: 15px;
          background: rgba(18, 22, 32, 0.9);
          padding: 12px 24px;
          border-radius: 30px;
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .feature-btn {
          background: #1e293b;
          color: #fff;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: 0.2s;
        }

        .feature-btn:hover {
          background: #334155;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}