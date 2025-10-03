import axios from 'axios';

// Configuración base de Axios
const API_BASE_URL = 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Error en la API:', error);
    return Promise.reject(error);
  }
);

export default api;