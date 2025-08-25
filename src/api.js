import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

// Part 1: Automatically add the ACCESS token to every request header
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

// Part 2: Automatically refresh the token if it expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 Unauthorized and we haven't already retried
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/token/refresh/`, {
            refresh: refreshToken,
          });

          localStorage.setItem('access_token', response.data.access);

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

    return Promise.reject(error);
  }
);

export default api;