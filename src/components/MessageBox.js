import React, { useRef, useEffect, useState } from 'react';
import '../css/AdminChat.css';
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
    onlineUsers, // Mảng các ID người dùng online
    currentUserId,
    chatRooms,
    sendAdminMessage, // <-- Hàm này được truyền từ SocketContext
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

    // SỬA ĐỔI Ở ĐÂY: Sử dụng trực tiếp currentChatRoom?.user vì nó đã là username string
    const otherUsername = currentChatRoom?.user || (otherUserId ? `User ${otherUserId.substring(0, 6)}` : 'User undefined');
    
    // Sửa lại logic kiểm tra online: onlineUsers là một mảng ID, dùng .includes()
    const isOtherUserOnline = onlineUsers?.includes(otherUserId);

    // ... (các phần xử lý loading, error không đổi) ...
    if (!selectedRoomId) {
        return (
            <div className="chat-main no-room-selected">
                <p>Vui lòng chọn một cuộc trò chuyện để bắt đầu.</p>
            </div>
        );
    }
    if (isLoadingMessages) {
        return (
            <div className="chat-main loading-messages">
                <p>Đang tải tin nhắn...</p>
            </div>
        );
    }
    if (messagesError) {
        return (
            <div className="chat-main error-messages">
                <p>Đã xảy ra lỗi khi tải tin nhắn: {messagesError.message || 'Lỗi không xác định'}</p>
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
            if (file) {
                // Thay thế alert bằng một thông báo trên UI nếu có thể
                console.warn('Vui lòng chọn một tệp ảnh hợp lệ.');
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
                // Thay thế alert bằng một thông báo trên UI nếu có thể
                console.warn('Lỗi tải ảnh lên, sự cố sẽ được khắc phục sớm');
                return null;
            }
        } catch (error) {
            console.error('Lỗi mạng hoặc server khi upload: ', error);
            // Thay thế alert bằng một thông báo trên UI nếu có thể
            console.warn('Không thể kết nối đến máy chủ khi tải ảnh lên!');
            return null;
        }
    };

    // ĐỊNH NGHĨA LẠI HÀM GỬI TIN NHẮN ĐỂ NÓ GỌN HƠN VÀ TẬP TRUNG VÀO VIỆC GỌI PROP sendAdminMessage
    const handleSendMessage = async (event) => {
        event.preventDefault();

        // Kiểm tra điều kiện cần thiết
        if (!isSocketReady || !selectedRoomId || isLoadingMessages || (!newMessage.trim() && !selectedImage)) {
            console.warn('Không thể gửi tin nhắn.');
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
                // Reset states sau khi gửi thành công
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

    // Hàm này được gọi khi nhấn Enter trong InputEmoji
    const handleSendMessageFromInput = (msg) => {
        // Chỉ gửi tin nhắn văn bản nếu không có ảnh nào đang được chọn
        if (!selectedImage && msg.trim()) {
            handleSendMessage({ preventDefault: () => {} });
        }
    };

    return (
        <div className="chat-main">
            <div className="chat-header">
                <h3>{otherUsername}</h3>
                {otherUserId && (
                    isOtherUserOnline ? <span className="online-indicator">Online</span> : <span className="offline-indicator">Offline</span>
                )}
            </div>
            {/* ... Phần hiển thị tin nhắn không đổi ... */}
            <div className="chat-messages">
                {messages.length === 0 ? (
                    <p className="no-messages">Chưa có tin nhắn nào trong cuộc trò chuyện này.</p>
                ) : (
                    messages.map((msg, index) => {
                        const senderIdFromMsg = msg.sender && msg.sender._id;
                        const isSenderAdmin = String(senderIdFromMsg).trim() === String(currentUserId).trim();
                        return (
                            <div
                                key={msg._id || index}
                                className={`message-bubble ${isSenderAdmin ? 'admin-message' : 'user-message'}`}
                            >
                                <div className="message-content-wrapper">
                                    {msg.messageType === 'image' && msg.mediaUrl ? (
                                        <>
                                            <img src={msg.mediaUrl} alt="Ảnh chat" className="chat-image-display" />
                                            {msg.content && msg.content.trim() && <p className="image-caption">{msg.content}</p>}
                                        </>
                                    ) : (
                                        <p className="message-text">{msg.content}</p>
                                    )}
                                </div>
                                <span className="message-time">{moment(msg.createdAt).format('HH:mm')}</span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* VÙNG HIỂN THỊ PREVIEW ẢNH */}
            {imagePreviewUrl && (
                <div className="image-preview-container">
                    <img src={imagePreviewUrl} alt="Image Preview" className="image-preview" />
                    <button
                        className="remove-image-btn"
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

            <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                    type='file'
                    id='imageUploadInput'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={handleSelectFile}
                    ref={fileInputRef}
                />
                <label htmlFor="imageUploadInput" className="upload-icon-label">
                    <Image size={24} name='camera' />
                </label>
                <InputEmoji
                    value={newMessage}
                    onChange={setNewMessage}
                    cleanOnEnter={true}
                    onEnter={handleSendMessageFromInput}
                    placeholder="Type your message..."
                    height={50}
                    fontSize={16}
                    disabled={!isSocketReady || isLoadingMessages}
                />
                <button
                    type="submit"
                    disabled={!isSocketReady || isLoadingMessages || (!newMessage.trim() && !selectedImage)}
                >
                    Gửi
                </button>
            </form>
        </div>
    );
};

export default MessageBox;
