import React from "react";
import Sidebar from '../components/Sidebar.js';
import HeaderTwo from "../components/HeaderTwo.js";
import OrderDetailPage from "../components/OrderDetailPage.js";
import TopBar from "../components/TopBar.jsx";
const OrderDetail = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Phần nội dung chia sidebar và main content */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50">
          <OrderDetailPage />
        </main>
      </div>
    </div>
  );
};

export default OrderDetail;
