import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';

import statusColors from '../utils/StatusColors';


const CategoryDetailProduct = () => {
  const { orders } = useOrders();
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const navigate = useNavigate();

  const filteredOrders = orders
    .filter(order => order.code.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Đơn hàng</h1>

      <div className="flex gap-4 justify-end mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 pr-10"
          />
          <span className="absolute right-3 top-2.5">🔍</span>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full table-auto text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Mã đơn hàng</th>
              <th className="p-3">Tên khách hàng</th>
              <th className="p-3">Ngày đặt hàng</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={index}
                className="bg-gray-50 border-b cursor-pointer hover:bg-gray-100"
                onClick={() => navigate(`/orders/${order.code}`)}
              >
                <td className="p-3 font-medium">{order.code}</td>
                <td className="p-3">{order.customer?.name}</td>
                <td className="p-3">{order.date}</td>
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
