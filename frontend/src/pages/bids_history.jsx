// src/pages/BidsHistoryPage.jsx
import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  MessageSquare,
  History,
  User,
  LogOut,
  Wrench,
  Clock,
  CheckCircle,
  Eye,
  Star,
  MapPin,
  DollarSign,
  Calendar,
  Filter,
  Loader2,
  AlertCircle,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  BadgeCheck,
  Hourglass,
  XCircle
} from "lucide-react";
import { Button } from "../ui/button";

const BASE_URL = "http://localhost:8000";

/* ------------------------------------------------------------------ */
/*  STATUS HELPERS                                                      */
/* ------------------------------------------------------------------ */

const BID_STATUS_META = {
  pending:  { label: "Pending",  cls: "bg-yellow-50 text-yellow-700 border-yellow-200",  Icon: Hourglass    },
  accepted: { label: "Accepted", cls: "bg-green-50  text-green-700  border-green-200",   Icon: BadgeCheck   },
  rejected: { label: "Rejected", cls: "bg-red-50    text-red-700    border-red-200",     Icon: XCircle      },
  withdrawn:{ label: "Withdrawn",cls: "bg-gray-100  text-gray-600   border-gray-200",    Icon: X            },
};

const getStatusMeta = (status) =>
  BID_STATUS_META[status] ?? { label: status, cls: "bg-gray-100 text-gray-700 border-gray-200", Icon: Clock };

/* ------------------------------------------------------------------ */
/*  MAIN PAGE                                                           */
/* ------------------------------------------------------------------ */

export function BidsHistoryPage() {
  const [bids, setBids]               = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedId, setExpandedId]   = useState(null);
  const [withdrawing, setWithdrawing] = useState(null); // bid_id being withdrawn

  // ---------- grab email from localStorage ----------
  const providerEmail =
    JSON.parse(localStorage.getItem("user") || "{}").email || "";

  // ---------- fetch bids ----------
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

  // ---------- withdraw bid ----------
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

  // ---------- derived stats ----------
  const stats = {
    pending:   bids.filter((b) => b.status === "pending").length,
    accepted:  bids.filter((b) => b.status === "accepted").length,
    completed: bids.filter((b) => b.status === "completed").length,
    avgRating: "4.8", // placeholder — replace with real data if available
  };

  // ---------- filtered list ----------
  const filtered =
    filterStatus === "All"
      ? bids
      : bids.filter((b) => b.status === filterStatus.toLowerCase());

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">

      {/* ---- SIDEBAR ---- */}
      <aside className="w-full lg:w-64 bg-white border-r border-border flex flex-col shadow-sm">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">UtilitY</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <SidebarLink to="/provider-dashboard" icon={<LayoutDashboard />} label="Home" />
          <SidebarLink to="/provider-messages"  icon={<MessageSquare />}   label="Messages" badge="5" />
          <SidebarLink to="/bids-history"        icon={<History />}         label="Bids History" />
          <SidebarLink to="/my-bids"             icon={<ClipboardList />}   label="Available Bids" />
          <SidebarLink to="/provider-profile"    icon={<User />}            label="Profile" />
        </nav>

        <div className="p-4 border-t border-border">
          <Link
            to="/login"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </aside>

      {/* ---- MAIN ---- */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-border px-8 py-6">
          <h1 className="text-3xl font-bold mb-1">Bids History</h1>
          <p className="text-muted-foreground">Track all bids you've submitted</p>
        </header>

        <div className="p-8 space-y-8">

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <StatCard icon={<Hourglass  className="w-6 h-6 text-yellow-500" />} label="Pending"  value={stats.pending}   />
            <StatCard icon={<BadgeCheck className="w-6 h-6 text-green-600"  />} label="Accepted" value={stats.accepted}  />
            <StatCard icon={<CheckCircle className="w-6 h-6 text-blue-600" />}  label="Total"    value={bids.length}     />
            <StatCard icon={<Star        className="w-6 h-6 text-yellow-400"/>}  label="Avg Rating" value={stats.avgRating}/>
          </div>

          {/* Filter */}
          <FilterBar filterStatus={filterStatus} setFilterStatus={setFilterStatus} />

          {/* Content */}
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
                />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SIDEBAR LINK                                                        */
/* ------------------------------------------------------------------ */

function SidebarLink({ to, icon, label, badge }) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
        active
          ? "bg-accent text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      }`}
    >
      {icon}
      {label}
      {badge && (
        <span className="ml-auto bg-primary text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  STAT CARD                                                           */
/* ------------------------------------------------------------------ */

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl border p-6 flex items-center gap-4">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FILTER BAR                                                          */
/* ------------------------------------------------------------------ */

function FilterBar({ filterStatus, setFilterStatus }) {
  const statuses = ["All", "Pending", "Accepted", "Rejected"];
  return (
    <div className="bg-white rounded-2xl border p-4 flex flex-wrap justify-between items-center gap-4">
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Filter className="w-4 h-4" />
        Filter by status
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filterStatus === s
                ? "bg-primary text-white"
                : "bg-accent hover:bg-accent/80"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BID CARD                                                            */
/* ------------------------------------------------------------------ */

function BidCard({ bid, expanded, onToggle, onWithdraw, withdrawing }) {
  const snap   = bid.request_snapshot || {};
  const meta   = getStatusMeta(bid.status);
  const Icon   = meta.Icon;

  return (
    <div className="bg-white rounded-2xl border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* ---- Summary row ---- */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold truncate">
                {snap.title || "Service Request"}
              </h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border whitespace-nowrap ${meta.cls}`}>
                <Icon className="w-3 h-3" />
                {meta.label}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
              {snap.customer_name && (
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {snap.customer_name}
                </span>
              )}
              {snap.location_name && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {snap.location_name}
                </span>
              )}
              {snap.date && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {snap.date} {snap.time && `at ${snap.time}`}
                </span>
              )}
            </div>
          </div>

          {/* Right — price */}
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground mb-0.5">Your bid</p>
            <p className="text-2xl font-bold text-green-600">
              Rs.&nbsp;{bid.bid_amount?.toLocaleString()}
            </p>
            {snap.budget && (
              <p className="text-xs text-muted-foreground mt-0.5">
                Budget: Rs.&nbsp;{Number(snap.budget).toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t">
          <button
            onClick={onToggle}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-sm font-medium hover:bg-accent/80 transition-colors"
          >
            <Eye className="w-4 h-4" />
            {expanded ? "Hide Details" : "View Details"}
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <Link to="/provider-messages">
            <Button variant="outline" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contact Client
            </Button>
          </Link>

          {bid.status === "pending" && (
            <button
              onClick={() => onWithdraw(bid)}
              disabled={withdrawing}
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 border border-red-200 hover:bg-red-50 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {withdrawing
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Trash2 className="w-4 h-4" />
              }
              Withdraw Bid
            </button>
          )}
        </div>
      </div>

      {/* ---- Expanded details ---- */}
      {expanded && (
        <div className="border-t bg-gray-50 p-6 grid sm:grid-cols-2 gap-6">
          <DetailSection title="Your Bid Details">
            <DetailRow label="Bid Amount"      value={`Rs. ${bid.bid_amount?.toLocaleString()}`} highlight />
            <DetailRow label="Availability"    value={bid.availability}    />
            <DetailRow label="Completion Time" value={bid.completion_time} />
            <DetailRow label="Submitted"       value={bid.created_at}      />
            {bid.message && <DetailRow label="Your Message" value={bid.message} />}
          </DetailSection>

          <DetailSection title="Request Details">
            <DetailRow label="Category"       value={snap.category}       />
            <DetailRow label="Client"         value={snap.customer_name}  />
            <DetailRow label="Client Email"   value={snap.customer_email} />
            <DetailRow label="Budget"         value={snap.budget ? `Rs. ${Number(snap.budget).toLocaleString()}` : "—"} />
            <DetailRow label="Scheduled Date" value={snap.date ? `${snap.date}${snap.time ? ` at ${snap.time}` : ""}` : "—"} />
            {snap.location_name && (
              <DetailRow label="Location" value={snap.location_name} />
            )}
          </DetailSection>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DETAIL HELPERS                                                      */
/* ------------------------------------------------------------------ */

function DetailSection({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, highlight }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-2 text-sm">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className={`text-right font-medium ${highlight ? "text-green-600 text-base font-bold" : ""}`}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STATES                                                              */
/* ------------------------------------------------------------------ */

function LoadingState() {
  return (
    <div className="bg-white rounded-2xl border p-16 flex flex-col items-center gap-4 text-muted-foreground">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
      <p className="text-lg font-medium">Loading your bids…</p>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="bg-white rounded-2xl border p-16 flex flex-col items-center gap-4 text-center">
      <AlertCircle className="w-12 h-12 text-red-400" />
      <p className="text-lg font-semibold text-red-600">Something went wrong</p>
      <p className="text-muted-foreground max-w-sm">{message}</p>
      <Button onClick={onRetry} className="mt-2">Try Again</Button>
    </div>
  );
}

function EmptyState({ filterStatus }) {
  return (
    <div className="bg-white rounded-2xl border p-16 flex flex-col items-center gap-3 text-muted-foreground text-center">
      <ClipboardList className="w-14 h-14 opacity-30" />
      <p className="text-lg font-semibold">
        {filterStatus === "All"
          ? "You haven't submitted any bids yet"
          : `No ${filterStatus.toLowerCase()} bids found`}
      </p>
      <p className="text-sm">Head over to Available Bids to start bidding on jobs.</p>
      <Link to="/my-bids" className="mt-2">
        <Button className="bg-primary text-white">Browse Available Bids</Button>
      </Link>
    </div>
  );
}