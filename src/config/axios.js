import axios from 'axios';
import { API_BASE_URL, getFullUrl } from './api';

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
  withCredentials: false
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Use CORS proxy URL
    if (config.url && !config.url.startsWith('http')) {
      config.url = getFullUrl(config.url);
    }
    
    // Log request data for debugging
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data ? 'Data present' : 'No data'
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response data for debugging
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data ? 'Data present' : 'No data'
    });
    return response;
  },
  (error) => {
    // Log error details
    if (error.response) {
      console.error('Response Error:', {
        message: error.message,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      console.error('Network Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 