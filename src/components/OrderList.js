import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrder } from '../services/orderService';
import { getAllUsers } from '../services/userServices';
import statusColors from '../utils/StatusColors';

const CategoryDetailProduct = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const navigate = useNavigate();

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
  }, []);

  const filteredOrders = orders
    .filter(order =>
      order._id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) =>
      sortAsc
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const getUserNameById = (userId) => {
    const user = users.find(u => u._id === userId);
    return user?.username || 'Không rõ';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng</h1>

      <div className="flex gap-4 justify-end mb-4">
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
                onClick={() => navigate(`/orders/${order._id}`)}
              >
                <td className="p-3 font-medium">{order._id}</td>
                <td className="p-3">{getUserNameById(order.userId)}</td>
                <td className="p-3">{order.id_address}</td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-3">
                  <span className={`px-4 py-1 rounded-full font-semibold text-sm ${statusColors[order.status]}`}>
                    {order.status}
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
