import React, { useState, useEffect, useCallback } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { providerVerification } from '../services/api';

export default function ServiceProviderVerification() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [allProviders, setAllProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProviders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await providerVerification.getAllProviders();
      setAllProviders(response.data.providers || getDefaultProviders());
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
    {
      id: 1,
      name: 'Ali Roza',
      title: 'Professional plumber with 5 years of experience in residential and commercial plumbing',
      service: 'Plumbing',
      phone: '+92 321 0234567',
      location: 'Gulberg, Lahore',
      experience: '5 years',
      applied: 'Dec 28, 2024',
      status: 'Pending',
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Kamran Sheikh',
      title: 'Experienced electrician specializing in home and office electrical installations',
      service: 'Electrical',
      phone: '+92 300 9876543',
      location: 'DHA Phase 5, Lahore',
      experience: '5 years',
      applied: 'Dec 28, 2024',
      status: 'Pending',
      avatar: 'K'
    },
    {
      id: 3,
      name: 'Fahad Ahmed',
      title: 'Skilled carpenter with expertise in custom furniture and woodwork',
      service: 'Carpentry',
      phone: '+92 333 0556444',
      location: 'Model Town, Lahore',
      experience: '7 years',
      applied: 'Dec 27, 2024',
      status: 'Pending',
      avatar: 'F'
    },
    {
      id: 4,
      name: 'Jawad Ali',
      title: 'Professional AC technician with experience in all major brands',
      service: 'AC Repair',
      phone: '+92 345 7778888',
      location: 'Johar Town, Lahore',
      experience: '4 years',
      applied: 'Dec 27, 2024',
      status: 'Pending',
      avatar: 'J'
    },
    {
      id: 5,
      name: 'Rizwan Khan',
      title: 'Experienced painter with expertise in interior and exterior painting',
      service: 'Painting',
      phone: '+92 300 223333',
      location: 'Bahria Town, Lahore',
      experience: '6 years',
      applied: 'Dec 26, 2024',
      status: 'Pending',
      avatar: 'R'
    }
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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
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
        </div>
      </div>

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
                    <p className="text-gray-600 text-xs font-medium mb-1">📞 Phone</p>
                    <p className="font-semibold text-gray-900 text-sm">{provider.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">📍 Location</p>
                    <p className="font-semibold text-gray-900">{provider.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">⏰ Experience</p>
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
    </div>
  );
}
