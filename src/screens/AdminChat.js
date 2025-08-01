import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import ChatSidebar from '../components/ChatSidebar';
import MessageBox from '../components/MessageBox';
import '../css/AdminChat.css';

const AdminChat = () => {
    const { 
        isSocketReady,
        chatRooms, 
        selectedRoomId,
        messages,
        isLoadingChatRooms,
        chatRoomsError,
        isLoadingMessages,
        messagesError,
        selectAdminChatRoom,
        sendAdminMessage,
        onlineUsers, // Lấy onlineUsers từ useSocket
        currentUserId 
    } = useSocket();

    // THÊM DÒNG LOG NÀY ĐỂ XEM ONLINEUSERS MÀ ADMINCHAT NHẬN ĐƯỢC
    console.log("AdminChat: onlineUsers from useSocket():", onlineUsers);

    const [newMessageInput, setNewMessageInput] = useState('');

    if (isLoadingChatRooms) {
        return <div className="admin-chat-container"><p>Đang tải danh sách phòng chat...</p></div>;
    }

    if (chatRoomsError) {
        return <div className="admin-chat-container"><p>Lỗi: {chatRoomsError.message || "Không xác định"}</p></div>;
    }

    if (!isLoadingChatRooms && (!chatRooms || chatRooms.length === 0)) {
        return (
            <div className="admin-chat-container">
                <p className="no-chat-rooms-fallback">Chưa có cuộc trò chuyện nào. Hãy chờ đợi người dùng bắt đầu chat.</p>
            </div>
        );
    }

    return (
        <div className="admin-chat-container">
            <ChatSidebar
                chatRooms={chatRooms || []} 
                selectedRoomId={selectedRoomId}
                onSelectRoom={selectAdminChatRoom}
                // SỬA ĐỔI Ở ĐÂY: Đảm bảo onlineUsers luôn là một mảng
                onlineUsers={onlineUsers || []} 
            />
            <MessageBox
                messages={messages}
                newMessage={newMessageInput}
                setNewMessage={setNewMessageInput}
                sendAdminMessage={sendAdminMessage}
                isSocketReady={isSocketReady}
                selectedRoomId={selectedRoomId}
                isLoadingMessages={isLoadingMessages} 
                messagesError={messagesError}
                // SỬA ĐỔI Ở ĐÂY: Đảm bảo onlineUsers luôn là một mảng
                onlineUsers={onlineUsers || []} 
                currentUserId={currentUserId} 
                chatRooms={chatRooms || []} 
            />
        </div>
    );
};

export default AdminChat;
