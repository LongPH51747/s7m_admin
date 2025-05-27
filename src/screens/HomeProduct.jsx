import React from 'react';
import TabBar from '../components/TopBar';
import Footer from '../components/Footer';
import TabDraw from '../components/TabDraws';
import ProductList from '../components/ProductList';
import '../css/HomeProduct.css'; // for layout

function HomeProduct() {
  return (
    <div className="home-page">
      <TabBar />

      <div className="main-content">
        <TabDraw />
        <ProductList />
      </div>

      <Footer />
    </div>
  );
}

export default HomeProduct;
