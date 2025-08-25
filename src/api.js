// src/api.js
import axios from 'axios';
import authApi from './authApi'; // <-- Import the new clean instance

// This is the main axios instance for all authenticated API requests.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Interceptor to add the ACCESS token to every outgoing request made with `api`.
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor to refresh the token when it expires.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the token is expired (401) and we haven't already retried this request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've now retried this request

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          // Use the clean authApi instance for the refresh request.
          const response = await authApi.post('/api/token/refresh/', {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', response.data.access);

          // Update the header on the original, failed request and try again
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return api(originalRequest);

        } catch (refreshError) {
          console.error("Refresh token is invalid, logging out.", refreshError);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }
    }
    // For all other errors, just return the error
    return Promise.reject(error);
  }
);

export default api;