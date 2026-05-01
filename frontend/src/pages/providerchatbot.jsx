import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";

// ----------------------------------------------------------------
// PROVIDER KNOWLEDGE BASE
// ----------------------------------------------------------------
const PROVIDER_KB = [
  {
    keywords: ["hi", "hello", "hey", "salam", "start"],
    reply: "👋 Hello! I'm your UtilitY provider assistant. How can I help you grow your business today?"
  },
  {
    keywords: ["bid", "submit", "how to bid", "place bid", "send bid"],
    reply: "💼 To submit a bid:\n1. Go to 'Available Bids' in the menu\n2. Browse open requests in your category\n3. Click on a request to view details\n4. Enter your price, availability & message\n5. Click 'Submit Bid' — customer will review it!"
  },
  {
    keywords: ["withdraw", "cancel bid", "remove bid", "delete bid"],
    reply: "🗑️ To withdraw a bid:\n1. Go to 'Bids History'\n2. Find the pending bid you want to remove\n3. Click 'Withdraw Bid'\n\nNote: You can only withdraw bids that are still pending."
  },
  {
    keywords: ["accept", "accepted", "my bid accepted", "bid approved"],
    reply: "🎉 When your bid is accepted:\n1. You'll see it move to 'Accepted' in Bids History\n2. You must click 'Start Service' when you arrive\n3. Customer will mark it as complete when done\n4. You'll earn the bid amount!"
  },
  {
    keywords: ["start", "begin", "arrived", "start service"],
    reply: "▶️ To start a service:\n1. Go to 'Bids History'\n2. Find the accepted bid\n3. Click 'Start Service'\n4. Your live location will be shared with the customer"
  },
  {
    keywords: ["complete", "done", "finish", "completed"],
    reply: "✅ Job completion:\n- The **customer** marks the job as complete\n- Once marked, you'll receive your payment\n- Customer can then rate your service\n- Your rating & jobs count will update!"
  },
  {
    keywords: ["earn", "earning", "money", "payment", "income", "salary"],
    reply: "💰 Earnings info:\n- Your total earnings show on your dashboard\n- Each accepted & completed bid adds to your total\n- View breakdown in 'Bids History'\n- Earnings update automatically after job completion"
  },
  {
    keywords: ["rating", "rate", "review", "score", "stars"],
    reply: "⭐ Your rating:\n- Customers rate you after each completed job\n- Your average rating shows on dashboard\n- Higher rating = more customers choose you!\n- Aim for 4.5+ to get 'Top Rated' badge 🏆"
  },
  {
    keywords: ["badge", "top rated", "experienced", "rank"],
    reply: "🏆 Badge system:\n- **Top Rated**: Rating ≥ 4.5 ⭐\n- **Experienced**: 10+ completed jobs\n\nBadges appear on your profile to attract more customers!"
  },
  {
    keywords: ["profile", "update profile", "edit profile", "skills"],
    reply: "👤 To update your profile:\n1. Click 'Profile' in the sidebar\n2. Edit your name, service type, skills, experience\n3. Update your service area\n4. Click 'Save Changes'\n\nA complete profile gets more bids!"
  },
  {
    keywords: ["available", "availability", "online", "offline", "status"],
    reply: "🟢 Manage your availability:\n1. Go to 'Profile'\n2. Toggle your availability status\n3. When unavailable, you won't appear in customer searches\n\nTurn it on to start receiving job requests!"
  },
  {
    keywords: ["message", "chat", "contact", "customer", "talk"],
    reply: "💬 To message a customer:\n1. Click 'Messages' in the sidebar\n2. Find the customer conversation\n3. Type and send your message\n\nAlways communicate clearly before starting a job!"
  },
  {
    keywords: ["category", "service type", "carpenter", "plumber", "electrician"],
    reply: "🔧 Service categories available:\n- Carpenter\n- Plumber\n- Electrician\n- Mechanic\n- General Repair\n\nSet your service type in Profile to get relevant job requests!"
  },
  {
    keywords: ["password", "change password", "security"],
    reply: "🔒 To change your password:\n1. Go to 'Profile'\n2. Find 'Change Password' section\n3. Enter old password & new password\n4. Click 'Update'"
  },
  {
    keywords: ["tip", "tips", "advice", "better", "improve", "grow"],
    reply: "🚀 Tips to grow on UtilitY:\n✅ Complete your profile fully\n✅ Respond to bids quickly\n✅ Set competitive prices\n✅ Always be professional\n✅ Ask customers to leave reviews\n✅ Maintain 4.5+ rating for Top Rated badge!"
  },
  {
    keywords: ["logout", "log out", "sign out", "exit"],
    reply: "👋 To logout, click 'Logout' at the bottom of the sidebar. See you soon!"
  },
  {
    keywords: ["help", "support", "problem", "issue", "error", "stuck"],
    reply: "🆘 Common fixes:\n- **Can't see available bids?** Set your service type in Profile\n- **Bid not showing?** You may have already bid on it\n- **Can't start service?** Bid must be 'Accepted' first\n\nStill stuck? Use Messages to contact support."
  }
];

const QUICK_REPLIES = [
  "How to submit a bid?",
  "How to start a service?",
  "How to improve my rating?",
  "How to update my profile?",
  "Tips to get more jobs?"
];

function getBotReply(input) {
  const lower = input.toLowerCase();
  for (const item of PROVIDER_KB) {
    if (item.keywords.some(k => lower.includes(k))) {
      return item.reply;
    }
  }
  return "🤔 I'm not sure about that. Try asking:\n- 'How to submit a bid?'\n- 'How to start a service?'\n- 'How to improve rating?'\n\nOr contact our support team!";
}

// ----------------------------------------------------------------
// PROVIDER CHATBOT COMPONENT
// ----------------------------------------------------------------
export default function ProviderChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hi! I'm your UtilitY provider assistant. How can I help you today?",
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

  // Provider theme: green/emerald instead of sky blue
  const PRIMARY = "linear-gradient(135deg, #10b981, #059669)";
  const PRIMARY_SOLID = "#10b981";

  return (
    <>
      <style>{`
        .pchat-fade-in {
          animation: pchatFadeIn 0.25s ease;
        }
        @keyframes pchatFadeIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .pmsg-in {
          animation: pmsgIn 0.2s ease;
        }
        @keyframes pmsgIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ptyping-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #94a3b8;
          animation: ptypingBounce 1.2s infinite;
        }
        .ptyping-dot:nth-child(2) { animation-delay: 0.2s; }
        .ptyping-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes ptypingBounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .pchat-scrollbar::-webkit-scrollbar { width: 4px; }
        .pchat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .pchat-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .pquick-btn {
          transition: all 0.15s ease;
        }
        .pquick-btn:hover {
          background: #10b981;
          color: white;
          border-color: #10b981;
          transform: translateY(-1px);
        }
        .pfab-pulse::after {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #10b981;
          animation: pfabPulse 2s ease infinite;
        }
        @keyframes pfabPulse {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.5); }
        }
      `}</style>

      {/* FAB */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
        {!open && (
          <button
            onClick={() => setOpen(true)}
            style={{
              position: "relative",
              width: "56px", height: "56px",
              borderRadius: "50%",
              background: PRIMARY,
              border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(16,185,129,0.45)",
              color: "white"
            }}
            className="pfab-pulse"
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

        {open && (
          <div
            className="pchat-fade-in"
            style={{
              width: "360px", height: "520px",
              background: "#fff",
              borderRadius: "20px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
              display: "flex", flexDirection: "column",
              overflow: "hidden",
              border: "1px solid #e2e8f0"
            }}
          >
            {/* HEADER */}
            <div style={{
              background: PRIMARY,
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
                  Provider Assistant
                </p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: 0 }}>
                  Here to help you succeed 🟢
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
              className="pchat-scrollbar"
              style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="pmsg-in"
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
                      background: PRIMARY,
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
                      background: msg.from === "user" ? PRIMARY : "#f1f5f9",
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

              {typing && (
                <div className="pmsg-in" style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
                  <div style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: PRIMARY,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Bot size={14} color="white" />
                  </div>
                  <div style={{
                    background: "#f1f5f9", borderRadius: "18px 18px 18px 4px",
                    padding: "12px 16px", display: "flex", gap: "4px", alignItems: "center"
                  }}>
                    <div className="ptyping-dot" />
                    <div className="ptyping-dot" />
                    <div className="ptyping-dot" />
                  </div>
                </div>
              )}

              {messages.length === 1 && !typing && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  <p style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Quick questions
                  </p>
                  {QUICK_REPLIES.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="pquick-btn"
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
                onFocus={e => e.target.style.borderColor = PRIMARY_SOLID}
                onBlur={e => e.target.style.borderColor = "#e2e8f0"}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                style={{
                  width: "40px", height: "40px",
                  borderRadius: "12px",
                  background: input.trim() ? PRIMARY : "#e2e8f0",
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