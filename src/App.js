import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CategoryAdmin from './screens/CategoryAdmin';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import Users from './screens/Users';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
import CategoryDetailProduct from './components/OrderList';
import { OrderProvider } from './contexts/OrderContext';
import "./App.css";
import LoginPage from "./screens/LoginPage.js";
import HomeProduct from "./screens/HomeProduct.js";
import DetailProduct from "./screens/DetailProduct.js";
import ProductScreen from "./screens/ProductScreen.js";
import AddProduct from './screens/AddProduct.js';
import UpdateProduct from './screens/UpdateProduct.js';
import UpdateVariant from './screens/UpdateVariant.js';
// import CategoryDetailProduct from './components/CategoryDetailProduct';
// import LoginPage from './screens/LoginPage';
import AdminChat from './screens/AdminChat'; // Import AdminChat component
import MainScreen from './screens/MainScreen';
import { useAuth } from './contexts/AuthContext';
import UserOrderHistory from './screens/UserOrderHistory.js';
import UserStatistics from './screens/UserStatistic.js';
import ThongKeDoanhThu from './screens/ThongKeDoanhThu.js';
import VoucherScreen from './screens/VoucherScreen.js';
import VoucherDisplayScreen from './screens/VoucherScreen.js';
import ShipperScreen from './screens/ShipperScreen.js'
import ShipperDetailPage from './screens/ShipperDetailPage';
import PostOfficePage from './screens/PostOfficePage';

// ProtectedRoute component đã được cung cấp
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, loadingAuth, user } = useAuth();
    if (loadingAuth) return <div>Đang tải xác thực...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />; // Nếu không xác thực, chuyển về login
    if (allowedRoles && !allowedRoles.includes(user?.role)) { // Kiểm tra user?.role để tránh lỗi nếu user là null/undefined
        alert('Bạn không có quyền truy cập trang này hoặc vai trò không hợp lệ.');
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        // AuthProvider, SocketProvider, OrderProvider đã được đặt ở index.js
        <Routes>
          {/* <Route path="/" element={<LoginPage />} />
            {/* <Route path="/" element={<CategoryAdmin />} /> */}
            {/* <Route path="/" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/categories" element={<CategoryAdmin />} />
          <Route path="/category/:categorySlug" element={<CategoryDetailScreen />} />
          <Route path="/users" element={<Users />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:orderCode" element={<OrderDetail />} />
          <Route path="/order-list" element={<CategoryDetailProduct />} />
          */}
            {/* Protected Routes for Admin */}
            {/* Mặc định chuyển đến /categories nếu là admin và đã đăng nhập */}
          {/* 
          <Route path="/categories" element={<ProtectedRoute allowedRoles={['admin']}><CategoryAdmin /></ProtectedRoute>} />
          <Route path="/category/:categorySlug" element={<ProtectedRoute allowedRoles={['admin']}><CategoryDetailScreen /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute allowedRoles={['admin']}><Orders /></ProtectedRoute>} />
          <Route path="/orders/:orderCode" element={<ProtectedRoute allowedRoles={['admin']}><OrderDetail /></ProtectedRoute>} />
          <Route path="/order-list" element={<ProtectedRoute allowedRoles={['admin']}><CategoryDetailProduct /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute allowedRoles={['admin']}><DetailProduct /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute allowedRoles={['admin']}><ProductScreen /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute allowedRoles={['admin']}><AddProduct /></ProtectedRoute>} />
          <Route path="/products/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><UpdateProduct /></ProtectedRoute>} />
          
          <Route path="/update-product/:id" element={<ProtectedRoute allowedRoles={['admin']}><UpdateProduct /></ProtectedRoute>} />
          <Route path="/update-variant/:id" element={<ProtectedRoute allowedRoles={['admin']}><UpdateVariant /></ProtectedRoute>} /> */}
            
            {/* Thêm route cho Admin Chat */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute allowedRoles={['admin']}><Navigate to="/home" replace /></ProtectedRoute>} />
            <Route path="/chat" element={<ProtectedRoute allowedRoles={['admin']}><AdminChat /></ProtectedRoute>} />

            {/* Fallback route - Chuyển hướng đến /login nếu không khớp route nào */}
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/* Protected Routes for Admin */}
            {/* Mặc định chuyển đến /categories nếu là admin và đã đăng nhập */}
            {/* <Route path="/" element={<ProtectedRoute allowedRoles={['admin']}><Navigate to="/categories" replace /></ProtectedRoute>} /> */}
            <Route path="/categories" element={<ProtectedRoute allowedRoles={['admin']}><CategoryAdmin /></ProtectedRoute>} />
            {/* <Route path="/home" element={<HomeProduct />} /> */}
            {/* <Route path="/product/:id" element={<DetailProduct />} /> */}
            {/* <Route path="/products" element={<ProductScreen />} /> */}
            {/* <Route path="/add-product" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<UpdateProduct />} /> */}
            <Route path="/home" element={<ProtectedRoute allowedRoles={['admin']}><HomeProduct /></ProtectedRoute>} />
            <Route path="/category/:categorySlug" element={<ProtectedRoute allowedRoles={['admin']}><CategoryDetailScreen /></ProtectedRoute>} />
            <Route path="/product/:id" element={<ProtectedRoute allowedRoles={['admin']}><DetailProduct /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute allowedRoles={['admin']}><ProductScreen /></ProtectedRoute>} />
            <Route path="/add-product" element={<ProtectedRoute allowedRoles={['admin']}><AddProduct /></ProtectedRoute>} />
            <Route path="/products/edit/:id" element={<ProtectedRoute allowedRoles={['admin']}><UpdateProduct /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['admin']}><Orders /></ProtectedRoute>} />
            <Route path="/orders/:orderCode" element={<ProtectedRoute allowedRoles={['admin']}><OrderDetail /></ProtectedRoute>} />
            <Route path="/order-list" element={<ProtectedRoute allowedRoles={['admin']}><CategoryDetailProduct /></ProtectedRoute>} />
            <Route path="/thongke" element={<ProtectedRoute allowedRoles={['admin']}><MainScreen/></ProtectedRoute>} />
            {/* Thêm route cho Admin Chat */}
            <Route path="/chat" element={<ProtectedRoute allowedRoles={['admin']}><AdminChat /></ProtectedRoute>} />
             <Route path="/shipper" element={<ProtectedRoute allowedRoles={['admin']}><ShipperScreen /></ProtectedRoute>} />
            <Route path="/shippers/:shipperId" element={<ProtectedRoute allowedRoles={['admin']}><ShipperDetailPage /></ProtectedRoute>} />
            <Route path="/post-offices" element={<ProtectedRoute allowedRoles={['admin']}><PostOfficePage /></ProtectedRoute>} />
            <Route path="/userstatistics" element={<ProtectedRoute allowedRoles={['admin']}><UserStatistics/></ProtectedRoute>}/>
            <Route path="/voucher" element={<ProtectedRoute allowedRoles={['admin']}><VoucherDisplayScreen/></ProtectedRoute>} />
            {/* Fallback route - Chuyển hướng đến /login nếu không khớp route nào */}
            <Route path="*" element={<Navigate to="/login" replace />} />
            <Route path="/update-product/:id" element={<UpdateProduct />} />
            <Route path="/update-variant/:id" element={<UpdateVariant />} />
            <Route path="/users/:id/orders" element={<UserOrderHistory />} />
        </Routes>
    );
}

export default App;
