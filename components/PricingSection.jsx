"use client";

import Link from "next/link";

export default function PricingSection() {
  return (
    <>
      <style jsx>{`
        .pricing-grid-updated {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 36px;
        }
        .pricing-card-custom {
          position: relative;
          background: rgba(18, 22, 32, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          backdrop-filter: blur(12px);
          transition: all 0.3s ease;
        }
        .pricing-card-custom:hover {
          transform: translateY(-6px);
          border-color: rgba(255, 75, 43, 0.4);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 75, 43, 0.15);
        }
        .pricing-card-custom.featured {
          background: linear-gradient(180deg, rgba(30, 20, 28, 0.85) 0%, rgba(16, 19, 28, 0.85) 100%);
          border: 1px solid rgba(255, 75, 43, 0.45);
          box-shadow: 0 16px 40px rgba(255, 75, 43, 0.15);
        }
        .pricing-badge-popular {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .pricing-badge-save {
          position: absolute;
          top: -13px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #ffe600, #ff8c00);
          color: #000000;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 4px 14px;
          border-radius: 20px;
          text-transform: uppercase;
        }
        .price-value-box {
          font-size: 38px;
          font-weight: 900;
          color: #ffffff;
          margin: 16px 0 10px;
          display: flex;
          align-items: baseline;
          gap: 4px;
        }
        .price-value-box span {
          font-size: 14px;
          font-weight: 500;
          color: #94a3b8;
        }
        .pricing-features-list {
          list-style: none;
          padding: 0;
          margin: 20px 0 28px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .pricing-features-list li {
          font-size: 13.5px;
          color: #cbd5e1;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pricing-features-list li::before {
          content: '✓';
          color: #ff5232;
          font-weight: bold;
        }
        @media (max-width: 1080px) {
          .pricing-grid-updated {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .pricing-grid-updated {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="section" id="pricing" style={{ background: "#080a0e", padding: "90px 20px 70px" }}>
        <div className="container">
          <div className="section-header fade-in" style={{ textAlign: "center", marginBottom: "40px" }}>
            <span className="section-label">Pricing Plans</span>
            <h2>Start free. Upgrade as you transform.</h2>
            <p style={{ color: "#94a3b8", maxWidth: "600px", margin: "12px auto 0" }}>
              Transparent pricing for real results. No hidden fees, cancel anytime.
            </p>
          </div>

          <div className="pricing-grid-updated">
            <div className="pricing-card-custom fade-in">
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff" }}>Free</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Get started with essentials</p>
                <div className="price-value-box">$0 <span>/ lifetime</span></div>
                <ul className="pricing-features-list">
                  <li>Basic 30-day plan</li>
                  <li>5 food scans daily</li>
                  <li>Workout log & streak tracker</li>
                  <li>Daily transformation missions</li>
                  <li>Community stories access</li>
                </ul>
              </div>
              <Link href="/onboarding" className="btn btn-secondary btn-block">Start Free</Link>
            </div>

            <div className="pricing-card-custom fade-in">
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff" }}>Weekly</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Flexible trial sprint</p>
                <div className="price-value-box">$4.99 <span>/ week</span></div>
                <ul className="pricing-features-list">
                  <li>Unlimited meal photo scans</li>
                  <li>Adaptive workout adjustments</li>
                  <li>Instant calorie & macro feedback</li>
                  <li>Full exercise demo library</li>
                  <li>Cancel anytime with 1-click</li>
                </ul>
              </div>
              <Link href="/onboarding" className="btn btn-secondary btn-block">Get Started</Link>
            </div>

            <div className="pricing-card-custom featured fade-in">
              <span className="pricing-badge-popular">MOST POPULAR</span>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff" }}>Monthly</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Full 30-day AI power</p>
                <div className="price-value-box">
                  <span style={{ color: "#ff5232", fontSize: "38px", fontWeight: 900 }}>$12.99</span> <span>/ month</span>
                </div>
                <ul className="pricing-features-list">
                  <li>Everything in Weekly Plan</li>
                  <li>AI 3D body silhouette tracking</li>
                  <li>Daily tailored coaching feedback</li>
                  <li>Smart progressive workout loads</li>
                  <li>Priority support 24/7</li>
                </ul>
              </div>
              <Link href="/onboarding" className="btn btn-primary btn-block">Start Monthly</Link>
            </div>

            <div className="pricing-card-custom fade-in">
              <span className="pricing-badge-save">SAVE 36%</span>
              <div>
                <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff" }}>Yearly</h3>
                <p style={{ color: "#94a3b8", fontSize: "13px", marginTop: "4px" }}>Complete long-term journey</p>
                <div className="price-value-box">$99 <span>/ year</span></div>
                <ul className="pricing-features-list">
                  <li>Full Pro access for 12 months</li>
                  <li>Equivalent to just $8.25/mo</li>
                  <li>Exclusive custom seasonal challenges</li>
                  <li>Early VIP access to new AI models</li>
                  <li>Personalized diet & workout exports</li>
                </ul>
              </div>
              <Link href="/onboarding" className="btn btn-secondary btn-block">Save on Yearly</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}