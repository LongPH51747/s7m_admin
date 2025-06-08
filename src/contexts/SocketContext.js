import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from 'socket.io-client'; 
const SocketContext = createContext(null);

export const SocketProvider = ({children}) => {
    const {user, isAuthenticated, loadingAuth, logout} = useAuth(); // lấy thông tin xác thực từ Auth Context
    const [socket, setSocket] = useState(null);   // state để lưu trữ instance socket
    const socketRef = useRef(null);

    useEffect(() => {
        if(!loadingAuth && isAuthenticated && user) {
            const token = localStorage.getItem('jwtToken');
            if(!token){
                console.warn("No JWT token found for socket connection.");
                logout();
                return;
            }

            const newSocket = io('http://localhost:3000', {
                auth: {
                    token: token, // gửi token qua auth payload khi kết nối
                },
                query: {
                    userId: user._id,
                    role: user.role, // gửi role cho query
                },
                transports: ['websocket', 'polling']                
            });
            // gán instance socket mới vào state và ref
            setSocket(newSocket);
            socketRef.current = newSocket;

            newSocket.on('connect', () => {
               console.log('Connected to socket server:', newSocket.id, 'as', user.username, 'role:', user.role);

            });

            newSocket.on('auth_error', (error) => {
                  console.error('Socket authentication error:', error);
                alert('Authentication failed on socket. Please login again.');
                logout();
            });

              newSocket.on('disconnect', (reason) => {
                console.log('Disconnected from socket server. Reason:', reason);
                // Xử lý các trường hợp ngắt kết nối nếu cần
            });

            newSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error.message);
                // Xử lý lỗi kết nối
            });

            return () => {
                if(socketRef.current){
                    console.log('Disconnecting socket...');
                    socketRef.current.disconnect();  // ngắt kết nối socket hiện tại
                    socketRef.current = null
                }
                setSocket(null);
            }
        }else if(!loadingAuth && isAuthenticated && socket){
            console.log("Người dùng đã đăng xuất hoặc chưa được xác thực. Ngắt kết nối socket");
            if(socketRef.current){
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setSocket(null);
        }
    }, [isAuthenticated, loadingAuth, user, logout]);

    // giá trị được cung cấp bởi các component con
    // các component con sẽ dùng useSocket() để lấy các instance

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if(context === undefined){
        console.warn('useSocket must be used within a SocketProvider. Socket may not be available if user is not authenticated.');
        return null; 
    }
    return context;
}