"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const handleAnchorClick = (e, targetId) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx>{`
        .aura-footer {
          background: #040508 !important;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          padding: 70px 24px 30px;
          color: #94a3b8;
          font-size: 14px;
        }
        .aura-footer-container {
          max-width: 1240px;
          margin: 0 auto;
        }
        .aura-footer-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 50px;
        }
        .brand-logo-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #ffffff;
        }
        .logo-badge-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .brand-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          background: linear-gradient(90deg, #ffffff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .aura-footer-brand p {
          margin-top: 16px;
          line-height: 1.65;
          color: #94a3b8;
          max-width: 320px;
        }
        .aura-footer-col h4 {
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          margin-bottom: 18px;
          text-transform: uppercase;
        }
        .aura-footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .f-link {
          color: #94a3b8;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
        }
        .f-link:hover {
          color: #ff5232;
          transform: translateX(3px);
        }
        .aura-status-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #4ade80;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 20px;
          margin-top: 18px;
        }
        .aura-status-dot {
          width: 7px;
          height: 7px;
          background: #22c55e;
          border-radius: 50%;
        }
        .aura-footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 25px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 13px;
          color: #64748b;
        }
        .aura-bottom-nav {
          display: flex;
          gap: 20px;
        }
        .b-nav-link {
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .b-nav-link:hover {
          color: #cbd5e1;
        }
        @media (max-width: 900px) {
          .aura-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 580px) {
          .aura-footer {
            padding: 50px 16px 25px;
          }
          .aura-footer-grid {
            grid-template-columns: 1fr;
          }
          .aura-footer-bottom {
            flex-direction: column;
            gap: 14px;
            text-align: center;
          }
        }
      `}</style>

      <footer className="aura-footer">
        <div className="aura-footer-container">
          <div className="aura-footer-grid">
            <div className="aura-footer-brand">
              <Link href="/" className="brand-logo-wrap">
                <div className="logo-badge-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6.5 6.5 11 11" />
                    <path d="m21 21-1-1" />
                    <path d="m3 3 1 1" />
                    <path d="m18 22 4-4" />
                    <path d="m2 6 4-4" />
                    <path d="m3 10 7-7" />
                    <path d="m14 21 7-7" />
                  </svg>
                </div>
                <span className="brand-title">AURA FIT</span>
              </Link>
              <p>Next-gen AI fitness & calorie intelligence. Scan body, track meals with a picture, and achieve your 30-day goals effortlessly.</p>
              <div className="aura-status-badge">
                <span className="aura-status-dot"></span> AI Engines Active (v2.6)
              </div>
            </div>

            <div className="aura-footer-col">
              <h4>AI Features</h4>
              <ul className="aura-footer-links">
                <li><Link href="/food-scanner" className="f-link">📸 Food Scanner</Link></li>
                <li><Link href="/#page-2" className="f-link" onClick={(e) => handleAnchorClick(e, "#page-2")}>⚡ Body Scan Analysis</Link></li>
                <li><Link href="/#page-3" className="f-link" onClick={(e) => handleAnchorClick(e, "#page-3")}>🍔 Calorie Picture Log</Link></li>
                <li><Link href="/#page-4" className="f-link" onClick={(e) => handleAnchorClick(e, "#page-4")}>📊 Visual Transformation</Link></li>
                <li><Link href="/analysis" className="f-link">🤖 AI Routine Matcher</Link></li>
              </ul>
            </div>

            <div className="aura-footer-col">
              <h4>Dashboard</h4>
              <ul className="aura-footer-links">
                <li><Link href="/dashboard" className="f-link">🏠 User Dashboard</Link></li>
                <li><Link href="/workout" className="f-link">🏋️ Daily Workout Player</Link></li>
                <li><Link href="/progress" className="f-link">📈 30-Day Streak Review</Link></li>
                <li><Link href="/basic-info" className="f-link">⚙️ Edit Profile Stats</Link></li>
                <li><Link href="/safety" className="f-link">🛡️ Fitness Health Screening</Link></li>
              </ul>
            </div>

            <div className="aura-footer-col">
              <h4>Membership</h4>
              <ul className="aura-footer-links">
                <li><Link href="/#pricing" className="f-link" onClick={(e) => handleAnchorClick(e, "#pricing")}>💳 Pricing Plans</Link></li>
                <li><Link href="/onboarding" className="f-link">🚀 Start Free (30 Days)</Link></li>
                <li><Link href="/login" className="f-link">🔑 Member Login</Link></li>
                <li><Link href="/goal" className="f-link">🎯 Goal Discovery</Link></li>
                <li><Link href="/time" className="f-link">⏱️ Schedule Optimizer</Link></li>
              </ul>
            </div>
          </div>

          <div className="aura-footer-bottom">
            <div>© 2026 AuraFit AI. All rights reserved. Built with 🔥 for peak performance.</div>
            <div className="aura-bottom-nav">
              <Link href="/safety" className="b-nav-link">Safety Terms</Link>
              <Link href="/#pricing" className="b-nav-link" onClick={(e) => handleAnchorClick(e, "#pricing")}>Upgrade</Link>
              <Link href="/dashboard" className="b-nav-link">App</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}