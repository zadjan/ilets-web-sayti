import axios from 'axios';

// Local: '/api' (Vite proxy orqali)
// Production: VITE_API_URL environment variable orqali
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Har bir so'rovga token qo'shish
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ielts_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 xatosida admin loginiga yo'naltirish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('ielts_admin_token');
      localStorage.removeItem('ielts_admin_user');
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
