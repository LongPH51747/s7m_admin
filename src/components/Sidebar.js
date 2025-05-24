import React from 'react';

const Sidebar = () => (
  <div className="w-1/5 h-screen border-r p-6">
    <h2 className="font-bold text-xl mb-10">S7M STORE</h2>
    <nav className="flex flex-col gap-6">
      <a href="#" className="flex items-center gap-2">Người dùng</a>
      <a href="#" className="flex items-center gap-2">Danh mục</a>
      <a href="#" className="flex items-center gap-2">Sản phẩm</a>
      <a href="#" className="flex items-center gap-2">Đơn hàng</a>
      <a href="#" className="flex items-center gap-2">Thống kê</a>
      <a href="#" className="flex items-center gap-2">Chat</a>
    </nav>
  </div>
);

export default Sidebar;
