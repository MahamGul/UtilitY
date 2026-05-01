import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

// ----------------------------------------------------------------
// CUSTOMER KNOWLEDGE BASE
// ----------------------------------------------------------------
const CUSTOMER_KB = [
  {
    keywords: ["hi", "hello", "hey", "salam", "start"],
    reply: "👋 Hello! I'm your UtilitY assistant. How can I help you today?"
  },
  {
    keywords: ["book", "hire", "find", "service", "request"],
    reply: "📋 To book a service:\n1. Go to 'New Request'\n2. Select your service category\n3. Fill in the details & location\n4. Submit — providers will bid on your request!"
  },
  {
    keywords: ["cancel", "cancell"],
    reply: "❌ To cancel a request:\n1. Open your active requests\n2. Find the request you want to cancel\n3. Click 'Cancel Request'\n\nNote: You can only cancel requests that haven't started yet."
  },
  {
    keywords: ["complete", "done", "finish", "mark"],
    reply: "✅ To mark a job as complete:\n1. Go to your 'In Progress' requests\n2. Click 'Mark as Completed'\n3. You'll then be asked to rate the provider!"
  },
  {
    keywords: ["bid", "bids", "offer", "accept", "reject"],
    reply: "💼 To manage bids on your request:\n1. Open your pending request\n2. View all provider bids\n3. Click 'Accept' on the best one\n4. The provider will be notified!"
  },
  {
    keywords: ["rate", "rating", "review", "feedback", "star"],
    reply: "⭐ To rate a provider:\n1. After a job is completed, go to 'Rate Your Services'\n2. Click 'Rate' next to the completed job\n3. Give stars and write a review\n4. Submit — it helps other customers!"
  },
  {
    keywords: ["pay", "payment", "cost", "price", "budget"],
    reply: "💰 Payment info:\n- You set your budget when creating a request\n- Providers bid their price\n- You choose the best offer\n- Payment is handled directly with the provider"
  },
  {
    keywords: ["message", "chat", "contact", "talk", "provider"],
    reply: "💬 To contact a provider:\n1. Go to 'Messages' in the menu\n2. Find the conversation with your provider\n3. Type your message and send!"
  },
  {
    keywords: ["profile", "account", "setting", "edit"],
    reply: "👤 To update your profile:\n1. Click on 'Profile' in the menu\n2. Edit your name, phone, or location\n3. Click 'Save Changes'"
  },
  {
    keywords: ["password", "change password", "forgot"],
    reply: "🔒 To change your password:\n1. Go to 'Profile'\n2. Scroll to 'Change Password'\n3. Enter old & new password\n4. Click 'Update Password'"
  },
  {
    keywords: ["status", "track", "where", "update"],
    reply: "📍 Track your request status:\n- **Pending** → Waiting for bids\n- **In Progress** → Provider is working\n- **Completed** → Job done!\n\nCheck your dashboard stats for live counts."
  },
  {
    keywords: ["provider", "top", "best", "recommend"],
    reply: "🏆 To find top providers:\n- Use the 'Select Service Type' dropdown on your dashboard\n- Top rated providers will appear automatically\n- Look for 'Top Rated' or 'Experienced' badges!"
  },
  {
    keywords: ["logout", "log out", "sign out", "exit"],
    reply: "👋 To logout, click the 'Logout' option in the menu. See you next time!"
  },
  {
    keywords: ["help", "support", "problem", "issue", "error"],
    reply: "🆘 Common fixes:\n- **Page not loading?** Refresh the browser\n- **Can't submit request?** Make sure all fields are filled\n- **No bids?** Try increasing your budget or wait a bit longer\n\nStill stuck? Message us!"
  }
];

const QUICK_REPLIES = [
  "How to book a service?",
  "How to accept a bid?",
  "How to mark as completed?",
  "How to rate a provider?",
  "How to contact provider?"
];

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const item of CUSTOMER_KB) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply;
    }
  }
  return "🤔 I'm not sure about that. Try asking:\n- 'How to book?'\n- 'How to cancel?'\n- 'How to rate provider?'\n\nOr contact our support team!";
}

// ----------------------------------------------------------------
// CHATBOT COMPONENT
// ----------------------------------------------------------------
export default function CustomerChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm your UtilitY assistant. How can I help you today?",
      time: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setUnread(0);
  }, [open]);

  const sendMessage = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { from: "user", text: userMsg, time: new Date() }]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const reply = getBotReply(userMsg);
      setTyping(false);
      setMessages(prev => [...prev, { from: "bot", text: reply, time: new Date() }]);
      if (!open) setUnread(n => n + 1);
    }, 1000 + Math.random() * 800);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatText = (text) => {
    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.replace(/\*\*(.*?)\*\*/g, "$1")}
        {i < text.split("\n").length - 1 && <br />}
      </span>
    ));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* STYLES */}
      <style>{`
        .chat-fade-in {
          animation: chatFadeIn 0.25s ease;
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .msg-in {
          animation: msgIn 0.2s ease;
        }
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .typing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #94a3b8;
          animation: typingBounce 1.2s infinite;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .quick-btn {
          transition: all 0.15s ease;
        }
        .quick-btn:hover {
          background: #0ea5e9;
          color: white;
          border-color: #0ea5e9;
          transform: translateY(-1px);
        }
        .fab-pulse::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #0ea5e9;
          animation: fabPulse 2s ease infinite;
        }
        @keyframes fabPulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>

      {/* FAB BUTTON */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              position: "relative",
              width: "56px", height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(14,165,233,0.45)",
              color: "white"
            }}
            className="fab-pulse"
          >
            <MessageCircle size={24} />
            {unread > 0 && (
              <span style={{
                position: "absolute", top: "-4px", right: "-4px",
                background: "#ef4444", color: "white",
                borderRadius: "50%", width: "18px", height: "18px",
                fontSize: "11px", fontWeight: "700",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {unread}
              </span>
            )}
          </button>
        )}

        {/* CHAT WINDOW */}
        {open && (
          <div
            className="chat-fade-in"
            style={{
              width: "360px",
              height: "520px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            {/* HEADER */}
            <div style={{
              background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
              padding: "16px 20px",
              display: "flex", alignItems: "center", gap: "12px"
            }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Bot size={22} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: "white", fontWeight: "700", fontSize: "15px", margin: 0 }}>
                  UtilitY Assistant
                </p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: 0 }}>
                  Always here to help 🟢
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none", borderRadius: "50%",
                  width: "32px", height: "32px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "white"
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* MESSAGES */}
            <div
              className="chat-scrollbar"
              style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="msg-in"
                  style={{
                    display: "flex",
                    flexDirection: msg.from === "user" ? "row-reverse" : "row",
                    gap: "8px",
                    alignItems: "flex-end"
                  }}
                >
                  {msg.from === "bot" && (
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <Bot size={14} color="white" />
                    </div>
                  )}
                  <div style={{ maxWidth: "75%" }}>
                    <div style={{
                      padding: "10px 14px",
                      borderRadius: msg.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.from === "user"
                        ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                        : "#f1f5f9",
                      color: msg.from === "user" ? "white" : "#1e293b",
                      fontSize: "13.5px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap"
                    }}>
                      {formatText(msg.text)}
                    </div>
                    <p style={{
                      fontSize: "10px", color: "#94a3b8", margin: "3px 4px 0",
                      textAlign: msg.from === "user" ? "right" : "left"
                    }}>
                      {formatTime(msg.time)}
                    </p>
                  </div>
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {typing && (
                <div className="msg-in" style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: "linear-gradient(135deg, #0ea5e9, #0284c7)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                  <div style={{
                    background: "#f1f5f9", borderRadius: "18px 18px 18px 4px",
                    padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center"
                  }}>
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                    <div className="typing-dot" />
                  </div>
                </div>
              )}

              {/* QUICK REPLIES — shown after first bot message */}
              {messages.length === 1 && !typing && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Quick questions
                  </p>
                  {QUICK_REPLIES.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="quick-btn"
                      style={{
                        textAlign: "left", padding: "8px 12px",
                        background: "white", border: "1.5px solid #e2e8f0",
                        borderRadius: "10px", cursor: "pointer",
                        fontSize: "12.5px", color: "#475569", fontWeight: "500"
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={{
              padding: "12px 16px",
              borderTop: "1px solid #f1f5f9",
              display: "flex", gap: "10px", alignItems: "center"
            }}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                style={{
                  flex: 1, padding: "10px 14px",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: "12px", fontSize: "13.5px",
                  outline: "none", color: "#1e293b",
                  background: "#f8fafc",
                  fontFamily: "inherit"
                }}
                onFocus={e => e.target.style.borderColor = "#0ea5e9"}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "12px",
                  background: input.trim()
                    ? "linear-gradient(135deg, #0ea5e9, #0284c7)"
                    : "#e2e8f0",
                  border: "none", cursor: input.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: input.trim() ? "white" : "#94a3b8",
                  transition: "all 0.2s ease",
                  flexShrink: 0
                }}
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}