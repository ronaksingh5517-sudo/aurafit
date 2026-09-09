"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "ai",
    text: "Namaste! Main hoon AuraFit AI Coach. Apne workout, nutrition, form ya calorie budget ke baare mein kuch bhi poocho!",
    time: "Just now",
  },
];

const SUGGESTED_PROMPTS = [
  "Aaj ka workout kaisa plan karun?",
  "High protein dinner suggestion do",
  "Squat form sahi kaise karein?",
  "Weight loss plateau kaise todun?",
];

export default function AICoachView() {
  const { user } = useApp();
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          userContext: {
            goal: user?.goal || "Build Muscle",
            dailyCalories: user?.dailyCalories || 2180,
            weight: user?.weight || 71,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.reply || data.error || `Server Status Code: ${res.status}`);
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.reply || "Stay consistent and follow your routine!",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error("AI Coach Fetch Failed:", err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: `⚠️ Exact Error: ${err.message}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .coach-container {
          min-height: 100vh;
          min-height: 100dvh;
          background: radial-gradient(circle at 50% 10%, #151824 0%, #080a0e 85%);
          color: #ffffff;
          display: flex;
          flex-direction: column;
          font-family: system-ui, sans-serif;
          box-sizing: border-box;
          width: 100%;
          overflow-x: hidden;
        }

        .coach-header {
          background: rgba(18, 22, 34, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 14px 16px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .coach-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .coach-avatar {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          box-shadow: 0 4px 14px rgba(255, 75, 43, 0.4);
        }
        .btn-back {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          padding: 8px 14px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .chat-body {
          flex: 1;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          padding: 20px 16px 140px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .msg-bubble {
          max-width: 85%;
          padding: 14px 16px;
          border-radius: 18px;
          font-size: 14.5px;
          line-height: 1.55;
          animation: popIn 0.25s ease forwards;
        }
        .msg-bubble.ai {
          align-self: flex-start;
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #f1f5f9;
          border-bottom-left-radius: 4px;
        }
        .msg-bubble.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          color: #ffffff;
          border-bottom-right-radius: 4px;
          box-shadow: 0 6px 20px rgba(255, 75, 43, 0.3);
        }
        .msg-time {
          font-size: 10.5px;
          color: #94a3b8;
          margin-top: 6px;
          text-align: right;
        }
        .msg-bubble.user .msg-time {
          color: rgba(255, 255, 255, 0.7);
        }

        @keyframes popIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .typing-indicator {
          align-self: flex-start;
          background: rgba(18, 22, 34, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 18px;
          border-radius: 18px;
          border-bottom-left-radius: 4px;
          display: flex;
          gap: 6px;
        }
        .typing-dot {
          width: 6px;
          height: 6px;
          background: #ff4b2b;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }

        .chat-input-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(12, 15, 24, 0.96);
          backdrop-filter: blur(16px);
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          padding: 12px 16px;
          box-sizing: border-box;
          z-index: 100;
        }
        .suggestions-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 10px;
          max-width: 800px;
          margin: 0 auto;
          scrollbar-width: none;
        }
        .suggestions-row::-webkit-scrollbar { display: none; }
        .prompt-chip {
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }
        .prompt-chip:hover {
          background: rgba(255, 75, 43, 0.15);
          border-color: #ff4b2b;
          color: #ffffff;
        }

        .input-inner {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          gap: 10px;
        }
        .chat-field {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          padding: 12px 16px;
          color: #ffffff;
          font-size: 14.5px;
          outline: none;
        }
        .chat-field:focus {
          border-color: #ff4b2b;
        }
        .btn-send {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          border: none;
          color: #ffffff;
          padding: 0 20px;
          border-radius: 14px;
          font-weight: 800;
          cursor: pointer;
        }
      `}</style>

      <div className="coach-container">
        <header className="coach-header">
          <div className="header-content">
            <div className="coach-meta">
              <div className="coach-avatar">🤖</div>
              <div>
                <h2 style={{ fontSize: "16px", fontWeight: 800, margin: 0 }}>AuraFit AI Coach</h2>
                <span style={{ fontSize: "11px", color: "#4ade80", fontWeight: 700 }}>● Powered by Gemini</span>
              </div>
            </div>

            <Link href="/dashboard" className="btn-back">
              ← Dashboard
            </Link>
          </div>
        </header>

        <main className="chat-body">
          {messages.map((m) => (
            <div key={m.id} className={`msg-bubble ${m.sender}`}>
              <div>{m.text}</div>
              <div className="msg-time">{m.time}</div>
            </div>
          ))}

          {isTyping && (
            <div className="typing-indicator">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>

        <div className="chat-input-bar">
          <div className="suggestions-row">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <div key={i} className="prompt-chip" onClick={() => handleSend(prompt)}>
                {prompt}
              </div>
            ))}
          </div>

          <div className="input-inner">
            <input
              type="text"
              className="chat-field"
              placeholder="Ask anything about diet, workout or form..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button className="btn-send" onClick={() => handleSend()}>
              Send →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}