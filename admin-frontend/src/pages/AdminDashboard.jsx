import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Loader, AlertCircle, Shield, Users, Wrench, ClipboardList,
  TrendingUp, CheckCircle, Clock, Eye, LogOut, BarChart3, XCircle,
} from 'lucide-react';
import { dashboard, users, providerVerification } from '../services/api';

/* ── Shared sidebar ── */
function Sidebar({ pendingProviders = 0, pendingReports = 0 }) {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('adminUser'); navigate('/admin-login'); };
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-sm shrink-0 min-h-screen">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 block leading-tight">Utilit<span className="text-teal-500">Y</span></span>
            <span className="text-[10px] text-gray-400 tracking-wide uppercase">Admin Portal</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <SideLink to="/admin-dashboard" icon={BarChart3} label="Dashboard" active />
        <SideLink to="/admin-verification" icon={CheckCircle} label="Provider Verification" badge={pendingProviders} badgeColor="bg-amber-500" />
        <SideLink to="/admin-reports" icon={AlertCircle} label="Customer Reports" badge={pendingReports} badgeColor="bg-red-500" />
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-500 hover:bg-red-50 font-medium text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );
}

function SideLink({ to, icon: Icon, label, active, badge, badgeColor = 'bg-teal-500' }) {
  return (
    <Link to={to} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-teal-50 text-teal-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
      <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-500' : ''}`} />
      <span className="flex-1">{label}</span>
      {badge > 0 && <span className={`${badgeColor} text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center`}>{badge}</span>}
    </Link>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending:  'bg-amber-50 text-amber-700 border border-amber-200',
    Approved: 'bg-teal-50 text-teal-700 border border-teal-200',
    Rejected: 'bg-red-50 text-red-700 border border-red-200',
  };
  return <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>;
}

function getActivityIcon(type) {
  const map = {
    provider_approved: { bg: 'bg-teal-100',   el: <CheckCircle className="w-5 h-5 text-teal-600" /> },
    provider_rejected: { bg: 'bg-red-100',    el: <XCircle className="w-5 h-5 text-red-600" /> },
    report_resolved:   { bg: 'bg-blue-100',   el: <ClipboardList className="w-5 h-5 text-blue-600" /> },
    report_escalated:  { bg: 'bg-orange-100', el: <AlertCircle className="w-5 h-5 text-orange-600" /> },
    user:              { bg: 'bg-purple-100', el: <Users className="w-5 h-5 text-purple-600" /> },
    provider:          { bg: 'bg-amber-100',  el: <Clock className="w-5 h-5 text-amber-600" /> },
    app:               { bg: 'bg-gray-100',   el: <ClipboardList className="w-5 h-5 text-gray-600" /> },
  };
  const { bg, el } = map[type] || map.app;
  return <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center shrink-0`}>{el}</div>;
}

function StatCard({ icon, iconBg, iconColor, label, value, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 ${iconBg} rounded-xl flex items-center justify-center`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats]                 = useState(null);
  const [providersList, setProvidersList] = useState([]);
  const [platformStats, setPlatformStats] = useState([]);
  const [activities, setActivities]       = useState([]);
  const [pendingCount, setPendingCount]   = useState(0);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => { fetchDashboardData(); }, []);

  const fmt     = (n) => (n != null ? Number(n).toLocaleString() : '0');
  const fmtDate = (d) => {
    if (!d) return '-';
    try { const dt = new Date(d); return isNaN(dt) ? d : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };
  const fmtAction = (a) => ({ provider_approved: 'New provider approved', provider_rejected: 'Provider application rejected', report_resolved: 'Report resolved', report_escalated: 'Report escalated' }[a] || a || 'Activity');

  const defaultProviders = () => [
    { id: 1, name: 'Ali Raza',      service: 'Plumbing',   location: 'Gulberg, Lahore',     experience: '5 years', applied: 'Dec 28, 2024', status: 'Pending' },
    { id: 2, name: 'Kamran Sheikh', service: 'Electrical', location: 'DHA Phase 5, Lahore', experience: '3 years', applied: 'Dec 28, 2024', status: 'Pending' },
    { id: 3, name: 'Fahad Ahmed',   service: 'Carpentry',  location: 'Model Town, Lahore',  experience: '7 years', applied: 'Dec 27, 2024', status: 'Pending' },
    { id: 4, name: 'Asim Khan',     service: 'Plumbing',   location: 'Bahria Town, Lahore', experience: '4 years', applied: 'Dec 27, 2024', status: 'Approved' },
    { id: 5, name: 'Tariq Mahmood', service: 'AC Repair',  location: 'Johar Town, Lahore',  experience: '6 years', applied: 'Dec 26, 2024', status: 'Approved' },
    { id: 6, name: 'Naveed Malik',  service: 'Electrical', location: 'Cantt, Lahore',       experience: '2 years', applied: 'Dec 26, 2024', status: 'Rejected' },
  ];

  const defaultActivities = () => [
    { type: 'provider_approved', text: 'New provider approved',         detail: 'Asim Khan - Plumbing • 2 hours ago' },
    { type: 'user',              text: 'New user registration',         detail: 'Sara Ahmed joined as customer • 3 hours ago' },
    { type: 'provider',          text: 'Provider application received', detail: 'Ali Raza - Plumbing • 4 hours ago' },
    { type: 'report_escalated',  text: 'New customer report submitted', detail: 'Report #1245 - Requires review • 5 hours ago' },
    { type: 'app',               text: 'Job completed',                 detail: 'Usman Ahmed completed plumbing job • 6 hours ago' },
  ];

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

      const raw = statsRes.data;
      if (raw && typeof raw === 'object') setStats(raw);

      const rawP = providersRes.data;
      if (Array.isArray(rawP)) {
        setProvidersList(rawP.map(p => ({
          id:         p.id || p.providerId || 0,
          name:       p.fullName || p.name || p.email || 'Unknown',
          service:    p.serviceType || p.service || 'Not specified',
          location:   p.serviceArea || p.location || 'Not specified',
          experience: p.experience && p.experience > 0 ? `${p.experience} years` : (p.experience || 'New'),
          applied:    fmtDate(p.createdAt || p.memberSince || p.applied),
          status:     p.isVerified === true ? 'Approved' : 'Pending',
          phone:      p.phone || '',
        })));
      } else { setProvidersList(defaultProviders()); }

      const rawA = activityRes.data;
      if (Array.isArray(rawA)) {
        setActivities(rawA.map(a => ({ type: a.action || a.type || 'app', text: fmtAction(a.action || a.text), detail: a.details || a.detail || fmtDate(a.timestamp) })));
      } else { setActivities(defaultActivities()); }

      const pd = pendingRes.data;
      if (pd && typeof pd === 'object') setPendingCount((pd.pendingProviders?.length || 0) + (pd.unresolvedReports?.length || 0) + (pd.pendingDisputes?.length || 0));

      const us = usersRes.data;
      if (us && typeof us === 'object') {
        setPlatformStats([
          { label: 'User Growth',    value: fmt(us.newUsersThisMonth || us.totalUsers || 0), sub: 'New users this month', pct: 75, color: 'bg-teal-500' },
          { label: 'Jobs Completed', value: fmt(us.completedJobs || 342),                   sub: 'This month',           pct: 85, color: 'bg-blue-500' },
          { label: 'Average Rating', value: '4.7/5',                                        sub: 'Platform average',     pct: 94, color: 'bg-amber-500' },
        ]);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data from server');
      setProvidersList(defaultProviders());
      setActivities(defaultActivities());
      setPlatformStats([
        { label: 'User Growth',    value: '+7',    sub: 'New users this month', pct: 75, color: 'bg-teal-500' },
        { label: 'Jobs Completed', value: '15',    sub: 'This month',           pct: 85, color: 'bg-blue-500' },
        { label: 'Average Rating', value: '4.2/5', sub: 'Platform average',     pct: 84, color: 'bg-amber-500' },
      ]);
    } finally { setLoading(false); }
  };

  const handleApprove = async (id) => {
    try { setActionLoading(id); await providerVerification.approveProvider(id); fetchDashboardData(); }
    catch (err) { setError('Failed to approve provider: ' + (err.response?.data?.detail || err.message)); }
    finally { setActionLoading(null); }
  };
  const handleReject = async (id) => {
    try { setActionLoading(id); await providerVerification.rejectProvider(id); fetchDashboardData(); }
    catch (err) { setError('Failed to reject provider: ' + (err.response?.data?.detail || err.message)); }
    finally { setActionLoading(null); }
  };

  const totalUsers       = stats ? fmt(stats.totalUsers      || providersList.length + 1) : String(providersList.length + 1);
  const totalProviders   = stats ? fmt(stats.totalProviders  || providersList.length)     : String(providersList.length);
  const activeServices   = stats ? fmt(stats.activeServices  || pendingCount)             : String(pendingCount);
  const totalReports     = stats ? fmt(stats.totalReports    || 0)                        : '0';
  const pendingProviders = providersList.filter(p => p.status === 'Pending').length;
  const approvedProviders = providersList.filter(p => p.status === 'Approved').length;
  const badgeCount       = pendingProviders;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-100">
          <Wrench className="w-7 h-7 text-white" />
        </div>
        <Loader className="w-7 h-7 text-teal-500 animate-spin mt-1" />
        <p className="text-gray-500 font-medium text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar pendingProviders={badgeCount} pendingReports={stats?.totalReports || 0} />

      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-400 text-sm mt-0.5">Monitor platform activity and manage operations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Logged in as</p>
                <p className="font-extrabold text-gray-900">Admin</p>
              </div>
              <div className="w-11 h-11 bg-teal-500 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-teal-100">A</div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">

          {/* Error */}
          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 items-start">
              <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <p className="text-amber-800 text-sm">{error}</p>
            </div>
          )}

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard icon={<Users size={22} />}        iconBg="bg-blue-100"   iconColor="text-blue-600"   label="Total Users"      value={totalUsers}>
              <TrendingUp className="w-4 h-4 text-teal-500" /><span className="text-teal-600 font-semibold">+12%</span><span className="text-gray-400">this month</span>
            </StatCard>
            <StatCard icon={<Wrench size={22} />}       iconBg="bg-teal-100"   iconColor="text-teal-600"   label="Total Providers"  value={totalProviders}>
              <TrendingUp className="w-4 h-4 text-teal-500" /><span className="text-teal-600 font-semibold">+8%</span><span className="text-gray-400">this month</span>
            </StatCard>
            <StatCard icon={<ClipboardList size={22} />} iconBg="bg-green-100" iconColor="text-green-600"  label="Active Jobs"      value={activeServices}>
              <Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-400">Updated 5 min ago</span>
            </StatCard>
            <StatCard icon={<AlertCircle size={22} />}  iconBg="bg-red-100"    iconColor="text-red-600"    label="Reports"          value={totalReports}>
              <Link to="/admin-reports" className="text-teal-500 font-semibold text-sm hover:underline">Review Now →</Link>
            </StatCard>
          </div>

          {/* ── Pending Banner ── */}
          <div className="rounded-2xl p-8 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)' }}>
            <div className="flex items-center justify-between gap-6 flex-wrap">
              <div>
                <h2 className="text-2xl font-extrabold">Pending Actions Required</h2>
                <p className="text-teal-50 mt-1 text-sm">
                  {pendingProviders > 0
                    ? `${pendingProviders} provider application${pendingProviders !== 1 ? 's' : ''} awaiting verification`
                    : pendingCount > 0 ? `${pendingCount} item${pendingCount !== 1 ? 's' : ''} awaiting action`
                    : 'No pending actions at this time'}
                </p>
              </div>
              <Link to="/admin-verification">
                <button className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-6 py-2.5 rounded-full shadow-md text-sm transition-all hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap">
                  <CheckCircle size={15} /> Review Applications
                </button>
              </Link>
            </div>
          </div>

          {/* ── Provider Registrations ── */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-extrabold text-gray-900">Recent Provider Registrations</h2>
              <div className="flex items-center gap-5 text-sm">
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />Pending: {pendingProviders}</span>
                <span className="flex items-center gap-1.5 text-gray-500"><span className="w-2.5 h-2.5 bg-teal-500 rounded-full" />Approved: {approvedProviders}</span>
                <Link to="/admin-verification" className="text-teal-500 hover:underline font-semibold">View All</Link>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Provider Name', 'Service Type', 'Location', 'Experience', 'Applied Date', 'Status'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {providersList.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-teal-100">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                            {p.phone && <p className="text-xs text-gray-400">{p.phone}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-semibold">{p.service}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.location === 'N/A' ? 'Not specified' : p.location}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{p.experience}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.applied}</td>
                      <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                  {providersList.length === 0 && (
                    <tr><td colSpan={6} className="px-6 py-16 text-center text-gray-400">No providers found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Platform Stats ── */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(platformStats.length > 0 ? platformStats : [
                { label: 'User Growth',    value: '+156', sub: 'New users this month', pct: 75, color: 'bg-teal-500' },
                { label: 'Jobs Completed', value: '342',  sub: 'This month',           pct: 85, color: 'bg-blue-500' },
                { label: 'Average Rating', value: '4.7/5',sub: 'Platform average',     pct: 94, color: 'bg-amber-500' },
              ]).map((s, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-gray-900">{s.label}</h3>
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                  </div>
                  <p className="text-3xl font-extrabold text-gray-900 mb-0.5">{s.value}</p>
                  <p className="text-sm text-gray-400 mb-4">{s.sub}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full transition-all`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Recent Activity ── */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-5">Recent Activity</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
              {(activities.length > 0 ? activities : defaultActivities()).map((a, i) => (
                <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  {getActivityIcon(a.type)}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.detail}</p>
                  </div>
                </div>
              ))}
              {activities.length === 0 && <div className="p-12 text-center text-gray-400">No recent activity</div>}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}