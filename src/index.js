import React from 'react';
import ReactDOM from 'react-dom/client'; 
import 'antd/dist/reset.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Import AuthProvider của bạn
import { AuthProvider } from './contexts/AuthContext';
// Đảm bảo SocketProvider được import và bao bọc App
import { SocketProvider } from './contexts/SocketContext'; 
import { OrderProvider } from './contexts/OrderContext'; // Giữ nguyên nếu bạn có OrderContext

// ✅ Thêm React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // hoặc 'react-query' nếu bản cũ

// ✅ Tạo QueryClient
const queryClient = new QueryClient();

// Sử dụng createRoot thay vì render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    // <React.StrictMode> {/* Bạn đã chọn tắt StrictMode, giữ nguyên */}
    <BrowserRouter basename="/LongPH51747/s7m_admin"> {/* Đảm bảo basename đúng */}
        <AuthProvider>
            <QueryClientProvider client={queryClient}> {/* ✅ Bọc toàn bộ app */}
                <SocketProvider> 
                    <OrderProvider> 
                        <App />
                    </OrderProvider>
                </SocketProvider>
            </QueryClientProvider>
        </AuthProvider>
    </BrowserRouter>
    // </React.StrictMode>
);

reportWebVitals();
