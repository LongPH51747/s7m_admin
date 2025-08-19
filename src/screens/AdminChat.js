// AdminChat.js - Dùng Tailwind CSS
import React, { useState } from 'react';
import { useSocket } from '../contexts/SocketContext';
import ChatSidebar from '../components/ChatSidebar';
import MessageBox from '../components/MessageBox';

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
        onlineUsers,
        currentUserId 
    } = useSocket();

    const [newMessageInput, setNewMessageInput] = useState('');

    if (isLoadingChatRooms) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
                <p className="text-gray-500 text-lg">Đang tải danh sách phòng chat...</p>
            </div>
        );
    }

    if (chatRoomsError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
                <p className="text-red-500 text-lg">Lỗi: {chatRoomsError.message || "Không xác định"}</p>
            </div>
        );
    }

    if (!isLoadingChatRooms && (!chatRooms || chatRooms.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
                <p className="text-gray-500 text-lg text-center max-w-md">
                    Chưa có cuộc trò chuyện nào. Hãy chờ đợi người dùng bắt đầu chat.
                </p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 p-8 space-x-8 font-sans antialiased">
            {/* Chat Sidebar */}
            <div className="flex-none w-80">
                <ChatSidebar
                    chatRooms={chatRooms || []} 
                    selectedRoomId={selectedRoomId}
                    onSelectRoom={selectAdminChatRoom}
                    onlineUsers={onlineUsers || []} 
                />
            </div>
            {/* Message Box */}
            <div className="flex-1">
                <MessageBox
                    messages={messages}
                    newMessage={newMessageInput}
                    setNewMessage={setNewMessageInput}
                    sendAdminMessage={sendAdminMessage}
                    isSocketReady={isSocketReady}
                    selectedRoomId={selectedRoomId}
                    isLoadingMessages={isLoadingMessages} 
                    messagesError={messagesError}
                    onlineUsers={onlineUsers || []} 
                    currentUserId={currentUserId} 
                    chatRooms={chatRooms || []} 
                />
            </div>
        </div>
    );
};

export default AdminChat;