import axios from 'axios';
import { API_BASE } from './api';

// Tạo một instance axios với các cấu hình mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE, // Sử dụng ngrok URL làm base URL
  headers: {
    'Content-Type': 'application/json',// Định dạng nội dung là JSON
    'Accept': 'application/json',// Chấp nhận định dạng JSON
    'ngrok-skip-browser-warning': 'true' // Bỏ qua cảnh báo của ngrok
  },
  withCredentials: false// Không gửi cookie theo yêu cầu
});

// Thêm interceptor cho yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    // Ghi log dữ liệu yêu cầu để gỡ lỗi
    console.log('Request:', {
      url: config.url,
      baseURL: config.baseURL,
      method: config.method,
      headers: config.headers,
      data: config.data ? 'Data present' : 'No data'
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);  // Ghi log lỗi yêu cầu
    return Promise.reject(error);
  }
);

// Thêm interceptor cho phản hồi
axiosInstance.interceptors.response.use(
  (response) => {
    // Ghi log dữ liệu phản hồi để gỡ lỗi
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data ? 'Data present' : 'No data'
    });
    return response;
  },
  (error) => {
    // Ghi log chi tiết lỗi
    if (error.response) {
      console.error('Response Error:', {
        message: error.message,
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      });
    } else {
      console.error('Network Error:', error.message); // Ghi log lỗi mạng
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;  // Xuất instance axios