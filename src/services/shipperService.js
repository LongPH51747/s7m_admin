import axios from 'axios';
import { API_BASE } from './LinkApi';

const SHIPPER_API = `${API_BASE}/api/shipper`;

export const getAllShipper = async () => {
 try {
    console.log("đã nhảy vào getAllShipper");
    
    const response = await axios.get(`${SHIPPER_API}/getAllShipper`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
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