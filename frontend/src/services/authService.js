import API from './api';

const authService = {
  // Register with name, email, password — returns { token, user }
  register: async (name, email, password) => {
    const response = await API.post('/auth/register', { name, email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  // Login with email, password — returns { token, user }
  login: async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  },

  // Logout — clear localStorage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from backend using stored JWT
  getCurrentUser: async () => {
    const response = await API.get('/auth/me');
    return response.data.user;
  },

  // Get token from localStorage
  getToken: () => localStorage.getItem('token'),

  // Check if user is authenticated
  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;