import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  verifyOTP: (otp) => api.post('/auth/verify-otp', { otp }),
  resendOTP: () => api.post('/auth/resend-otp'),
};

// Farmer API
export const farmerAPI = {
  getProfile: () => api.get('/farmers/profile'),
  updateProfile: (data) => api.post('/farmers/profile', data),
  getDashboard: () => api.get('/farmers/dashboard'),
  getNearby: (lat, lng, radius) => api.get(`/farmers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
  getById: (id) => api.get(`/farmers/${id}`),
  uploadDocuments: (formData) => api.post('/farmers/upload-documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Product API
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getFarmerProducts: () => api.get('/products/farmer/my-products'),
  uploadImages: (formData) => api.post('/products/upload-images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// User/Address API
export const userAPI = {
  getAddresses:    ()           => api.get('/users/addresses'),
  addAddress:      (data)       => api.post('/users/addresses', data),
  updateAddress:   (id, data)   => api.put(`/users/addresses/${id}`, data),
  deleteAddress:   (id)         => api.delete(`/users/addresses/${id}`),
  setDefault:      (id)         => api.put(`/users/addresses/${id}/default`),
  getProfile:      ()           => api.get('/users/profile'),
};

// Order API
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status, note) => api.put(`/orders/${id}/status`, { status, note }),
  getFarmerOrders: () => api.get('/orders/farmer/my-orders'),
  getConsumerOrders: () => api.get('/orders/consumer/my-orders'),
  addReview: (id, review) => api.post(`/orders/${id}/review`, review),
  cancelOrder: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
};

// Payment API
export const paymentAPI = {
  createOrder: (amount) => api.post('/payments/create-order', { amount }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};

// Admin API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getFarmers: (params) => api.get('/admin/farmers', { params }),
  approveFarmer: (id) => api.put(`/admin/farmers/${id}/approve`),
  rejectFarmer: (id, reason) => api.put(`/admin/farmers/${id}/reject`, { reason }),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
  getProducts: (params) => api.get('/admin/products', { params }),
  createProduct: (data) => api.post('/admin/products', data),
  toggleProductStatus: (id) => api.put(`/admin/products/${id}/toggle-status`),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
};

export default api;
