"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import HeroVideo from "@/components/HeroVideo";
import BodyScanSection from "@/components/BodyScanSection";
import FoodScannerSection from "@/components/FoodScannerSection";
import TransformationSection from "@/components/TransformationSection";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import OnboardingWizard from "@/components/OnboardingWizard";
import DashboardView from "@/components/DashboardView";
import FoodScannerView from "@/components/FoodScannerView";
import WorkoutView from "@/components/WorkoutView";
import ProgressView from "@/components/ProgressView";
import AuthView from "@/components/AuthView";
import ProfileView from "@/components/ProfileView";
import AICoachView from "@/components/AICoachView";
import FloatingCoachButton from "@/components/FloatingCoachButton";
import BodyScanView from "@/components/BodyScanView";
import ToastNotification from "@/components/ToastNotification";
import CheckoutView from "@/components/CheckoutView";
import SettingsView from "@/components/SettingsView";

export default function DynamicPage() {
  const rawPathname = usePathname() || "/";

  const cleanPath = rawPathname
    .toLowerCase()
    .replace(/\/$/, "")
    .replace(".jsx", "")
    .replace(".js", "") || "/";

  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState(true);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check karo kya user ne onboarding poori ki hai ya nahi
    const savedUser = localStorage.getItem("aurafit_user");
    if (!savedUser && cleanPath !== "/onboarding" && cleanPath !== "/login" && cleanPath !== "/signup" && cleanPath !== "/") {
      setIsOnboarded(false);
      router.push("/onboarding"); // Agar data nahi hai toh forced onboarding par bhejo
    } else {
      setIsOnboarded(true);
    }
    setCheckingAuth(false);
  }, [cleanPath, router]);

  const handlePageClick = (e) => {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    if (href.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      return;
    }

    if (href.startsWith("/") && !href.startsWith("//")) {
      e.preventDefault();
      router.push(href);
    }
  };

  const renderContent = () => {
    if (cleanPath === "/") {
      return (
        <>
          <Navbar />
          <HeroVideo />
          <BodyScanSection />
          <FoodScannerSection />
          <TransformationSection />
          <PricingSection />
          <Footer />
        </>
      );
    }

    if (cleanPath === "/onboarding" || cleanPath === "/onboardingwizard") {
      return <OnboardingWizard />;
    }

    if (cleanPath === "/dashboard" || cleanPath === "/dashboardview") {
      return <DashboardView />;
    }

    if (cleanPath === "/food-scanner" || cleanPath === "/foodscannerview") {
      return <FoodScannerView />;
    }

    if (cleanPath === "/workout" || cleanPath === "/workoutview") {
      return <WorkoutView />;
    }

    if (cleanPath === "/progress" || cleanPath === "/progressview") {
      return <ProgressView />;
    }

    if (cleanPath === "/profile" || cleanPath === "/profileview") {
      return <ProfileView />;
    }

    if (cleanPath === "/login") {
      return <AuthView defaultMode="login" />;
    }
    if (cleanPath === "/signup" || cleanPath === "/authview") {
      return <AuthView defaultMode="signup" />;
    }

    if (cleanPath === "/ai-coach" || cleanPath === "/aicoach" || cleanPath === "/aicoachview") {
      return <AICoachView />;
    }

    if (cleanPath === "/body-scan" || cleanPath === "/bodyscan" || cleanPath === "/bodyscanview") {
      return <BodyScanView />;
    }

    if (cleanPath === "/checkout" || cleanPath === "/pricing" || cleanPath === "/checkoutview") {
      return <CheckoutView />;
    }

    if (cleanPath === "/settings" || cleanPath === "/settingsview") {
      return <SettingsView />;
    }

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#080a0e",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            background: "rgba(18, 22, 32, 0.8)",
            border: "1px solid rgba(255, 75, 43, 0.3)",
            borderRadius: "20px",
            padding: "40px 24px",
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>🚧</div>
          <span
            style={{
              background: "rgba(255, 75, 43, 0.15)",
              color: "#ff5232",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            Under Construction
          </span>
          <h2 style={{ fontSize: "24px", fontWeight: "800", marginTop: "16px", marginBottom: "8px" }}>
            Ye Page Abhi Nahi Bana Hai
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
            Route: <code style={{ color: "#ffe600", background: "rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: "6px" }}>{rawPathname}</code>
          </p>
          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "10px 24px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #ff416c, #ff4b2b)",
              color: "#ffffff",
              textDecoration: "none",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            ← Back to Homepage
          </Link>
        </div>
      </div>
    );
  };

  if (checkingAuth) return null;

  return (
    <main onClick={handlePageClick} className="main-wrapper">
      <ToastNotification />
      {renderContent()}
      <FloatingCoachButton />

   <style jsx global>{`
        /* CLEAN GLOBAL RESET: Scrollbar aur gap ki problem hamesha ke liye khatam */
        html, body {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          min-height: 100vh !important;
          background-color: #080a0e !important;
          overflow-x: hidden !important;
        }
        *, *:before, *:after {
          box-sizing: border-box !important;
        }
      `}</style>

      <style jsx>{`
        .main-wrapper {
          position: relative;
          width: 100%;
          min-height: 100vh;
          margin: 0;
          padding: 0;
          background-color: #080a0e;
          box-sizing: border-box;
          overflow-x: hidden;
        }
      `}</style>
    </main>
  );
}