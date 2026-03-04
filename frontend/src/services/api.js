/**
 * API Service - Handles all HTTP requests
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to requests
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getProfile: () => apiClient.get('/auth/profile'),
  updateProfile: (data) => apiClient.put('/auth/profile', data)
};

// Product APIs
export const productAPI = {
  getAllProducts: (params) => apiClient.get('/products', { params }),
  getProduct: (id) => apiClient.get(`/products/${id}`),
  getTrending: (params) => apiClient.get('/products/trending', { params }),
  searchProducts: (query) => apiClient.get('/products/search', { params: { q: query } }),
  createProduct: (data) => apiClient.post('/products', data),
  updateProduct: (id, data) => apiClient.put(`/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/products/${id}`)
};

// Cart APIs
export const cartAPI = {
  getCart: () => apiClient.get('/cart'),
  addToCart: (data) => apiClient.post('/cart/add', data),
  removeFromCart: (data) => apiClient.post('/cart/remove', data),
  updateCartItem: (data) => apiClient.post('/cart/update', data),
  clearCart: () => apiClient.delete('/cart')
};

// Order APIs
export const orderAPI = {
  getOrders: (params) => apiClient.get('/orders', { params }),
  getOrder: (id) => apiClient.get(`/orders/${id}`),
  createPaymentIntent: (data) => apiClient.post('/orders/payment-intent', data),
  checkout: (data) => apiClient.post('/orders/checkout', data),
  updateOrderStatus: (id, data) => apiClient.put(`/orders/${id}/status`, data),
  requestRefund: (id, data) => apiClient.post(`/orders/${id}/refund`, data)
};

// AI APIs
export const aiAPI = {
  getRecommendations: (params) => apiClient.get('/ai/recommendations', { params }),
  chatbot: (data) => apiClient.post('/ai/chatbot', data),
  generateDescription: (data) => apiClient.post('/ai/generate-description', data),
  checkFraud: (data) => apiClient.post('/ai/fraud-check', data),
  getTrending: (params) => apiClient.get('/ai/trending', { params })
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
