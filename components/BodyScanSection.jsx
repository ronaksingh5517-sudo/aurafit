"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function BodyScanSection() {
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
        .section-hero-2 {
          position: relative;
          background: #080a0e !important;
          min-height: 94vh;
          display: flex;
          align-items: center;
          padding: 60px 24px;
          overflow: hidden;
        }
        .section-hero-2-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-2-image-box {
          flex: 1 1 0%;
          width: 100%;
          height: 75vh;
          max-height: 680px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-80px) scale(0.95);
          transition: opacity 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-2-image-box.scrolled-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .hero-2-glow-bg {
          position: absolute;
          width: 440px;
          height: 440px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 230, 0, 0.18) 0%, rgba(255, 75, 43, 0.08) 45%, rgba(8, 10, 14, 0) 70%);
          filter: blur(60px);
          pointer-events: none;
        }
        .hero-2-scan-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .hero-2-scan-img {
          width: 100%;
          height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 20px 30px rgba(0, 0, 0, 0.75));
          animation: scanFloatFluid 5s ease-in-out infinite;
        }
        @keyframes scanFloatFluid {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(-1.2deg); }
        }
        .scan-laser-beam {
          position: absolute;
          left: 10%;
          width: 80%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #ffe600, #ff416c, #ffe600, transparent);
          box-shadow: 0 0 16px 3px rgba(255, 230, 0, 0.6);
          border-radius: 50%;
          z-index: 2;
          pointer-events: none;
          animation: scanLaser 3.5s ease-in-out infinite alternate;
        }
        @keyframes scanLaser {
          0% { top: 12%; opacity: 0.15; }
          15% { opacity: 0.9; }
          85% { opacity: 0.9; }
          100% { top: 88%; opacity: 0.15; }
        }
        .hero-2-text-wrap {
          flex: 0 0 auto;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          z-index: 3;
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
        .hero-2-text-wrap h1 {
          font-size: clamp(2.1rem, 4.4vw, 3.8rem);
          line-height: 1.15;
          margin: 0 0 18px 0;
          color: #ffffff;
          font-weight: 800;
        }
        .yellow-red-animated-text {
          background: linear-gradient(
            110deg,
            #ffe600 0%,
            #ffe600 35%,
            #fff066 50%,
            #ff3d3d 52%,
            #ffe600 54%,
            #ffe600 85%,
            #ffb703 100%
          );
          background-size: 250% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: yellowRedShine 3.6s ease-in-out infinite;
          display: inline-block;
        }
        @keyframes yellowRedShine {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-underline-wrapper {
          position: relative;
          display: inline-block;
          padding-bottom: 6px;
        }
        .animated-underline-wrapper::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 5px;
          border-radius: 4px;
          background: linear-gradient(90deg, #ffe600 0%, #ffe600 48%, #ff3d3d 50%, #ffe600 52%, #ffb703 100%);
          background-size: 250% 100%;
          animation: yellowRedShine 3.6s ease-in-out infinite;
          box-shadow: 0 2px 14px rgba(255, 230, 0, 0.6);
        }
        .hero-desc {
          max-width: 480px;
          margin: 0 0 30px 0;
          line-height: 1.7;
          color: #94a3b8;
          font-size: 16px;
        }
        .hero-2-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 968px) {
          .section-hero-2 {
            min-height: auto;
            padding: 30px 16px 50px;
          }
          .section-hero-2-container {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .hero-2-image-box {
            order: 1;
            height: 48vh;
            min-height: 360px;
            max-height: 440px;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            transform: translateX(-40px);
          }
          .hero-2-image-box.scrolled-in {
            transform: translateX(0);
          }
          .hero-2-text-wrap {
            order: 2;
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          .hero-2-actions {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

      <section className="section-hero-2" id="page-2" ref={sectionRef}>
        <div className="section-hero-2-container">
          <div className={`hero-2-image-box ${isVisible ? "scrolled-in" : ""}`}>
            <div className="hero-2-glow-bg"></div>
            <div className="hero-2-scan-wrapper">
              <div className="scan-laser-beam"></div>
              <img src="/scan.png" alt="AI Body Scan" className="hero-2-scan-img" />
            </div>
          </div>

          <div className="hero-2-text-wrap">
            <div className="hero-badge">
              <span className="dot"></span>
              AI-Powered Fitness Coach
            </div>

            <h1>
              <span>Scan Body</span><br />
              <span className="yellow-red-animated-text">and Start a</span><br />
              <span className="yellow-red-animated-text animated-underline-wrapper">Transformation</span>
            </h1>

            <p className="hero-desc">
              Your personal AI coach that adapts to YOU. Photo food scanner, smart workouts, daily missions — all in one place.
            </p>

            <div className="hero-2-actions">
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Start My 30-Day Journey →
              </Link>
              <a href="#page-3" className="btn btn-secondary btn-lg">
                See How it Works
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}