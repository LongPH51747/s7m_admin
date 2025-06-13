import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import { getUserById } from '../services/userServices';
import { getFullNameAtAddress } from '../services/addressService';
import statusColors from '../utils/StatusColors';

const OrderDetailPage = () => {
  const { orderCode } = useParams(); // SMT + _id
  const rawId = orderCode.replace(/^SMT/, '');

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [receiverName, setReceiverName] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const orderData = await getOrderById(rawId);
        setOrder(orderData);
        setNewStatus(orderData.status);

        const userData = await getUserById(orderData.userId);
        setUser(userData);

        const fullName = await getFullNameAtAddress(orderData.id_address);
        setReceiverName(fullName);
      } catch (err) {
        console.error('Lỗi khi tải chi tiết đơn hàng:', err);
      }
    };
    fetchDetail();
  }, [rawId]);

  if (!order || !user || !receiverName) {
    return (
      <div className="p-6 text-center text-gray-600">
        ⏳ Đang tải thông tin đơn hàng...
      </div>
    );
  }

  const total = order.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const finalTotal = total - (order.voucher || 0);

  return (
    <div className="max-w-5xl mx-auto p-6 border-2 border-blue-500 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ĐƠN HÀNG #{orderCode}</h1>
        <span className={`px-4 py-1 rounded-full font-semibold ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Thông Tin Đặt Hàng</h2>
            <p>Ngày đặt hàng: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
            <p>Vận chuyển: <strong>{order.shipping}</strong></p>
            <p>Thanh toán: <strong>{order.paymentMethod}</strong></p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Thông Tin Khách Hàng</h2>
            <p>Tên người đặt: <strong>{user.username}</strong></p>
            <p>Tên người nhận: <strong>{receiverName}</strong></p>
            <p>Điện thoại: {order.customer?.phone || '...'}</p>
            <p>Địa chỉ: {order.customer?.address || '...'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Trạng Thái Đơn Hàng</h2>
            <select
              className="w-full border px-3 py-2 rounded mb-2"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option>Chờ xác nhận</option>
              <option>Đang giao</option>
              <option>Giao thành công</option>
              <option>Hoàn hàng</option>
              <option>Hủy</option>
            </select>
            <button
              onClick={() => {
                // gọi API update nếu có
                console.log("Update status:", newStatus);
              }}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Cập nhật
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Sản phẩm</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Tên</th>
                  <th className="text-center py-1">SL</th>
                  <th className="text-right py-1">Giá</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-1">{item.name}</td>
                    <td className="text-center py-1">{item.quantity}</td>
                    <td className="text-right py-1">{item.price.toLocaleString()}₫</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan="2" className="text-right font-semibold pt-2">Tổng:</td>
                  <td className="text-right pt-2">{total.toLocaleString()}₫</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-right">Voucher:</td>
                  <td className="text-right text-red-500">-{order.voucher?.toLocaleString() || 0}₫</td>
                </tr>
                <tr>
                  <td colSpan="2" className="text-right font-bold pt-2">Thanh toán:</td>
                  <td className="text-right font-bold text-green-600">{finalTotal.toLocaleString()}₫</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
