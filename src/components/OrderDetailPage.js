import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatusApi } from '../services/orderService';
import { getByIdAddress } from '../services/addressService';
import statusColors from '../utils/StatusColors';

const OrderDetailPage = () => {
  const { orderCode } = useParams();
  const rawId = orderCode.replace(/^SMT/, '');

  const [order, setOrder] = useState(null);
  const [receiverName, setReceiverName] = useState('...');
  const [phone, setPhone] = useState('...');
  const [address, setAddress] = useState('...');
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const orderData = await getOrderById(rawId);
        setOrder(orderData);
        setNewStatus(orderData.status);

       
          const addressInfo = await getByIdAddress(orderData.id_address._id);
          console.log("orderdata.address", orderData.id_address );
          console.log( "orderdata", orderData);
          
          
          console.log("📍 Thông tin địa chỉ:", addressInfo);

          setReceiverName(addressInfo?.fullName || 'Không rõ');
          setPhone(addressInfo?.phone_number || 'Không rõ');
          setAddress(addressInfo?.addressDetail || 'Không rõ');
        
          console.warn('⚠️ Đơn hàng không có id_address.');
        
      } catch (err) {
        console.error('❌ Lỗi khi tải chi tiết đơn hàng:', err);
      }
    };

    fetchDetail();
  }, [rawId]);

  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      await updateOrderStatusApi(rawId, { status: newStatus });
      alert("✅ Cập nhật trạng thái thành công!");
    } catch (err) {
      alert("❌ Cập nhật thất bại!");
      console.error("Lỗi cập nhật trạng thái:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) {
    return <div className="p-6 text-center text-gray-600">⏳ Đang tải thông tin đơn hàng...</div>;
  }

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
            <p>Vận chuyển: <strong>{order.shipping || '...'}</strong></p>
            <p>Thanh toán: <strong>{order.paymentMethod || 'Không rõ'}</strong></p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Thông Tin Khách Hàng</h2>
            <p>Tên người nhận: <strong>{receiverName}</strong></p>
            <p>Điện thoại: {phone}</p>
            <p>Địa chỉ: {address}</p>
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
              {/* <option value="Chờ xác nhận">Chờ xác nhận</option> */}
              <option value="Đã xác nhận">Đã xác nhận</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Giao thành công">Giao thành công</option>
              {/* <option value="Hoàn hàng">Hoàn hàng</option> */}
              <option value="Hủy">Hủy</option>
            </select>
            <button
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
              onClick={handleUpdateStatus}
              disabled={isUpdating}
            >
              {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold text-lg mb-2">Sản phẩm</h2>
            <p className="text-gray-500 italic">Chưa có dữ liệu sản phẩm.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
