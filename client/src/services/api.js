import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const publicAPI = {
  getSocieties: () => api.get('/societies'),
  getSocietyById: (id) => api.get(`/societies/${id}`),
  getBenchmarks: () => api.get('/benchmarks'),
  getComparison: () => api.get('/comparison'),
  getInsights: () => api.get('/insights'),
  getTrends: () => api.get('/trends'),
};

export const adminAPI = {
  login: (password) => api.post('/admin/login', { password }),
  logout: () => api.post('/admin/logout'),
  checkAuth: () => api.get('/admin/check'),
  createSociety: (data) => api.post('/admin/societies', data),
  updateSociety: (id, data) => api.put(`/admin/societies/${id}`, data),
  deleteSociety: (id) => api.delete(`/admin/societies/${id}`),
  getBenchmarks: () => api.get('/admin/benchmarks'),
  getSocietyBenchmarks: (societyId) => api.get(`/admin/benchmarks/${societyId}`),
  updateBenchmarks: (societyId, data) => api.post(`/admin/benchmarks/${societyId}`, data),
};

export default api;
