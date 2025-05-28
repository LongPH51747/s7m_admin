import React from 'react';
import Sidebar from '../components/Sidebar.js';
import CategoryListUser from '../components/CategoryListUser.js';
import HeaderTwo from '../components/HeaderTwo.js';
const Users = () => {
    return (
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 bg-gray-50 min-h-screen">
            <HeaderTwo />
            <CategoryListUser />
          </main>
        </div>
      );
};

export default Users;
