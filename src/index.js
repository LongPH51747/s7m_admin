import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// Import AuthProvider của bạn
import { AuthProvider } from './contexts/AuthContext';
// import { SocketProvider } from './contexts/SocketContext'; // SocketProvider đã được di chuyển vào App.js
// import { OrderProvider } from './contexts/OrderContext'; // OrderProvider đã được di chuyển vào App.js


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* BrowserRouter phải là wrapper ngoài cùng để cung cấp context cho Router */}
        <BrowserRouter basename="/LongPH51747/s7m_admin"> {/* Đảm bảo basename đúng */}
            {/* AuthProvider bao bọc App để tất cả các component trong App có thể dùng AuthContext */}
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();