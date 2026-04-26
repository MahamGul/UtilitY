// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Home,
//   MessageSquare,
//   ClipboardList,
//   Briefcase,
//   User,
//   LogOut,
//   Wrench,
//   Search,
//   Phone,
//   Video,
//   MoreVertical,
//   Paperclip,
//   Send,
// } from "lucide-react";

// // ── Mock data ─────────────────────────────────────────────────────────────────
// const CONVERSATIONS = [
//   { id: 1, initial: "A", name: "Ahmed Khan",    preview: "Great! When can you start?",   time: "2m ago",   unread: 2, online: true  },
//   { id: 2, initial: "F", name: "Fatima Malik",  preview: "Thank you for the quote",       time: "15m ago",  unread: 0, online: true  },
//   { id: 3, initial: "H", name: "Hassan Ali",    preview: "Is the price negotiable?",      time: "1h ago",   unread: 1, online: false },
//   { id: 4, initial: "S", name: "Sana Tariq",    preview: "I accepted your bid",           time: "3h ago",   unread: 0, online: false },
//   { id: 5, initial: "B", name: "Bilal Ahmed",   preview: "When will you arrive?",         time: "Yesterday",unread: 0, online: false },
// ];

// const MESSAGES = [
//   { id: 1, from: "other", name: "Ahmed Khan", text: "Hi, I saw your bid for the plumbing work. Are you available this week?", time: "10:30 AM" },
//   { id: 2, from: "me",    text: "Yes, I'm available. I can come tomorrow or the day after.", time: "10:32 AM" },
//   { id: 3, from: "other", name: "Ahmed Khan", text: "Tomorrow works for me. What time?", time: "10:33 AM" },
//   { id: 4, from: "me",    text: "I can be there at 2 PM. Does that work?", time: "10:35 AM" },
//   { id: 5, from: "other", name: "Ahmed Khan", text: "Great! When can you start?", time: "10:36 AM" },
// ];

// const NAV_ITEMS = [
//   { label: "Home",           icon: Home,          path: "/provider-dashboard" },
//   { label: "Messages",       icon: MessageSquare,  path: "/provider/messages",       active: true, badge: 5 },
//   { label: "Bids History",   icon: ClipboardList,  path: "/provider/bids-history" },
//   { label: "Available Bids", icon: Briefcase,      path: "/provider/available-bids" },
//   { label: "Profile",        icon: User,           path: "/provider/profile" },
// ];

// // ── Avatar ────────────────────────────────────────────────────────────────────
// function Avatar({ initial, size = "md", online = false }) {
//   const sz = size === "lg" ? "w-14 h-14 text-xl" : size === "sm" ? "w-9 h-9 text-sm" : "w-12 h-12 text-base";
//   const dot = size === "lg" ? "w-4 h-4" : "w-3 h-3";
//   return (
//     <div className="relative flex-shrink-0">
//       <div className={`${sz} bg-gradient-to-br from-blue-400 to-blue-200 rounded-2xl flex items-center justify-center font-bold text-white`}>
//         {initial}
//       </div>
//       {online && (
//         <span className={`${dot} absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full`} />
//       )}
//     </div>
//   );
// }

// // ── Main Component ─────────────────────────────────────────────────────────────
// export default function ProviderMessages() {
//   const navigate = useNavigate();
//   const [activeConv, setActiveConv]   = useState(CONVERSATIONS[0]);
//   const [messages, setMessages]       = useState(MESSAGES);
//   const [draft, setDraft]             = useState("");
//   const [search, setSearch]           = useState("");

//   const filtered = CONVERSATIONS.filter(c =>
//     c.name.toLowerCase().includes(search.toLowerCase())
//   );

//   const sendMessage = () => {
//     if (!draft.trim()) return;
//     setMessages(prev => [...prev, {
//       id: Date.now(), from: "me", text: draft.trim(),
//       time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     }]);
//     setDraft("");
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">

//       {/* ── Sidebar ── */}
//       <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm flex-shrink-0">
//         {/* Logo */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-blue-400 rounded-xl flex items-center justify-center">
//               <Wrench className="w-6 h-6 text-white" />
//             </div>
//             <span className="text-xl font-bold text-gray-900">UtilitY</span>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 p-4 space-y-2">
//           {NAV_ITEMS.map(({ label, icon: Icon, path, active, badge }) => (
//             <button
//               key={label}
//               onClick={() => navigate(path)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-left transition-colors
//                 ${active
//                   ? "bg-blue-100 text-gray-900"
//                   : "text-gray-500 hover:bg-blue-100 hover:text-gray-900"
//                 }`}
//             >
//               <Icon className="w-5 h-5 flex-shrink-0" />
//               <span className="flex-1">{label}</span>
//               {badge && (
//                 <span className="bg-blue-400 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
//                   {badge}
//                 </span>
//               )}
//             </button>
//           ))}
//         </nav>

//         {/* Logout */}
//         <div className="p-4 border-t border-gray-200">
//           <button
//             onClick={() => navigate("/login")}
//             className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
//           >
//             <LogOut className="w-5 h-5" />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ── Conversation List ── */}
//       <div className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
//         {/* Header */}
//         <div className="px-6 py-5 border-b border-gray-200">
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               value={search}
//               onChange={e => setSearch(e.target.value)}
//               placeholder="Search conversations..."
//               className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-blue-400"
//             />
//           </div>
//         </div>

//         {/* Conversation Items */}
//         <div className="flex-1 overflow-y-auto">
//           {filtered.map(conv => (
//             <button
//               key={conv.id}
//               onClick={() => setActiveConv(conv)}
//               className={`w-full flex items-center gap-3 px-4 py-4 border-b border-gray-100 text-left transition-colors
//                 ${activeConv.id === conv.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
//             >
//               <Avatar initial={conv.initial} online={conv.online} />
//               <div className="flex-1 min-w-0">
//                 <div className="flex justify-between items-center mb-1">
//                   <span className="font-semibold text-gray-900">{conv.name}</span>
//                   <span className="text-xs text-gray-400">{conv.time}</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-sm text-gray-500 truncate flex-1">{conv.preview}</span>
//                   {conv.unread > 0 && (
//                     <span className="ml-2 bg-blue-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
//                       {conv.unread}
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ── Chat Window ── */}
//       <div className="flex-1 flex flex-col bg-gray-50">

//         {/* Chat Header */}
//         <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <Avatar initial={activeConv.initial} online={activeConv.online} />
//             <div>
//               <p className="font-bold text-gray-900">{activeConv.name}</p>
//               <p className="text-sm text-gray-500">{activeConv.online ? "Active now" : "Offline"}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2">
//             {[Phone, Video, MoreVertical].map((Icon, i) => (
//               <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors">
//                 <Icon className="w-4 h-4 text-gray-500" />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-6 space-y-4">
//           {messages.map(msg => (
//             <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
//               <div className="max-w-md">
//                 {msg.from !== "me" && (
//                   <p className="text-xs font-semibold text-blue-400 mb-1 ml-1">{msg.name}</p>
//                 )}
//                 <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
//                   ${msg.from === "me"
//                     ? "bg-blue-400 text-white"
//                     : "bg-white border border-gray-200 text-gray-900"
//                   }`}
//                 >
//                   {msg.text}
//                 </div>
//                 <p className={`text-xs text-gray-400 mt-1 ${msg.from === "me" ? "text-right" : "text-left"}`}>
//                   {msg.time}{msg.from === "me" && " ✓✓"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input */}
//         <div className="bg-white border-t border-gray-200 px-6 py-4">
//           <div className="flex items-center gap-3">
//             <button className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0">
//               <Paperclip className="w-4 h-4 text-gray-500" />
//             </button>
//             <input
//               value={draft}
//               onChange={e => setDraft(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Type your message..."
//               className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400"
//             />
//             <button
//               onClick={sendMessage}
//               className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors
//                 ${draft.trim() ? "bg-blue-400 hover:bg-blue-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const API = "http://localhost:8000";

export default function CustomerMessages() {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [tempConversations, setTempConversations] = useState([]);

  const userEmail = localStorage.getItem("email");
  const location = useLocation();
  const preselectedUser = location.state?.otherUser;

  // 🔹 Load conversations
  useEffect(() => {
    fetch(`${API}/conversations/${userEmail}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("CONVERSATIONS:", data);
        setConversations(data || []);
      });
  }, [userEmail]);

  useEffect(() => {
    if (preselectedUser) {
      setTempConversations([
        {
          user: preselectedUser.email, // ✅ MUST be email
          name: preselectedUser.name, // optional (for UI)
          lastMessage: "Start a conversation",
          isTemp: true,
        },
      ]);

      loadMessages(preselectedUser);
    }
  }, [preselectedUser]);

  useEffect(() => {
  const interval = setInterval(() => {
    if (selectedUser) loadMessages(selectedUser);
  }, 2000);

  return () => clearInterval(interval);
}, [selectedUser]);

  // 🔹 Load messages
  const loadMessages = (otherUser) => {
    setSelectedUser(otherUser);

    fetch(`${API}/messages/${userEmail}/${otherUser}`)
      .then((res) => res.json())
      .then((data) => setMessages(data || []))
      .catch(() => setMessages([]));
  };

  // 🔹 Send message
  const sendMessage = async () => {
    if (!text || !selectedUser) return;

    const newMessage = {
      sender: userEmail,
      text,
    };

    // ✅ 1. Instantly show message in UI
    setMessages((prev) => [...prev, newMessage]);

    // ✅ 2. Update conversations immediately
    setConversations((prev) => {
      const exists = prev.find(
        (c) => (c.user || c.otherUser || c.participant) === selectedUser,
      );

      if (exists) {
        return prev.map((c) =>
          (c.user || c.otherUser || c.participant) === selectedUser
            ? { ...c, lastMessage: text }
            : c,
        );
      }

      return [{ user: selectedUser, lastMessage: text }, ...prev];
    });

    setText("");

    // ✅ 3. Remove temp conversation
    setTempConversations((prev) => prev.filter((c) => c.user !== selectedUser));

    // ✅ 4. Send to backend (AFTER UI update)
    try {
      await fetch(`${API}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: userEmail,
          receiver: selectedUser, // ✅ must be email
          text,
        }),
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white border-b px-6 py-4 flex items-center gap-4">
        <button onClick={() => window.history.back()} className="text-gray-500">
          ← Back
        </button>
        <h1 className="text-xl font-bold">Messages</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-96 bg-white border-r flex flex-col">
          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {[...tempConversations, ...conversations].length === 0 ? (
              <p className="text-center mt-10 text-gray-400">
                No conversations yet
              </p>
            ) : (
              [...tempConversations, ...conversations].map((c, i) => {
                const user = c.user || c.otherUser || c.participant;

                return (
                  <button
                    key={i}
                    onClick={() => loadMessages(user)}
                    className={`w-full text-left px-4 py-4 border-b hover:bg-gray-50 ${
                      selectedUser === user ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="font-semibold">{user}</div>
                    <div className="text-sm text-gray-500 truncate">
                      {c.lastMessage || "Start conversation"}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT CHAT */}
        <div className="flex-1 flex flex-col">
          {!selectedUser ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a conversation
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="bg-white border-b px-6 py-4 font-semibold">
                {selectedUser}
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.length === 0 ? (
                  <p className="text-gray-400">No messages yet</p>
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex ${
                        m.sender === userEmail ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-xl max-w-xs ${
                          m.sender === userEmail
                            ? "bg-blue-400 text-white"
                            : "bg-white border"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* INPUT */}
              <div className="bg-white border-t p-4 flex gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="Type message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-400 text-white px-4 rounded-lg"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
