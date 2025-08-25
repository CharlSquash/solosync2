// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// REVERTED: This is the original, working interceptor.
api.interceptors.request.use(
  config => {
    // It looks for the key 'token', which now matches LoginPage.js
    const token = localStorage.getItem('token');
    if (token) {
      // The login request to '/api/token/' will not have a token
      // in localStorage, so this header will not be added to it.
      // This solves the 400 Bad Request error.
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default api;