import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductItem from '../components/ProductItem';
import '../css/HomeProduct.css'; // for layout
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { ENDPOINTS } from '../config/api';
import { getAllOrder } from '../services/orderService';

function HomeProduct() {
  // State để lưu thống kê sản phẩm
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu thống kê khi component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Gọi API song song để lấy sản phẩm và đơn hàng
        const [productsResponse, ordersData] = await Promise.all([
          axios.get(ENDPOINTS.GET_PRODUCTS, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          }),
          getAllOrder()
        ]);

        // Tính tổng sản phẩm
        const totalProducts = productsResponse.data?.length || 0;

        // Tính tổng đơn hàng
        const totalOrders = ordersData?.length || 0;

        // Tính đơn hàng hôm nay
        const today = new Date().toDateString();
        const todayOrders = Array.isArray(ordersData) 
          ? ordersData.filter(order => {
              const orderDate = new Date(order.createdAt).toDateString();
              return orderDate === today;
            }).length 
          : 0;

        // Tính tổng doanh thu từ tất cả đơn hàng
        let totalRevenue = 0;
        if (Array.isArray(ordersData)) {
          totalRevenue = ordersData.reduce((sum, order) => {
            // Sử dụng total_amount hoặc sub_total_amount từ order
            const orderTotal = order.total_amount || order.sub_total_amount || 0;
            return sum + orderTotal;
          }, 0);
        }

        // Cập nhật state
        setStats({
          totalProducts,
          totalOrders,
          todayOrders,
          totalRevenue
        });
        
        console.log('📊 Thống kê:', {
          totalProducts,
          totalOrders,
          todayOrders,
          totalRevenue: totalRevenue.toLocaleString('vi-VN')
        });

      } catch (error) {
        console.error('❌ Lỗi khi lấy thống kê:', error);
        // Giữ nguyên giá trị mặc định nếu có lỗi
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Hàm format số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="home-page">
      <TopBar />

      <div className="main-content">
        <Sidebar />
      
        <main className="product-content">
          <div className="top-stats">
            <div className="stat-box">
              Tổng sản phẩm
              <b>{loading ? '...' : stats.totalProducts.toLocaleString('vi-VN')}</b>
            </div>
            <div className="stat-box">
              Đơn hàng hôm nay
              <b>{loading ? '...' : stats.todayOrders.toLocaleString('vi-VN')}</b>
            </div>
            <div className="stat-box">
              Doanh thu
              <b>{loading ? '...' : formatCurrency(stats.totalRevenue)}</b>
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
