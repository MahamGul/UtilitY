import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  Star,
} from "lucide-react";

// ── Mock data ─────────────────────────────────────────────────────────────────
const PROVIDERS = [
  { id: 1, name: "Ahmed Khan",    rating: 4.9, preview: "I'll arrive in 15 minutes. Is the location correct?", time: "2m ago",   unread: 2, online: true  },
  { id: 2, name: "Fatima Ali",    rating: 4.8, preview: "Thank you! I'll bring all necessary tools.",           time: "1h ago",   unread: 0, online: false },
  { id: 3, name: "Hassan Malik",  rating: 4.7, preview: "The work is completed. Please check and confirm.",     time: "3h ago",   unread: 0, online: false },
  { id: 4, name: "Ayesha Rahman", rating: 4.9, preview: "Perfect! I can start tomorrow at 10 AM.",             time: "Yesterday",unread: 0, online: true  },
];

const MESSAGES = [
  { id: 1, from: "me",    text: "Hi! I accepted your offer for the plumbing work.", time: "10:30 AM" },
  { id: 2, from: "other", text: "Thank you! I'm on my way. What's the exact issue?", time: "10:32 AM" },
  { id: 3, from: "me",    text: "The kitchen sink is leaking and the water pressure is very low.", time: "10:33 AM" },
  { id: 4, from: "other", text: "Got it. I have all the necessary tools with me.", time: "10:35 AM" },
  { id: 5, from: "other", text: "I'll arrive in 15 minutes. Is the location correct?", time: "10:42 AM" },
];

// ── Avatar (initial-based since customer side shows providers) ─────────────────
function ProviderAvatar({ name, size = "md", online = false }) {
  const initial = name.charAt(0);
  const sz = size === "lg" ? "w-14 h-14 text-xl" : "w-12 h-12 text-base";
  const dot = size === "lg" ? "w-4 h-4" : "w-3 h-3";
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sz} bg-gradient-to-br from-blue-400 to-blue-200 rounded-2xl flex items-center justify-center font-bold text-white border-2 border-gray-200`}>
        {initial}
      </div>
      {online && (
        <span className={`${dot} absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full`} />
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function CustomerMessages() {
  const navigate = useNavigate();
  const [activeProvider, setActiveProvider] = useState(PROVIDERS[0]);
  const [messages, setMessages]             = useState(MESSAGES);
  const [draft, setDraft]                   = useState("");
  const [search, setSearch]                 = useState("");

  const filtered = PROVIDERS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const sendMessage = () => {
    if (!draft.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(), from: "me", text: draft.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Top Header ── */}
      <header className="bg-white border-b border-gray-200 px-8 py-5 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Provider List ── */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          {/* Search */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Provider Items */}
          <div className="flex-1 overflow-y-auto">
            {filtered.map(provider => (
              <button
                key={provider.id}
                onClick={() => setActiveProvider(provider)}
                className={`w-full flex items-start gap-3 px-4 py-4 border-b border-gray-100 text-left transition-colors
                  ${activeProvider.id === provider.id ? "bg-blue-50" : "hover:bg-gray-50"}`}
              >
                <ProviderAvatar name={provider.name} size="lg" online={provider.online} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{provider.name}</span>
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-700">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {provider.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{provider.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 truncate flex-1">{provider.preview}</span>
                    {provider.unread > 0 && (
                      <span className="ml-2 bg-blue-400 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                        {provider.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat Window ── */}
        <div className="flex-1 flex flex-col bg-gray-50">

          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ProviderAvatar name={activeProvider.name} online={activeProvider.online} />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-gray-900 text-lg">{activeProvider.name}</p>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-gray-600">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {activeProvider.rating}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  {activeProvider.online ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {[Phone, Video, MoreVertical].map((Icon, i) => (
                <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors">
                  <Icon className="w-4 h-4 text-gray-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-lg">
                  <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed
                    ${msg.from === "me"
                      ? "bg-blue-400 text-white rounded-br-sm"
                      : "bg-white border-2 border-gray-200 text-gray-900 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${msg.from === "me" ? "text-right" : "text-left"} px-1`}>
                    {msg.time}{msg.from === "me" && " ✓✓"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4">
            <div className="flex items-end gap-3">
              <button className="w-9 h-9 flex items-center justify-center rounded-xl border-2 border-gray-200 hover:bg-gray-100 transition-colors flex-shrink-0">
                <Paperclip className="w-4 h-4 text-gray-500" />
              </button>
              <div className="flex-1 border-2 border-gray-200 rounded-xl focus-within:border-blue-400 transition-colors bg-white">
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full px-4 py-3 text-sm outline-none resize-none rounded-xl bg-transparent text-gray-700"
                />
              </div>
              <button
                onClick={sendMessage}
                className={`w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0 transition-colors
                  ${draft.trim() ? "bg-blue-400 hover:bg-blue-500 text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
