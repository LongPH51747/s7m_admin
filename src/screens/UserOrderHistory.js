import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrdersByUserId } from '../services/orderService';
import { API_BASE } from '../services/LinkApi';

// Ánh xạ số trạng thái -> tên trạng thái
const statusMap = {
  1: 'Chờ xác nhận',
  2: 'Đã xác nhận',
  3: 'Rời kho',
  4: 'Tới bưu cục',
  5: 'Shipper nhận hàng',
  6: 'Đang giao',
  7: 'Giao thành công',
  8: 'Đã nhận',
  9: 'Giao thất bại',
  10: 'Bưu cục nhận hàng bom',
  11: 'Đơn bom rời bưu cục về kho',
  12: 'Đơn bom tới kho',
  13: 'Chờ xác nhận hoàn hàng',
  14: 'Đã xác nhận hoàn',
  15: 'Shipper đã nhận hàng hoàn',
  16: 'Bưu cục nhận hàng hoàn',
  17: 'Hàng hoàn rời bưu cục',
  18: 'Hàng hoàn tới kho',
  19: 'Đã hủy',
  24: 'Không xác nhận đơn hoàn'
};

const UserOrderHistory = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getOrdersByUserId(id);
        const sortedData = Array.isArray(data) 
          ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) 
          : [data];
        setOrders(sortedData);
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

  const filteredOrders = orders.filter(order => {
    const statusText = statusMap[order.status] || 'Không rõ';
    return filterStatus === "Tất cả" ? true : statusText === filterStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">
          📋 Lịch sử mua hàng của khách hàng: <span className="text-blue-600">{id}</span>
        </h1>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Đang giao">Đang giao</option>
          <option value="Giao thành công">Giao thành công</option>
          <option value="Đã nhận">Đã nhận</option>
          <option value="Hoàn hàng">Hoàn hàng</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-4">⏳ Đang tải dữ liệu...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="mt-4">❌ Không có đơn hàng nào với trạng thái này.</p>
      ) : (
        filteredOrders.map(order => (
          <div key={order._id} className="border rounded-md p-4 mt-6 shadow">
            <div className="mb-2 font-medium text-lg">🛒 Đơn hàng #{order._id}</div>
            <div className="text-sm text-gray-600">
              Ngày đặt: {formatDate(order.createdAt)} |
              Trạng thái: <span className="font-semibold">{statusMap[order.status] || 'Không rõ'}</span> |
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