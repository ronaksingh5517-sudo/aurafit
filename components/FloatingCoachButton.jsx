"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingCoachButton() {
  const pathname = usePathname() || "/";

  // Agar user pehle se AI Coach screen par hai, toh floating button hide karo
  if (pathname === "/ai-coach" || pathname === "/aicoach") return null;

  return (
    <>
      <style jsx>{`
        .floating-btn-wrap {
          position: fixed;
          bottom: 84px; /* Bottom nav ke upar clean position */
          right: 18px;
          z-index: 99;
        }

        .coach-fab {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          padding: 10px 16px;
          border-radius: 30px;
          text-decoration: none;
          font-weight: 800;
          font-size: 13.5px;
          box-shadow: 0 8px 25px rgba(255, 75, 43, 0.45);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .coach-fab:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 30px rgba(255, 75, 43, 0.6);
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          box-shadow: 0 0 8px #4ade80;
        }

        @media (max-width: 480px) {
          .coach-fab span.fab-text {
            display: none;
          }
          .coach-fab {
            padding: 12px;
            border-radius: 50%;
          }
        }
      `}</style>

      <div className="floating-btn-wrap">
        <Link href="/ai-coach" className="coach-fab">
          <span style={{ fontSize: "18px" }}>🤖</span>
          <span className="fab-text">Ask AI Coach</span>
          <span className="pulse-dot"></span>
        </Link>
      </div>
    </>
  );
}