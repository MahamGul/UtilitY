import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, AlertCircle, Loader } from 'lucide-react';
import { customerReports } from '../services/api';

export default function CustomerReports() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedReport, setExpandedReport] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [reportStats, setReportStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const [reportsRes, statsRes] = await Promise.all([
        customerReports.getAllReports(),
        customerReports.getReportStats()
      ]);

      setAllReports(reportsRes.data.reports || getDefaultReports());
      setReportStats(statsRes.data || {
        pending: 4,
        resolved: 1,
        escalated: 1
      });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load reports');
      console.error('Fetch error:', err);
      setAllReports(getDefaultReports());
      setReportStats({ pending: 4, resolved: 1, escalated: 1 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getDefaultReports = () => [
    {
      id: 1243,
      status: 'Escalated',
      priority: 'High Priority',
      category: 'Material Quality',
      reporter: 'Ayesha Raza',
      provider: 'Rizwan Khan',
      serviceType: 'Painting',
      reported: 'Dec 25, 2024 - 3:30 PM',
      reportDetails: 'Provider used substandard materials despite agreeing to use premium quality paint',
      escalationDetails: 'Case forwarded to senior management for investigation.'
    },
    {
      id: 2246,
      status: 'Pending',
      priority: 'Low Priority',
      category: 'Poor Quality',
      reporter: 'Fatima Malik',
      provider: 'Ali Raza',
      serviceType: 'Plumbing',
      reported: 'Dec 24, 2024 - 2:15 PM',
      reportDetails: 'Minor issue in service but provider communicated well and completed the job',
      escalationDetails: '',
      resolution: 'Provider warned. Customer satisfied with first outcome.'
    },
    {
      id: 2247,
      status: 'Pending',
      priority: 'Slightly Risky',
      category: 'Unprofessional Behavior',
      reporter: 'Rizwan Ali',
      provider: 'Kamran Sheikh',
      serviceType: 'Electrical',
      reported: 'Dec 24, 2024 - 4:45 PM',
      reportDetails: 'Provider wide rude and unprofessional. User complaint spoke language when i questioned the quality of work',
      escalationDetails: ''
    },
    {
      id: 2248,
      status: 'Pending',
      priority: 'Slightly Risky',
      category: 'Pricing Issue',
      reporter: 'Saira Khan',
      provider: 'Fahad Ahmed',
      serviceType: 'Carpentry',
      reported: 'Dec 23, 2024 - 4:48 PM',
      reportDetails: 'Provider quoted more than the agreed amount initially quoted. 5,500 charged for 5,000 without an',
      escalationDetails: ''
    }
  ];

  const stats = [
    { label: 'Pending', value: reportStats.pending || 4, color: 'bg-yellow-50', icon: '⏳' },
    { label: 'Resolved', value: reportStats.resolved || 1, color: 'bg-green-50', icon: '✅' },
    { label: 'Escalated', value: reportStats.escalated || 1, color: 'bg-red-50', icon: '⚠️' }
  ];

  const filteredReports = filterStatus === 'All' 
    ? allReports 
    : allReports.filter(r => r.status === filterStatus);

  const getPriorityColor = (priority) => {
    if (priority.includes('High')) return 'bg-red-100 text-red-800';
    if (priority.includes('Slightly')) return 'text-orange-600';
    return 'text-yellow-600';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await customerReports.resolveReport(reportId, { resolution: 'Resolved by admin' });
      fetchReports();
    } catch (err) {
      setError('Failed to resolve report');
    }
  };

  const handleEscalate = async (reportId) => {
    try {
      await customerReports.escalateReport(reportId, { escalationDetails: 'Escalated for further investigation' });
      fetchReports();
    } catch (err) {
      setError('Failed to escalate report');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-600 font-medium">Loading reports...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Customer Reports</h1>
              <p className="text-gray-600">Review and resolve customer complaints and issues</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600 text-sm">Pending Reports</p>
              <p className="text-3xl font-bold text-red-600">{stats[0].value}</p>
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
          {['All', 'Pending', 'Resolved', 'Escalated'].map((status) => (
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
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-red-400">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-2xl mt-1">📋</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">Report #{report.id}</h3>
                        <span className={`text-xs font-semibold px-3 py-1 rounded ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <span className={`text-xs font-semibold px-3 py-1 rounded ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">Category: {report.category}</p>
                    </div>
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-400 transition ${expandedReport === report.id ? 'rotate-180' : ''}`}
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Reporter</p>
                    <p className="font-semibold text-gray-900 text-sm">{report.reporter}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Reported Provider</p>
                    <p className="font-semibold text-gray-900 text-sm">{report.provider}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Service Type</p>
                    <p className="font-semibold text-gray-900 text-sm">{report.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-xs font-medium mb-1">Reported</p>
                    <p className="font-semibold text-gray-900 text-sm">{report.reported}</p>
                  </div>
                </div>
              </div>

              {expandedReport === report.id && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="mb-4">
                    <div className="flex items-start gap-3 mb-3">
                      <AlertCircle size={18} className="text-red-500 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">Report Details:</h4>
                        <p className="text-gray-700 bg-red-50 p-3 rounded-lg text-sm">
                          {report.reportDetails}
                        </p>
                      </div>
                    </div>
                  </div>

                  {report.escalationDetails && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Escalation Details:</h4>
                      <p className="text-gray-700 bg-orange-50 p-3 rounded-lg text-sm">
                        {report.escalationDetails}
                      </p>
                    </div>
                  )}

                  {report.resolution && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2">Resolution:</h4>
                      <p className="text-gray-700 bg-green-50 p-3 rounded-lg text-sm">
                        {report.resolution}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                      👁️ View Details
                    </button>
                    <button onClick={() => handleResolve(report.id)} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                      ✅ Resolve
                    </button>
                    <button onClick={() => handleEscalate(report.id)} className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                      ⬆️ Escalate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No {filterStatus.toLowerCase()} reports to display</p>
          </div>
        )}
      </div>
    </div>
  );
}
