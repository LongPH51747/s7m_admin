import axios from 'axios';
import { API_BASE } from './LinkApi';

const PRODUCTS_API = `${API_BASE}/api/products`;

export const getAllProducts = async () => {
 try {
    console.log("đã nhảy vào getAllProductProduct");
    
    const response = await axios.get(`${PRODUCTS_API}/getProductByCate`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
  console.log("đã chạy responseProducts");
  
  console.log("responseProducts", response.data);
  
  const products = Array.isArray(response.data)
  ? response.data
  : Array.isArray(response.data?.data)
  ? response.data.data
  : [];
  
  if (!Array.isArray(products)) {
    throw new Error("❌ Dữ liệu trả về không phải là mảng.");
  }
  
  return products;
} catch (error) {
  console.log("eror: ", error);
    
}
};