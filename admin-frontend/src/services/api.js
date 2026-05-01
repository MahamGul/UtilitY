import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Admin Authentication
export const adminAuth = {
  login: (email, password) => api.post('/login', { email, password, role: 'admin' }),
  logout: () => api.post('/logout'),
};

// Dashboard
export const dashboard = {
  getStats: () => api.get('/admin/dashboard/stats'),
  getRecentProviders: () => api.get('/admin/dashboard/recent-providers'),
  getPendingActions: () => api.get('/admin/dashboard/pending-actions'),
  getActivityFeed: () => api.get('/admin/dashboard/activity'),
};

// Provider Verification
export const providerVerification = {
  getPendingProviders: () => api.get('/admin/providers/pending'),
  getAllProviders: () => api.get('/admin/providers'),
  getProviderDetails: (providerId) => api.get(`/admin/providers/${providerId}`),
  approveProvider: (providerId) => api.put(`/admin/providers/${providerId}/approve`),
  rejectProvider: (providerId) => api.put(`/admin/providers/${providerId}/reject`),
};

// Customer Reports
export const customerReports = {
  getAllReports: () => api.get('/admin/reports'),
  getReportStats: () => api.get('/admin/reports/stats'),
  getReportDetails: (reportId) => api.get(`/admin/reports/${reportId}`),
  resolveReport: (reportId, resolution) => api.put(`/admin/reports/${reportId}/resolve`, { resolution }),
  escalateReport: (reportId, escalationDetails) => api.put(`/admin/reports/${reportId}/escalate`, { escalationDetails }),
};

// Users
export const users = {
  getAllUsers: () => api.get('/admin/users'),
  getUserStats: () => api.get('/admin/users/stats'),
};

export default api;
