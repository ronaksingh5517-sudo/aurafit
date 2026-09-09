"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Don't show bottom nav on login/landing if any, or show everywhere inside app
  if (pathname === "/") return null;

  const navItems = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/ai-coach", label: "AI Coach", icon: "🤖" },
    { href: "/food-scanner", label: "Scan", icon: "📸" },
    { href: "/workout", label: "Workout", icon: "🏋️‍♂️" },
    { href: "/profile", label: "Profile", icon: "⚙️" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(12, 16, 24, 0.95)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px 0",
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: isActive ? "#38bdf8" : "#94a3b8",
              fontSize: "11px",
              fontWeight: isActive ? 700 : 500,
              gap: "2px",
            }}
          >
            <span style={{ fontSize: "20px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}