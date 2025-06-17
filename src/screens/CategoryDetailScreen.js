import React from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import CategoryDetailPage from '../components/CategoryDetailPage';
import TopBar from '../components/TopBar';
const CategoryDetailScreen = () => {
  const { categorySlug } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
    <TopBar />
  
    <div className="flex flex-1 overflow-hidden">
        <Sidebar />
      
      <main className="flex-1 p-6 overflow-auto">
        <CategoryDetailPage categorySlug={categorySlug} />
      </main>
    </div>
  </div>
  
  );
};

export default CategoryDetailScreen;
