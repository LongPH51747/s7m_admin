import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CategoryDetailPage from '../components/CategoryDetailPage';

const CategoryDetailScreen = () => {
  const { categorySlug } = useParams();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50 min-h-screen">
        <Header />
        <CategoryDetailPage categorySlug={categorySlug} />
      </main>
    </div>
  );
};

export default CategoryDetailScreen;
