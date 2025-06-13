import React from 'react';
import Sidebar from '../components/Sidebar.js';
import CategoryListUser from '../components/ListUser.js';
import HeaderTwo from '../components/HeaderTwo.js';

const Users = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <HeaderTwo />

      {/* Phần nội dung chia sidebar và main content */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50">
          <CategoryListUser />
        </main>
      </div>
    </div>
  );
};

export default Users;
