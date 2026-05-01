import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Loader,
  AlertCircle,
  Shield,
  Users,
  Wrench,
  ClipboardList,
  TrendingUp,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  BarChart3,
  Check,
  XCircle,
} from 'lucide-react';
import { dashboard, users, providerVerification } from '../services/api';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ pendingProviders = 0, pendingReports = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/admin-login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm shrink-0 min-h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold text-gray-900 block">UtilitY</span>
            <span className="text-xs text-gray-500">Admin Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/admin-dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-gray-900 font-medium transition-colors"
        >
          <BarChart3 className="w-5 h-5 text-blue-500" />
          Dashboard
        </Link>

        <Link
          to="/admin-verification"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          Provider Verification
          {pendingProviders > 0 && (
            <span className="ml-auto bg-yellow-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {pendingProviders}
            </span>
          )}
        </Link>

        <Link
          to="/admin-reports"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
        >
          <AlertCircle className="w-5 h-5" />
          Customer Reports
          {pendingReports > 0 && (
            <span className="ml-auto bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {pendingReports}
            </span>
          )}
        </Link>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

// ─── Status badge helper ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    Pending: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    Approved: 'bg-green-100 text-green-700 border border-green-200',
    Rejected: 'bg-red-100 text-red-700 border border-red-200',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
}

// ─── Activity icon helper ──────────────────────────────────────────────────────
function getActivityIcon(type) {
  const icons = {
    provider_approved: { bg: 'bg-green-100', icon: <CheckCircle className="w-5 h-5 text-green-600" /> },
    provider_rejected: { bg: 'bg-red-100',   icon: <AlertCircle className="w-5 h-5 text-red-600" /> },
    report_resolved:   { bg: 'bg-blue-100',  icon: <ClipboardList className="w-5 h-5 text-blue-600" /> },
    report_escalated:  { bg: 'bg-orange-100',icon: <AlertCircle className="w-5 h-5 text-orange-600" /> },
    user:              { bg: 'bg-blue-100',  icon: <Users className="w-5 h-5 text-blue-600" /> },
    provider:          { bg: 'bg-yellow-100',icon: <Clock className="w-5 h-5 text-yellow-600" /> },
    app:               { bg: 'bg-purple-100',icon: <ClipboardList className="w-5 h-5 text-purple-600" /> },
  };
  const entry = icons[type] || icons.app;
  return (
    <div className={`w-10 h-10 ${entry.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
      {entry.icon}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats, setStats]               = useState(null);
  const [providersList, setProvidersList] = useState([]);
  const [platformStats, setPlatformStats] = useState([]);
  const [activities, setActivities]     = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchDashboardData(); }, []);

  // ── helpers ──
  const fmt = (n) => (n != null ? Number(n).toLocaleString() : '0');

  const fmtDate = (d) => {
    if (!d) return 'N/A';
    try {
      const date = new Date(d);
      return isNaN(date) ? d : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch { return d; }
  };

  const fmtAction = (action) => ({
    provider_approved: 'New provider approved',
    provider_rejected: 'Provider application rejected',
    report_resolved:   'Report resolved',
    report_escalated:  'Report escalated',
  }[action] || action || 'Activity');

  // ── fallbacks ──
  const defaultProviders = () => [
    { id: 1, name: 'Ali Raza',      service: 'Plumbing',   location: 'Gulberg, Lahore',      experience: '5 years', applied: 'Dec 28, 2024', status: 'Pending' },
    { id: 2, name: 'Kamran Sheikh', service: 'Electrical', location: 'DHA Phase 5, Lahore',  experience: '3 years', applied: 'Dec 28, 2024', status: 'Pending' },
    { id: 3, name: 'Fahad Ahmed',   service: 'Carpentry',  location: 'Model Town, Lahore',   experience: '7 years', applied: 'Dec 27, 2024', status: 'Pending' },
    { id: 4, name: 'Asim Khan',     service: 'Plumbing',   location: 'Bahria Town, Lahore',  experience: '4 years', applied: 'Dec 27, 2024', status: 'Approved' },
    { id: 5, name: 'Tariq Mahmood', service: 'AC Repair',  location: 'Johar Town, Lahore',   experience: '6 years', applied: 'Dec 26, 2024', status: 'Approved' },
    { id: 6, name: 'Naveed Malik',  service: 'Electrical', location: 'Cantt, Lahore',        experience: '2 years', applied: 'Dec 26, 2024', status: 'Rejected' },
  ];

  const defaultActivities = () => [
    { type: 'provider_approved', text: 'New provider approved',            detail: 'Asim Khan - Plumbing • 2 hours ago' },
    { type: 'user',              text: 'New user registration',            detail: 'Sara Ahmed joined as customer • 3 hours ago' },
    { type: 'provider',          text: 'Provider application received',    detail: 'Ali Raza - Plumbing • 4 hours ago' },
    { type: 'report_escalated',  text: 'New customer report submitted',    detail: 'Report #1245 - Requires review • 5 hours ago' },
    { type: 'app',               text: 'Job completed',                    detail: 'Usman Ahmed completed plumbing job • 6 hours ago' },
  ];

  // ── fetch ──
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, providersRes, activityRes, pendingRes, usersRes] = await Promise.all([
        dashboard.getStats(),
        dashboard.getRecentProviders(),
        dashboard.getActivityFeed(),
        dashboard.getPendingActions(),
        users.getUserStats(),
      ]);

      // stats
      const raw = statsRes.data;
      if (raw && typeof raw === 'object') setStats(raw);

// providers
      const rawP = providersRes.data;
      if (Array.isArray(rawP)) {
        setProvidersList(rawP.map(p => ({
          id:         p.id || p.providerId || 0,
          name:       p.fullName || p.name || p.email || 'Unknown',
          service:    p.serviceType || p.service || 'N/A',
          location:   p.serviceArea || p.location || 'N/A',
          experience: p.experience && p.experience > 0 ? `${p.experience} years` : (p.experience || 'New'),
          applied:    fmtDate(p.createdAt || p.memberSince || p.applied),
          status:     p.isVerified === true ? 'Approved' : 'Pending',
          phone:      p.phone || '',
        })));
      } else {
        setProvidersList(defaultProviders());
      }

      // activities
      const rawA = activityRes.data;
      if (Array.isArray(rawA)) {
        setActivities(rawA.map(a => ({
          type:   a.action || a.type || 'app',
          text:   fmtAction(a.action || a.text),
          detail: a.details || a.detail || fmtDate(a.timestamp),
        })));
      } else {
        setActivities(defaultActivities());
      }

      // pending count
      const pd = pendingRes.data;
      if (pd && typeof pd === 'object') {
        setPendingCount(
          (pd.pendingProviders?.length || 0) +
          (pd.unresolvedReports?.length || 0) +
          (pd.pendingDisputes?.length || 0)
        );
      }

      // platform stats
      const us = usersRes.data;
      if (us && typeof us === 'object') {
        setPlatformStats([
          { label: 'User Growth',    value: fmt(us.newUsersThisMonth || us.totalUsers || 0), sub: 'New users this month', pct: 75, color: 'bg-green-500' },
          { label: 'Jobs Completed', value: fmt(us.completedJobs || 342),                   sub: 'This month',           pct: 85, color: 'bg-blue-500' },
          { label: 'Average Rating', value: '4.7/5',                                        sub: 'Platform average',      pct: 94, color: 'bg-yellow-500' },
]);
      }
      setError('');
} catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.detail || 'Failed to load dashboard data from server');
      
      // Use fallback data to show something on the dashboard
      const defaultData = defaultProviders();
      setProvidersList(defaultData);
      setActivities(defaultActivities());
      setPlatformStats([
        { label: 'User Growth', value: '+7', sub: 'New users this month', pct: 75, color: 'bg-green-500' },
        { label: 'Jobs Completed', value: '15', sub: 'This month', pct: 85, color: 'bg-blue-500' },
        { label: 'Average Rating', value: '4.2/5', sub: 'Platform average', pct: 84, color: 'bg-yellow-500' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ── approve/reject handlers ──
  const handleApprove = async (providerId) => {
    try {
      setActionLoading(providerId);
      await providerVerification.approveProvider(providerId);
      // Refresh the data after approval
      fetchDashboardData();
    } catch (err) {
      setError('Failed to approve provider: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (providerId) => {
    try {
      setActionLoading(providerId);
      await providerVerification.rejectProvider(providerId);
      // Refresh the data after rejection
      fetchDashboardData();
    } catch (err) {
      setError('Failed to reject provider: ' + (err.response?.data?.detail || err.message));
    } finally {
      setActionLoading(null);
    }
  };

  // ── derived values ──
  const totalUsers      = stats ? fmt(stats.totalUsers      || providersList.length + 1) : String(providersList.length + 1);
  const totalProviders  = stats ? fmt(stats.totalProviders  || providersList.length) : String(providersList.length);
  const activeServices  = stats ? fmt(stats.activeServices  || pendingCount) : String(pendingCount);
  const totalReports    = stats ? fmt(stats.totalReports    || 0) : '0';
  const pendingProviders = providersList.filter(p => p.status === 'Pending').length;
  const approvedProviders = providersList.filter(p => p.status === 'Approved').length;

  // Use consistent pending count for badge
  const badgeCount = pendingProviders;

  // ── loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // ── render ──
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* ── Sidebar ── */}
      <Sidebar pendingProviders={badgeCount} pendingReports={stats?.totalReports || 0} />

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Dashboard</h1>
              <p className="text-gray-500">Monitor platform activity and manage operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="text-lg font-bold text-gray-900">Admin</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">

          {/* Error banner */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">+12%</span>
                <span className="text-gray-400">this month</span>
              </div>
            </div>

            {/* Total Providers */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Providers</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProviders}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-green-600 font-semibold">+8%</span>
                <span className="text-gray-400">this month</span>
              </div>
            </div>

            {/* Active Jobs */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{activeServices}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Updated 5 min ago</span>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/admin-reports" className="text-sm text-red-600 font-semibold hover:underline">
                  Review Now →
                </Link>
              </div>
            </div>
          </div>

          {/* ── Pending Actions Banner ── */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Pending Actions Required</h2>
                <p className="text-lg opacity-90">
                  {pendingProviders > 0
                    ? `${pendingProviders} provider application${pendingProviders !== 1 ? 's' : ''} awaiting verification`
                    : pendingCount > 0
                      ? `${pendingCount} item${pendingCount !== 1 ? 's' : ''} awaiting action`
                      : 'No pending actions at this time'}
                </p>
              </div>
              <Link to="/admin-verification">
                <button className="bg-white text-orange-600 hover:bg-gray-50 font-semibold px-8 py-3 text-base rounded-xl shadow-md flex items-center gap-2 transition-colors">
                  <CheckCircle className="w-5 h-5" />
                  Review Applications
                </button>
              </Link>
            </div>
          </div>

          {/* ── Recent Provider Registrations ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-gray-900">Recent Provider Registrations</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                  <span className="text-gray-500">Pending: {pendingProviders}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-gray-500">Approved: {approvedProviders}</span>
                </div>
                <Link to="/admin-verification" className="text-blue-500 hover:underline font-medium text-sm">
                  View All
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Provider Name', 'Service Type', 'Location', 'Experience', 'Application Date', 'Status', 'Actions'].map(h => (
                        <th key={h} className="text-left px-6 py-4 text-sm font-semibold text-gray-700">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {providersList.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white font-bold">
                              {p.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{p.name}</p>
                              {p.phone && <p className="text-xs text-gray-400">{p.phone}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                            {p.service}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">{p.location}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.experience}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{p.applied}</td>
                        <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-400">—</span>
                        </td>
                      </tr>
                    ))}
                    {providersList.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No providers found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── Platform Statistics ── */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(platformStats.length > 0
                ? platformStats
                : [
                    { label: 'User Growth',    value: '+156', sub: 'New users this month', pct: 75, color: 'bg-green-500' },
                    { label: 'Jobs Completed', value: '342',  sub: 'This month',           pct: 85, color: 'bg-blue-500' },
                    { label: 'Average Rating', value: '4.7/5',sub: 'Platform average',     pct: 94, color: 'bg-yellow-500' },
                  ]
              ).map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{s.label}</h3>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{s.value}</p>
                  <p className="text-sm text-gray-400">{s.sub}</p>
                  <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-gray-100">
                {(activities.length > 0 ? activities : defaultActivities()).map((a, i) => (
                  <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                    {getActivityIcon(a.type)}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{a.text}</p>
                      <p className="text-sm text-gray-400">{a.detail}</p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="p-12 text-center text-gray-400">No recent activity</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}