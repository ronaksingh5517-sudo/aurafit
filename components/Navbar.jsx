"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
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
        .custom-navbar {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          background: transparent;
          padding: 16px 0;
          backdrop-filter: blur(4px);
        }
        .custom-nav-container {
          max-width: 1240px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
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
          box-shadow: 0 4px 15px rgba(255, 75, 43, 0.35);
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
        .custom-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          color: #f1f5f9;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.3px;
          text-decoration: none;
          transition: color 0.2s ease, opacity 0.2s ease;
          opacity: 0.9;
          cursor: pointer;
        }
        .nav-item:hover {
          color: #ff4b2b;
          opacity: 1;
        }
        .custom-nav-auth {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .btn-nav-login {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.25s ease;
        }
        .btn-nav-login:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: #ffffff;
        }
        .btn-nav-signup {
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          padding: 8px 20px;
          border-radius: 8px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          box-shadow: 0 4px 14px rgba(255, 75, 43, 0.3);
          transition: all 0.25s ease;
        }
        .btn-nav-signup:hover {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        @media (max-width: 900px) {
          .custom-nav-links {
            display: none;
          }
        }
        @media (max-width: 500px) {
          .brand-title {
            display: none;
          }
          .custom-nav-container {
            padding: 0 14px;
          }
          .btn-nav-login {
            display: none;
          }
        }
      `}</style>

      <nav className="custom-navbar">
        <div className="custom-nav-container">
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

          <ul className="custom-nav-links">
            <li><Link href="/" className="nav-item">Home</Link></li>
            <li>
              <Link href="/#page-2" className="nav-item" onClick={(e) => handleAnchorClick(e, "#page-2")}>
                Features
              </Link>
            </li>
            <li>
              <Link href="/#pricing" className="nav-item" onClick={(e) => handleAnchorClick(e, "#pricing")}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="/onboarding" className="nav-item" style={{ color: "#ff6b4a" }}>
                Start for Free
              </Link>
            </li>
          </ul>

          <div className="custom-nav-auth">
            <Link href="/login" className="btn-nav-login">Log In</Link>
            <Link href="/onboarding" className="btn-nav-signup">Sign Up</Link>
          </div>
        </div>
      </nav>
    </>
  );
}