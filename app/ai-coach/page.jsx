"use client";

import { useState } from "react";
import Link from "next/link";

export default function AICoachPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! Main aapka AuraFit AI Coach hoon. Batao aaj kya goal hai ya kya query hai?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = "default_user";

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, userId }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: "Sorry, I couldn't reach the AI coach right now." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", text: "Network error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif" }}>
      
      {/* Header */}
      <header style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(18,22,34,0.85)" }}>
        <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
          ← Dashboard
        </Link>
        <h1 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>Contextual AI Coach 🤖</h1>
        <div style={{ width: "60px" }}></div>
      </header>

      {/* Chat Messages Area */}
      <div style={{ flex: 1, maxWidth: "640px", width: "100%", margin: "0 auto", padding: "20px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px", boxSizing: "border-box" }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              background: msg.role === "user" ? "linear-gradient(135deg, #ff416c, #ff4b2b)" : "rgba(18,22,34,0.9)",
              border: msg.role === "assistant" ? "1px solid rgba(255,255,255,0.08)" : "none",
              borderRadius: "14px",
              padding: "14px 16px",
              maxWidth: "80%",
              fontSize: "14px",
              lineHeight: 1.5,
              color: "#ffffff",
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: "flex-start", background: "rgba(18,22,34,0.9)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "14px", padding: "12px 16px", fontSize: "13px", color: "#94a3b8" }}>
            AI is checking your MongoDB records & thinking...
          </div>
        )}
      </div>

      {/* Input Form */}
      <div style={{ padding: "16px", background: "rgba(18,22,34,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <form onSubmit={sendMessage} style={{ maxWidth: "640px", margin: "0 auto", display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Ask anything about your diet, workouts, or goals..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, background: "#0b0f17", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "12px", padding: "12px 16px", color: "#ffffff", fontSize: "14px", outline: "none" }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ background: "#38bdf8", color: "#000000", border: "none", borderRadius: "12px", padding: "0 20px", fontWeight: 800, fontSize: "14px", cursor: "pointer" }}
          >
            Send
          </button>
        </form>
      </div>

    </div>
  );
}