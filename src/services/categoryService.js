import axios from 'axios';
import { API_BASE } from './LinkApi';

const CATEGORY_API = `${API_BASE}/api/categories`;

export const getAllCategories = async () => {
 try {
    console.log("đã nhảy vào getAllCate");
    
    const response = await axios.get(`${CATEGORY_API}/get-all-categories`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
  console.log("đã chạy responseCate");
  
  console.log("responseCate", response.data);
  
  const categories = Array.isArray(response.data)
  ? response.data
  : Array.isArray(response.data?.data)
  ? response.data.data
  : [];
  
  if (!Array.isArray(categories)) {
    throw new Error("❌ Dữ liệu trả về không phải là mảng.");
  }
  
  return categories;
} catch (error) {
  console.log("eror: ", error);
    
}
};

export const addCategory = async (categoryData) => {
  const res = await axios.post(`${CATEGORY_API}/create-category`, categoryData);
  return res.data;
};

export const deleteCategory = async (id) => {
  const res = await axios.delete(`${CATEGORY_API}/delete-category-by-id/id/${id}`);
  return res.data;
};
