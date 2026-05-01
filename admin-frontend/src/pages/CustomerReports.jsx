import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, AlertCircle, Loader, Shield, CheckCircle, BarChart3, LogOut } from "lucide-react";
import { customerReports, providerVerification } from "../services/api";

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
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-gray-900 font-medium transition-colors"
        >
          <AlertCircle className="w-5 h-5 text-blue-500" />
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

export default function CustomerReports() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [expandedReport, setExpandedReport] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [reportStats, setReportStats] = useState({
    pending: 0,
    resolved: 0,
    escalated: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingProvidersCount, setPendingProvidersCount] = useState(0);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);

      const reportsRes = await customerReports.getAllReports();
      const statsRes = await customerReports.getReportStats();

      // Backend returns array directly
      const reportsData = Array.isArray(reportsRes.data) ? reportsRes.data : [];
      setAllReports(reportsData);

      // Handle stats from backend
      const statsData = statsRes.data || {};
      setReportStats({
        pending: statsData.pendingReports || 0,
        resolved: statsData.resolvedReports || 0,
        escalated: statsData.escalatedReports || 0
      });

    } catch (err) {
      console.error(err);

      setError(err.response?.data?.detail || "Failed to load reports");

      // Show empty state when API fails - no sample data
      setAllReports([]);
      setReportStats({ pending: 0, resolved: 0, escalated: 0 });

    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
    fetchPendingProviders();
  }, [fetchReports]);

  const fetchPendingProviders = async () => {
    try {
      const res = await providerVerification.getPendingProviders();
      const providers = Array.isArray(res.data) ? res.data : [];
      setPendingProvidersCount(providers.length);
    } catch (err) {
      console.error("Failed to fetch pending providers:", err);
    }
  };

  const stats = [
    { label: "Pending", value: reportStats.pending, color: "bg-yellow-50", icon: "⏳" },
    { label: "Resolved", value: reportStats.resolved, color: "bg-green-50", icon: "✅" },
    { label: "Escalated", value: reportStats.escalated, color: "bg-red-50", icon: "⚠️" }
  ];

  const pendingCount = stats[0].value;

  const filteredReports =
    filterStatus === "All"
      ? allReports
      : allReports.filter((r) => r.status === filterStatus);

  const getPriorityColor = (priority) => {
    if (!priority) return "text-gray-600";
    if (priority.includes("High")) return "bg-red-100 text-red-800";
    if (priority.includes("Slightly")) return "text-orange-600";
    return "text-yellow-600";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Escalated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await customerReports.resolveReport(reportId, {
        resolution: "Resolved by admin"
      });
      fetchReports();
    } catch (err) {
      setError("Failed to resolve report");
    }
  };

  const handleEscalate = async (reportId) => {
    try {
      await customerReports.escalateReport(reportId, {
        escalationDetails: "Escalated for further investigation"
      });
      fetchReports();
    } catch (err) {
      setError("Failed to escalate report");
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
    <div className="min-h-screen bg-gray-100 flex">
{/* Sidebar with pending counts */}
      <Sidebar pendingProviders={pendingProvidersCount} pendingReports={pendingCount} />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* HEADER */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Reports
          </h1>
          <p className="text-gray-600">
            Review and resolve customer complaints
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="max-w-7xl mx-auto px-6 py-4 bg-red-50 border border-red-200 rounded-lg my-4 flex gap-3">
            <AlertCircle className="text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* STATS */}
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-3 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className={`${s.color} p-6 rounded-lg border`}>
              <div className="text-2xl">{s.icon}</div>
              <p className="text-sm text-gray-600">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* FILTER */}
        <div className="max-w-7xl mx-auto px-6 flex gap-3 mb-6">
          {["All", "Pending", "Resolved", "Escalated"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-2 rounded ${
                filterStatus === s
                  ? "bg-blue-500 text-white"
                  : "bg-white border"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* REPORT LIST */}
        <div className="max-w-7xl mx-auto px-6 space-y-4 pb-8">
          {filteredReports.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Reports Found</h3>
              <p className="text-gray-500">
                {filterStatus === "All" 
                  ? "There are no customer reports in the system yet."
                  : `There are no ${filterStatus.toLowerCase()} reports.`}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Reports will appear here when customers submit complaints.
              </p>
            </div>
          ) : (
            filteredReports.map((report) => {
              return (
                <div key={report.id} className="bg-white p-4 rounded shadow">

                  <div
                    className="flex justify-between cursor-pointer"
                    onClick={() =>
                      setExpandedReport(
                        expandedReport === report.id ? null : report.id
                      )
                    }
                  >
                    <div>
                      <p className="font-bold">Report #{report.id}</p>
                      <p className="text-sm text-gray-500">
                        {report.category}
                      </p>
                    </div>

                    <ChevronDown />
                  </div>

                  {expandedReport === report.id && (
                    <div className="mt-4 border-t pt-4">
                      <p>{report.reportDetails}</p>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleResolve(report.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded"
                        >
                          Resolve
                        </button>

                        <button
                          onClick={() => handleEscalate(report.id)}
                          className="bg-orange-500 text-white px-3 py-1 rounded"
                        >
                          Escalate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
