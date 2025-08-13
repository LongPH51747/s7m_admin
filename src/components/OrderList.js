import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllOrder } from '../services/orderService';
import { getAllUsers } from '../services/userServices';
import { statusMap, statusColors } from '../utils/StatusColors';

const statuses = [
  'Chờ xác nhận',
  'Đã xác nhận',
  'Đang giao',
  'Giao thành công',
  'Đã nhận',
  'Hoàn hàng',
  'Hủy',
];

const CategoryDetailProduct = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, userData] = await Promise.all([
          getAllOrder(),
          getAllUsers()
        ]);
        setOrders(orderData);
        setUsers(userData);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };
    fetchData();
  }, [location]);

  const filteredOrders = orders
    .filter(order =>
      (`SMT${order._id}`).toLowerCase().includes(search.toLowerCase()) &&
      (!statusFilter || statusMap[order.status] === statusFilter)
    )
    .reverse();

  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.username || 'Không rõ';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng</h1>

      <div className="flex gap-2 justify-end mb-4 items-center">
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(statusFilter === status ? null : status)}
            className={`px-3 py-1 rounded ${statusFilter === status ? statusColors[status] : 'bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>

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
                onClick={() => navigate(`/orders/SMT${order._id}`)}
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

