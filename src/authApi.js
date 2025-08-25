// src/authApi.js
import axios from 'axios';

// This is a 'clean' axios instance with no interceptors.
// It is used ONLY for login and token refresh.
const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export default authApi;