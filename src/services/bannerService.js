import axios from 'axios';
import { API_BASE2 } from './LinkApi';

const BANNER_API = `${API_BASE2}/api/banner`;

export const getAllBanners = async () => {
  try {
    console.log("đã nhảy vào getAllBannerget");
    
    const response = await axios.get(`${BANNER_API}/get-all-banner`, {  headers: {
        // Thêm header này để bỏ qua trang cảnh báo của Ngrok
        'ngrok-skip-browser-warning': 'true' 
      }})
  console.log("đã chạy response");
  
  console.log("response", response.data);
  
  const banners = Array.isArray(response.data)
  ? response.data
  : Array.isArray(response.data?.data)
  ? response.data.data
  : [];
  
  if (!Array.isArray(banners)) {
    throw new Error("❌ Dữ liệu trả về không phải là mảng.");
  }
  
  return banners;
} catch (error) {
  console.log("eror: ", error);
    
}
};

export const addBanner = async (bannerData) => {
  const response = await axios.post(`${BANNER_API}/add-banner`, bannerData);
  return response.data;
};

export const deleteBannerById = async (id) => {
  const response = await axios.delete(`${BANNER_API}/delete-banner-by-id/id/${id}`);
  return response.data;
};
