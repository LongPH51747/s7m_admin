// ChatSidebar.js - Dùng Tailwind CSS
import React from 'react';
import moment from 'moment';

const ChatSidebar = ({ chatRooms, selectedRoomId, onSelectRoom, onlineUsers }) => {
    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden p-6">
            
            {/* Header */}
            <div className='flex items-center space-x-4 mb-6'>
                <img 
                    src={require('../logo.png')} 
                    className='w-12 h-12' 
                    alt="Logo" 
                />
                <h2 className='text-2xl font-bold text-gray-800'>Hỗ trợ khách hàng</h2>
            </div>
            
            {/* Room list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {chatRooms.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">Không có phòng chat nào.</p>
                ) : (
                    chatRooms.map((room) => {
                        const roomUserId = room.user?._id;
                        const isUserOnline = onlineUsers?.includes(roomUserId);
                        
                        return (
                            <div
                                key={room._id}
                                className={`
                                    flex items-center p-4 rounded-xl cursor-pointer transition-all duration-200 
                                    ${room._id === selectedRoomId 
                                        ? 'bg-emerald-500 text-white shadow-lg' 
                                        : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                                    }
                                `}
                                onClick={() => onSelectRoom(room._id)}
                            >
                                {/* Avatar and status */}
                                <div className="relative w-12 h-12">
                                    <img
                                        src={room.user?.avatar || `https://placehold.co/48x48/f3f4f6/374151?text=${room.user?.fullname?.[0]?.toUpperCase() || 'U'}`}
                                        alt="User Avatar"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    {/* Status indicator */}
                                    <div className={`
                                        absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full 
                                        ${isUserOnline ? 'bg-green-500' : 'bg-gray-400'}
                                    `} />
                                </div>

                                {/* User info */}
                                <div className="flex-1 ml-4 overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <p  className="font-semibold truncate">{room.user || `User ${room.userId?.substring(0, 6)}`}</p>
                                        {room.unreadCountAdmin > 0 && (
                                            <span className={`
                                                ml-2 px-2 py-1 text-xs font-bold rounded-full 
                                                ${room._id === selectedRoomId 
                                                    ? 'bg-white text-emerald-500' 
                                                    : 'bg-emerald-500 text-white'
                                                }
                                            `}>
                                                {room.unreadCountAdmin}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm truncate mt-1">
                                        {room.lastMessageContent || 'Chưa có tin nhắn.'}
                                    </p>
                                </div>
                                
                                {/* Last message time */}
                                <div className={`text-xs self-start ml-4 flex-shrink-0 ${room._id === selectedRoomId ? 'text-white/80' : 'text-gray-400'}`}>
                                    {room.lastMessageTimestamp ? moment(room.lastMessageTimestamp).fromNow() : ''}
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