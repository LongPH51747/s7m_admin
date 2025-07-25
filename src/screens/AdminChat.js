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
        sendAdminMessage, // <-- GIỮ LẠI HÀM NÀY TỪ useSocket
        onlineUsers,
        currentUserId 
    } = useSocket();

    const [newMessageInput, setNewMessageInput] = useState('');

    // XÓA BỎ HOẶC BÌNH LUẬN (COMMENT OUT) HAI HÀM NÀY
    // Lý do: Logic gửi tin nhắn (bao gồm ảnh) sẽ được xử lý TRỰC TIẾP trong MessageBox
    // const handleSendMessageSubmit = (e) => {
    //     e?.preventDefault();
    //     if (!newMessageInput.trim()) return;
    //     sendAdminMessage(newMessageInput);
    //     setNewMessageInput('');
    // };

    // const handleSendMessageFromInputEmoji = (msg) => {
    //     if (!msg?.trim()) return;
    //     sendAdminMessage(msg);
    //     setNewMessageInput('');
    // };

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
            />
            <MessageBox
                messages={messages}
                newMessage={newMessageInput}
                setNewMessage={setNewMessageInput}
                // XÓA DÒNG NÀY: handleSendMessage={handleSendMessageSubmit}
                // XÓA DÒNG NÀY: handleSendMessageFromInput={handleSendMessageFromInputEmoji}
                // THAY VÀO ĐÓ, TRUYỀN TRỰC TIẾP sendAdminMessage TỪ useSocket
                sendAdminMessage={sendAdminMessage} // <-- ĐÂY LÀ ĐIỀU QUAN TRỌNG NHẤT!
                isSocketReady={isSocketReady}
                selectedRoomId={selectedRoomId}
                isLoadingMessages={isLoadingMessages} 
                messagesError={messagesError}
                onlineUsers={onlineUsers} 
                currentUserId={currentUserId} 
                chatRooms={chatRooms || []} 
                // Không cần truyền socket trực tiếp nếu chỉ dùng sendAdminMessage
            />
        </div>
    );
};

export default AdminChat;