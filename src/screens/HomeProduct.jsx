import React from 'react';
import TabBar from '../components/TopBar';
import Footer from '../components/Footer';
import TabDraw from '../components/TabDraws';
import ProductItem from '../components/ProductItem';
import '../css/HomeProduct.css'; // for layout

function HomeProduct() {
  return (
    <div className="home-page">
      <TabBar />

      <div className="main-content">
        <div className="sidebar">
          <TabDraw />
        </div>
        <div className="product-content">
          <div className="top-stats">
            <div className="stat-box">Tổng sản phẩm: <b>1000</b></div>
            <div className="stat-box">Tổng đơn hàng hôm nay: <b>10</b></div>
            <div className="stat-box">Doanh thu: <b>2.000.000Đ</b></div>
          </div>
          <ProductItem />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomeProduct;
