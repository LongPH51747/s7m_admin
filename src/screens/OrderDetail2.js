import React from "react";
import Sidebar from '../components/Sidebar.js';
import OrderDetailPage2 from "../components/OrderDetailPage2.js";
import TopBar from "../components/TopBar.js";
const OrderDetail2 = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Phần nội dung chia sidebar và main content */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50">
          <OrderDetailPage2 />
        </main>
      </div>
    </div>
  );
};

export default OrderDetail2;
