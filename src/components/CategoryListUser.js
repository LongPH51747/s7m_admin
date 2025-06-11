import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserPermission } from '../services/userServices';

const CategoryListUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [blockedUsers, setBlockedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);

       
        const initialBlocked = {};
        data.forEach(user => {
          initialBlocked[user._id] = !user.is_allowed;
        });
        setBlockedUsers(initialBlocked);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleBlockToggle = async (id) => {
    const isCurrentlyBlocked = blockedUsers[id];
    const confirmMessage = isCurrentlyBlocked
      ? 'Bạn có chắc chắn muốn bỏ chặn người này không?'
      : 'Bạn có chắc chắn muốn chặn người này không?';

    if (!window.confirm(confirmMessage)) return;

    const newBlocked = !isCurrentlyBlocked;

    try {
      
      await updateUserPermission(id, !newBlocked); 

      // Cập nhật UI
      setBlockedUsers((prev) => ({
        ...prev,
        [id]: newBlocked,
      }));
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái chặn:', err);
      alert('Không thể cập nhật trạng thái chặn. Vui lòng thử lại.');
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-6">Quản lý người dùng</h1>

      <div className="flex justify-end gap-4 mb-4">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm theo họ tên"
            className="border rounded px-3 py-2 pr-10"
          />
          <span className="absolute right-3 top-2.5">🔍</span>
        </div>
      </div>

      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Họ và tên</th>
            <th className="p-3 border">Tên người dùng</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">SĐT</th>
            <th className="p-3 border">Địa chỉ</th>
            <th className="p-3 border text-center">Chặn</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
            const isBlocked = blockedUsers[user._id];
            return (
              <tr
                key={user._id}
                className={`border-b transition-opacity duration-300 ${isBlocked ? 'opacity-50' : 'opacity-100'}`}
              >
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.fullname}</td>
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.username}</td>
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.email}</td>
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.telephone}</td>
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.address || 'N/A'}</td>
                <td className="p-3 border text-center">
                  <input
                    type="checkbox"
                    checked={!!isBlocked}
                    onChange={() => handleBlockToggle(user._id)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryListUser;
