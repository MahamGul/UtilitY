import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Shield, CheckCircle, BarChart3, LogOut, Wrench, User } from 'lucide-react';
import { providerVerification } from '../services/api';

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
        <SideLink to="/admin-dashboard"    icon={BarChart3}    label="Dashboard" />
        <SideLink to="/admin-verification" icon={CheckCircle}  label="Provider Verification" badge={pendingProviders} badgeColor="bg-amber-500" active />
        <SideLink to="/admin-reports"      icon={AlertCircle}  label="Customer Reports"      badge={pendingReports}   badgeColor="bg-red-500" />
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

export default function ServiceProviderVerification() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState('');

  const getDefaultProviders = () => [
    { id: 1, name: 'Ali Raza',      title: 'Professional plumber with 5 years of experience',          service: 'Plumbing',   phone: '+92 321 0234567', location: 'Gulberg, Lahore',     experience: '5 years', applied: 'Dec 28, 2024', status: 'Pending',  avatar: 'A' },
    { id: 2, name: 'Kamran Sheikh', title: 'Experienced electrician specializing in home installations', service: 'Electrical', phone: '+92 300 9876543', location: 'DHA Phase 5, Lahore', experience: '3 years', applied: 'Dec 28, 2024', status: 'Pending',  avatar: 'K' },
    { id: 3, name: 'Fahad Ahmed',   title: 'Skilled carpenter with expertise in custom furniture',       service: 'Carpentry',  phone: '+92 333 0556444', location: 'Model Town, Lahore',  experience: '7 years', applied: 'Dec 27, 2024', status: 'Pending',  avatar: 'F' },
    { id: 4, name: 'Asim Khan',     title: 'Professional plumber with 4 years of experience',           service: 'Plumbing',   phone: '+92 345 111222',  location: 'Bahria Town, Lahore', experience: '4 years', applied: 'Dec 27, 2024', status: 'Approved', avatar: 'A' },
    { id: 5, name: 'Tariq Mahmood', title: 'AC technician with expertise in all major brands',           service: 'AC Repair',  phone: '+92 300 444555',  location: 'Johar Town, Lahore',  experience: '6 years', applied: 'Dec 26, 2024', status: 'Approved', avatar: 'T' },
    { id: 6, name: 'Naveed Malik',  title: 'Electrician with basic residential experience',              service: 'Electrical', phone: '+92 333 666777',  location: 'Cantt, Lahore',       experience: '2 years', applied: 'Dec 26, 2024', status: 'Rejected', avatar: 'N' },
  ];

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await providerVerification.getAllProviders();
      const data = Array.isArray(res.data) ? res.data : (res.data?.providers || getDefaultProviders());
      setAllProviders(data.map(p => ({
        id:         p.id || p.providerId || 0,
        name:       p.fullName || p.name || p.email || 'Unknown',
        title:      p.serviceType || 'Not specified',
        service:    p.serviceType || 'Not specified',
        phone:      p.phone || '',
        location:   p.serviceArea || 'Not specified',
        experience: p.experience && p.experience > 0 ? `${p.experience} years` : (p.experience || 'New'),
        applied:    p.createdAt || p.memberSince || 'Recently',
        status:     p.isVerified === true ? 'Approved' : 'Pending',
        avatar:     (p.fullName || p.email || 'U').charAt(0).toUpperCase(),
      })));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load providers');
      setAllProviders(getDefaultProviders());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProviders(); }, [fetchProviders]);

  const handleApprove = async (id) => {
    try { await providerVerification.approveProvider(id); fetchProviders(); }
    catch { setError('Failed to approve provider'); }
  };
  const handleReject = async (id) => {
    try { await providerVerification.rejectProvider(id); fetchProviders(); }
    catch { setError('Failed to reject provider'); }
  };

  const stats = [
    { label: 'Pending',  value: allProviders.filter(p => p.status === 'Pending').length,  bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-600',  icon: '⏳' },
    { label: 'Approved', value: allProviders.filter(p => p.status === 'Approved').length, bg: 'bg-teal-50',   border: 'border-teal-200',  text: 'text-teal-600',   icon: '✅' },
    { label: 'Rejected', value: allProviders.filter(p => p.status === 'Rejected').length, bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-600',    icon: '❌' },
  ];

  const filtered  = filterStatus === 'All' ? allProviders : allProviders.filter(p => p.status === filterStatus);
  const pendingCt = stats[0].value;

  const statusStyle = {
    Pending:  { card: 'border-amber-200', badge: 'bg-amber-50 text-amber-700 border border-amber-200', bar: 'bg-amber-400' },
    Approved: { card: 'border-teal-200',  badge: 'bg-teal-50 text-teal-700 border border-teal-200',   bar: 'bg-teal-500'  },
    Rejected: { card: 'border-red-200',   badge: 'bg-red-50 text-red-700 border border-red-200',      bar: 'bg-red-400'   },
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-100"><Wrench className="w-7 h-7 text-white" /></div>
        <Loader className="w-7 h-7 text-teal-500 animate-spin mt-1" />
        <p className="text-gray-500 font-medium text-sm">Loading providers...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar pendingProviders={pendingCt} pendingReports={0} />

      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">Provider Verification</h1>
              <p className="text-gray-400 text-sm mt-0.5">Review and approve service provider applications</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Pending Applications</p>
              <p className="text-3xl font-extrabold text-amber-500">{pendingCt}</p>
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
            {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  filterStatus === s ? 'bg-teal-500 text-white shadow-md shadow-teal-100' : 'bg-white text-gray-600 border border-gray-200 hover:border-teal-300 hover:text-teal-600'
                }`}>{s}</button>
            ))}
          </div>

          {/* Cards */}
          <div className="space-y-4">
            {filtered.map(p => {
              const st = statusStyle[p.status] || statusStyle.Pending;
              return (
                <div key={p.id} className={`bg-white rounded-2xl border-2 ${st.card} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
                  {/* Colored top bar */}
                  <div className={`h-1 ${st.bar}`} />
                  <div className="p-6">
                    {/* Provider info row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-md shadow-teal-100">
                          {p.avatar}
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-gray-900">{p.name}</h3>
                          <p className="text-gray-500 text-sm mt-0.5">{p.title}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${st.badge}`}>{p.status}</span>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                      {[['Service Type', p.service], ['Phone', p.phone], ['Location', p.location], ['Experience', p.experience]].map(([l, v]) => (
                        <div key={l} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 font-medium mb-0.5">{l}</p>
                          <p className="text-sm font-semibold text-gray-900 truncate">{v || '—'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 rounded-xl px-3 py-2 mb-5 inline-block">
                      <p className="text-xs text-gray-400">Applied Date</p>
                      <p className="text-sm font-semibold text-gray-900">{p.applied}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button onClick={() => handleApprove(p.id)}
                        className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-sm shadow-teal-100">
                        ✅ Approve
                      </button>
                      <button onClick={() => handleReject(p.id)}
                        className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all hover:-translate-y-0.5">
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
              <User className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="text-lg font-extrabold text-gray-600">No {filterStatus === 'All' ? '' : filterStatus.toLowerCase()} providers</p>
              <p className="text-gray-400 text-sm mt-1">Check back later for new applications.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}