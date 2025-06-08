// src/components/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Cần import useNavigate
import '../css/LoginForm.css';
import { useAuth } from '../contexts/AuthContext';

// KHÔNG CÒN IMPORT LOGO Ở ĐÂY NỮA (như bạn đã ghi chú)

const LoginForm = () => {
    // Đổi 'identifier' thành 'username' cho rõ ràng
    const [username, setUsername] = useState('admin'); // Mặc định là 'admin'
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const {login} = useAuth();


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        const loginEndpoint = 'http://localhost:3000/api/auth/admin-login'; // Endpoint admin
        // Payload chỉ chứa username và password
        const payload = { username, password };

        try {
            const response = await fetch(loginEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Admin Login successful:', data);
                login(data.user, data.access_token, data.refresh_token);
               alert('Admin Login Successful!');
            } else {
                setError(data.message || 'Thông tin đăng nhập không hợp lệ.');
                console.error('Admin login failed:', data.message || 'Unknown error');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
            console.error('Error during admin login fetch:', err);
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
                            disabled // Mặc định disable để username luôn là 'admin'
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