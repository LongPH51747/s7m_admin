import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // kiểm tra local storage khi component mount
        const token = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('username');
        const storedRole = localStorage.getItem('userRole');
        const storedUserId = localStorage.getItem('userId');
        const storedFullName = localStorage.getItem('fullName');

        if(token &&  storedUser && storedRole && storedUserId && storedFullName){
            setUser ({
                _id: storedUserId,
                username: storedUser,
                role: storedRole,
                fullName: storedFullName
            });
            setIsAuthenticated(true)
        }else{
            localStorage.clear();
            setUser(null);
            setIsAuthenticated(false);
        }
        setLoadingAuth(false)
    }, []);

    const login = (userData, accessToken, refreshToken) => {
        localStorage.setItem('jwtToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userId', userData._id);
        localStorage.setItem('username', userData.username);
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('fullName', userData.fullName);

        setUser(userData);
        setIsAuthenticated(true);

        if(userData.role === 'admin'){
            navigate('/');
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    const value = {
        user,
        isAuthenticated,
        loadingAuth,
        login,
        logout,
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