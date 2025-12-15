import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
};

// Products
export const productsAPI = {
  getAll: (search = '') => api.get(`/products${search ? `?search=${search}` : ''}`),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

// Sales
export const salesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/sales${query ? `?${query}` : ''}`);
  },
  getById: (id) => api.get(`/sales/${id}`),
  create: (sale) => api.post('/sales', sale),
  update: (id, sale) => api.put(`/sales/${id}`, sale),
  delete: (id) => api.delete(`/sales/${id}`),
};

// Clients
export const clientsAPI = {
  getAll: (search = '') => api.get(`/clients${search ? `?search=${search}` : ''}`),
  getById: (id) => api.get(`/clients/${id}`),
  create: (client) => api.post('/clients', client),
  update: (id, client) => api.put(`/clients/${id}`, client),
  delete: (id) => api.delete(`/clients/${id}`),
};

// Dashboard
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getReports: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return api.get(`/dashboard/reports${query ? `?${query}` : ''}`);
  },
};

export default api;
