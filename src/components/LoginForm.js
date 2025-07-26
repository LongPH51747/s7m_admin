// src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Cần import useNavigate
import '../css/LoginForm.css';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE } from '../services/LinkApi';
import axios from 'axios';

// KHÔNG CÒN IMPORT LOGO Ở ĐÂY NỮA (như bạn đã ghi chú)

const LoginForm = () => {
   
    const [username, setUsername] = useState(''); // Mặc định là 'admin'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const loginEndPoint = `${API_BASE}/api/auth/login-username`;

        try {
            const response = await axios.post(loginEndPoint, {
                username,
                password,
            });

            const data = response.data;
            console.log('Đăng nhập thành công (Raw Data):', data);
            console.log("Data.user: ", data.user);
            console.log("Data.user.user: ", data.user.user)

            // === CHỖ SỬA ĐÂY ===
            // Lấy token từ cấp ngoài của đối tượng 'user'
            const accessToken = data.user.access_token;
            const refreshToken = data.user.refresh_token; // Lấy refresh_token nếu có

            // Lấy thông tin user chi tiết từ cấp con 'user'
            const detailedUser = data.user.user; // <--- SỬA TỪ 'data.user' THÀNH 'data.user.user'

            // Kiểm tra xem dữ liệu có đầy đủ không trước khi sử dụng
            if (!detailedUser || !detailedUser._id || !accessToken) {
                throw new Error('Dữ liệu phản hồi API không đầy đủ hoặc không đúng định dạng.');
            }

            // Chuẩn bị userData để truyền vào AuthContext's login function
            const userDataForContext = {
                _id: detailedUser._id, // <--- Đảm bảo trùng khớp với tên trường của API (_id)
                username: detailedUser.username,
                fullName: detailedUser.fullName,
                role: detailedUser.role,
                email: detailedUser.email, // Có thể thêm email nếu bạn cần
            };

            // Gọi hàm login từ AuthContext
            login(userDataForContext, accessToken, refreshToken);

            alert('Đăng nhập thành công!'); // Hoặc bỏ nếu muốn điều hướng liền mạch

        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Thông tin đăng nhập không hợp lệ.');
                console.error('Admin login failed:', error.response.data || error.response.statusText);
            } else if (error.request) {
                setError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
                console.error('Error during admin login: No response received from server', error.request);
            } else {
                setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
                console.error('Error setting up login request:', error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-section">
            <div className="login-form-container">
                <h2>Admin Login to S7M STORE</h2> {/* Đổi tiêu đề cho phù hợp */}
                <p>Enter your admin credentials</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label> {/* Đổi label thành Username */}
                        <input
                            type="text"
                            id="username" // Đổi id
                            name="username" // Đổi name
                            placeholder="Enter admin username" // Đổi placeholder
                            value={username} // Sử dụng state 'username'
                            onChange={(e) => setUsername(e.target.value)} // Cập nhật state 'username'
                            required
                            // disabled // Mặc định disable để username luôn là 'admin'
                        />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log In'}
                    </button>
                    {/* Bạn có thể bỏ "Forgot Password?" nếu nó không liên quan đến tài khoản admin duy nhất */}
                    {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
                </form>
            </div>
        </div>
    );
};

export default LoginForm;