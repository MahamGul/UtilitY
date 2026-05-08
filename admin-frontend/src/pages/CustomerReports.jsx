import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, AlertCircle, Loader, CheckCircle, BarChart3, LogOut, Wrench, FileText } from 'lucide-react';
import { customerReports, providerVerification } from '../services/api';

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
        <SideLink to="/admin-dashboard"    icon={BarChart3}   label="Dashboard" />
        <SideLink to="/admin-verification" icon={CheckCircle} label="Provider Verification" badge={pendingProviders} badgeColor="bg-amber-500" />
        <SideLink to="/admin-reports"      icon={AlertCircle} label="Customer Reports"      badge={pendingReports}   badgeColor="bg-red-500" active />
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

export default function CustomerReports() {
  const [filterStatus, setFilterStatus]             = useState('All');
  const [expandedReport, setExpandedReport]         = useState(null);
  const [allReports, setAllReports]                 = useState([]);
  const [reportStats, setReportStats]               = useState({ pending: 0, resolved: 0, escalated: 0 });
  const [loading, setLoading]                       = useState(true);
  const [error, setError]                           = useState('');
  const [pendingProvidersCount, setPendingProvidersCount] = useState(0);

  const HARD_CODED_REPORTS = [
    { id: 1241, status: 'Pending', category: 'Plumbing', reportDetails: 'Customer reports a persistent leak under the kitchen sink. Intermittent puddling noticed for the past 3 days. Requesting investigation and repair.' },
    { id: 1242, status: 'Resolved', category: 'Electrical', reportDetails: 'Outlet sparks intermittently in the living room. After inspection, wiring was replaced and issue resolved. Customer confirmed safe operation.' },
    { id: 1243, status: 'Escalated', category: 'Carpentry', reportDetails: 'Cabinet hinge installation not aligned; door does not close properly. Escalated for rework assessment and quality review.' },
  ];

  const HARD_CODED_STATS = { pendingReports: 1, resolvedReports: 1, escalatedReports: 1 };

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      // Prefer live API data; fall back to hardcoded data if the API fails.
      const [reportsRes, statsRes] = await Promise.all([
        customerReports.getAllReports(),
        customerReports.getReportStats(),
      ]);

      const liveReports = Array.isArray(reportsRes.data) ? reportsRes.data : [];
      const s = statsRes.data || {};
      const liveStats = {
        pending: s.pendingReports || 0,
        resolved: s.resolvedReports || 0,
        escalated: s.escalatedReports || 0,
      };

      // Even if the API succeeds but returns nothing, show hardcoded data.
      if (liveReports.length === 0) {
        setError('No customer reports found (showing sample data)');
        setAllReports(HARD_CODED_REPORTS);
        setReportStats({
          pending: HARD_CODED_STATS.pendingReports,
          resolved: HARD_CODED_STATS.resolvedReports,
          escalated: HARD_CODED_STATS.escalatedReports,
        });
      } else {
        setAllReports(liveReports);
        setReportStats(liveStats);
      }
    } catch (err) {
      // Hardcoded fallback so the UI still shows meaningful report cards.
      setError(err.response?.data?.detail ? `Failed to load reports: ${err.response.data.detail}` : 'Failed to load reports (showing sample data)');
      setAllReports(HARD_CODED_REPORTS);
      setReportStats({
        pending: HARD_CODED_STATS.pendingReports,
        resolved: HARD_CODED_STATS.resolvedReports,
        escalated: HARD_CODED_STATS.escalatedReports,
      });
    } finally { setLoading(false); }
  }, []);


  const fetchPendingProviders = async () => {
    try {
      const res = await providerVerification.getPendingProviders();
      setPendingProvidersCount(Array.isArray(res.data) ? res.data.length : 0);
    } catch { /* silent */ }
  };

  useEffect(() => { fetchReports(); fetchPendingProviders(); }, [fetchReports]);

  const handleResolve = async (id) => {
    try { await customerReports.resolveReport(id, { resolution: 'Resolved by admin' }); fetchReports(); }
    catch { setError('Failed to resolve report'); }
  };
  const handleEscalate = async (id) => {
    try { await customerReports.escalateReport(id, { escalationDetails: 'Escalated for further investigation' }); fetchReports(); }
    catch { setError('Failed to escalate report'); }
  };

  const stats = [
    { label: 'Pending',   value: reportStats.pending,   bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600',  icon: '⏳' },
    { label: 'Resolved',  value: reportStats.resolved,  bg: 'bg-teal-50',  border: 'border-teal-200',  text: 'text-teal-600',   icon: '✅' },
    { label: 'Escalated', value: reportStats.escalated, bg: 'bg-red-50',   border: 'border-red-200',   text: 'text-red-600',    icon: '⚠️' },
  ];

  const filtered = filterStatus === 'All' ? allReports : allReports.filter(r => r.status === filterStatus);

  const statusStyle = {
    Pending:   { badge: 'bg-amber-50 text-amber-700 border border-amber-200',  bar: 'bg-amber-400' },
    Resolved:  { badge: 'bg-teal-50 text-teal-700 border border-teal-200',     bar: 'bg-teal-500'  },
    Escalated: { badge: 'bg-red-50 text-red-700 border border-red-200',        bar: 'bg-red-500'   },
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-100"><Wrench className="w-7 h-7 text-white" /></div>
        <Loader className="w-7 h-7 text-teal-500 animate-spin mt-1" />
        <p className="text-gray-500 font-medium text-sm">Loading reports...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar pendingProviders={pendingProvidersCount} pendingReports={reportStats.pending} />

      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Customer Reports</h1>
              <p className="text-gray-400 text-sm mt-0.5">Review and resolve customer complaints</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Pending Reports</p>
              <p className="text-3xl font-extrabold text-red-500">{reportStats.pending}</p>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">

          {error && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
              <p className="text-amber-800 text-sm">{error}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            {stats.map((s, i) => (
              <div key={i} className={`${s.bg} border ${s.border} rounded-2xl p-6`}>
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <p className={`text-3xl font-extrabold mt-1 ${s.text}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['All', 'Pending', 'Resolved', 'Escalated'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filterStatus === s ? 'bg-teal-500 text-white shadow-md shadow-teal-100' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600'
                }`}>{s}</button>
            ))}
          </div>

          {/* Report cards */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
                <FileText className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                <p className="text-lg font-extrabold text-gray-600">No Reports Found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {filterStatus === 'All'
                    ? 'There are no customer reports in the system yet.'
                    : `There are no ${filterStatus.toLowerCase()} reports.`}
                </p>
              </div>
            ) : (
              filtered.map(r => {
                const isOpen = expandedReport === r.id;
                const st = statusStyle[r.status] || statusStyle.Pending;
                return (
                  <div key={r.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className={`h-1 ${st.bar}`} />
                    <div className="p-6">
                      {/* Header row */}
                      <button className="w-full text-left" onClick={() => setExpandedReport(isOpen ? null : r.id)}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-11 h-11 bg-teal-50 border-2 border-teal-100 rounded-xl flex items-center justify-center shrink-0">
                              <AlertCircle className="w-5 h-5 text-teal-500" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-3 flex-wrap">
                                <p className="font-extrabold text-gray-900">Report #{r.id}</p>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${st.badge}`}>{r.status}</span>
                              </div>
                              <p className="text-sm text-gray-500 mt-0.5 truncate">{r.category}</p>
                            </div>
                          </div>
                          <div className="shrink-0 ml-4 text-gray-400">
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                      </button>

                      {/* Expanded body */}
                      {isOpen && (
                        <div className="mt-5 pt-5 border-t border-gray-100 space-y-4">
                          <div className="bg-gray-50 rounded-xl p-4">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Report Details</p>
                            <p className="text-gray-700 text-sm leading-relaxed">{r.reportDetails}</p>
                          </div>
                          <div className="flex gap-3">
                            <button onClick={() => handleResolve(r.id)}
                              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-sm shadow-teal-100">
                              ✅ Mark Resolved
                            </button>
                            <button onClick={() => handleEscalate(r.id)}
                              className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm transition-all hover:-translate-y-0.5">
                              ⚠️ Escalate
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}