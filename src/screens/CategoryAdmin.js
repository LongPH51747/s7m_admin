import React from 'react';
import Sidebar from '../components/Sidebar.js';
import Header from '../components/Header.js';
import Slider from '../components/Slider.js';
import CategoryList from '../components/CategoryList.js';

const CategoryAdmin = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Header />
        <Slider />
        <CategoryList />
      </main>
    </div>
  );
};

export default CategoryAdmin;
