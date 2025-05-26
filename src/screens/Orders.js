import React from "react";
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import CategoryDetailProduct from "../components/CategoryDetailProduct.js";
const Orders = () => {
    return (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 min-h-screen">
            <Header />
            <CategoryDetailProduct />
          </main>
        </div>
      );
};
export default Orders;