"use client";

export default function ToastNotification({ message, type = "success" }) {
  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        background: isSuccess ? "rgba(74, 222, 128, 0.9)" : "rgba(239, 68, 68, 0.9)",
        color: "#000000",
        padding: "12px 20px",
        borderRadius: "12px",
        fontSize: "14px",
        fontWeight: 700,
        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backdropFilter: "blur(8px)",
      }}
    >
      <span>{isSuccess ? "✅" : "⚠️"}</span>
      <span>{message}</span>
    </div>
  );
}