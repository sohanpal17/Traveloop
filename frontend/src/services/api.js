import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auto-redirect to login on 401
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────────────────────────────
export const login  = (data) => API.post('/auth/login', data);
export const signup = (data) => API.post('/auth/register', data);
export const getMe  = ()     => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);

// ─── Trips ───────────────────────────────────────────────────────────────────
export const fetchTrips  = ()           => API.get('/trips');
export const fetchTrip   = (id)         => API.get(`/trips/${id}`);
export const createTrip  = (data)       => API.post('/trips', data);
export const updateTrip  = (id, data)   => API.put(`/trips/${id}`, data);
export const deleteTrip  = (id)         => API.delete(`/trips/${id}`);

// ─── Stops ───────────────────────────────────────────────────────────────────
export const fetchStops  = (tripId)           => API.get(`/trips/${tripId}/stops`);
export const fetchStop   = (tripId, stopId)   => API.get(`/trips/${tripId}/stops/${stopId}`);
export const addStop     = (tripId, data)     => API.post(`/trips/${tripId}/stops`, data);
export const updateStop  = (tripId, stopId, data) => API.put(`/trips/${tripId}/stops/${stopId}`, data);
export const deleteStop  = (tripId, stopId)   => API.delete(`/trips/${tripId}/stops/${stopId}`);

// ─── Activities ──────────────────────────────────────────────────────────────
export const fetchActivities = (stopId)               => API.get(`/stops/${stopId}/activities`);
export const addActivity     = (stopId, data)         => API.post(`/stops/${stopId}/activities`, data);
export const updateActivity  = (stopId, actId, data)  => API.put(`/stops/${stopId}/activities/${actId}`, data);
export const deleteActivity  = (stopId, actId)        => API.delete(`/stops/${stopId}/activities/${actId}`);

// ─── Checklist ───────────────────────────────────────────────────────────────
export const fetchChecklist      = (tripId)           => API.get(`/trips/${tripId}/checklist`);
export const addChecklistItem    = (tripId, data)     => API.post(`/trips/${tripId}/checklist`, data);
export const toggleChecklistItem = (tripId, itemId, data) => API.patch(`/trips/${tripId}/checklist/${itemId}`, data);
export const deleteChecklistItem = (tripId, itemId)   => API.delete(`/trips/${tripId}/checklist/${itemId}`);

// ─── Notes ───────────────────────────────────────────────────────────────────
export const fetchNotes  = (tripId)           => API.get(`/trips/${tripId}/notes`);
export const addNote     = (tripId, data)     => API.post(`/trips/${tripId}/notes`, data);
export const updateNote  = (tripId, noteId, data) => API.put(`/trips/${tripId}/notes/${noteId}`, data);
export const deleteNote  = (tripId, noteId)   => API.delete(`/trips/${tripId}/notes/${noteId}`);

// ─── Public ──────────────────────────────────────────────────────────────────
export const fetchPublicTrips = () => API.get('/public/trips');

export default API;