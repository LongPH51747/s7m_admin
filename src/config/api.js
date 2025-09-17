// URL cơ sở API - ngrok URL
// URL Proxy CORS - bạn có thể sử dụng bất kỳ dịch vụ nào trong số này:
// - https://cors-anywhere.herokuapp.com/
// - https://api.allorigins.win/raw?url=
// - https://corsproxy.io/?
// const CORS_PROXY = 'https://corsproxy.io/?';

// URL cơ sở API - sử dụng đường dẫn tương đối khi proxy được cấu hình
const API_BASE = 'http://192.168.1.10:3000';

// Các điểm cuối
const ENDPOINTS = {
  // Sản phẩm
  CREATE_PRODUCT: `${API_BASE}/api/products/create-product`, // Tạo sản phẩm
  GET_PRODUCTS: `${API_BASE}/api/products/get-all-products`, // Lấy tất cả sản phẩm
  GET_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/get-products-by-id/id/${id}`, // Lấy sản phẩm theo ID
  UPDATE_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/update-product-by-id/id/${id}`, // Cập nhật sản phẩm theo ID
  UPDATE_VARIANT_BY_PRODUCT_ID: (id) => `${API_BASE}/api/products/updata-variant-by-id-product/id_product/${id}`, // Cập nhật variant theo product ID
  ADD_PRODUCT_VARIANT: (id) => `${API_BASE}/api/products/addProductVariant/${id}`, // Thêm variant vào sản phẩm
  DELETE_VARIANT_BY_ID: (productId, variantId) => `${API_BASE}/api/products/delete-variant-by-id/id_product/${productId}/id_variant/${variantId}`, // Xóa variant theo ID
  DELETE_PRODUCT_BY_ID: (id) => `${API_BASE}/api/products/delete-product-by-id/id/${id}`, // Xóa sản phẩm theo ID
  
  // Danh mục
  GET_ALL_CATEGORIES: `${API_BASE}/api/categories/get-all-categories`, // Lấy tất cả danh mục
  CREATE_CATEGORY: `${API_BASE}/api/categories/create-category`,// Tạo danh mục

  //Comment
  GET_COMMENT_BY_PRODUCT_ID: (id) => `${API_BASE}/api/review/get-review-by-id/id_product/${id}`, // Lấy comment theo product ID
  CREATE_COMMENT: () => `${API_BASE}/api/review/create-review`, // Tạo comment user
  CREATE_ADMIN_REPLY: (id) => `${API_BASE}/api/review/createReviewAdmin/id_review/${id}`, // Admin trả lời comment
  DELETE_COMMENT_BY_ADMIN: (id) => `${API_BASE}/api/review/deleteReviewByAdmin/id_review/${id}`, // Admin xóa comment theo ID
  UPDATE_COMMENT_BY_ID: (id) => `${API_BASE}/api/comments/update-comment-by-id/id/${id}`, // Cập nhật comment theo ID

  //User
  GET_ALL_USERS: `${API_BASE}/api/users/get-all-users`, // Lấy tất cả user

  GET_ALL_VOUCHERS: `${API_BASE}/api/voucher/getAllVoucherByAdmin`,  // lấy tât cả voucher
  CREATE_VOUCHER: `${API_BASE}/api/voucher/createVoucher`, // Tạo voucher
  UPDATE_VOUCHER: (id) => `${API_BASE}/api/voucher/updateVoucher/${id}`, // Cập nhật voucher theo ID
  
  // Orders
  FILTER_ORDERS_BY_CITY: `${API_BASE}/api/order/filterOrderAddressByCityAndWard`, // Lọc đơn hàng theo thành phố
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