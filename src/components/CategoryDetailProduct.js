import React, { useState } from 'react';

const orders = [
  { code: 'MDI9303', customer: 'Nguyễn Văn A', date: '2025-05-02', status: 'Thành công' },
  { code: 'BH62744', customer: 'Trần Trương B', date: '2025-03-15', status: 'Đang giao' },
  { code: 'KH817363', customer: 'Phan Mạnh Q', date: '2025-02-30', status: 'Chờ xác nhận' },
  { code: 'PJ717284', customer: 'Nguyễn Tuấn H', date: '2025-01-14', status: 'Thành công' },
  { code: 'UH62735', customer: 'Đàm Vĩnh L', date: '2024-07-22', status: 'Đang giao' },
  { code: 'AH27362', customer: 'Thích Là Nhích', date: '2023-05-26', status: 'Hoàn hàng' },
];

const statusColors = {
  'Thành công': 'bg-green-200 text-green-800',
  'Đang giao': 'bg-orange-300 text-white',
  'Chờ xác nhận': 'bg-yellow-200 text-black',
  'Hoàn hàng': 'bg-red-600 text-white',
};

const CategoryDetailProduct = () => {
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredOrders = orders
    .filter((order) => order.customer.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      return sortAsc
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });

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
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="border rounded px-4 py-2"
        >
          Sắp xếp ⬍
        </button>
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
              <tr key={index} className="bg-gray-50 border-b">
                <td className="p-3 font-medium">{order.code}</td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.date}</td>
                <td className="p-3">
                  <span
                    className={`px-4 py-1 rounded-full font-semibold text-sm ${statusColors[order.status]}`}
                  >
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
