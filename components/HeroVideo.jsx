"use client";

import Link from "next/link";

export default function HeroVideo() {
  return (
    <>
      <style jsx>{`
        .hero-responsive-section {
          position: relative;
          min-height: 94vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 110px 20px 50px;
          text-align: center;
          background: #080a0e !important;
        }
        .hero-video-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.75;
          filter: brightness(0.9) contrast(1.05);
          z-index: 0;
          pointer-events: none;
        }
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(8, 10, 14, 0.3) 0%, rgba(8, 10, 14, 0.72) 65%, #080a0e 100%);
          z-index: 1;
        }
        .hero-content-wrapper {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #f1f5f9;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .hero-badge .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff4b2b;
          box-shadow: 0 0 8px #ff4b2b;
        }
        .hero-actions-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
          margin-bottom: 36px;
        }
        .hero-stats-group {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 32px;
        }
        .highlight {
          color: #ff5232;
        }
        @media (max-width: 768px) {
          .hero-responsive-section {
            min-height: 90vh;
            padding: 95px 16px 40px;
          }
          .hero-actions-group .btn {
            width: 100%;
            text-align: center;
          }
          .hero-stats-group {
            gap: 18px;
          }
        }
      `}</style>

      <section className="hero hero-responsive-section">
        <video autoPlay loop muted playsInline className="hero-video-bg">
          <source src="/videos/hero-gym.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="hero-content-wrapper">
          <div className="fade-in">
            <div className="hero-badge" style={{ marginLeft: "auto", marginRight: "auto" }}>
              <span className="dot"></span>
              AI-Powered Fitness Coach
            </div>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4rem)", lineHeight: 1.15, marginBottom: "18px" }}>
              Transform Yourself<br />
              in <span className="highlight">30 Days</span>
            </h1>
            <p className="hero-desc" style={{ maxWidth: "640px", margin: "0 auto 30px auto" }}>
              Your personal AI coach that adapts to YOU. Photo food scanner, smart workouts, daily missions — all in one place.
            </p>
            <div className="hero-actions-group">
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Start My 30-Day Journey →
              </Link>
              <a href="#page-2" className="btn btn-secondary btn-lg">
                See How it Works
              </a>
            </div>
            <div className="hero-stats-group">
              <div className="stat-item">
                <div className="stat-value">50K+</div>
                <div className="stat-label">Active Users</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4.9★</div>
                <div className="stat-label">App Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">92%</div>
                <div className="stat-label">See Results</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}