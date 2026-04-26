// src/pages/BidsHistoryPage.jsx

import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ClipboardList, MessageSquare, History,
  User, LogOut, Wrench, Clock, Eye, MapPin, Calendar,
  Filter, Loader2, AlertCircle, Trash2, ChevronDown, ChevronUp,
  X, BadgeCheck, Hourglass, XCircle, PlayCircle,
  CheckCircle2, Navigation, ExternalLink
} from "lucide-react";
import { Button } from "../ui/button";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const BASE_URL = "http://localhost:8000";

/* ------------------------------------------------------------------ */
/*  STATUS HELPERS                                                      */
/* ------------------------------------------------------------------ */

const BID_STATUS_META = {
  pending:     { label: "Pending",     cls: "bg-yellow-50 text-yellow-700 border-yellow-200", Icon: Hourglass    },
  accepted:    { label: "Accepted",    cls: "bg-green-50  text-green-700  border-green-200",  Icon: BadgeCheck   },
  rejected:    { label: "Rejected",    cls: "bg-red-50    text-red-700    border-red-200",    Icon: XCircle      },
  withdrawn:   { label: "Withdrawn",   cls: "bg-gray-100  text-gray-600   border-gray-200",   Icon: X            },
  in_progress: { label: "In Progress", cls: "bg-blue-50   text-blue-700   border-blue-200",   Icon: PlayCircle   },
  completed:   { label: "Completed",   cls: "bg-teal-50   text-teal-700   border-teal-200",   Icon: CheckCircle2 },
};

const getStatusMeta = (status) =>
  BID_STATUS_META[status] ?? { label: status, cls: "bg-gray-100 text-gray-700 border-gray-200", Icon: Clock };

/* ================================================================== */
/*  MAP LOCATION PICKER                                                 */
/* ================================================================== */

function LocationPicker({ setMarkerPos, setAddress }) {
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      const a = data.address || {};

      const parts = [
        a.shop || a.amenity || a.building || a.office || a.tourism,
        a.house_number ? `${a.house_number} ${a.road || ""}`.trim() : a.road || a.pedestrian || a.footway || a.path,
        a.suburb || a.neighbourhood || a.quarter || a.residential,
        a.city_district || a.county,
        a.city || a.town || a.village || a.municipality,
        a.state,
        a.country,
      ].filter(Boolean);

      return parts.join(", ") || data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng;
      setMarkerPos({ lat, lng });
      const name = await reverseGeocode(lat, lng);
      setAddress(name);
    },
  });

  return null;
}

/* ================================================================== */
/*  START SERVICE MODAL                                                 */
/* ================================================================== */

function StartServiceModal({ bid, onClose, onStarted }) {
  const [markerPos, setMarkerPos] = useState(null);
  const [address,   setAddress]   = useState("");
  const [step,      setStep]      = useState("pick");
  const [errMsg,    setErrMsg]    = useState("");

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const providerEmail = JSON.parse(localStorage.getItem("user") || "{}").email || "";

  const confirmStart = async () => {
    if (!markerPos) return;
    setStep("submitting");
    try {
      const res = await fetch(`${BASE_URL}/bids/${bid.id}/start`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_email:   providerEmail,
          latitude:         markerPos.lat,
          longitude:        markerPos.lng,
          provider_address: address || `${markerPos.lat.toFixed(6)}, ${markerPos.lng.toFixed(6)}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Failed to start service");
      setStep("success");
      setTimeout(() => { onStarted(); onClose(); }, 1800);
    } catch (err) {
      setErrMsg(err.message);
      setStep("error");
    }
  };

  return (
    // ✅ FIX: overlay scrolls vertically; items-start + my-auto keeps modal
    // centred when there's room but allows it to scroll on short viewports.
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden my-auto">

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <PlayCircle className="text-sky-500" size={22} />
            Start My Service
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">

          <div className="bg-gray-50 rounded-xl p-4 mb-5 border text-sm space-y-1">
            <p className="font-semibold text-base line-clamp-2">
              {bid.request_snapshot?.title || "Service Request"}
            </p>
            <p className="text-gray-500">
              {bid.request_snapshot?.customer_name}
              {bid.request_snapshot?.location_name && ` · ${bid.request_snapshot.location_name}`}
            </p>
            <p className="text-green-600 font-bold text-base">
              Rs. {bid.bid_amount?.toLocaleString()}
            </p>
          </div>

          {step === "pick" && (
            <>
              <p className="text-gray-500 text-sm mb-3 leading-relaxed">
                Click anywhere on the map to drop a pin at your current location before starting the job.
              </p>

              <input
                className="w-full border rounded-xl px-3 py-2 text-sm text-gray-700 bg-gray-50 mb-3"
                value={address}
                readOnly
                placeholder="Click the map to select your location…"
              />

              <div className="rounded-xl overflow-hidden border mb-4" style={{ height: 260 }}>
                <MapContainer
                  center={[31.5204, 74.3587]}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker setMarkerPos={setMarkerPos} setAddress={setAddress} />
                  {markerPos && <Marker position={[markerPos.lat, markerPos.lng]} />}
                </MapContainer>
              </div>

              {markerPos && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 flex items-start gap-2 text-sm">
                  <Navigation size={14} className="text-green-500 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-green-700">
                      {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
                    </p>
                    <a
                      href={
                        address
                          ? `https://www.google.com/maps/search/${encodeURIComponent(address)}`
                          : `https://www.google.com/maps?q=${markerPos.lat},${markerPos.lng}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-500 hover:text-sky-700 underline"
                    >
                      View on Google Maps ↗
                    </a>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={confirmStart}
                  disabled={!markerPos}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                >
                  <CheckCircle2 size={16} />
                  Confirm & Start
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Not Yet
                </button>
              </div>
            </>
          )}

          {step === "submitting" && (
            <div className="flex flex-col items-center py-10 text-gray-500 gap-3">
              <Loader2 size={42} className="animate-spin text-sky-500" />
              <p className="font-medium">Starting your service…</p>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center py-10 text-green-600 gap-3">
              <CheckCircle2 size={52} />
              <p className="text-xl font-bold">Service Started!</p>
              <p className="text-sm text-gray-500 text-center">
                The client has been notified. Head to the job site — good luck!
              </p>
            </div>
          )}

          {step === "error" && (
            <>
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-5 text-red-700 text-sm">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p>{errMsg}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => { setStep("pick"); setErrMsg(""); }}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
                >
                  Try Again
                </Button>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Cancel
                </Button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  MAIN PAGE                                                           */
/* ================================================================== */

export function BidsHistoryPage() {
  const [bids, setBids]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [filterStatus, setFilterStatus]   = useState("All");
  const [expandedId, setExpandedId]       = useState(null);
  const [withdrawing, setWithdrawing]     = useState(null);
  const [startModalBid, setStartModalBid] = useState(null);

  const providerEmail =
    JSON.parse(localStorage.getItem("user") || "{}").email || "";

  const fetchBids = async () => {
    if (!providerEmail) {
      setError("Provider email not found. Please log in again.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/bids/provider/${providerEmail}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setBids(data);
    } catch (err) {
      setError(err.message || "Failed to load bids.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBids(); }, [providerEmail]);

  const handleWithdraw = async (bid) => {
    if (!window.confirm("Withdraw this bid?")) return;
    setWithdrawing(bid.id);
    try {
      const res = await fetch(`${BASE_URL}/bids/${bid.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider_email: providerEmail }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Failed to withdraw");
      }
      setBids((prev) => prev.filter((b) => b.id !== bid.id));
    } catch (err) {
      alert(err.message);
    } finally {
      setWithdrawing(null);
    }
  };

  const handleServiceStarted = () => {
    fetchBids();
  };

  const stats = {
    pending:    bids.filter((b) => b.status === "pending").length,
    accepted:   bids.filter((b) => b.status === "accepted").length,
    inProgress: bids.filter((b) => b.status === "in_progress").length,
    completed:  bids.filter((b) => b.status === "completed").length,
  };

  const filtered =
    filterStatus === "All"
      ? bids
      : bids.filter((b) => b.status === filterStatus.toLowerCase().replace(" ", "_"));

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <aside className="w-64 bg-white border-r flex flex-col shrink-0">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">UtilitY</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <SidebarLink to="/provider-dashboard" icon={<LayoutDashboard size={18} />} label="Home"             />
          <SidebarLink to="/provider-messages"  icon={<MessageSquare   size={18} />} label="Messages" badge="5" />
          <SidebarLink to="/bids-history"       icon={<History         size={18} />} label="Bids History" active />
          <SidebarLink to="/my-bids"            icon={<ClipboardList   size={18} />} label="Available Bids"  />
          <SidebarLink to="/provider-profile"   icon={<User            size={18} />} label="Profile"          />
        </nav>
        <div className="p-4 border-t">
          <Link
            to="/login"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-sm font-medium"
          >
            <LogOut size={18} /> Logout
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b px-8 py-6">
          <h1 className="text-3xl font-bold mb-1">Bids History</h1>
          <p className="text-gray-500">Track all bids you've submitted</p>
        </header>

        <div className="p-8 space-y-6">

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Hourglass    className="w-6 h-6 text-yellow-500" />} label="Pending"     value={stats.pending}    />
            <StatCard icon={<BadgeCheck   className="w-6 h-6 text-green-600"  />} label="Accepted"    value={stats.accepted}   />
            <StatCard icon={<PlayCircle   className="w-6 h-6 text-blue-500"   />} label="In Progress" value={stats.inProgress} />
            <StatCard icon={<CheckCircle2 className="w-6 h-6 text-teal-500"   />} label="Completed"   value={stats.completed}  />
          </div>

          <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} onRetry={fetchBids} />
          ) : filtered.length === 0 ? (
            <EmptyState filterStatus={filterStatus} />
          ) : (
            <div className="space-y-4">
              {filtered.map((bid) => (
                <BidCard
                  key={bid.id}
                  bid={bid}
                  expanded={expandedId === bid.id}
                  onToggle={() => setExpandedId(expandedId === bid.id ? null : bid.id)}
                  onWithdraw={handleWithdraw}
                  withdrawing={withdrawing === bid.id}
                  onStartService={() => setStartModalBid(bid)}
                />
              ))}
            </div>
          )}

        </div>
      </main>

      {startModalBid && (
        <StartServiceModal
          bid={startModalBid}
          onClose={() => setStartModalBid(null)}
          onStarted={handleServiceStarted}
        />
      )}
    </div>
  );
}

/* ================================================================== */
/*  BID CARD                                                            */
/* ================================================================== */

function BidCard({ bid, expanded, onToggle, onWithdraw, withdrawing, onStartService }) {
  const snap         = bid.request_snapshot || {};
  const meta         = getStatusMeta(bid.status);
  const Icon         = meta.Icon;
  const isAccepted   = bid.status === "accepted";
  const isInProgress = bid.status === "in_progress";
  const isCompleted  = bid.status === "completed";

  const providerCoords = bid.provider_start_location?.coordinates
    ? {
        lng: bid.provider_start_location.coordinates[0],
        lat: bid.provider_start_location.coordinates[1],
      }
    : null;

  return (
    <div className={`bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
      isAccepted   ? "border-green-300 ring-1 ring-green-200" :
      isInProgress ? "border-blue-300  ring-1 ring-blue-200"  :
      isCompleted  ? "border-teal-300  ring-1 ring-teal-200"  : ""
    }`}>

      {isAccepted && (
        <div className="bg-green-500 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2">
          <BadgeCheck size={13} />
          Bid accepted — click "Start My Service" when you're ready to begin
        </div>
      )}
      {isInProgress && (
        <div className="bg-blue-500 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2">
          <PlayCircle size={13} />
          Service in progress — waiting for the client to mark the job as complete
        </div>
      )}
      {isCompleted && (
        <div className="bg-teal-500 text-white text-xs font-semibold px-4 py-2 flex items-center gap-2">
          <CheckCircle2 size={13} />
          Job completed successfully
        </div>
      )}

      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="text-lg font-bold truncate">
                {snap.title || "Service Request"}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap ${meta.cls}`}>
                <Icon className="w-3 h-3" />
                {meta.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
              {snap.customer_name && (
                <span className="flex items-center gap-1.5">
                  <User size={13} /> {snap.customer_name}
                </span>
              )}
              {snap.location_name && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> {snap.location_name}
                </span>
              )}
              {snap.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {snap.date}{snap.time && ` at ${snap.time}`}
                </span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400 mb-0.5">Your bid</p>
            <p className="text-2xl font-bold text-green-600">
              Rs.&nbsp;{bid.bid_amount?.toLocaleString()}
            </p>
            {snap.budget && (
              <p className="text-xs text-gray-400 mt-0.5">
                Budget: Rs.&nbsp;{Number(snap.budget).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            <Eye size={15} />
            {expanded ? "Hide Details" : "View Details"}
            {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          <Link to="/provider-messages">
            <Button variant="outline" className="flex items-center gap-2 text-sm">
              <MessageSquare size={15} />
              Contact Client
            </Button>
          </Link>

          {isAccepted && (
            <button
              onClick={onStartService}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <PlayCircle size={15} />
              Start My Service
            </button>
          )}

          {bid.status === "pending" && (
            <button
              onClick={() => onWithdraw(bid)}
              disabled={withdrawing}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {withdrawing
                ? <Loader2 size={15} className="animate-spin" />
                : <Trash2  size={15} />
              }
              Withdraw Bid
            </button>
          )}
        </div>
      </div>

      {/* ── Expanded details panel ── */}
      {expanded && (
        <div className="border-t bg-gray-50 p-6 space-y-6">

          <div className="grid sm:grid-cols-2 gap-6">

            <DetailSection title="Your Bid Details">
              <DetailRow label="Bid Amount"      value={`Rs. ${bid.bid_amount?.toLocaleString()}`} highlight />
              <DetailRow label="Availability"    value={bid.availability}    />
              <DetailRow label="Completion Time" value={bid.completion_time} />
              <DetailRow label="Submitted At"    value={bid.created_at}      />
              {bid.service_started_at && (
                <DetailRow label="Service Started" value={bid.service_started_at} />
              )}
              {bid.completed_at && (
                <DetailRow label="Completed At" value={bid.completed_at} />
              )}
              {bid.message && (
                <DetailRow label="Your Message" value={bid.message} />
              )}
            </DetailSection>

            <DetailSection title="Request Details">
              <DetailRow label="Category"     value={snap.category}       />
              <DetailRow label="Client"       value={snap.customer_name}  />
              <DetailRow label="Client Email" value={snap.customer_email} />
              <DetailRow
                label="Budget"
                value={snap.budget ? `Rs. ${Number(snap.budget).toLocaleString()}` : undefined}
              />
              <DetailRow
                label="Scheduled Date"
                value={snap.date ? `${snap.date}${snap.time ? ` at ${snap.time}` : ""}` : undefined}
              />
              {snap.location_name && (
                <DetailRow label="Job Location" value={snap.location_name} />
              )}
            </DetailSection>

          </div>

          {/* Provider start location card */}
          {bid.service_started && (bid.provider_start_address || providerCoords) && (
            <div className="border-t pt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
                <MapPin size={13} className="text-blue-500" />
                Your Start Location
              </h4>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">

                <div className="flex items-start gap-3">
                  <Navigation size={15} className="text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-0.5">
                      Address
                    </p>
                    <p className="text-sm text-gray-800 font-medium leading-snug">
                      {bid.provider_start_address
                        ? bid.provider_start_address
                        : providerCoords
                          ? `${providerCoords.lat.toFixed(6)}, ${providerCoords.lng.toFixed(6)}`
                          : "Address not available"}
                    </p>
                  </div>
                </div>

                {providerCoords && (
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-4 text-xs font-mono text-blue-600">
                      <span>
                        <span className="font-sans font-semibold text-blue-400 mr-1">Lat</span>
                        {providerCoords.lat.toFixed(6)}
                      </span>
                      <span>
                        <span className="font-sans font-semibold text-blue-400 mr-1">Lng</span>
                        {providerCoords.lng.toFixed(6)}
                      </span>
                    </div>
                    <a
                      href={
                        bid.provider_start_address
                          ? `https://www.google.com/maps/search/${encodeURIComponent(bid.provider_start_address)}`
                          : `https://www.google.com/maps?q=${providerCoords.lat},${providerCoords.lng}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-sky-500 hover:text-sky-700 underline whitespace-nowrap"
                    >
                      <ExternalLink size={11} />
                      View on Google Maps
                    </a>
                  </div>
                )}

                {providerCoords && (
                  <div className="rounded-lg overflow-hidden border border-blue-200" style={{ height: 180 }}>
                    <MapContainer
                      center={[providerCoords.lat, providerCoords.lng]}
                      zoom={15}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={false}
                      dragging={false}
                      scrollWheelZoom={false}
                      doubleClickZoom={false}
                      touchZoom={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[providerCoords.lat, providerCoords.lng]} />
                    </MapContainer>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/*  REUSABLE COMPONENTS                                                 */
/* ================================================================== */

function SidebarLink({ to, icon, label, badge, active }) {
  const location = useLocation();
  const isActive = active || location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {icon} {label}
      {badge && (
        <span className="ml-auto bg-sky-500 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border p-5 flex items-center gap-4 shadow-sm">
      {icon}
      <div>
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

function FilterBar({ filterStatus, setFilterStatus }) {
  const statuses = ["All", "Pending", "Accepted", "In Progress", "Rejected", "Completed"];
  return (
    <div className="bg-white rounded-2xl border p-4 flex flex-wrap justify-between items-center gap-4 shadow-sm">
      <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
        <Filter size={15} /> Filter by status
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              filterStatus === s
                ? "bg-sky-500 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-gray-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-3 text-sm">
      <span className="text-gray-400 shrink-0">{label}</span>
      <span className={`text-right font-medium break-words max-w-[60%] ${
        highlight ? "text-green-600 font-bold text-base" : "text-gray-700"
      }`}>
        {value}
      </span>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-white rounded-2xl border p-16 flex flex-col items-center gap-4 text-gray-400">
      <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      <p className="text-lg font-medium">Loading your bids…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded-2xl border p-16 flex flex-col items-center gap-4 text-center">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-lg font-semibold text-red-600">Something went wrong</p>
      <p className="text-gray-500 max-w-sm text-sm">{message}</p>
      <Button onClick={onRetry} className="mt-2">Try Again</Button>
    </div>
  );
}

function EmptyState({ filterStatus }) {
  return (
    <div className="bg-white rounded-2xl border p-16 flex flex-col items-center gap-3 text-gray-400 text-center">
      <ClipboardList className="w-14 h-14 opacity-30" />
      <p className="text-lg font-semibold text-gray-600">
        {filterStatus === "All"
          ? "You haven't submitted any bids yet"
          : `No ${filterStatus.toLowerCase()} bids found`}
      </p>
      <p className="text-sm">Head over to Available Bids to start bidding on jobs.</p>
      <Link to="/my-bids" className="mt-2">
        <Button className="bg-sky-500 hover:bg-sky-600 text-white">Browse Available Bids</Button>
      </Link>
    </div>
  );
}