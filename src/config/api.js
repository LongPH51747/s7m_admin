// CORS Proxy URL - you can use any of these services:
// - https://cors-anywhere.herokuapp.com/
// - https://api.allorigins.win/raw?url=
// - https://corsproxy.io/?
const CORS_PROXY = 'https://corsproxy.io/?';

// API Base URL - use relative path when proxy is configured
const API_BASE = 'https://059f-2405-4802-4b2-2810-c455-f308-457-aa78.ngrok-free.app/api';

// Endpoints
const ENDPOINTS = {
  // Products
  CREATE_PRODUCT: `${API_BASE}/products/create-product`,
  GET_PRODUCTS: `${API_BASE}/products`,
  GET_PRODUCT: (id) => `${API_BASE}/products/${id}`,
  UPDATE_PRODUCT: (id) => `${API_BASE}/products/${id}`,
  DELETE_PRODUCT: (id) => `${API_BASE}/products/${id}`,
  
  // Categories
  GET_ALL_CATEGORIES: `${API_BASE}/categories/get-all-categories`,
  CREATE_CATEGORY: `${API_BASE}/categories/create-category`
};

// Helper function to get full URL with CORS proxy
const getFullUrl = (endpoint) => {
  const url = `${API_BASE}${endpoint}`;
  // Only use CORS proxy in development
  if (process.env.NODE_ENV === 'development') {
    return `${CORS_PROXY}${encodeURIComponent(url)}`;
  }
  return url;
};

export {
  API_BASE,
  ENDPOINTS,
  getFullUrl,
}; 