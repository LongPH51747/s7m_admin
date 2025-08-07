import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Bookmark,
  Package,
  Inbox,
  BarChart2,
  MessageCircle,
  TruckIcon
} from 'lucide-react';

const Sidebar = () => (
  <div className="w-1/5 h-screen border-r p-6">
    <nav className="flex flex-col gap-6 text-[17px]">
      <Link to="/users" className="flex items-center gap-3 hover:text-blue-600">
        <User size={20} />
        Người dùng
      </Link>
      <Link to="/categories" className="flex items-center gap-3 hover:text-blue-600">
        <Bookmark size={20} />
        Danh mục
      </Link>
      <Link to="/products" className="flex items-center gap-3 hover:text-blue-600">
        <Package size={20} />
        Sản phẩm
      </Link>
      <Link to="/orders" className="flex items-center gap-3 hover:text-blue-600">
        <Inbox size={20} />
        Đơn hàng
      </Link>
      <Link to="/statistics" className="flex items-center gap-3 hover:text-blue-600">
        <BarChart2 size={20} />
        Thống kê
      </Link>
      <Link to="/chat" className="flex items-center gap-3 hover:text-blue-600">
        <MessageCircle size={20} />
        Chat
      </Link>
       <Link to="/shipper" className="flex items-center gap-3 hover:text-blue-600">
        <TruckIcon size={20} />
        Shipper
      </Link>
    </nav>
  </div>
);

export default Sidebar;
