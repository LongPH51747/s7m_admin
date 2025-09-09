import axios from 'axios';
import { API_BASE } from './LinkApi'; 

const ORDER_API = `${API_BASE}/api/order`;

export const getAllOrder = async () => {
  try {
    const response = await axios.get(`${ORDER_API}/getAll`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    // API của bạn trả về dữ liệu trực tiếp trong response.data
    const orders = response.data;
    if (!Array.isArray(orders)) {
      throw new Error("API không trả về một mảng đơn hàng.");
    }
    return orders;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    throw error; // Ném lỗi ra để Context xử lý
  }
};




export const updateOrderStatusApi = async (id, status, id_Admin) => {
  try {
   
    await axios.patch(`${ORDER_API}/updateStatusByAdmin/${id}`, {
      status: status,
      id_admin: id_Admin
    }
      , // ✅ sửa lại thành object JSON đúng
       
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái:", error);
    throw error;
  }
};


export const getOrderById = async (id) => {
  try {
     console.log("đã nhảy vào getOrderById");
    const response = await axios.get(`${ORDER_API}/getOrderByIdForAddmin/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
     console.log("đã chạy responseOrderById");

console.log("responseOrderById", response.data);

    return response.data; // giả định API trả về chi tiết đơn hàng
  } catch (error) {
    console.error(`❌ Lỗi khi lấy đơn hàng với ID ${id}:`, error);
    throw error;
  }
};

export const getOrdersByUserId = async (id) => {
  try {
     console.log("đã nhảy vào getOrderById");
    const response = await axios.get(`${ORDER_API}/getByUserId/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
     console.log("đã chạy responseOrderById");

console.log("responseOrderByUserId", response.data);

    return response.data; // giả định API trả về chi tiết đơn hàng
  } catch (error) {
    console.error(`❌ Lỗi khi lấy đơn hàng với ID ${id}:`, error);
    throw error;
  }
};

export const filterOrdersByCity = async (province) => {
  try {
    const response = await axios.get(`${ORDER_API}/filterOrderAddressByCityAndWard?province=${encodeURIComponent(province)}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    
    const orders = response.data;
    if (!Array.isArray(orders)) {
      throw new Error("API không trả về một mảng đơn hàng.");
    }
    return orders;
  } catch (error) {
    console.error("Lỗi khi lọc đơn hàng theo thành phố:", error);
    throw error;
  }
};

