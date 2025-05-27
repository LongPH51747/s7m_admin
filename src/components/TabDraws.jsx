// src/components/TabDraws.jsx
import React from "react";
import "../css/TabDraws.css";
import { Link } from "react-router-dom";

const TabDraw = () => {
  return (
    <div className="tabdraw">
      <ul>
        <li><Link to="/user">👤 Người dùng</Link></li>
        <li><Link to="/category">📂 Danh mục</Link></li>
        <li><Link to="/product">🛍️ Sản phẩm</Link></li>
        <li><Link to="/order">📦 Đơn hàng</Link></li>
        <li><Link to="/statistic">📊 Thống kê</Link></li>
        <li><Link to="/chat">💬 Chat</Link></li>
      </ul>
    </div>
  );
};

export default TabDraw;
