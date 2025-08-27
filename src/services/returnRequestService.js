// src/services/returnRequestService.js

import axios from 'axios';
import { API_BASE } from './LinkApi'; // Đảm bảo LinkApi của bạn được export đúng

const RETURN_REQUEST_API = `${API_BASE}/api/return-request`;

// Hàm helper để lấy token và tạo headers chuẩn, tránh lặp lại code
const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token'); // Hoặc cách bạn lưu token
  return {
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };
};

/**
 * Lấy tất cả các yêu cầu trả hàng (dành cho Admin).
 * Đây là API chính cho trang quản lý.
 * @returns {Promise<Array>} Mảng các yêu cầu trả hàng.
 */
export const getAllReturnRequests = async () => {
  const { data } = await axios.get(`${RETURN_REQUEST_API}/getAllReturnRequests`, {
    headers: getAuthHeaders()
  });
  return data;
};

/**
 * Cập nhật trạng thái của một yêu cầu trả hàng.
 * @param {object} params - Một object chứa id và dữ liệu mới.
 * @param {string} params.requestId - ID của yêu cầu trả hàng.
 * @param {object} params.statusData - Dữ liệu mới { status, adminNotes, resolution }.
 */
export const updateReturnRequestStatus = async ({ requestId, statusData }) => {
  const { data } = await axios.put(
    `${RETURN_REQUEST_API}/updateReturnRequestStatus/${requestId}`,
    statusData, // Gửi thẳng payload này đi
    { headers: getAuthHeaders() }
  );
  return data;
};

/**
 * Lấy tất cả các yêu cầu trả hàng của một người dùng cụ thể.
 * @param {string} userId - ID của người dùng cần tra cứu.
 * @returns {Promise<Array>} Mảng các yêu cầu trả hàng của người dùng đó.
 */
export const getReturnRequestByUser = async (userId) => {
  const { data } = await axios.get(`${RETURN_REQUEST_API}/getReturnRequestByUser/${userId}`, {
    headers: getAuthHeaders()
  });
  return data;
};

/**
 * Lấy yêu cầu trả hàng liên quan đến một đơn hàng cụ thể.
 * @param {string} orderId - ID của đơn hàng cần tra cứu.
 * @returns {Promise<object>} Đối tượng yêu cầu trả hàng (nếu có).
 */
export const getReturnRequestByOrder = async (orderId) => {
  const { data } = await axios.get(`${RETURN_REQUEST_API}/getReturnRequestByOrder/${orderId}`, {
    headers: getAuthHeaders()
  });
  return data;
};