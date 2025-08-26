import axios from 'axios';
import { API_BASE } from './LinkApi'; 

const POST_OFFICE_API = `${API_BASE}/api/post-office`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('admin_token'); 
  return {
    Authorization: `Bearer ${token}`,
    'ngrok-skip-browser-warning': 'true'
  };
};

/**
 * Lấy tất cả bưu cục
 */
export const getAllPostOffices = async () => {
  const { data } = await axios.get(`${POST_OFFICE_API}/getAllPostOffice`, {
    headers: getAuthHeaders()
  });
  return data;
};

/**
 * Tạo một bưu cục mới
 * @param {object} postOfficeData - Dữ liệu của bưu cục mới { name, address_post_office, latitude, longitude }
 */
export const createPostOffice = async (postOfficeData) => {
  const { data } = await axios.post(`${POST_OFFICE_API}/createPostOffice`, postOfficeData, {
    headers: getAuthHeaders()
  });
  return data;
};

/**
 * Cập nhật thông tin một bưu cục
 * @param {string} id - ID của bưu cục cần cập nhật
 * @param {object} postOfficeData - Dữ liệu mới của bưu cục { name, address_post_office, latitude, longitude }
 */
export const updatePostOffice = async ({ id, postOfficeData }) => {
  const { data } = await axios.put(`${POST_OFFICE_API}/updatePostOffice/${id}`, postOfficeData, {
    headers: getAuthHeaders()
  });
  return data;
};

/**
 * Tìm kiếm bưu cục theo tên và địa chỉ (có thể không cần dùng trong trang quản lý)
 * @param {string} name - Tên bưu cục
 * @param {string} address - Địa chỉ bưu cục
 */
export const findPostOffice = async (name, address) => {
  const { data } = await axios.get(`${POST_OFFICE_API}/getPostOfficeByAddressAndName`, {
    params: { name, address },
    headers: getAuthHeaders()
  });
  return data;
};