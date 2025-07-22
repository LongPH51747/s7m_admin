// src/contexts/AuthContext.js

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [accessToken, setAccessToken] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('username');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');
        const storedFullName = localStorage.getItem('fullName');

        if(token && storedUser && storedRole && storedUserId && storedFullName){
            setAccessToken(token);
            setUser ({
                _id: storedUserId,
                username: storedUser,
                fullName: storedFullName,
                role: storedRole,
               
            });
            setIsAuthenticated(true);
        }else{
            localStorage.clear();
            setUser(null);
            setIsAuthenticated(false);
            setAccessToken(null);
        }
        setLoadingAuth(false);
    }, []);

    // Bọc hàm login trong useCallback, không cần navigate trong dependency vì nó stable
    const login = useCallback((userData, receivedAccessToken, refreshToken) => {
        console.log("AuthContext: Login function called. Token received:", receivedAccessToken ? "Exists" : "Missing");
        localStorage.setItem('accessToken', receivedAccessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userData._id);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('fullName', userData.fullName);

        setAccessToken(receivedAccessToken);
        console.log("AuthContext: accessToken state updated.");
        setUser(userData);
        setIsAuthenticated(true);

        if(userData.role === 'admin'){
            navigate('/');
        }
    }, []); // navigate là stable, có thể bỏ qua

    // Bọc hàm logout trong useCallback, không cần navigate trong dependency vì nó stable
    const logout = useCallback(() => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        setAccessToken(null);
        navigate('/login');
    }, []); // navigate là stable, có thể bỏ qua

    const value = {
        user,
        isAuthenticated,
        loadingAuth,
        login,
        logout,
        accessToken,
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