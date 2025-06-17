import React from "react";
import Sidebar from '../components/Sidebar.js';
import HeaderTwo from "../components/HeaderTwo.js";
import CategoryDetailProduct from "../components/OrderList.js";
import TopBar from "../components/TopBar.js";
const Orders = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <TopBar />

      {/* Phần nội dung chia sidebar và main content */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50">
          <CategoryDetailProduct />
        </main>
      </div>
    </div>
  );
};

export default Orders;
