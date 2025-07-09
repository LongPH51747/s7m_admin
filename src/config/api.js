// URL Proxy CORS - bạn có thể sử dụng bất kỳ dịch vụ nào trong số này:
// - https://cors-anywhere.herokuapp.com/
// - https://api.allorigins.win/raw?url=
// - https://corsproxy.io/?
const CORS_PROXY = 'https://corsproxy.io/?';

// URL cơ sở API - sử dụng đường dẫn tương đối khi proxy được cấu hình
const API_BASE = 'https://248401aa5715.ngrok-free.app';

// Các điểm cuối
const ENDPOINTS = {
  // Sản phẩm
  CREATE_PRODUCT: `${API_BASE}/api/products/create-product`, // Tạo sản phẩm
  GET_PRODUCTS: `${API_BASE}/api/products/get-all-products`, // Lấy tất cả sản phẩm
  GET_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/get-products-by-id/id/${id}`, // Lấy sản phẩm theo ID
  UPDATE_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/update-product-by-id/id/${id}`, // Cập nhật sản phẩm theo ID
  DELETE_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/delete-product-by-id/id/${id}`, // Xóa sản phẩm theo ID
  
  // Danh mục
  GET_ALL_CATEGORIES: `${API_BASE}/api/categories/get-all-categories`, // Lấy tất cả danh mục
  CREATE_CATEGORY: `${API_BASE}/api/categories/create-category` // Tạo danh mục
};

// Hàm trợ giúp để lấy URL đầy đủ với proxy CORS
const getFullUrl = (endpoint) => {
  const url = `${API_BASE}${endpoint}`;
  // Chỉ sử dụng proxy CORS trong môi trường phát triển
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