import axios from "axios";
import { API_BASE } from "./LinkApi";

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
        "ngrok-skip-browser-warning": "true",
      },
    });

    console.log("📦 Response raw:", response.data);

    let products = [];

    // TH1: nếu data là mảng
    if (Array.isArray(response.data)) {
      products = response.data;
    }
    // TH2: nếu data.data là mảng
    else if (Array.isArray(response.data.data)) {
      products = response.data.data;
    }
    // TH3: nếu response.data.results (tùy API bạn) là mảng
    else if (Array.isArray(response.data.results)) {
      products = response.data.results;
    }

    if (!products.length) {
      console.warn("⚠️ Không tìm thấy mảng sản phẩm trong response:", response.data);
    }

    return products;
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
    return [];
  }
};
