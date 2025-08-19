import axios from 'axios';
import { API_BASE } from './LinkApi';

const SHIPPER_API = `${API_BASE}/api/shipper`;

// Lấy tất cả shipper
export const getAllShippers = async () => {
  try {
    console.log("đã nhảy vào getAllShipper");
    
    const response = await axios.get(`${SHIPPER_API}/getAllShipper`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    });
    console.log("đã chạy responseShip");
    console.log("responseShip", response.data);

    const shippers = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.data?.data)
      ? response.data.data
      : [];
    
    if (!Array.isArray(shippers)) {
      throw new Error("❌ Dữ liệu trả về không phải là mảng.");
    }
    
    return shippers;
  } catch (error) {
    console.log("eror: ", error);
  }
};

// Đăng ký shipper
export const registerShipper = async (shipperData) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.post(
    `${SHIPPER_API}/register`,
    shipperData,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    }
  );
  return response.data;
};

// Lấy thông tin shipper theo ID
export const getShipperById = async (shipperId) => {
  const token = localStorage.getItem('admin_token');
  const response = await axios.get(
    `${SHIPPER_API}/getShipperById/${shipperId}`,
    {
      headers: { 
        Authorization: `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    }
  );
  return response.data;
};
