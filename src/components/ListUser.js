import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllUsers, updateUserPermission } from '../services/userServices';
import { Lock, Unlock } from 'lucide-react';

const CategoryListUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          console.warn("Dữ liệu trả về không hợp lệ:", data);
          setUsers([]);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleBlockToggle = async (id, shouldBlock) => {
    const confirmMessage = shouldBlock
      ? 'Bạn có chắc chắn muốn chặn người này không?'
      : 'Bạn có chắc chắn muốn bỏ chặn người này không?';

    if (!window.confirm(confirmMessage)) return;

    try {
      await updateUserPermission(id, { is_allowed: !shouldBlock });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === id ? { ...user, is_allowed: !shouldBlock } : user
        )
      );
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái chặn:', err);
      alert('Không thể cập nhật trạng thái chặn. Vui lòng thử lại.');
    }
  };

  const handleViewOrders = (id) => {
    navigate(`/users/${id}/orders`);
  };

  const handleViewStatistics = () => {
    navigate('/userstatistics');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullname?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === null ||
      (statusFilter === 'active' && user.is_allowed) ||
      (statusFilter === 'blocked' && !user.is_allowed);

      const isNormalUser = user.role === 'user';


    return matchesSearch && matchesStatus && isNormalUser;
  });

  return (
    <div className="p-6">
    <h1 className="text-xl font-semibold mb-4">Quản lý người dùng</h1>

<div className="flex justify-between items-center gap-4 mb-4 flex-wrap">
  {/* 📊 Nút Thống kê */}
  <button
    onClick={handleViewStatistics}
    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
  >
    📊 Thống kê mua hàng
  </button>

  <div className="flex gap-4 flex-wrap">
    <button
      onClick={() => setStatusFilter(statusFilter === 'active' ? null : 'active')}
      className={`px-4 py-2 rounded ${statusFilter === 'active' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
    >
      Hoạt động
    </button>
    <button
      onClick={() => setStatusFilter(statusFilter === 'blocked' ? null : 'blocked')}
      className={`px-4 py-2 rounded ${statusFilter === 'blocked' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
    >
      Bị chặn
    </button>
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
</div>


      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-3 border">Tên người dùng</th>
            <th className="p-3 border">Email</th>
            <th className="p-3 border">SĐT</th>
            <th className="p-3 border text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => {
            const isBlocked = user.is_allowed === false;
            return (
              <tr
                key={user._id}
                className={`border-b ${isBlocked ? 'opacity-50' : 'opacity-100'}`}
              >
                <td
                  className="p-3 border cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleViewOrders(user._id)}
                >
                  {user.fullname}
                </td>
                <td className="p-3 border">{user.email}</td>
                <td className="p-3 border">{user.telephone}</td>
                <td className="p-3 border text-center">
                  {isBlocked ? (
                    <button
                      onClick={() => handleBlockToggle(user._id, false)}
                      className="opacity-100"
                    >
                      <Lock className="text-red-500" strokeWidth={2.5} />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBlockToggle(user._id, true)}
                      className="opacity-100"
                    >
                      <Unlock className="text-green-500" strokeWidth={2.5} />
                    </button>
                  )}
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
