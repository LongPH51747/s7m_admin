import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-1/5 h-screen border-r p-6">
    <nav className="flex flex-col gap-6">
      <Link to="/users" className="flex items-center gap-2">Người dùng</Link>
      <Link to="/categories" className="flex items-center gap-2">Danh mục</Link>
      <Link to="/products" className="flex items-center gap-2">Sản phẩm</Link>
      <Link to="/orders" className="flex items-center gap-2">Đơn hàng</Link>
      <Link to="/statistics" className="flex items-center gap-2">Thống kê</Link>
      <Link to="/chat" className="flex items-center gap-2">Chat</Link>
    </nav>
  </div>
);

export default Sidebar;
