// components/OnboardingWizard.jsx (Reference implementation)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", age: "", weight: "" });
  const router = useRouter();

  const handleNext = async (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Data ko database / localStorage mein save karna
      localStorage.setItem("aurafit_user", JSON.stringify(formData));
      // AI ko data bhejne aur save karne ke baad login/dashboard par redirect
      router.push("/dashboard");
    }
  };

  return (
    <div style={{ background: "#080a0e", color: "#fff", padding: "30px", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleNext} style={{ background: "#0b0f17", padding: "24px", borderRadius: "16px", width: "100%", maxWidth: "400px", border: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "16px" }}>AuraFit Setup - Step {step} of 3</h2>
        
        {step === 1 && (
          <div>
            <label style={{ fontSize: "12px", color: "#94a3b8" }}>Aapka Naam (Name kya hai?)</label>
            <input 
              type="text5" 
              required 
              placeholder="Jaise: Rahul" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ width: "100%", padding: "10px", marginTop: "8px", background: "#121622", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}
            />
          </div>
        )}

        {step === 2 && (
          <div>
            <label style={{ fontSize: "12px", color: "#94a3b8" }}>Aapki Age (Umar kitni hai?)</label>
            <input 
              type="number" 
              required 
              placeholder="Jaise: 21" 
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              style={{ width: "100%", padding: "10px", marginTop: "8px", background: "#121622", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <label style={{ fontSize: "12px", color: "#94a3b8" }}>Aapka Weight (Vajan kitna hai kg mein?)</label>
            <input 
              type="number" 
              required 
              placeholder="Jaise: 65" 
              value={formData.weight} 
              onChange={(e) => setFormData({...formData, weight: e.target.value})}
              style={{ width: "100%", padding: "10px", marginTop: "8px", background: "#121622", border: "1px solid #333", color: "#fff", borderRadius: "8px" }}
            />
          </div>
        )}

        <button type="submit" style={{ width: "100%", marginTop: "20px", padding: "12px", background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
          {step === 3 ? "Complete & Go to Login/Dashboard" : "Next →"}
        </button>
      </form>
    </div>
  );
}