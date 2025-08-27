import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrderById, updateOrderStatusApi } from '../services/orderService';
import { getByIdAddress } from '../services/addressService';
import { statusMap, statusColors, statusMapUpdates } from '../utils/StatusColors';
import { updateReturnRequestStatus, getReturnRequestByOrder } from '../services/returnRequestService';

const OrderDetailPage = () => {
  const { orderCode } = useParams();
  const rawId = orderCode.replace(/^SMT/, '');

  const [order, setOrder] = useState(null);
  const [receiverName, setReceiverName] = useState('...');
  const [phone, setPhone] = useState('...');
  const [address, setAddress] = useState('...');
  const [newStatus, setNewStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [shipperInfo, setShipperInfo] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const orderData = await getOrderById(rawId);

        setOrder(orderData);
        setNewStatus(orderData.status);

        // Lấy thông tin địa chỉ người nhận
        if (orderData.id_address?._id) {
          const addressInfo = await getByIdAddress(orderData.id_address._id);
          setReceiverName(addressInfo?.fullName || 'Không rõ');
          setPhone(addressInfo?.phone_number || 'Không rõ');
          setAddress(addressInfo?.addressDetail || 'Không rõ');
        }
        console.log("day la thong tin shipper", orderData.shipper)
        // Lấy thông tin shipper
        if (orderData.shipper) {
          const foundShipper = orderData.shipper
          if (foundShipper) {
            setShipperInfo({
              name: foundShipper.name || 'Không rõ',
              phone_number: foundShipper.phone_number || '---',
              // Xử lý trường hợp `post_office` là một object
              post_office: foundShipper.address_shipping || '---'
            });
          }
        }

      } catch (err) {
        console.error('❌ Lỗi khi tải chi tiết đơn hàng:', err);
      }
    };
    fetchDetail();
  }, [rawId]);
  const handleUpdateStatus = async () => {
    try {
      setIsUpdating(true);
      if (order.status > 12 && order.status  < 19) {
        const data = await getReturnRequestByOrder(rawId);
        await updateReturnRequestStatus(data._id, {status:Number(newStatus), resolution:22});
       console.log("data.id", data);
       
      } else {
        await updateOrderStatusApi(rawId, { status: Number(newStatus) });
      }

      setOrder((prev) => ({ ...prev, status: Number(newStatus) }));
      alert("✅ Cập nhật trạng thái thành công!");
    } catch (err) {
       alert("❌ Cập nhật thất bại! Lỗi: " + (err.response?.data?.message || err.message));
      console.error("Lỗi cập nhật trạng thái:", err.response?.data?.message || err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!order) {
    return <div className="p-6 text-center text-gray-600">⏳ Đang tải thông tin đơn hàng...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 border-t-4 rounded-b-lg bg-gray-50 shadow">
      <div className="flex justify-between items-center border-b-2 pb-3 mb-4">
        <h1 className="text-xl font-bold">ĐƠN HÀNG #{orderCode}</h1>
        <span
          className={`px-4 py-1 rounded-full font-semibold text-sm capitalize ${statusColors[statusMap[order.status]] || 'bg-gray-100 text-gray-500'
            }`}
        >
          {statusMap[order.status] || 'Không rõ'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-md mb-2">Thông Tin Khách Hàng</h2>
          <p>Tên khách hàng: <strong>{receiverName}</strong></p>
          <p>Số điện thoại: {phone}</p>
          <p>Địa chỉ: {address}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold text-md mb-2">Trạng Thái Đơn Hàng</h2>
          <select
            className="w-full border px-3 py-2 rounded mb-3"
            value={newStatus}
            onChange={(e) => setNewStatus(Number(e.target.value))}
            disabled={order.status === 8}
          >
            {Object.entries(statusMapUpdates).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
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

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold text-md mb-2">Thông Tin Đặt Hàng</h2>
          <p>Ngày đặt hàng: <strong>{new Date(order.createdAt).toLocaleDateString()}</strong></p>
          <p>Chi phí vận chuyển: <strong>{order.shipping}</strong></p>
          <p>Giảm giá: <strong>{order.discount}</strong></p>
          <p>Hình thức thanh toán: <strong>{order.payment_method}</strong></p>
        </div>
        <div className="bg-gray-100 p-4 rounded shadow">
          <h2 className="font-bold text-md mb-2">Thông Tin Shipper</h2>
          {shipperInfo ? (
            <>
              <p>Tên shipper: <strong>{shipperInfo.name}</strong></p>
              <p>Số điện thoại: <strong>{shipperInfo.phone_number}</strong></p>
              <p>Khu vực: <strong>{shipperInfo.post_office}</strong></p>
            </>
          ) : (
            <p>Đang xử lý...</p>
          )}
        </div>
      </div>

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
            {/* 1. TỔNG TIỀN HÀNG */}
            <tr className="border-t font-medium">
              <td colSpan="5" className="p-2 text-right">Tổng tiền hàng</td>
              <td className="p-2">{(order.sub_total_amount || 0).toLocaleString()}</td>
            </tr>

            {/* 2. PHÍ VẬN CHUYỂN */}
            <tr className="font-medium">
              <td colSpan="5" className="p-2 text-right">Phí vận chuyển</td>
              <td className="p-2">+ {(order.shipping || 0).toLocaleString()}</td>
            </tr>

            {/* 3. GIẢM GIÁ */}
            <tr className="font-medium text-red-500">
              <td colSpan="5" className="p-2 text-right">Giảm giá</td>
              <td className="p-2">- {(order.discount || 0).toLocaleString()}</td>
            </tr>

            {/* 4. TỔNG THANH TOÁN CUỐI CÙNG */}
            <tr className="border-t font-bold text-green-700 text-base">
              <td colSpan="5" className="p-2 text-right">Tổng thanh toán</td>
              {/* Hiển thị trực tiếp `total_amount` từ backend là chính xác nhất */}
              <td className="p-2">{(order.total_amount || 0).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailPage;
