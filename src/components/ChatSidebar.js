// ChatSidebar.js
import React from 'react';
import '../css/AdminChat.css';
import moment from 'moment';

// Cập nhật props của ChatSidebar để nhận onlineUsers
const ChatSidebar = ({ chatRooms, selectedRoomId, onSelectRoom, onlineUsers }) => {
    console.log("ChatSidebar: onlineUsers received:", onlineUsers); // Kiểm tra mảng onlineUsers
    return (
        <div className="chat-sidebar">
            <div className='header'>
                <img src={require('../logo.png')} className='logo' alt="" />
                <h2 className='title'>Hỗ trợ khách hàng</h2>
            </div>
            
            <div className="room-list">
                {chatRooms.length === 0 ? (
                    <p className="no-chat-rooms">Không có phòng chat nào.</p>
                ) : (
                    chatRooms.map((room) => {
                        // Lấy ID người dùng và kiểm tra trạng thái online
                        const roomUserId = room.user?._id;
                        const isUserOnline = onlineUsers?.includes(roomUserId);
                        
                        return (
                            <div
                                key={room._id}
                                className={`room-item ${room._id === selectedRoomId ? 'active' : ''}`}
                                onClick={() => onSelectRoom(room._id)}
                            >
                                <div className="room-item-header">
                                    {/* Wrapper cho avatar và chấm trạng thái */}
                                    <div className="avatar-container-sidebar">
                                        <img
                                            src={room.user?.avatar || `https://placehold.co/40x40/abcdef/ffffff?text=${room.user?.fullname?.[0]?.toUpperCase() || 'U'}`}
                                            alt="User Avatar"
                                            className="room-avatar"
                                        />
                                        {/* Hiển thị chấm trạng thái dựa trên biến isUserOnline */}
                                        <div className={`status-indicator ${isUserOnline ? 'online' : 'offline'}`} />
                                    </div>

                                    <p className="room-name">{room.user || `User ${room.userId?.substring(0, 6)}`}</p>
                                    
                                    {room.unreadCountAdmin > 0 && (
                                        <span className="unread-badge">{room.unreadCountAdmin}</span>
                                    )}
                                </div>
                                
                                <div>
                                    <p className="last-message-preview">
                                        {room.lastMessageContent || 'Chưa có tin nhắn.'}
                                    </p>
                                    <span className="last-message-time">
                                        {room.lastMessageTimestamp ? moment(room.lastMessageTimestamp).fromNow() : ''}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;