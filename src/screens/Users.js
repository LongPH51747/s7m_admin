import React from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import CategoryListUser from '../components/CategoryListUser.js';
const Users = () => {
    return (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 min-h-screen">
            <Header />
            <CategoryListUser />
          </main>
        </div>
      );
};

export default Users;
