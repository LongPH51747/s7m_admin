import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CategoryAdmin from './screens/CategoryAdmin';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import Users from './screens/Users';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
import CategoryDetailProduct from './components/CategoryDetailProduct';
import LoginPage from './screens/LoginPage';
import AdminChat from './screens/AdminChat'; // Import AdminChat component
import MainScreen from './screens/MainScreen';
import { useAuth } from './contexts/AuthContext';

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
            <Route path="/login" element={<LoginPage/>} />
            
            {/* Protected Routes for Admin */}
            {/* Mặc định chuyển đến /categories nếu là admin và đã đăng nhập */}
            <Route path="/" element={<ProtectedRoute allowedRoles={['admin']}><Navigate to="/categories" replace /></ProtectedRoute>} />
            <Route path="/categories" element={<ProtectedRoute allowedRoles={['admin']}><CategoryAdmin /></ProtectedRoute>} />
            <Route path="/category/:categorySlug" element={<ProtectedRoute allowedRoles={['admin']}><CategoryDetailScreen /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute allowedRoles={['admin']}><Orders /></ProtectedRoute>} />
            <Route path="/orders/:orderCode" element={<ProtectedRoute allowedRoles={['admin']}><OrderDetail /></ProtectedRoute>} />
            <Route path="/order-list" element={<ProtectedRoute allowedRoles={['admin']}><CategoryDetailProduct /></ProtectedRoute>} />
             <Route path="/thongke" element={<ProtectedRoute allowedRoles={['admin']}><MainScreen /></ProtectedRoute>} />
            
            {/* Thêm route cho Admin Chat */}
            <Route path="/chat" element={<ProtectedRoute allowedRoles={['admin']}><AdminChat /></ProtectedRoute>} />

            {/* Fallback route - Chuyển hướng đến /login nếu không khớp route nào */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;
