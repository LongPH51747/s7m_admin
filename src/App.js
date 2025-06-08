import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Thêm Navigate

// Các Screens/Pages hiện có của bạn
import CategoryAdmin from './screens/CategoryAdmin';
import CategoryDetailScreen from './screens/CategoryDetailScreen';
import Users from './screens/Users';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';

// Các Component dùng Context (nếu chúng được render bởi một Route)
import CategoryDetailProduct from './components/CategoryDetailProduct';

// Page Đăng nhập
import LoginPage from './screens/LoginPage'; // Đảm bảo tên file và import chính xác

// Import các Providers cần thiết
import { OrderProvider } from './contexts/OrderContext';
import { useAuth } from './contexts/AuthContext'; // Chỉ cần useAuth cho ProtectedRoute
import { SocketProvider } from './contexts/SocketContext'; // Import SocketProvider


// ProtectedRoute Component:
// Dùng để bảo vệ các route yêu cầu đăng nhập và/hoặc vai trò cụ thể
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, loadingAuth, user } = useAuth(); // Lấy trạng thái xác thực từ AuthContext

    if (loadingAuth) {
        // Hiển thị một spinner hoặc thông báo loading trong khi xác thực đang diễn ra
        return <div>Loading authentication...</div>;
    }

    // Nếu chưa đăng nhập hoặc không có thông tin user
    if (!isAuthenticated || !user) {
        // Chuyển hướng về trang đăng nhập
        return <Navigate to="/login" replace />;
    }

    // Nếu đã đăng nhập nhưng vai trò không khớp với vai trò được phép
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        alert('Bạn không có quyền truy cập trang này hoặc vai trò không hợp lệ.');
        // Có thể chuyển hướng về trang lỗi, trang chủ, hoặc trang đăng nhập tùy ý
        return <Navigate to="/login" replace />;
    }

    return children; // Cho phép truy cập vào component con nếu đủ điều kiện
};

function App() {
    return (
        // Các Providers khác có thể nằm ở đây, bên trong AuthProvider và SocketProvider nếu cần truy cập chúng
        // OrderProvider có thể nằm ở đây hoặc cao hơn trong index.js tùy thuộc vào phạm vi sử dụng của nó
        // Nếu CategoryDetailProduct cần OrderContext, thì OrderProvider nên bao bọc nó.
        <SocketProvider> {/* SocketProvider phải nằm trong AuthProvider (đã ở index.js) và trước các routes cần socket */}
            <OrderProvider> {/* Đặt OrderProvider ở đây để các routes admin có thể dùng OrderContext */}
                <Routes>
                    {/* Route cho trang đăng nhập - KHÔNG BẢO VỆ */}
                    <Route path="/login" element={<LoginPage />} />

                    {/*
                        Các routes dành cho Admin, được bảo vệ bởi ProtectedRoute.
                        Chỉ admin mới có thể truy cập các trang này.
                        Sử dụng allowedRoles={['admin']} để chỉ cho phép vai trò 'admin'.
                    */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CategoryAdmin />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CategoryAdmin />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/category/:categorySlug"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CategoryDetailScreen />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:orderCode"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <OrderDetail />
                            </ProtectedRoute>
                        }
                    />
                    {/* Giả định CategoryDetailProduct cũng là một phần của admin dashboard */}
                    <Route
                        path="/order-list"
                        element={
                            <ProtectedRoute allowedRoles={['admin']}>
                                <CategoryDetailProduct />
                            </ProtectedRoute>
                        }
                    />

                    {/* Route catch-all: Chuyển hướng về trang đăng nhập nếu không có route nào khớp */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            </OrderProvider>
        </SocketProvider>
    );
}

export default App;