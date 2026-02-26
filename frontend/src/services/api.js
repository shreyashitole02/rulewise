import axios from 'axios';

// Base URL of your backend
const API = axios.create({
  baseURL: 'http://localhost:5000'
});

// ── Rules ──────────────────────────
export const getRules = () => API.get('/rules');
export const createRule = (data) => API.post('/rules', data);
export const toggleRule = (id) => API.patch(`/rules/${id}/toggle`);
export const deleteRule = (id) => API.delete(`/rules/${id}`);

// ── Events ─────────────────────────
export const createEvent = (data) => API.post('/events', data);

// ── Alerts ─────────────────────────
export const getAlerts = () => API.get('/alerts');
export const clearAlerts = () => API.delete('/alerts/clear');