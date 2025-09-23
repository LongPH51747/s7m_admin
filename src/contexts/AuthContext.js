// src/contexts/AuthContext.js

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate();

    // Sử dụng useCallback để bọc các hàm có thể được gọi nhiều lần, tránh re-render không cần thiết
    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        setAccessToken(null);
        navigate('/login');
    }, [navigate]);

    const refreshToken = useCallback(async () => {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
            console.log('AuthContext: Không có refreshToken, logout');
            logout();
            return false;
        }

        try {
            console.log('AuthContext: Đang gọi API refresh token...');
            const response = await fetch(`${API_BASE}/api/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: storedRefreshToken }),
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log('AuthContext: Nhận được token mới từ server:', data);
                localStorage.setItem('accessToken', data.access_token);
                setAccessToken(data.access_token);
                console.log('AuthContext: Token đã được làm mới thành công.');
                return true;
            } else {
                console.error('AuthContext: Refresh token thất bại, status:', response.status);
                logout(); // Refresh token không hợp lệ
                return false;
            }
        } catch (error) {
            console.error("AuthContext: Lỗi khi làm mới token:", error);
            logout(); // Lỗi mạng hoặc lỗi khác
            return false;
        }
    }, [logout]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('username');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');
        const storedFullName = localStorage.getItem('fullName');

        if(token && storedUser && storedRole && storedUserId && storedFullName){
            setAccessToken(token);
            setUser({
                _id: storedUserId,
                username: storedUser,
                fullName: storedFullName,
                role: storedRole,
            });
            setIsAuthenticated(true);
        } else {
            localStorage.clear();
            setUser(null);
            setIsAuthenticated(false);
            setAccessToken(null);
        }
        setLoadingAuth(false);
        
        let refreshInterval;
        if (storedRefreshToken) {
            // Thiết lập làm mới token định kỳ
            refreshInterval = setInterval(() => {
                refreshToken();
            }, 1000 * 60 * 15); // Mỗi 4 phút
        }

        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };

    }, [refreshToken]); // Thêm refreshToken vào dependency array

    const login = useCallback((userData, receivedAccessToken, receivedRefreshToken) => {
        localStorage.setItem('accessToken', receivedAccessToken);
        localStorage.setItem('refreshToken', receivedRefreshToken);
        localStorage.setItem('userId', userData._id);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('fullName', userData.fullName);

        setAccessToken(receivedAccessToken);
        setUser(userData);
        setIsAuthenticated(true);

        if(userData.role === 'admin'){
            navigate('/home');
        }
    }, [navigate]);

    const value = {
        user,
        isAuthenticated,
        loadingAuth,
        login,
        logout,
        accessToken,
        refreshToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};