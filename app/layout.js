import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  metadataBase: new URL("https://fullyworkout.com"),
  title: "FullyWorkout - AI Fitness, Nutrition & Posture Scanner",
  description: "Transform your body with FullyWorkout, featuring Gemini AI workout planners, food macro vision scanning, posture alignment checks, and MongoDB fitness tracking.",
  keywords: ["AI fitness coach", "meal planner", "food macro scanner", "workout routine generator", "body posture scan", "fullyworkout"],
  openGraph: {
    title: "FullyWorkout - AI Fitness & Nutrition Suite",
    description: "Transform your body with AI-driven workouts and nutrition tracking.",
    url: "https://fullyworkout.com",
    siteName: "FullyWorkout",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: "#080a0e", color: "#ffffff", paddingBottom: "70px" }}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}