// URL cơ sở API - ngrok URL
const API_BASE = 'https://ad06e3f5d75f.ngrok-free.app';

// Các điểm cuối
const ENDPOINTS = {
  // Sản phẩm
  CREATE_PRODUCT: `${API_BASE}/api/products/create-product`, // Tạo sản phẩm
  GET_PRODUCTS: `${API_BASE}/api/products/get-all-products`, // Lấy tất cả sản phẩm
  GET_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/get-products-by-id/id/${id}`, // Lấy sản phẩm theo ID
  UPDATE_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/update-product-by-id/id/${id}`, // Cập nhật sản phẩm theo ID
  UPDATE_VARIANT_BY_PRODUCT_ID: (id) => `${API_BASE}/api/products/updata-variant-by-id-product/id_product/${id}`, // Cập nhật variant theo product ID
  DELETE_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/delete/${id}`, // Xóa sản phẩm theo ID
  
  // Danh mục
  GET_ALL_CATEGORIES: `${API_BASE}/api/categories/get-all-categories`, // Lấy tất cả danh mục
  CREATE_CATEGORY: `${API_BASE}/api/categories/create-category`,// Tạo danh mục

  //Comment
  GET_COMMENT_BY_PRODUCT_ID: (id) => `${API_BASE}/api/review/get-review-by-id/id_product/${id}`, // Lấy comment theo product ID
  CREATE_COMMENT: (id) => `${API_BASE}/api/review/create-review`, // Tạo comment
  DELETE_COMMENT_BY_ID: (id) => `${API_BASE}/api/review/delete-review-id/id_review/${id}`, // Xóa comment theo ID
  UPDATE_COMMENT_BY_ID: (id) => `${API_BASE}/api/comments/update-comment-by-id/id/${id}`, // Cập nhật comment theo ID

  //User
  GET_ALL_USERS: `${API_BASE}/api/users/get-all-users`, // Lấy tất cả user
};

// Hàm trợ giúp để lấy URL đầy đủ - trực tiếp sử dụng ngrok URL
const getFullUrl = (endpoint) => {
  // Nếu endpoint đã có http/https thì return as is
  if (endpoint.startsWith('http')) {
    return endpoint;
  }
  // Nếu endpoint bắt đầu với / thì thêm API_BASE
  if (endpoint.startsWith('/')) {
    return `${API_BASE}${endpoint}`;
  }
  // Ngược lại thì thêm API_BASE + /
  return `${API_BASE}/${endpoint}`;
};

export {
  API_BASE,
  ENDPOINTS,
  getFullUrl,
}; 