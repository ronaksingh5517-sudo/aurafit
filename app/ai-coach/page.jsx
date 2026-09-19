"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function AICoachPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Namaste! Main aapka AuraFit AI Coach hoon. Batao aaj kya goal hai ya diet/workout se juda kya sawaal hai?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const chatEndRef = useRef(null);

  const userId = "default_user";

  // Page load hone par database se chat history fetch karo
  useEffect(() => {
    fetch(`/api/ai-chat?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.messages && data.messages.length > 0) {
          setMessages(data.messages);
          // Recent chat history mein summarize karke dikha sakte hain
          setRecentChats([{ title: "Previous Diet & Workout Query", date: "Saved" }]);
        }
      })
      .catch((err) => console.error("Failed to load chat history:", err));
  }, [userId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // New Chat Button Handler
  const handleNewChat = () => {
    setMessages([
      { role: "assistant", text: "Nayi chat shuru ho chuki hai! Batao aaj kya plan ya goal discuss karna hai?" }
    ]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, userId }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
        setRecentChats([{ title: userMessage.substring(0, 25) + "...", date: "Just now" }]);
      } else {
        setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Maaf karna, abhi AI coach se connect nahi ho pa raha. Kripya thodi der baad try karein." }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", text: "⚠️ Network error occurred while reaching AI coach." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", background: "#080a0e", color: "#ffffff", display: "flex", overflow: "hidden", fontFamily: "system-ui, sans-serif", boxSizing: "border-box" }}>
      
      {/* Sidebar */}
      <div style={{
        width: "280px",
        height: "100%",
        background: "#0b0f17",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        zIndex: 50,
        position: "absolute",
        left: 0,
        top: 0
      }}>
        <div style={{ padding: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 800, fontSize: "15px", color: "#38bdf8" }}>FullyWorkout Menu</span>
          <button onClick={() => setSidebarOpen(false)} style={{ background: "transparent", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer" }}>✕</button>
        </div>

        {/* New Chat Button */}
        <div style={{ padding: "16px 16px 0 16px" }}>
          <button 
            onClick={handleNewChat}
            style={{ width: "100%", background: "linear-gradient(135deg, #a67dff, #7a45ff)", color: "#fff", border: "none", borderRadius: "10px", padding: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
          >
            <span>+ New Chat</span>
          </button>
        </div>

        <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginBottom: "4px" }}>App Features</div>
          <Link href="/dashboard" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)" }}>🏠 Dashboard</Link>
          <Link href="/food-scanner" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)" }}>📸 Vision Food Scanner</Link>
          <Link href="/body-scan" style={{ color: "#cbd5e1", textDecoration: "none", fontSize: "13px", padding: "8px 12px", borderRadius: "8px", background: "rgba(255,255,255,0.03)" }}>🧍 Body Posture Scanner</Link>
        </div>

        {/* Dynamic Recent Chats Section */}
        <div style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", color: "#64748b", fontWeight: 700, marginBottom: "8px" }}>Recent Chats</div>
          {recentChats.length === 0 ? (
            <div style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic" }}>No recent history</div>
          ) : (
            recentChats.map((chat, idx) => (
              <div key={idx} style={{ fontSize: "13px", color: "#94a3b8", padding: "8px 10px", borderRadius: "6px", cursor: "pointer", background: "rgba(255,255,255,0.03)", marginBottom: "6px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                💬 {chat.title}
              </div>
            ))
          )}
        </div>
      </div>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }} />
      )}

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        
        <header style={{ padding: "12px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(18,22,34,0.85)", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", padding: "6px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "14px" }}>
              ☰
            </button>
            <h1 style={{ fontSize: "15px", fontWeight: 800, margin: 0 }}>AI Coach 🤖</h1>
          </div>
          <Link href="/dashboard" style={{ color: "#38bdf8", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
            Dashboard →
          </Link>
        </header>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: "16px", boxSizing: "border-box", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: "700px", display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {messages.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} style={{ display: "flex", justifyContent: isUser ? "flex-end" : "flex-start", width: "100%" }}>
                  <div style={{
                    maxWidth: "85%",
                    background: isUser ? "linear-gradient(135deg, #a67dff, #7a45ff)" : "rgba(18,22,34,0.9)",
                    color: "#ffffff",
                    padding: "14px 18px",
                    borderRadius: "16px",
                    fontSize: "21px",
                    fontWeight: "bold",
                    fontStyle: "italic",
                    lineHeight: 1.4,
                    border: isUser ? "none" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isUser ? "0 4px 12px rgba(122,69,255,0.3)" : "none"
                  }}>
                    {msg.text}
                  </div>
                </div>
              );
            })}

            {/* Three-Body Loader */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start", width: "100%", padding: "10px 0" }}>
                <div className="three-body">
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        <div style={{ padding: "16px", background: "rgba(8,10,14,0.95)", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <form onSubmit={sendMessage} className="pb-ai-input-wrap" style={{ width: "100%", maxWidth: "600px", opacity: loading ? 0.6 : 1 }}>
            <input
              type="text"
              className="pb-ai-input"
              placeholder={loading ? "AI is typing, please wait..." : "Ask your coach..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="pb-ai-input-btn" disabled={loading} style={{ padding: "8px 12px", minWidth: "36px", height: "36px", cursor: loading ? "not-allowed" : "pointer" }}>
              <span className="pb-ai-sparkle" style={{ fontSize: "16px", fontWeight: "bold" }}>↑</span>
            </button>
          </form>
        </div>

      </div>

      <style jsx global>{`
        .three-body {
          --uib-size: 35px;
          --uib-speed: 0.8s;
          --uib-color: #5D3FD3;
          position: relative;
          display: inline-block;
          height: var(--uib-size);
          width: var(--uib-size);
          animation: spin78236 calc(var(--uib-speed) * 2.5) infinite linear;
        }

        .three-body__dot {
          position: absolute;
          height: 100%;
          width: 30%;
        }

        .three-body__dot:after {
          content: '';
          position: absolute;
          height: 0%;
          width: 100%;
          padding-bottom: 100%;
          background-color: var(--uib-color);
          border-radius: 50%;
        }

        .three-body__dot:nth-child(1) {
          bottom: 5%;
          left: 0;
          transform: rotate(60deg);
          transform-origin: 50% 85%;
        }

        .three-body__dot:nth-child(1)::after {
          bottom: 0;
          left: 0;
          animation: wobble1 var(--uib-speed) infinite ease-in-out;
          animation-delay: calc(var(--uib-speed) * -0.3);
        }

        .three-body__dot:nth-child(2) {
          bottom: 5%;
          right: 0;
          transform: rotate(-60deg);
          transform-origin: 50% 85%;
        }

        .three-body__dot:nth-child(2)::after {
          bottom: 0;
          left: 0;
          animation: wobble1 var(--uib-speed) infinite
            calc(var(--uib-speed) * -0.15) ease-in-out;
        }

        .three-body__dot:nth-child(3) {
          bottom: -5%;
          left: 0;
          transform: translateX(116.666%);
        }

        .three-body__dot:nth-child(3)::after {
          top: 0;
          left: 0;
          animation: wobble2 var(--uib-speed) infinite ease-in-out;
        }

        @keyframes spin78236 {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes wobble1 {
          0%,
          100% {
            transform: translateY(0%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(-66%) scale(0.65);
            opacity: 0.8;
          }
        }

        @keyframes wobble2 {
          0%,
          100% {
            transform: translateY(0%) scale(1);
            opacity: 1;
          }
          50% {
            transform: translateY(66%) scale(0.65);
            opacity: 0.8;
          }
        }

        .pb-ai-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          width: 100%;
          padding: 6px 12px;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(166, 125, 255, 0.18) 0%, rgba(122, 69, 255, 0.12) 100%);
          backdrop-filter: blur(14px);
          box-shadow: 0 0 0 4px rgba(125, 71, 255, 0.08), 0 0 24px rgba(98, 43, 255, 0.14), inset 0 0 6px rgba(255, 255, 255, 0.1);
          overflow: hidden;
          isolation: isolate;
        }
        .pb-ai-input {
          position: relative;
          z-index: 3;
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          padding: 6px 8px;
          color: #ffffff;
          font-size: 14px;
        }
        .pb-ai-input::placeholder {
          color: rgba(255, 255, 255, 0.55);
        }
        .pb-ai-input-btn {
          position: relative;
          z-index: 3;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: none;
          outline: none;
          cursor: pointer;
          border-radius: 999px;
          color: #fff;
          background: linear-gradient(180deg, #a67dff 0%, #7a45ff 45%, #5d24ff 100%);
          box-shadow: 0 0 0 3px rgba(125, 71, 255, 0.1), 0 5px 12px rgba(98, 43, 255, 0.2), inset 0 2px 8px rgba(255, 255, 255, 0.16);
          transition: transform 0.2s ease;
        }
        .pb-ai-input-btn:hover {
          transform: translateY(-1px);
        }
      `}</style>

    </div>
  );
}