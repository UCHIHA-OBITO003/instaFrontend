// src/services/api.js
import axios from 'axios';

const API = axios.create({
  // If you have .env => REACT_APP_API_URL=http://localhost:5000/api
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
