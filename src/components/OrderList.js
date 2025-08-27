import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllOrder } from '../services/orderService';
import { getAllUsers } from '../services/userServices';
import { statusMap, statusColors } from '../utils/StatusColors';

// Mảng này định nghĩa các nút bấm lọc trên giao diện
const statuses = [
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đang giao',
  'Giao thành công',
  'Đã nhận',
  'Hoàn hàng',
  'Đã hủy',
];

const CategoryDetailProduct = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect để fetch dữ liệu khi component được tải
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, userData] = await Promise.all([
          getAllOrder(),
          getAllUsers()
        ]);
        setOrders(orderData);
        setUsers(userData);
      } catch (error)      {
          console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, [location]); // Fetch lại khi URL thay đổi

  // Logic lọc danh sách đơn hàng
  const filteredOrders = orders
    .filter(order => {
      // 1. Lọc theo mã đơn hàng
      const searchMatch = (`SMT${order._id}`).toLowerCase().includes(search.toLowerCase());

      // 2. Lọc theo trạng thái
      if (!statusFilter) {
        return searchMatch; // Nếu không có bộ lọc trạng thái, chỉ cần khớp tìm kiếm
      }

      // Chuyển status sang SỐ để so sánh một cách an toàn và đáng tin cậy
      const statusNumber = Number(order.status);

      if (statusFilter === 'Hoàn hàng') {
        // Lọc tất cả các trạng thái trong quy trình hoàn hàng (13 đến 18)
        return searchMatch && statusNumber > 12 && statusNumber < 19;
      } else {
        // Logic lọc thông thường cho các trạng thái khác
        return searchMatch && statusMap[statusNumber] === statusFilter;
      }
    })
    .reverse(); // Đảo ngược để đơn hàng mới nhất lên đầu

  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.fullname || user?.username || user?.email || 'Không rõ';
  };
  
  // const handleRowClick = (order) => {
  //   const statusNumber = Number(order.status);
  //   if (statusNumber > 12 && statusNumber < 19) {
  //     // Điều hướng đến trang chi tiết đơn hàng hoàn
  //     navigate(`/return-orders/SMT${order._id}`);
  //   } else {
  //     // Điều hướng đến trang chi tiết đơn hàng thông thường
  //     navigate(`/orders/SMT${order._id}`);
  //   }
  // };

  const handleRowClick = (order) => {
  const statusNumber = Number(order.status);
  if (statusNumber >= 13 && statusNumber <= 18) {
    navigate(`/return-details/SMT${order._id}`);
  } else {
    navigate(`/orders/SMT${order._id}`);
  }
};

  return (
  <div className="p-6">
    {/* Header + Nút quản lý hàng hoàn */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Đơn hàng</h1>
      <button
        onClick={() => navigate('/return-requests')}
        className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600"
      >
        Lịch sử hàng hoàn
      </button>
    </div>

    {/* Thanh lọc trạng thái + tìm kiếm */}
    <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
      {/* Nhóm nút trạng thái */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            className={`px-3 py-1 rounded transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Ô tìm kiếm */}
      <input
        type="text"
        placeholder="Tìm kiếm theo mã đơn"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2"
      />
    </div>

    {/* Bảng danh sách đơn hàng */}
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Mã đơn hàng</th>
            <th className="p-3">Tên người đặt</th>
            <th className="p-3">Người nhận</th>
            <th className="p-3">Ngày đặt hàng</th>
            <th className="p-3">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order._id}
              className="bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => handleRowClick(order)}
            >
              <td className="p-3 font-medium">SMT{order._id}</td>
              <td className="p-3">{getUserNameById(order.userId)}</td>
              <td className="p-3">{order.id_address?.fullName || '...'}</td>
              <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td className="p-3">
                <span
                  className={`px-4 py-1 rounded-full font-semibold text-sm ${
                    statusColors[statusMap[order.status]] || 'bg-gray-200'
                  }`}
                >
                  {statusMap[order.status] || 'Không rõ'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default CategoryDetailProduct;