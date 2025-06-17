import axios from 'axios';
import { API_BASE } from './LinkApi';

const ADDRESS_API = `${API_BASE}/address`;

// Lấy thông tin đầy đủ địa chỉ theo userId (dùng cho trang chi tiết đơn hàng)
export const getAddressByUserId = async (userId) => {
  try {
    const response = await axios.get(`${ADDRESS_API}/getAddressByUserId/${userId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log("✅ getAddressByUserId:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi getAddressByUserId:", error);
    return null;
  }
};

// Lấy tên người nhận từ id_address (dùng cho danh sách đơn hàng)
export const getFullNameAtAddress = async (id) => {
  try {
    const response = await axios.get(`${ADDRESS_API}/getById/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    return response.data?.fullName || 'Không rõ';
  } catch (error) {
    console.error("❌ Lỗi khi lấy fullName tại địa chỉ:", error);
    return 'Không rõ';
  }
};
export const getByIdAddress = async (id) => {
    try {
      console.log("đã nhảy vào getByIdAddress");
      console.log("log id", id);
      
    const response = await axios.get(`${ADDRESS_API}/getById/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log("đã chạy responseByIdAddress");

console.log("responseByIdAddress", response.data);


    console.log("✅ getByIdAddress:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Lỗi khi gọi getByIdAddress:", error);
    return null;
  }
};