import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Slider from '../components/Slider';
import CategoryList from '../components/CategoryList';
import HeaderTwo from '../components/HeaderTwo';

const CategoryAdmin = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header chiếm toàn bộ chiều ngang */}
      <div className="w-full">
        <HeaderTwo />
      </div>

      {/* Phần nội dung chia thành sidebar + main content */}
      <div className="flex flex-1">
        {/* Sidebar bên trái */}
        <Sidebar />

        {/* Nội dung chính */}
        <main className="flex-1 p-6 bg-gray-50 flex flex-col">
          <Slider />

          {/* CategoryList ở dưới cùng của nội dung chính */}
          <div className="mt-auto">
            <CategoryList />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CategoryAdmin;
