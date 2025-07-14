import axios from 'axios';
import { API_BASE } from './LinkApi';

const PRODUCTS_API = `${API_BASE}/api/products`;

export const getProductsByCategoryId = async (cateId) => {
  if (!cateId || cateId.length !== 24) {
    console.error("❌ cateId không hợp lệ:", cateId);
    return [];
  }

  try {
    console.log("👉 Đang lấy sản phẩm cho cateId:", cateId);

    const response = await axios.get(`${PRODUCTS_API}/getProductByCate`, {
      params: { cateId },
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    console.log("📦 Response raw:", response.data);

    if (response.data?.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    console.warn("⚠️ Không tìm thấy mảng sản phẩm trong response:", response.data);
    return [];
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
    return [];
  }
};
