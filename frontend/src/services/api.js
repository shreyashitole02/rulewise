import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Rules
export const getRules = () => api.get('/rules');
export const createRule = (data) => api.post('/rules', data);
export const toggleRule = (id) => api.patch(`/rules/${id}/toggle`);
export const deleteRule = (id) => api.delete(`/rules/${id}`);

// Events
export const createEvent = (data) => api.post('/events', data);

// Alerts
export const getAlerts = () => api.get('/alerts');
export const clearAlerts = () => api.delete('/alerts');

export default api;