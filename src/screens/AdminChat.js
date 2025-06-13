import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import ChatSidebar from '../components/ChatSidebar';
import MessageBox from '../components/MessageBox';
import '../css/AdminChat.css';

const AdminChat = () => {
    const { 
        isSocketReady,
        chatRooms, // Lấy chatRooms từ SocketContext
        selectedRoomId,
        messages,
        isLoadingChatRooms,
        chatRoomsError,
        isLoadingMessages,
        messagesError,
        selectAdminChatRoom,
        sendAdminMessage,
        onlineUsers,
        currentUserId // Thêm currentUserId vào đây để truyền xuống MessageBox
    } = useSocket();

    const [newMessageInput, setNewMessageInput] = useState('');

    const handleSendMessageSubmit = (e) => {
        e.preventDefault();
        sendAdminMessage(newMessageInput);
        setNewMessageInput('');
    };

    if (isLoadingChatRooms) {
        return <div className="admin-chat-container"><p>Đang tải danh sách phòng chat...</p></div>;
    }

    if (chatRoomsError) {
        return <div className="admin-chat-container"><p>Lỗi tải danh sách phòng chat: {chatRoomsError.message}</p></div>;
    }

    if (!isLoadingChatRooms && (!chatRooms || chatRooms.length === 0)) { // Thêm kiểm tra !chatRooms
        return (
            <div className="admin-chat-container">
                <p>Chưa có cuộc trò chuyện nào. Hãy chờ đợi người dùng bắt đầu chat.</p>
            </div>
        );
    }

    return (
        <div className="admin-chat-container">
            <ChatSidebar
                chatRooms={chatRooms || []} // Đảm bảo luôn truyền một mảng (hoặc mảng rỗng)
                selectedRoomId={selectedRoomId}
                onSelectRoom={selectAdminChatRoom}
            />
            <MessageBox
                messages={messages}
                newMessage={newMessageInput}
                setNewMessage={setNewMessageInput}
                handleSendMessage={handleSendMessageSubmit}
                isSocketReady={isSocketReady}
                selectedRoomId={selectedRoomId}
                isLoadingMessages={isLoadingMessages} 
                messagesError={messagesError}
                onlineUsers={onlineUsers} 
                currentUserId={currentUserId} // Truyền currentUserId xuống
                chatRooms={chatRooms || []} // Đảm bảo luôn truyền một mảng (hoặc mảng rỗng)
            />
        </div>
    );
};

export default AdminChat;