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
setOrder((prev) => ({ ...prev, status: newStatus }));
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
    <div className="max-w-5xl mx-auto p-6 border-t-4 rounded-b-lg bg-gray-50 shadow">
  {/* Header */}
  <div className="flex justify-between items-center border-b-2 border-black-400 pb-3 mb-4">
    <h1 className="text-xl font-bold">ĐƠN HÀNG #{orderCode}</h1>
    <span
  className={`px-4 py-1 rounded-full font-semibold text-sm capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}
>
  {order.status}
</span>

  </div>

  {/* Thông tin khách + trạng thái */}
  <div className="grid grid-cols-2 gap-6 mb-6">
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-md mb-2">Thông Tin Khách Hàng</h2>
      <p>Tên khách hàng: <strong>{receiverName}</strong></p>
      {/* <p>Email: {order.email || 'Không có'}</p> */}
      <p>Số điện thoại: {phone}</p>
      <p>Địa chỉ: {address}</p>
    </div>

    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-bold text-md mb-2">Trạng Thái Đơn Hàng</h2>
      <select
        className="w-full border px-3 py-2 rounded mb-3"
        value={newStatus}
        onChange={(e) => setNewStatus(e.target.value)}
      >
        <option value="Đã xác nhận">Đã xác nhận</option>
        <option value="Đang giao">Đang giao</option>
        <option value="Giao thành công">Giao thành công</option>
        <option value="Hủy">Hủy</option>
      </select>
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 w-full"
        onClick={handleUpdateStatus}
        disabled={isUpdating}
      >
        {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
      </button>
    </div>
  </div>

  {/* Thông tin đặt hàng */}
  <div className="bg-gray-100 p-4 rounded mb-6">
    <h2 className="font-bold text-md mb-2">Thông Tin Đặt Hàng</h2>
    <p>Ngày đặt hàng: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
    <p>Hình thức vận chuyển: <strong>{order.shipping}</strong></p>
    <p>Hình thức thanh toán: <strong>{order.paymentMethod}</strong></p>
  </div>

  {/* Danh sách đơn hàng */}
  <div className="bg-white p-4 rounded shadow">
    <h2 className="font-bold text-lg mb-4">Đơn Hàng</h2>
    <table className="w-full text-left border-collapse text-sm">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2">Sản phẩm</th>
          <th className="p-2">color</th>
          <th className="p-2">size</th>
          <th className="p-2">Số lượng</th>
          <th className="p-2">Giá tiền</th>
          <th className="p-2">Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        {order.orderItems.map((item, index) => (
          <tr key={index} className="border-t text-sm">
            <td className="p-2">{item.name_product}</td>
            <td className="p-2">{item.color}</td>
            <td className="p-2">{item.size}</td>
            <td className="p-2">{item.quantity}</td>
            <td className="p-2">{item.unit_price_item}</td>
            <td className="p-2">{item.total_price_item}</td>
          </tr>
        ))}
      </tbody>
      <tfoot className="text-sm">
  <tr className="border-t font-medium">
    <td colSpan="5" className="p-2 text-right">Tổng tiền</td>
    <td className="p-2">{order.sub_total_amount.toLocaleString()}</td>
  </tr>
  <tr className="font-medium">
    <td colSpan="5" className="p-2 text-right">Shipping</td>
    <td className="p-2">{(order.shipping || 0).toLocaleString()}</td>
  </tr>
  <tr className="border-t font-bold text-green-700 text-base">
    <td colSpan="5" className="p-2 text-right">Thanh toán</td>
    <td className="p-2">{(order.total_amount - (order.voucher || 0)).toLocaleString()}</td>
  </tr>
</tfoot>

    </table>
  </div>
</div>

  );
};

export default OrderDetailPage;
