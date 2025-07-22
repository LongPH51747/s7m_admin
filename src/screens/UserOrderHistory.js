import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrdersByUserId } from '../services/orderService';
import { API_BASE } from '../services/LinkApi';
const UserOrderHistory = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrdersByUserId(id);
        setOrders(Array.isArray(data) ? data : [data]); // phòng khi backend trả về 1 object
      } catch (error) {
        console.error("❌ Lỗi khi load lịch sử mua hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id]);

  const formatDate = (iso) => new Date(iso).toLocaleString();
  const formatCurrency = (num) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        📋 Lịch sử mua hàng của khách hàng: <span className="text-blue-600">{id}</span>
      </h1>
      {/* <Link to="/" className="text-blue-600 underline">← Quay lại danh sách người dùng</Link> */}

      {loading ? (
        <p className="mt-4">⏳ Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p className="mt-4">❌ Hiện người dùng chưa có đơn hàng nào.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border rounded-md p-4 mt-6 shadow">
            <div className="mb-2 font-medium text-lg">🛒 Đơn hàng #{order._id}</div>
            <div className="text-sm text-gray-600">
              Ngày đặt: {formatDate(order.createdAt)} | 
              Trạng thái: <span className="font-semibold">{order.status}</span> | 
              {/* Thanh toán: <span className="font-semibold">{order.payment_status}</span> |  */}
              Phương thức: <span className="font-semibold">{order.payment_method}</span>
            </div>
            <div className="mt-2 text-right font-semibold">
              Tổng tiền: {formatCurrency(order.total_amount)}
            </div>

            <div className="mt-4">
              <table className="w-full text-sm table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Ảnh</th>
                    <th className="p-2 border">Tên sản phẩm</th>
                    <th className="p-2 border">Màu</th>
                    <th className="p-2 border">Size</th>
                    <th className="p-2 border">Số lượng</th>
                    <th className="p-2 border">Đơn giá</th>
                    <th className="p-2 border">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems.map(item => (
                    console.log("image", item.image),
                    
                    <tr key={item.id_product + item.id_variant} className="border-b">
                      <td className="p-2 border">
                        <img
                          src={`${API_BASE}${item.image}`}
                          alt={item.name_product}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </td>
                      <td className="p-2 border">{item.name_product}</td>
                      <td className="p-2 border">{item.color}</td>
                      <td className="p-2 border">{item.size}</td>
                      <td className="p-2 border text-center">{item.quantity}</td>
                      <td className="p-2 border text-right">{formatCurrency(item.unit_price_item)}</td>
                      <td className="p-2 border text-right">{formatCurrency(item.total_price_item)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserOrderHistory;
