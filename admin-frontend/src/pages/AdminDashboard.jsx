import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import { dashboard, users } from '../services/api';

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState([]);
  const [providersList, setProvidersList] = useState([]);
  const [platformStatsList, setPlatformStatsList] = useState([]);
  const [activitiesList, setActivitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, providersRes, activityRes, usersRes] = await Promise.all([
        dashboard.getStats(),
        dashboard.getRecentProviders(),
        dashboard.getActivityFeed(),
        users.getUserStats()
      ]);

      setDashboardStats(statsRes.data.stats || getDefaultStats());
      setProvidersList(providersRes.data.providers || getDefaultProviders());
      setActivitiesList(activityRes.data.activities || getDefaultActivities());
      
      // Format platform stats
      setPlatformStatsList([
        { label: 'User Growth', value: usersRes.data.userGrowth || '+156', period: 'this month', icon: '📈', color: 'green' },
        { label: 'Jobs Completed', value: usersRes.data.jobsCompleted || '342', icon: '✅', color: 'blue' },
        { label: 'Average Rating', value: usersRes.data.avgRating || '4.7/5', icon: '⭐', color: 'yellow' }
      ]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard data');
      console.error('Dashboard error:', err);
      setDashboardStats(getDefaultStats());
      setProvidersList(getDefaultProviders());
      setPlatformStatsList(getDefaultPlatformStats());
      setActivitiesList(getDefaultActivities());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultStats = () => [
    { label: 'Popular Verification', value: '1,245', change: '+5%', period: 'this month', icon: '⭐', color: 'bg-yellow-50' },
    { label: 'Unregistered Providers', value: '328', change: '+8%', period: 'this month', icon: '👤', color: 'bg-purple-50' },
    { label: 'New Jobs', value: '87', change: 'No Data', period: 'updated 5 min ago', icon: '💼', color: 'bg-green-50', notice: 'Notice Now -' },
    { label: 'Reports', value: '4', change: '', period: '', icon: '⚠️', color: 'bg-red-50' },
  ];

  const getDefaultProviders = () => [
    { id: 1, name: 'Ali Raza', service: 'Plumbing', location: 'Gulberg Lahore', experience: '5 years', applied: 'Dec 25, 2024', status: 'Pending' },
    { id: 2, name: 'Kamran Sheikh', service: 'Electrical', location: 'DHA Phase 5, Lahore', experience: '5 years', applied: 'Dec 20, 2024', status: 'Pending' },
    { id: 3, name: 'Fahad Ahmed', service: 'Carpentry', location: 'Model Town, Lahore', experience: '7 years', applied: 'Dec 27, 2024', status: 'Pending' },
    { id: 4, name: 'Aslm Khan', service: 'Plumbing', location: 'Bahria Town, Lahore', experience: '4 years', applied: 'Feb 27, 2024', status: 'Approved' },
    { id: 5, name: 'Tariq Mahmood', service: 'AC Repair', location: 'Johar Town, Lahore', experience: '6 years', applied: 'Dec 26, 2024', status: 'Approved' },
    { id: 6, name: 'Naveed Malik', service: 'Electrical', location: 'Canal Road, Lahore', experience: '2 years', applied: 'Dec 28, 2024', status: 'Rejected' }
  ];

  const getDefaultPlatformStats = () => [
    { label: 'User Growth', value: '+156', period: 'this month', icon: '📈', color: 'green' },
    { label: 'Jobs Completed', value: '342', icon: '✅', color: 'blue' },
    { label: 'Average Rating', value: '4.7/5', icon: '⭐', color: 'yellow' }
  ];

  const getDefaultActivities = () => [
    { type: 'provider', text: 'New provider approved', detail: 'Aslm Khan - Plumbing - 3 hours ago' },
    { type: 'user', text: 'New user registration', detail: 'Saad Ahmad added as customer - 1 hours ago' },
    { type: 'app', text: 'Provider application received', detail: 'Amirjan - 2 hours ago' },
    { type: 'report', text: 'New customer report submitted', detail: 'Report #4245 - Requires action - 1 hours ago' },
    { type: 'job', text: 'Job completed', detail: 'Amirjan Services - Completed plumbing job - 4 hours ago' }
  ];

  const getActivityIcon = (type) => {
    const icons = { provider: '✅', user: '👤', app: '📝', report: '⚠️', job: '💼' };
    return icons[type] || '📌';
  };

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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Monitor platform activity and manage operations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Logged in as</span>
            <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">A</div>
            <span className="text-gray-700">Admin</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto px-6 py-4 bg-yellow-50 border border-yellow-200 rounded-lg my-4 flex gap-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, idx) => (
            <div key={idx} className={`${stat.color} border border-gray-200 rounded-lg p-5`}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{stat.icon}</span>
                {stat.notice && <span className="text-red-600 text-xs font-semibold">{stat.notice}</span>}
              </div>
              <h3 className="text-gray-700 text-sm font-medium">{stat.label}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                {stat.change && <span className="text-green-600 text-sm">{stat.change}</span>}
              </div>
              <p className="text-gray-600 text-xs mt-2">{stat.period}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-400 rounded-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold">Pending Actions Required</h3>
              <p className="text-sm opacity-90">5 provider applications awaiting verification</p>
            </div>
            <button className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100">
              Review Applications
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Provider Registrations</h2>
              <div className="flex gap-2">
                <span className="text-yellow-600 text-sm font-semibold">• Pending</span>
                <span className="text-green-600 text-sm font-semibold">3 Approved</span>
                <span className="text-gray-600 text-sm font-semibold">View All</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Provider Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Service Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Experience</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Application Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {providersList.map((provider) => (
                  <tr key={provider.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {provider.name.charAt(0)}
                        </div>
                        <span className="font-medium text-gray-900">{provider.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{provider.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{provider.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{provider.experience}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{provider.applied}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-3 py-1 rounded ${
                        provider.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        provider.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm">👁️ View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {platformStatsList.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-gray-600 font-medium">{stat.label}</h3>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
              {stat.period && <p className="text-sm text-gray-500">{stat.period}</p>}
              <div className="mt-4 h-1 bg-gray-200 rounded">
                <div className={`h-full w-3/4 bg-${stat.color}-500 rounded`}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {activitiesList.map((activity, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 flex gap-4">
                <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.text}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
