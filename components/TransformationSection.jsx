"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function TransformationSection() {
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
        .section-hero-4 {
          position: relative;
          min-height: 94vh;
          display: flex;
          align-items: center;
          background: #080a0e !important;
          padding: 60px 24px;
          overflow: hidden;
        }
        .section-hero-4-container {
          max-width: 1400px;
          width: 100%;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
        }
        .hero-4-image-box {
          flex: 1 1 0%;
          width: 100%;
          height: 75vh;
          max-height: 700px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateX(-80px) scale(0.95);
          transition: opacity 0.85s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.85s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .hero-4-image-box.scrolled-in {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .hero-4-glow-bg {
          position: absolute;
          width: 480px;
          height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 65, 108, 0.22) 0%, rgba(255, 75, 43, 0.1) 50%, rgba(8, 10, 14, 0) 70%);
          filter: blur(65px);
          pointer-events: none;
        }
        .hero-4-img {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          max-width: 100%;
          object-fit: contain;
          filter: drop-shadow(0 25px 35px rgba(0, 0, 0, 0.8));
          animation: floatBodyFluid 5s ease-in-out infinite;
        }
        @keyframes floatBodyFluid {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(1.2deg); }
        }
        .hero-4-text-wrap {
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
        .hero-4-text-wrap h1 {
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
        .hero-4-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        @media (max-width: 968px) {
          .section-hero-4 {
            min-height: auto;
            padding: 30px 16px 50px;
          }
          .section-hero-4-container {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .hero-4-image-box {
            order: 1;
            height: 46vh;
            min-height: 350px;
            max-height: 440px;
            width: 100%;
            max-width: 360px;
            margin: 0 auto;
            transform: translateX(-40px);
          }
          .hero-4-image-box.scrolled-in {
            transform: translateX(0);
          }
          .hero-4-text-wrap {
            order: 2;
            max-width: 100%;
            align-items: center;
            text-align: center;
          }
          .hero-4-actions {
            justify-content: center;
            width: 100%;
          }
        }
      `}</style>

      <section className="section-hero-4" id="page-4" ref={sectionRef}>
        <div className="section-hero-4-container">
          <div className={`hero-4-image-box ${isVisible ? "scrolled-in" : ""}`}>
            <div className="hero-4-glow-bg"></div>
            <img src="/body.png" alt="Track Body Transformation" className="hero-4-img" />
          </div>

          <div className="hero-4-text-wrap">
            <div className="hero-badge">
              <span className="dot"></span>
              AI Body Shape & Progress Analysis
            </div>

            <h1>
              Track real visual<br />
              body <span className="highlight">transformation</span>
            </h1>

            <p className="hero-desc">
              Compare weekly body composition changes side-by-side with computer vision. AI tracks posture, muscle density, and body fat progression without guesswork.
            </p>

            <div className="hero-4-actions">
              <Link href="/onboarding" className="btn btn-primary btn-lg">
                Start My 30-Day Journey →
              </Link>
              <a href="#pricing" className="btn btn-secondary btn-lg">
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}