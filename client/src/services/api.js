import axios from 'axios';

const API_URL = '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Society APIs
export const getSocieties = () => apiClient.get('/societies');
export const getSocietyById = (id) => apiClient.get(`/societies/${id}`);
export const createSociety = (data) => apiClient.post('/admin/societies', data);
export const updateSociety = (id, data) => apiClient.put(`/admin/societies/${id}`, data);
export const deleteSociety = (id) => apiClient.delete(`/admin/societies/${id}`);

// Benchmark APIs
export const getBenchmarks = () => apiClient.get('/benchmarks');
export const getBenchmarksByCategory = () => apiClient.get('/benchmarks-by-category');
export const getSocietyBenchmarks = (societyId) =>
  apiClient.get(`/admin/benchmarks/${societyId}`);
export const saveSocietyBenchmark = (societyId, data) =>
  apiClient.post(`/admin/benchmarks/${societyId}`, data);
export const saveBulkBenchmarks = (societyId, data) =>
  apiClient.post(`/admin/benchmarks/${societyId}/bulk`, data);

// Comparison & Insights APIs
export const getComparisonData = (filters = {}) =>
  apiClient.get('/comparison', { params: filters });
export const getSocietyInsights = (societyId) =>
  apiClient.get(`/insights/society/${societyId}`);
export const getSummaryStats = () => apiClient.get('/insights/summary');

// Admin Authentication
export const adminLogin = (password) =>
  apiClient.post('/admin/login', { password });
export const adminLogout = () => apiClient.post('/admin/logout');
export const checkAdminAuth = () =>
  apiClient.get('/admin/check').catch(() => ({ data: { isAdmin: false } }));

export default apiClient;
