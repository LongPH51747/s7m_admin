import React from 'react';

import ProductItem from '../components/ProductItem';
import '../css/HomeProduct.css'; // for layout
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
function HomeProduct() {
  return (
    <div className="home-page">
      <TopBar />

      <div className="main-content">

          <Sidebar />
      
        <main className="product-content">
          <div className="top-stats">
            <div className="stat-box">
              Tổng sản phẩm
              <b>1000</b>
            </div>
            <div className="stat-box">
              Tổng đơn hàng hôm nay
              <b>10</b>
            </div>
            <div className="stat-box">
              Doanh thu
              <b>2.000.000Đ</b>
            </div>
          </div>
          <ProductItem />
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}

export default HomeProduct;
