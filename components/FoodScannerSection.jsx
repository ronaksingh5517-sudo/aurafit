"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function FoodScannerSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style jsx>{`
        .section-hero-3 {
          position: relative;
          min-height: 94vh;
          display: flex;
          align-items: center;
          background: #080a0e !important;
          padding: 60px 24px;
          overflow: hidden;
        }
        .section-hero-3-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
        }
        .hero-3-text-wrap {
          flex: 0 0 auto;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          z-index: 2;
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
        .hero-3-text-wrap h1 {
          font-size: clamp(2.1rem, 4.4vw, 3.8rem);
          line-height: 1.15;
          margin: 0 0 20px 0;
          color: #ffffff;
          font-weight: 800;
        }
        .highlight {
          color: #ff5232;
        }
        .hero-desc {
          max-width: 480px;
          margin: 0 0 32px 0;
          line-height: 1.7;
          color: #94a3b8;
          font-size: 16px;
        }
        .hero-3-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        .hero-3-image-box {
          flex: 1 1 0%;
          width: 100%;
          height: 75vh;
          max-height: 700px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(80px) scale(0.95);
          transition: opacity 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-3-image-box.scrolled-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .hero-3-glow-bg {
          position: absolute;
          width: 450px;
          height: 450px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 75, 43, 0.28) 0%, rgba(255, 65, 108, 0.08) 45%, rgba(8, 10, 14, 0) 70%);
          filter: blur(65px);
          pointer-events: none;
        }
        .hero-3-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.75));
          animation: floatBurgerFluid 4.6s ease-in-out infinite;
        }
        @keyframes floatBurgerFluid {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-16px) rotate(1.8deg) scale(1.02); }
        }
        .hero-3-pill {
          position: absolute;
          z-index: 3;
          padding: 12px 18px;
          border-radius: 14px;
          background: rgba(18, 22, 32, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(10px);
          color: #ffffff;
          box-shadow: 0 15px 30px rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pill-top-right {
          top: 25px;
          right: 25px;
        }
        .pill-bottom-left {
          bottom: 30px;
          left: 15px;
        }
        .pill-stat-val {
          font-size: 18px;
          font-weight: 800;
          color: #ff5232;
        }
        .pill-stat-lbl {
          font-size: 12px;
          color: #94a3b8;
        }
        @media (max-width: 968px) {
          .section-hero-3 {
            min-height: auto;
            padding: 30px 16px 50px;
          }
          .section-hero-3-container {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .hero-3-image-box {
            order: 1;
            height: 44vh;
            min-height: 340px;
            max-height: 420px;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            transform: translateX(40px);
          }
          .hero-3-image-box.scrolled-in {
            transform: translateX(0);
          }
          .hero-3-text-wrap {
            order: 2;
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          .hero-3-actions {
            justify-content: center;
            width: 100%;
          }
          .hero-3-pill {
            display: none;
          }
        }
      `}</style>

      <section className="section-hero-3" id="page-3" ref={sectionRef}>
        <div className="section-hero-3-container">
          <div className="hero-3-text-wrap">
            <div className="hero-badge">
              <span className="dot"></span>
              AI Calorie & Meal Scanner
            </div>

            <h1>
              Track your calories<br />
              with just a <span className="highlight">picture</span>
            </h1>

            <p className="hero-desc">
              Meet Cal AI, the AI-powered app for easy calorie tracking. Snap a photo, scan a barcode, or describe your meal and get instant calorie and nutrient info.
            </p>

            <div className="hero-3-actions">
              <Link href="/food-scanner" className="btn btn-primary btn-lg">
                Try Food Scanner →
              </Link>
              <Link href="/onboarding" className="btn btn-secondary btn-lg">
                Start Free
              </Link>
            </div>
          </div>

          <div className={`hero-3-image-box ${isVisible ? "scrolled-in" : ""}`}>
            <div className="hero-3-glow-bg"></div>

            <div className="hero-3-pill pill-top-right">
              <span style={{ fontSize: "24px" }}>🍔</span>
              <div>
                <div className="pill-stat-val">540 kcal</div>
                <div className="pill-stat-lbl">AI Confidence: 99%</div>
              </div>
            </div>

            <div className="hero-3-pill pill-bottom-left">
              <span style={{ fontSize: "24px" }}>🥩</span>
              <div>
                <div className="pill-stat-val">32g Protein</div>
                <div className="pill-stat-lbl">Target: Balanced</div>
              </div>
            </div>

            <img src="/burger.png" alt="Scan food calories with Cal AI" className="hero-3-img" />
          </div>
        </div>
      </section>
    </>
  );
}