import React from 'react';
import '../css/AdminChat.css'; // Sử dụng lại CSS đã có
import moment from 'moment'; // Để định dạng thời gian

const ChatSidebar = ({ chatRooms, selectedRoomId, onSelectRoom }) => {
    return (
        <div className="chat-sidebar">
            <div className='header'>
                <img src={require('../logo.png')} className='logo' alt="" />
                <h2 className='title'>Hỗ trợ khách hàng</h2>
            </div>
            
            <div className="room-list">
                {chatRooms.length === 0 ? (
                    <p className="no-chat-rooms">No chat rooms available.</p>
                ) : (
                    chatRooms.map((room) => (
                        <div
                            key={room._id}
                            className={`room-item ${room._id === selectedRoomId ? 'active' : ''}`}
                            onClick={() => onSelectRoom(room._id)}
                        >
                            {/* Hiển thị tên người dùng (khách hàng) và avatar */}
                            <div className="room-item-header">
                                <img
                                    src={room.userAvatar || `https://placehold.co/40x40/abcdef/ffffff?text=${room.user ? room.user[0].toUpperCase() : 'U'}`}
                                    alt="User Avatar"
                                    className="room-avatar"
                                />
                                <p className="room-name">{room.user || `User ${room.userId.substring(0, 6)}`}</p>
                                {/* Hiển thị số tin nhắn chưa đọc cho admin */}
                                {room.unreadCountAdmin > 0 && (
                                    <span className="unread-badge">{room.unreadCountAdmin}</span>
                                )}
                            </div>
                            <div>
                                <p className="last-message-preview">
                                {room.lastMessageContent || 'No messages yet.'}
                            </p>
                            <span className="last-message-time">
                                {room.lastMessageTimestamp ? moment(room.lastMessageTimestamp).fromNow() : ''}
                            </span>
                            </div>
                            
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;