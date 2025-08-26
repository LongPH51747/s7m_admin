// MessageBox.js - Dùng Tailwind CSS
import React, { useRef, useEffect, useState } from 'react';
import moment from 'moment';
import InputEmoji from 'react-input-emoji';
import { Image } from 'react-feather';
import { API_BASE2 } from '../services/LinkApi';

const MessageBox = ({
    messages,
    newMessage,
    setNewMessage,
    isSocketReady,
    selectedRoomId,
    isLoadingMessages,
    messagesError,
    onlineUsers,
    currentUserId,
    chatRooms,
    sendAdminMessage,
}) => {
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        setSelectedImage(null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [selectedRoomId]);

    const currentChatRoom = chatRooms?.find(room => room._id === selectedRoomId);
    const otherUserId = currentChatRoom?.userId;
    const otherUsername = currentChatRoom?.user || (otherUserId ? `User ${otherUserId.substring(0, 6)}` : 'User undefined');
    const isOtherUserOnline = onlineUsers?.includes(otherUserId);

    if (!selectedRoomId) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-2xl p-6">
                <p className="text-gray-500 text-lg">Vui lòng chọn một cuộc trò chuyện để bắt đầu.</p>
            </div>
        );
    }
    if (isLoadingMessages) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-2xl p-6">
                <p className="text-gray-500">Đang tải tin nhắn...</p>
            </div>
        );
    }
    if (messagesError) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-2xl p-6">
                <p className="text-red-500">Đã xảy ra lỗi khi tải tin nhắn: {messagesError.message || 'Lỗi không xác định'}</p>
            </div>
        );
    }

    const handleSelectFile = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            setImagePreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await fetch(`${API_BASE2}/api/upload/image`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                return data.url;
            } else {
                console.error('Lỗi api upload: ', data.message || 'Lỗi ko xác định khi upload ảnh');
                return null;
            }
        } catch (error) {
            console.error('Lỗi mạng hoặc server khi upload: ', error);
            return null;
        }
    };

    const handleSendMessage = async (event) => {
        event.preventDefault();

        if (!isSocketReady || !selectedRoomId || isLoadingMessages || (!newMessage.trim() && !selectedImage)) {
            return;
        }

        const messageContent = newMessage.trim();

        if (selectedImage) {
            const imageUrl = await uploadImageToCloudinary(selectedImage);
            if (imageUrl) {
                sendAdminMessage({
                    content: messageContent,
                    messageType: 'image',
                    mediaUrl: imageUrl,
                });
                setSelectedImage(null);
                setImagePreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setNewMessage('');
            }
        } else if (messageContent) {
            sendAdminMessage({
                content: messageContent,
                messageType: 'text',
            });
            setNewMessage('');
        }
    };

    const handleSendMessageFromInput = (msg) => {
        if (!selectedImage && msg.trim()) {
            handleSendMessage({ preventDefault: () => { } });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl p-6 relative">
            {/* Chat Header */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-200">
                <div className={`w-3 h-3 rounded-full ${isOtherUserOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                <h3 className="font-bold text-lg text-gray-800">{otherUsername}</h3>
                <span className={`text-sm ${isOtherUserOnline ? 'text-green-500' : 'text-gray-400'}`}>
                    {isOtherUserOnline ? 'Online' : 'Offline'}
                </span>
            </div>

            {/* Messages container */}
            <div className="flex-1 overflow-y-auto pt-4 pb-6 space-y-4">
                {messages.length === 0 ? (
                    <p className="text-gray-500 text-center mt-8">Chưa có tin nhắn nào trong cuộc trò chuyện này.</p>
                ) : (
                    messages.map((msg, index) => {
                        const senderIdFromMsg = msg.sender && msg.sender._id;
                        const isSenderAdmin = String(senderIdFromMsg).trim() === String(currentUserId).trim();
                        return (
                            <div
                                key={msg._id || index}
                                className={`flex ${isSenderAdmin ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-xs md:max-w-md p-3 rounded-xl shadow-md ${isSenderAdmin ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                    {msg.messageType === 'image' && msg.mediaUrl ? (
                                        <>
                                            <img
                                                src={msg.mediaUrl}
                                                alt="Ảnh chat"
                                                className="rounded-lg max-w-full h-auto mb-2 max-h-60 object-contain"
                                            />
                                            {msg.content && msg.content.trim() && <p className="text-sm">{msg.content}</p>}
                                        </>
                                    ) : (
                                        <p className="message-text">{msg.content}</p>
                                    )}
                                    <span className={`block text-right text-xs mt-1 ${isSenderAdmin ? 'text-white/80' : 'text-gray-500'}`}>
                                        {moment(msg.createdAt).format('HH:mm')}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {imagePreviewUrl && (
                <div className="relative p-2 rounded-xl bg-gray-200 mb-4 shadow-inner">
                    <img src={imagePreviewUrl} alt="Image Preview" className="h-24 object-cover rounded-lg" />
                    <button
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm"
                        onClick={() => {
                            setSelectedImage(null);
                            setImagePreviewUrl(null);
                            if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                            }
                        }}
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Message Input Form */}
            <form className="flex items-center space-x-3" onSubmit={handleSendMessage}>
                <input
                    type='file'
                    id='imageUploadInput'
                    accept='image/*'
                    className='hidden'
                    onChange={handleSelectFile}
                    ref={fileInputRef}
                />
                <label htmlFor="imageUploadInput" className="cursor-pointer text-gray-400 hover:text-emerald-500 transition-colors">
                    <Image size={24} />
                </label>
                <div className="flex-1">
                    <InputEmoji
                        value={newMessage}
                        onChange={setNewMessage}
                        cleanOnEnter={true}
                        onEnter={handleSendMessageFromInput}
                        placeholder="Nhập tin nhắn..."
                        height={48}
                        fontFamily='system-ui, sans-serif'
                        fontSize={16}
                        placeholderColor='#9ca3af' // gray-400
                        color='#1f2937' // gray-800
                        disabled={!isSocketReady || isLoadingMessages}
                        // Áp dụng Tailwind CSS cho InputEmoji
                        inputClass="rounded-full shadow-md px-6 py-3 border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    type="submit"
                    className="
                        bg-emerald-500 text-white font-bold py-3 px-6 rounded-full 
                        hover:bg-emerald-600 transition-colors duration-200
                        disabled:bg-gray-400 disabled:cursor-not-allowed
                    "
                    disabled={!isSocketReady || isLoadingMessages || (!newMessage.trim() && !selectedImage)}
                >
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default MessageBox;