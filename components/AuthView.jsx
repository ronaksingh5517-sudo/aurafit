"use client";
import { useState } from "react";

export default function AuthView({ initialStep = "onboarding" }) {
  const [step, setStep] = useState(initialStep); 
  const [formData, setFormData] = useState({ name: "", age: "", weight: "", email: "", password: "" });

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.weight) return;
    
    // Data save karo
    localStorage.setItem("aurafit_user", JSON.stringify(formData));
    
    // Ab login step par shift karo
    setStep("login");
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    window.location.href = "/workout";
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      
      {step === "onboarding" ? (
        /* 1. PEHLE SAWAAL (Name, Age, Weight) */
        <form onSubmit={handleOnboardingSubmit} style={{ background: "#0b0f17", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, textAlign: "center", margin: 0 }}>AuraFit AI Setup 🤖</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: 0 }}>Pehle apni basic details darj karein.</p>
          
          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Naam (Name)</label>
            <input type="text" required placeholder="Aapka naam" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Age (Umar)</label>
            <input type="number" required placeholder="Jaise: 22" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Weight (Vajan in kg)</label>
            <input type="number" required placeholder="Jaise: 70" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <button type="submit" style={{ background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", marginTop: "10px" }}>
            Submit Sawaal & Go to Login →
          </button>
        </form>
      ) : (
        /* 2. USKE BAAD LOGIN PAGE */
        <form onSubmit={handleLoginSubmit} style={{ background: "#0b0f17", padding: "30px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.08)", width: "100%", maxWidth: "400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, textAlign: "center", margin: 0 }}>Login to AuraFit 🔐</h2>
          <p style={{ fontSize: "13px", color: "#94a3b8", textAlign: "center", margin: 0 }}>Apne account mein sign in karein.</p>
          
          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Email</label>
            <input type="email" required placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <div>
            <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Password</label>
            <input type="password" required placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} style={{ width: "100%", padding: "10px", background: "#121622", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff", marginTop: "4px" }} />
          </div>

          <button type="submit" style={{ background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: 700, cursor: "pointer", marginTop: "10px" }}>
            Login & Open Workouts →
          </button>
        </form>
      )}

    </div>
  );
}