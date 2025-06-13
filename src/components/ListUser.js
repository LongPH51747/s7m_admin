import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserPermission } from '../services/userServices';

const CategoryListUser = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        console.log("day la user", data);

        // Đảm bảo data là một mảng
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.data)) { // Trường hợp API trả về { data: [...] }
          setUsers(data.data);
        } else {
          console.warn("Dữ liệu trả về từ getAllUsers không phải là mảng hợp lệ:", data);
          setUsers([]);
        }
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
    console.log("id truyen vao: ", id);
    
    const userToToggle = users.find(user => user._id === id);
    
    console.log(userToToggle._id);
    
    if (!userToToggle) {
      console.error("Không tìm thấy người dùng với ID:", id);
      return;
    }

    // Xác định trạng thái hiện tại của `is_allowed`
    // Nếu `is_allowed` là true, tức là người dùng hiện đang được phép (chưa bị chặn)
    // Nếu `is_allowed` là false, tức là người dùng hiện đang bị chặn
    const isCurrentlyAllowed = userToToggle.is_allowed;

    const confirmMessage = isCurrentlyAllowed
      ? 'Bạn có chắc chắn muốn chặn người này không?' // Hiện tại đang được phép, hỏi chặn
      : 'Bạn có chắc chắn muốn bỏ chặn người này không?'; // Hiện tại đang bị chặn, hỏi bỏ chặn

    if (!window.confirm(confirmMessage)) return;

    // Trạng thái `is_allowed` mới sẽ là ngược lại của trạng thái hiện tại
    const newIsAllowedStatus = !isCurrentlyAllowed;

    try {
      // Gửi request cập nhật trạng thái mới
      // payload là { is_allowed: true/false }
      await updateUserPermission(id, { is_allowed: newIsAllowedStatus });

      // Cập nhật UI: Tạo một bản sao của mảng users và cập nhật user cụ thể
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, is_allowed: newIsAllowedStatus } : user
        )
      );
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
            <th className="p-3 border">Tên người dùng</th>
            {/* <th className="p-3 border">Tên người dùng</th> */}
            <th className="p-3 border">Email</th>
            <th className="p-3 border">SĐT</th>
            {/* <th className="p-3 border">Địa chỉ</th> */}
            <th className="p-3 border text-center">Trạng thái</th> {/* Đổi tên cột */}
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => {
            // `isBlocked` là true nếu `is_allowed` là false
            const isBlocked = user.is_allowed === false;
            return (
              <tr
                key={user._id}
                className={`border-b transition-opacity duration-300 ${isBlocked ? 'opacity-50' : 'opacity-100'}`}
              >
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.fullname}</td>
                {/* <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.username}</td> */}
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.email}</td>
                <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.telephone}</td>
                {/* <td className={`p-3 border ${isBlocked ? 'font-normal' : 'font-semibold'}`}>{user.address || 'N/A'}</td> */}
                <td className="p-3 border text-center">
                  <input
                    type="checkbox"
                    checked={isBlocked} // Checkbox được chọn nếu người dùng BỊ chặn (is_allowed === false)
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