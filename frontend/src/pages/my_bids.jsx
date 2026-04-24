// src/pages/MyBidsPage.jsx

import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  History,
  User,
  LogOut,
  Wrench,
  DollarSign,
  MapPin,
  Clock,
  Star,
  Send,
  Eye,
  AlertCircle,
  X,
  Loader2,
  CheckCircle,
  RefreshCw,
  SlidersHorizontal,
  CalendarDays,
  FileText,
  ExternalLink
} from "lucide-react";
import { Button } from "../ui/button";

const API_BASE = "http://localhost:8000";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "plumber", label: "Plumber" },
  { value: "electrician", label: "Electrician" },
  { value: "mechanic", label: "Mechanic" },
  { value: "carpenter", label: "Carpenter" },
  { value: "general repair", label: "General Repair" },
];

// Maps category → colour classes
const CATEGORY_COLORS = {
  plumber:        "bg-blue-100 text-blue-700",
  electrician:    "bg-yellow-100 text-yellow-700",
  mechanic:       "bg-gray-100 text-gray-700",
  carpenter:      "bg-orange-100 text-orange-700",
  "general repair": "bg-purple-100 text-purple-700",
};

// How long ago helper
function timeAgo(dateStr) {
  if (!dateStr) return "Unknown";
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function MyBidsPage() {
  const [requests, setRequests]           = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Modals
  const [showBidModal, setShowBidModal]         = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPrefsModal, setShowPrefsModal]     = useState(false);
  const [selectedRequest, setSelectedRequest]   = useState(null);

  // Bid form
  const [bidAmount, setBidAmount]         = useState("");
  const [availability, setAvailability]   = useState("");
  const [completionTime, setCompletionTime] = useState("");
  const [bidMessage, setBidMessage]       = useState("");
  const [submitting, setSubmitting]       = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError]     = useState(null);

  // Preferences (stored locally; used as default category filter)
  const [prefCategories, setPrefCategories] = useState(() => {
    try { return JSON.parse(localStorage.getItem("providerPrefCategories") || "[]"); }
    catch { return []; }
  });

  const getProviderEmail = () => {
    try { return JSON.parse(localStorage.getItem("user") || "{}").email || ""; }
    catch { return ""; }
  };

  // ── Fetch available requests ──────────────────────────────────
  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const email = getProviderEmail();
      if (!email) throw new Error("Not logged in");

      const params = selectedCategory ? `?category=${encodeURIComponent(selectedCategory)}` : "";
      const res = await fetch(`${API_BASE}/available-requests/${email}${params}`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // ── Open bid modal ────────────────────────────────────────────
  const openBidModal = (req) => {
    setSelectedRequest(req);
    setBidAmount("");
    setAvailability("");
    setCompletionTime("");
    setBidMessage("");
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowBidModal(true);
  };

  // ── Submit bid ────────────────────────────────────────────────
  const submitBid = async () => {
    if (!bidAmount || !availability || !completionTime) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    const amountNum = parseInt(bidAmount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(amountNum) || amountNum <= 0) {
      setSubmitError("Please enter a valid bid amount.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch(`${API_BASE}/bids`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id:      selectedRequest.id,
          provider_email:  getProviderEmail(),
          bid_amount:      amountNum,
          availability,
          completion_time: completionTime,
          message:         bidMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to submit bid");

      setSubmitSuccess(true);
      // Remove the request from the list (provider already bid on it)
      setTimeout(() => {
        setShowBidModal(false);
        setRequests((prev) => prev.filter((r) => r.id !== selectedRequest.id));
      }, 1800);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Save preferences ──────────────────────────────────────────
  const savePreferences = (cats) => {
    setPrefCategories(cats);
    localStorage.setItem("providerPrefCategories", JSON.stringify(cats));
    setShowPrefsModal(false);
  };

  // ── Counts ────────────────────────────────────────────────────
  const matchingCount = requests.length;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Wrench className="text-white" />
            </div>
            <span className="font-bold text-xl">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem to="/provider-dashboard" icon={<LayoutDashboard size={18} />} label="Home" />
          <NavItem to="/provider-messages"  icon={<MessageSquare size={18} />}   label="Messages" badge="5" />
          <NavItem to="/bids-history"       icon={<History size={18} />}          label="Bids History" />
          <NavItem to="/my-bids"            icon={<ClipboardList size={18} />}   label="Available Bids" active />
          <NavItem to="/provider-profile"   icon={<User size={18} />}             label="Profile" />
        </nav>

        <div className="p-4 border-t">
          <Link to="/login" className="flex items-center gap-3 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg">
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="flex-1 p-8 overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-3xl font-bold">Available Job Requests</h1>
          <button
            onClick={fetchRequests}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-sky-600 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
        <p className="text-gray-500 mb-6">Browse and bid on jobs posted by customers in your area</p>

        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-400 to-teal-300 text-white p-6 rounded-xl flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold">New Job Opportunities</h2>
            <p className="text-sm">
              {loading ? "Loading..." : `${matchingCount} request${matchingCount !== 1 ? "s" : ""} available for you`}
            </p>
          </div>
          <Button
            className="!bg-white !text-blue-600 border border-blue-200 hover:bg-blue-50 flex items-center gap-2"
            onClick={() => setShowPrefsModal(true)}
          >
            <SlidersHorizontal size={15} />
            Set Preferences
          </Button>
        </div>

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                selectedCategory === cat.value
                  ? "bg-sky-500 text-white border-sky-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-sky-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Loader2 size={36} className="animate-spin mb-3" />
            <p>Loading available requests...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-24 text-red-400">
            <AlertCircle size={36} className="mb-3" />
            <p>{error}</p>
            <button onClick={fetchRequests} className="mt-4 text-sm text-sky-500 underline">Try again</button>
          </div>
        )}

        {!loading && !error && requests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <ClipboardList size={36} className="mb-3" />
            <p className="font-medium">No open requests right now</p>
            <p className="text-sm mt-1">Check back later or change your category filter</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && requests.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onBid={() => openBidModal(req)}
                onDetails={() => { setSelectedRequest(req); setShowDetailsModal(true); }}
              />
            ))}
          </div>
        )}

      </main>

      {/* ── Bid Modal ───────────────────────────────────────── */}
      {showBidModal && selectedRequest && (
        <Modal title="Submit Your Bid" onClose={() => setShowBidModal(false)}>

          {/* Request snapshot */}
          <div className="bg-blue-50 p-5 rounded-xl mb-5 border border-blue-100">
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Service Request</p>
            <h3 className="font-semibold text-lg mb-3">{selectedRequest.description}</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="Client"   value={selectedRequest.user_name || "—"} />
              <Info label="Budget"   value={`Rs. ${selectedRequest.budget?.toLocaleString()}`} green />
              <Info label="Location" value={selectedRequest.location_name || "—"} />
              <Info label="Date"     value={`${selectedRequest.date} at ${selectedRequest.time}`} />
            </div>
          </div>

          {submitSuccess ? (
            <div className="flex flex-col items-center py-8 text-green-600">
              <CheckCircle size={48} className="mb-3" />
              <p className="text-xl font-semibold">Bid Submitted!</p>
              <p className="text-sm text-gray-500 mt-1">The client will be notified.</p>
            </div>
          ) : (
            <>
              <FormField
                label="Your Bid Amount (Rs.) *"
                icon={<DollarSign size={16} className="text-gray-400" />}
                placeholder="e.g. 4500"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                type="number"
              />
              <FormField
                label="Your Availability *"
                icon={<Clock size={16} className="text-gray-400" />}
                placeholder="e.g. Tomorrow, 10 AM"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
              <FormField
                label="Expected Completion Time *"
                icon={<Clock size={16} className="text-gray-400" />}
                placeholder="e.g. 3–4 hours"
                value={completionTime}
                onChange={(e) => setCompletionTime(e.target.value)}
              />

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message to Client (Optional)</label>
                <textarea
                  placeholder="Introduce yourself and explain why you're the best fit..."
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  className="w-full border rounded-xl p-3 h-24 outline-none focus:ring-2 focus:ring-sky-400 resize-none text-sm"
                />
              </div>

              {submitError && (
                <p className="text-red-500 text-sm mb-3 flex items-center gap-2">
                  <AlertCircle size={14} /> {submitError}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={submitBid}
                  disabled={submitting}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2"
                >
                  {submitting
                    ? <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                    : <><Send size={16} /> Submit Bid</>
                  }
                </Button>
                <Button variant="outline" onClick={() => setShowBidModal(false)} disabled={submitting} className="flex-1">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </Modal>
      )}

      {/* ── View Details Modal ──────────────────────────────── */}
      {showDetailsModal && selectedRequest && (
        <Modal title="Request Details" onClose={() => setShowDetailsModal(false)}>
          <div className="space-y-4">

            {/* Category badge */}
            <span className={`inline-block text-xs px-3 py-1 rounded-full font-medium ${CATEGORY_COLORS[selectedRequest.category] || "bg-gray-100 text-gray-600"}`}>
              {selectedRequest.category}
            </span>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Description</p>
              <p className="text-gray-800">{selectedRequest.description}</p>
            </div>

            {selectedRequest.note && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Additional Note</p>
                <p className="text-gray-600 text-sm">{selectedRequest.note}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <DetailCard icon={<User size={14} />}         label="Client"   value={selectedRequest.user_name || "—"} />
              <DetailCard icon={<DollarSign size={14} />}   label="Budget"   value={`Rs. ${selectedRequest.budget?.toLocaleString()}`} />
              <DetailCard icon={<MapPin size={14} />}       label="Location" value={selectedRequest.location_name || "—"} />
              <DetailCard icon={<CalendarDays size={14} />} label="Date"     value={`${selectedRequest.date} at ${selectedRequest.time}`} />
              <DetailCard icon={<FileText size={14} />}     label="Bids so far" value={selectedRequest.totalBids ?? 0} />
              <DetailCard icon={<Clock size={14} />}        label="Posted"   value={timeAgo(selectedRequest.created_at)} />
            </div>

            {selectedRequest.location_link && (
              <a
                href={selectedRequest.location_link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sky-500 text-sm hover:underline"
              >
                <ExternalLink size={14} /> View on Google Maps
              </a>
            )}

            {selectedRequest.image_url && selectedRequest.image_url.startsWith("http") && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Attached Photo</p>
                <img
                  src={selectedRequest.image_url}
                  alt="Job"
                  className="rounded-xl w-full max-h-52 object-cover border"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2"
                onClick={() => { setShowDetailsModal(false); openBidModal(selectedRequest); }}
              >
                <Send size={16} /> Submit Bid
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setShowDetailsModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Preferences Modal ───────────────────────────────── */}
      {showPrefsModal && (
        <PreferencesModal
          current={prefCategories}
          onSave={savePreferences}
          onClose={() => setShowPrefsModal(false)}
        />
      )}

    </div>
  );
}

/* ─── Request Card ──────────────────────────────────────────── */
function RequestCard({ request, onBid, onDetails }) {
  const colorClass = CATEGORY_COLORS[request.category] || "bg-gray-100 text-gray-600";

  return (
    <div className="bg-white p-6 rounded-2xl shadow border hover:shadow-md transition">

      {/* Title row */}
      <div className="flex justify-between mb-2">
        <h3 className="text-base font-semibold leading-snug line-clamp-2 flex-1 pr-3">
          {request.description}
        </h3>
        <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full whitespace-nowrap self-start">
          {timeAgo(request.created_at)}
        </span>
      </div>

      {/* Category */}
      <span className={`inline-block text-xs px-3 py-1 rounded-full mb-4 font-medium ${colorClass}`}>
        {request.category}
      </span>

      {/* Client row */}
      <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {(request.user_name || "?")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{request.user_name || "Anonymous"}</p>
            <p className="text-xs text-gray-500">Client</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star size={14} className="fill-yellow-400" />
          <span className="text-sm">New</span>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
          <DollarSign size={15} className="text-green-600 shrink-0" />
          <span className="truncate">Rs. {request.budget?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
          <MapPin size={15} className="shrink-0" />
          <span className="truncate">{request.location_name || "Location set"}</span>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-lg">
          <CalendarDays size={15} className="text-purple-500 shrink-0" />
          <span>{request.date}</span>
        </div>
        <div className="flex items-center gap-2 bg-orange-50 p-3 rounded-lg">
          <Clock size={15} className="text-orange-500 shrink-0" />
          <span>{request.time}</span>
        </div>
      </div>

      {/* Bid count */}
      <div className="bg-yellow-50 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
        <AlertCircle size={15} className="text-yellow-600 shrink-0" />
        {request.totalBids === 0
          ? "Be the first to bid!"
          : `${request.totalBids} bid${request.totalBids !== 1 ? "s" : ""} submitted already`}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onBid}
          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center gap-2"
        >
          <Send size={15} /> Submit Bid
        </Button>
        <Button
          variant="outline"
          onClick={onDetails}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <Eye size={15} /> View Details
        </Button>
      </div>
    </div>
  );
}

/* ─── Preferences Modal ─────────────────────────────────────── */
function PreferencesModal({ current, onSave, onClose }) {
  const [selected, setSelected] = useState(current);

  const toggle = (val) =>
    setSelected((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );

  return (
    <Modal title="Set Job Preferences" onClose={onClose}>
      <p className="text-sm text-gray-500 mb-4">
        Choose the service categories you're interested in. This saves your preference for quick filtering.
      </p>
      <div className="space-y-2 mb-6">
        {CATEGORIES.filter((c) => c.value).map((cat) => (
          <label key={cat.value} className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:bg-sky-50 transition">
            <input
              type="checkbox"
              checked={selected.includes(cat.value)}
              onChange={() => toggle(cat.value)}
              className="w-4 h-4 accent-sky-500"
            />
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium mr-1 ${CATEGORY_COLORS[cat.value]}`}>
              {cat.label}
            </span>
          </label>
        ))}
      </div>
      <div className="flex gap-3">
        <Button
          className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
          onClick={() => onSave(selected)}
        >
          Save Preferences
        </Button>
        <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
      </div>
    </Modal>
  );
}

/* ─── Reusables ─────────────────────────────────────────────── */
function NavItem({ to, icon, label, badge, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
        active ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon} {label}
      {badge && (
        <span className="ml-auto bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full">{badge}</span>
      )}
    </Link>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex items-center border rounded-xl px-3 focus-within:ring-2 focus-within:ring-sky-400">
        <span className="mr-2">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full py-3 outline-none text-sm bg-transparent"
        />
      </div>
    </div>
  );
}

function Info({ label, value, green }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`font-medium text-sm ${green ? "text-green-600" : ""}`}>{value}</p>
    </div>
  );
}

function DetailCard({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl">
      <span className="text-gray-400 mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}