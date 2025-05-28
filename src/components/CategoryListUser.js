import React, { useState } from 'react';

const sampleUsers = [
  {
    id: 1,
    name: 'Đinh Gia Bảo',
    email: 'bao123@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 2,
    name: 'Lê Thành Long',
    email: 'longden@gmail.com',
    phone: '0987654321',
    address: 'Hà Đông - Hà Nội',
  },
  {
    id: 3,
    name: 'Hạ Việt Hải',
    email: 'haiviet@gmail.com',
    phone: '0987654321',
    address: 'Chương Mỹ - Hà Nội',
  },
  {
    id: 4,
    name: 'Đinh Tiến Đạt',
    email: 'datAnCut@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 5,
    name: 'Hoàng Thùy Linh',
    email: 'linhthuy@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 6,
    name: 'Đinh Gia Bảo',
    email: 'bao123@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 7,
    name: 'Đinh Gia Bảo',
    email: 'bao123@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 8,
    name: 'Đinh Gia Bảo',
    email: 'bao123@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 9,
    name: 'Đinh Gia Bảo',
    email: 'bao123@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
  {
    id: 10,
    name: 'Đinh Gia Bảo',
    email: 'bao123@gmail.com',
    phone: '0987654321',
    address: 'Tiên Nội Duy Tiên Hà Nam',
  },
];

const CategoryListUser = () => {
  const [search, setSearch] = useState('');
  const [blockedUsers, setBlockedUsers] = useState({});

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleBlockToggle = (id) => {
    setBlockedUsers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredUsers = sampleUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Quản lý người dùng</h1>

      <div className="flex justify-end gap-4 mb-4">
        <button className="bg-gray-200 px-4 py-2 rounded">Top 10</button>
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm"
            className="border rounded px-3 py-2 pr-10"
          />
          <span className="absolute right-3 top-2.5">🔍</span>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">SĐT</th>
            <th className="p-3 border">Địa chỉ</th>
            <th className="p-3 border text-center">Chặn</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-3 border">{user.name}</td>
              <td className="p-3 border">{user.email}</td>
              <td className="p-3 border">{user.phone}</td>
              <td className="p-3 border">{user.address}</td>
              <td className="p-3 border text-center">
                <input
                  type="checkbox"
                  checked={!!blockedUsers[user.id]}
                  onChange={() => handleBlockToggle(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryListUser;
