import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "FIT30 AI - Fitness Application",
  description: "30-Day Fitness Transformation Engine",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" style={{ margin: 0, padding: 0, width: "100%", overflowX: "hidden", backgroundColor: "#080a0e" }}>
      <body style={{ margin: 0, padding: 0, width: "100%", minHeight: "100vh", overflowX: "hidden", backgroundColor: "#080a0e" }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}