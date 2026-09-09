"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AuthView({ defaultMode = "login" }) {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated Authentication Flow
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <>
      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 10%, #151824 0%, #080a0e 85%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          box-sizing: border-box;
          width: 100%;
          font-family: system-ui, sans-serif;
          position: relative;
          overflow: hidden;
        }

        .ambient-glow {
          position: absolute;
          width: 450px;
          height: 350px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 75, 43, 0.12) 0%, transparent 70%);
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: clamp(24px, 5vw, 36px);
          backdrop-filter: blur(16px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
          position: relative;
          z-index: 2;
          box-sizing: border-box;
        }

        .auth-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
          text-decoration: none;
          color: #ffffff;
        }
        .brand-badge {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(255, 75, 43, 0.4);
        }

        /* Toggle Tab Header */
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 14px;
          margin-bottom: 24px;
        }
        .auth-tab-btn {
          padding: 10px;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
          color: #94a3b8;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .auth-tab-btn.active {
          background: rgba(255, 75, 43, 0.2);
          color: #ffffff;
          border: 1px solid rgba(255, 75, 43, 0.35);
        }

        .input-group {
          margin-bottom: 18px;
        }
        .input-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #e2e8f0;
          margin-bottom: 8px;
        }
        .custom-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 13px 16px;
          color: #ffffff;
          font-size: 15px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }
        .custom-input:focus {
          border-color: #ff4b2b;
          background: rgba(255, 75, 43, 0.05);
          box-shadow: 0 0 0 3px rgba(255, 75, 43, 0.15);
        }

        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          border: none;
          color: #ffffff;
          padding: 15px;
          border-radius: 12px;
          font-size: 15.5px;
          font-weight: 800;
          cursor: pointer;
          margin-top: 10px;
          transition: all 0.25s ease;
          box-shadow: 0 8px 24px rgba(255, 75, 43, 0.35);
        }
        .btn-submit:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .footer-note {
          text-align: center;
          margin-top: 20px;
          font-size: 13px;
          color: #94a3b8;
        }
        .back-home {
          display: inline-block;
          margin-top: 16px;
          color: #64748b;
          text-decoration: none;
          font-size: 13px;
          transition: color 0.2s ease;
        }
        .back-home:hover {
          color: #cbd5e1;
        }
      `}</style>

      <div className="auth-container">
        <div className="ambient-glow"></div>

        <div className="auth-card">
          <Link href="/" className="auth-brand">
            <div className="brand-badge">🔥</div>
            <span style={{ fontSize: "20px", fontWeight: "900", letterSpacing: "0.5px" }}>AURA FIT</span>
          </Link>

          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Log In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="custom-input"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                required
                className="custom-input"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                type="password"
                required
                className="custom-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" className="btn-submit" disabled={isLoading}>
              {isLoading
                ? "Authenticating..."
                : isLogin
                ? "Log In to Account →"
                : "Create Free Account →"}
            </button>
          </form>

          <div className="footer-note">
            {isLogin ? (
              <span>
                New to AuraFit?{" "}
                <strong
                  style={{ color: "#ff5232", cursor: "pointer" }}
                  onClick={() => setIsLogin(false)}
                >
                  Create Account
                </strong>
              </span>
            ) : (
              <span>
                Already have an account?{" "}
                <strong
                  style={{ color: "#ff5232", cursor: "pointer" }}
                  onClick={() => setIsLogin(true)}
                >
                  Log In
                </strong>
              </span>
            )}
            <br />
            <Link href="/" className="back-home">
              ← Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}