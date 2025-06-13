import axios from 'axios';
import { API_BASE } from './LinkApi'; 

const ORDER_API = `${API_BASE}/order`;

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

// export const updateOrderStatusApi = async (orderId, newStatus) => {
//   try {
//     // Giả định endpoint cập nhật là: PATCH /api/order/update-status/:id
//     const url = `${ORDER_API}/update-status/${orderId}`;
//     const body = { status: newStatus };
//     const response = await axios.patch(url, body, {
//       headers: { 'ngrok-skip-browser-warning': 'true' }
//     });
//     return response.data;
//   } catch (error) {
//     console.error(`Lỗi khi cập nhật trạng thái cho đơn hàng ${orderId}:`, error);
//     throw error;
//   }
// };
export const updateOrderStatusApi = async (id, status) => {
 await axios.patch(`${ORDER_API}/updateStatus/${id}`, 
    status,
  );

};

export const getOrderById = async (id) => {
  try {
    const response = await axios.get(`${ORDER_API}/getById/${id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    return response.data; // giả định API trả về chi tiết đơn hàng
  } catch (error) {
    console.error(`❌ Lỗi khi lấy đơn hàng với ID ${id}:`, error);
    throw error;
  }
};
