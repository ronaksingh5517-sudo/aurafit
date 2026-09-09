"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function CheckoutView() {
  const router = useRouter();
  const { updateUser, triggerToast } = useApp();
  const [plan, setPlan] = useState("monthly");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      updateUser({ membership: plan === "yearly" ? "30-Day VIP Elite" : "30-Day Pro Unlimited" });
      triggerToast("🎉 Payment Successful! Account Upgraded to PRO.");
      router.push("/dashboard");
    }, 1800);
  };

  return (
    <>
      <style jsx>{`
        .checkout-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 10%, #151824 0%, #080a0e 85%);
          color: #ffffff;
          padding: 24px 16px 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: system-ui, sans-serif;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }

        .checkout-nav {
          width: 100%;
          max-width: 520px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
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

        .checkout-card {
          width: 100%;
          max-width: 520px;
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: clamp(20px, 4.5vw, 32px);
          backdrop-filter: blur(16px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
          box-sizing: border-box;
        }

        .plan-select-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 20px 0;
        }

        .plan-option {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 16px 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }
        .plan-option.selected {
          border-color: #ff4b2b;
          background: rgba(255, 75, 43, 0.12);
          box-shadow: 0 4px 16px rgba(255, 75, 43, 0.25);
        }

        .save-tag {
          position: absolute;
          top: -10px;
          right: 10px;
          background: #ffe600;
          color: #000;
          font-size: 9px;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .price-text {
          font-size: 22px;
          font-weight: 900;
          margin: 6px 0 2px;
        }

        .order-summary {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 22px;
        }

        .summary-line {
          display: flex;
          justify-content: space-between;
          font-size: 13.5px;
          padding: 6px 0;
          color: #94a3b8;
        }
        .summary-line.total {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          margin-top: 6px;
          padding-top: 10px;
          color: #ffffff;
          font-weight: 800;
          font-size: 16px;
        }

        .btn-pay {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          font-size: 15.5px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 8px 24px rgba(255, 75, 43, 0.35);
        }
        .btn-pay:hover {
          opacity: 0.94;
          transform: translateY(-1px);
        }
        .btn-pay:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>

      <div className="checkout-container">
        <header className="checkout-nav">
          <Link href="/dashboard" className="btn-back">
            ← Dashboard
          </Link>
          <span style={{ fontWeight: 800, fontSize: "16px" }}>Complete Upgrade</span>
          <div style={{ width: "60px" }}></div>
        </header>

        <div className="checkout-card">
          <div style={{ textAlign: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "36px" }}>⚡</span>
            <h2 style={{ fontSize: "22px", fontWeight: 800, margin: "8px 0 4px" }}>
              Unlock AuraFit Pro
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "13.5px", margin: 0 }}>
              Unlimited photo scans, 3D body analysis, and adaptive workout loads.
            </p>
          </div>

          <div className="plan-select-grid">
            <div
              className={`plan-option ${plan === "monthly" ? "selected" : ""}`}
              onClick={() => setPlan("monthly")}
            >
              <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>Monthly Sprint</div>
              <div className="price-text" style={{ color: "#ff5232" }}>$12.99</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>Billed monthly</div>
            </div>

            <div
              className={`plan-option ${plan === "yearly" ? "selected" : ""}`}
              onClick={() => setPlan("yearly")}
            >
              <span className="save-tag">SAVE 36%</span>
              <div style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 700 }}>Yearly Pass</div>
              <div className="price-text" style={{ color: "#ffe600" }}>$99.00</div>
              <div style={{ fontSize: "11px", color: "#64748b" }}>$8.25 / month</div>
            </div>
          </div>

          <div className="order-summary">
            <div className="summary-line">
              <span>Selected Plan</span>
              <span style={{ color: "#ffffff", fontWeight: 700 }}>
                {plan === "yearly" ? "12 Months Full Access" : "1 Month Full Access"}
              </span>
            </div>
            <div className="summary-line">
              <span>Instant AI Activation</span>
              <span style={{ color: "#22c55e", fontWeight: 700 }}>Included</span>
            </div>
            <div className="summary-line">
              <span>Taxes & Fees</span>
              <span>$0.00</span>
            </div>
            <div className="summary-line total">
              <span>Due Today</span>
              <span style={{ color: plan === "yearly" ? "#ffe600" : "#ff5232" }}>
                {plan === "yearly" ? "$99.00" : "$12.99"}
              </span>
            </div>
          </div>

          <button className="btn-pay" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? "Authorizing Secure Payment..." : `Activate Pro (${plan === "yearly" ? "$99" : "$12.99"}) →`}
          </button>

          <p style={{ textAlign: "center", fontSize: "11px", color: "#64748b", marginTop: "14px", marginBotton: 0 }}>
            🔒 256-Bit Encrypted · Cancel anytime with 1-click in Settings
          </p>
        </div>
      </div>
    </>
  );
}