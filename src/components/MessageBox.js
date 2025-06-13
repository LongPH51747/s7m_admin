import React, { useRef, useEffect } from 'react';
import '../css/AdminChat.css'; // Sử dụng lại CSS đã có
import moment from 'moment'; // Để định dạng thời gian

const MessageBox = ({ 
    messages, 
    newMessage, 
    setNewMessage, 
    handleSendMessage, 
    isSocketReady, 
    selectedRoomId,
    isLoadingMessages, // Trạng thái loading tin nhắn
    messagesError,    // Lỗi khi tải tin nhắn
    onlineUsers,      // Danh sách người dùng online
    currentUserId,    // ID của admin hiện tại, cần để xác định tin nhắn của admin
    chatRooms         // Cần để tìm thông tin người dùng trong phòng chat hiện tại
}) => {
    // Scroll to the bottom of the messages div whenever messages change
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Tìm thông tin của phòng chat hiện tại
    const currentChatRoom = chatRooms?.find(room => room._id === selectedRoomId); 

    // Lấy ID của người dùng (khách hàng) trong phòng chat hiện tại
    const otherUserId = currentChatRoom?.userId; 

    // Tìm tên người dùng để hiển thị ở header
    // Chúng ta sẽ ưu tiên currentChatRoom.user (tên username từ backend aggregation)
    // Nếu không có, sẽ dùng fallback là 'User' + 6 ký tự đầu của ID.
    const otherUsername = currentChatRoom?.user || (otherUserId ? `User ${otherUserId.substring(0, 6)}` : 'User undefined');

    // Kiểm tra trạng thái online của người dùng
    const isOtherUserOnline = onlineUsers?.some(onlineUser => onlineUser.userId === otherUserId); 

    // --- Debugging Logs (Remove these in production) ---
    console.log('MessageBox Debug: chatRooms', chatRooms);
    console.log('MessageBox Debug: selectedRoomId', selectedRoomId);
    console.log('MessageBox Debug: currentChatRoom', currentChatRoom);
    console.log('MessageBox Debug: otherUserId', otherUserId);
    console.log('MessageBox Debug: otherUsername', otherUsername);
    // --- End Debugging Logs ---


    // Hiển thị thông báo khi chưa chọn phòng chat
    if (!selectedRoomId) {
        return (
            <div className="chat-main">
                <div className="no-room-selected">
                    <p>Select a chat room to start messaging.</p>
                </div>
            </div>
        );
    }

    // Hiển thị trạng thái loading tin nhắn
    if (isLoadingMessages) {
        return (
            <div className="chat-main">
                <div className="loading-messages">
                    <p>Đang tải tin nhắn...</p>
                </div>
            </div>
        );
    }

    // Hiển thị lỗi khi tải tin nhắn
    if (messagesError) {
        return (
            <div className="chat-main">
                <div className="error-messages">
                    <p>Lỗi: {messagesError.message || "Không thể tải tin nhắn."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-main">
            <div className="chat-header">
                {/* Sử dụng otherUsername đã được chuẩn bị */}
                <h3>{otherUsername}</h3>
                {otherUserId && ( // Chỉ hiển thị trạng thái online nếu có otherUserId
                    isOtherUserOnline ? <span className="online-indicator">Online</span> : <span className="offline-indicator">Offline</span>
                )}
            </div>
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="no-messages">Chưa có tin nhắn nào trong cuộc trò chuyện này.</p>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={msg._id || index} 
                            // Xác định tin nhắn là của admin hay user
                            className={`message-bubble ${msg.sender === currentUserId ? 'admin-message' : 'user-message'}`}
                        >
                            <p className="message-content">{msg.content}</p>
                            <span className="message-time">{moment(msg.createdAt).format('HH:mm')}</span>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} /> {/* Dùng để cuộn xuống cuối */}
            </div>
            <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={!isSocketReady || isLoadingMessages} // Disable khi socket chưa sẵn sàng hoặc đang tải tin nhắn
                />
                <button 
                    type="submit" 
                    disabled={!isSocketReady || !newMessage.trim() || isLoadingMessages}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessageBox;
