"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicRoutes = ["/login", "/signup", "/"]; 
    const isLoggedIn = localStorage.getItem("aurafit_logged_in");

    if (!isLoggedIn && !publicRoutes.includes(pathname)) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  if (!authorized && pathname !== "/login" && pathname !== "/signup" && pathname !== "/") {
    return (
      <div style={{ background: "#020617", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", color: "#38bdf8", fontFamily: "sans-serif" }}>
        <h2>Checking Security & Session... 🔒</h2>
      </div>
    );
  }

  return children;
}
