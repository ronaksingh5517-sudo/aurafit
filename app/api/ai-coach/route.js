"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getActiveUserId } from "@/lib/authHelper";

export default function AICoachPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const userId = getActiveUserId();

  useEffect(() => {
    fetch(`/api/ai-chat?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMessages(data.messages || []);
        }
      })
      .catch((err) => console.error(err));
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: userMsg }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Error getting response from AI coach." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Network error connecting to AI coach." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080a0e", color: "#ffffff", display: "flex", flexDirection: "column", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      
      {/* Top Header */}
      <div style={{ padding: "16px", background: "rgba(12,16,24,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 10 }}>
        <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>FullyWorkout AI Coach 🤖</h1>
        <div style={{ width: "40px" }}></div>
      </div>

      {/* Chat Messages Container */}
      <div style={{ flex: 1, maxWidth: "600px", width: "100%", margin: "0 auto", padding: "16px 16px 100px 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", boxSizing: "border-box" }}>
        {messages.length === 0 ? (
          <div style={{ textAlign: "center", color: "#64748b", marginTop: "60px", fontSize: "14px" }}>
            Ask me anything about workouts, diet, or macros! I am your personal AI coach.
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div key={idx} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "80%", background: isUser ? "#38bdf8" : "rgba(18,22,34,0.9)", color: isUser ? "#000000" : "#ffffff", padding: "12px 16px", borderRadius: "16px", fontSize: "14px", lineHeight: 1.5, border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)", fontWeight: isUser ? 600 : 400 }}>
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "rgba(18,22,34,0.9)", color: "#94a3b8", padding: "10px 16px", borderRadius: "16px", fontSize: "13px", border: "1px solid rgba(255,255,255,0.08)" }}>
              AI Coach is typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Bottom Input Form */}
      <div style={{ position: "fixed", bottom: "60px", left: 0, right: 0, background: "rgba(12,16,24,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "12px 16px", zIndex: 99 }}>
        <form onSubmit={handleSendMessage} style={{ maxWidth: "600px", margin: "0 auto", display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your AI coach..."
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