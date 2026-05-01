import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Shield, CheckCircle, BarChart3, LogOut } from 'lucide-react';
import { providerVerification } from '../services/api';

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ pendingProviders = 0, pendingReports = 0 }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    navigate('/login');
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
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors"
        >
          <BarChart3 className="w-5 h-5" />
          Dashboard
        </Link>

        <Link
          to="/admin-verification"
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-gray-900 font-medium transition-colors"
        >
          <CheckCircle className="w-5 h-5 text-blue-500" />
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

export default function ServiceProviderVerification() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await providerVerification.getAllProviders();
      // Backend returns array directly, not {providers: [...]}
      const providersData = Array.isArray(response.data) ? response.data : (response.data?.providers || getDefaultProviders());
      // Map backend data to frontend format
      const mappedProviders = providersData.map(p => ({
        id: p.id || p.providerId || 0,
        name: p.fullName || p.name || p.email || 'Unknown',
        title: p.serviceType || 'N/A',
        service: p.serviceType || 'N/A',
        phone: p.phone || '',
        location: p.serviceArea || 'N/A',
        experience: p.experience && p.experience > 0 ? `${p.experience} years` : (p.experience || 'New'),
        applied: p.createdAt || p.memberSince || 'N/A',
        status: p.isVerified === true ? 'Approved' : 'Pending',
        avatar: (p.fullName || p.email || 'U').charAt(0).toUpperCase()
      }));
      setAllProviders(mappedProviders);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load providers');
      console.error('Fetch error:', err);
      setAllProviders(getDefaultProviders());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const getDefaultProviders = () => [
    { id: 1, name: 'Ali Raza',      service: 'Plumbing',   location: 'Gulberg, Lahore',      experience: '5 years', applied: 'Dec 28, 2024', status: 'Pending', phone: '+92 321 0234567', title: 'Professional plumber with 5 years of experience' },
    { id: 2, name: 'Kamran Sheikh', service: 'Electrical', location: 'DHA Phase 5, Lahore',  experience: '3 years', applied: 'Dec 28, 2024', status: 'Pending', phone: '+92 300 9876543', title: 'Experienced electrician specializing in home installations' },
    { id: 3, name: 'Fahad Ahmed',   service: 'Carpentry',  location: 'Model Town, Lahore',   experience: '7 years', applied: 'Dec 27, 2024', status: 'Pending', phone: '+92 333 0556444', title: 'Skilled carpenter with expertise in custom furniture' },
    { id: 4, name: 'Asim Khan',     service: 'Plumbing',   location: 'Bahria Town, Lahore',  experience: '4 years', applied: 'Dec 27, 2024', status: 'Approved', phone: '+92 345 111222', title: 'Professional plumber with 4 years of experience' },
    { id: 5, name: 'Tariq Mahmood', service: 'AC Repair',  location: 'Johar Town, Lahore',   experience: '6 years', applied: 'Dec 26, 2024', status: 'Approved', phone: '+92 300 444555', title: 'AC technician with expertise in all major brands' },
    { id: 6, name: 'Naveed Malik',  service: 'Electrical', location: 'Cantt, Lahore',        experience: '2 years', applied: 'Dec 26, 2024', status: 'Rejected', phone: '+92 333 666777', title: 'Electrician with basic residential experience' },
  ];

  const stats = [
    { label: 'Pending', value: allProviders.filter(p => p.status === 'Pending').length, color: 'bg-yellow-50', icon: '⏳' },
    { label: 'Approved', value: allProviders.filter(p => p.status === 'Approved').length, color: 'bg-green-50', icon: '✅' },
    { label: 'Rejected', value: allProviders.filter(p => p.status === 'Rejected').length, color: 'bg-red-50', icon: '❌' }
  ];

  const filteredProviders = filterStatus === 'All' 
    ? allProviders 
    : allProviders.filter(p => p.status === filterStatus);

  const handleApprove = async (providerId) => {
    try {
      await providerVerification.approveProvider(providerId);
      fetchProviders();
    } catch (err) {
      setError('Failed to approve provider');
    }
  };

  const handleReject = async (providerId) => {
    try {
      await providerVerification.rejectProvider(providerId);
      fetchProviders();
    } catch (err) {
      setError('Failed to reject provider');
    }
  };

const pendingCount = allProviders.filter(p => p.status === 'Pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar pendingProviders={pendingCount} pendingReports={0} />
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-6">
<div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Service Provider Verification</h1>
              <p className="text-gray-600">Review and approve provider applications</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Pending Applications</p>
              <p className="text-3xl font-bold text-orange-500">{stats[0].value}</p>
            </div>
          </div>
        </header>

        {error && (
          <div className="max-w-7xl mx-auto px-6 py-4 bg-red-50 border border-red-200 rounded-lg my-4 flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.color} border border-gray-200 rounded-lg p-6`}>
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mb-8">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition ${
                filterStatus === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredProviders.map((provider) => (
            <div key={provider.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-yellow-400">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {provider.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{provider.title}</p>
                  </div>
                </div>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {provider.status}
                </span>
              </div>

<div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Service Type</p>
                    <p className="font-semibold text-gray-900">{provider.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Phone</p>
                    <p className="font-semibold text-gray-900 text-sm">{provider.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{provider.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Experience</p>
                    <p className="font-semibold text-gray-900">{provider.experience}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-600 text-xs font-medium mb-1">Applied Date</p>
                  <p className="font-semibold text-gray-900">{provider.applied}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                  👁️ View Details
                </button>
                <button onClick={() => handleApprove(provider.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                  ✅ Approve
                </button>
                <button onClick={() => handleReject(provider.id)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>

{filteredProviders.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No {filterStatus.toLowerCase()} providers to display</p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
