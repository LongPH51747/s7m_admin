import React, { useRef, useEffect, useState } from 'react';
import '../css/AdminChat.css';
import moment from 'moment';
import InputEmoji from 'react-input-emoji';
import { Image } from 'react-feather';
const MessageBox = ({
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    handleSendMessageFromInput,
    isSocketReady,
    selectedRoomId,
    isLoadingMessages,
    messagesError,
    onlineUsers,
    currentUserId,
    chatRooms
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
        if(fileInputRef.current){
            fileInputRef.current.value = '';
        }
    }, [selectedRoomId])

    const currentChatRoom = chatRooms?.find(room => room._id === selectedRoomId);
    const otherUserId = currentChatRoom?.userId;
    const otherUsername = currentChatRoom?.user || (otherUserId ? `User ${otherUserId.substring(0, 6)}` : 'User undefined');
    const isOtherUserOnline = onlineUsers?.some(onlineUser => onlineUser.userId === otherUserId);

    console.log('MessageBox Debug: chatRooms', chatRooms);
    console.log('MessageBox Debug: selectedRoomId', selectedRoomId);
    console.log('MessageBox Debug: currentChatRoom', currentChatRoom);
    console.log('MessageBox Debug: otherUserId', otherUserId);
    console.log('MessageBox Debug: otherUsername', otherUsername);
    

    if (!selectedRoomId) {
        return (
            <div className="chat-main">
                <div className="no-room-selected">
                    <p>Select a chat room to start messaging.</p>
                </div>
            </div>
        );
    }

    if (isLoadingMessages) {
        return (
            <div className="chat-main">
                <div className="loading-messages">
                    <p>Đang tải tin nhắn...</p>
                </div>
            </div>
        );
    }

    if (messagesError) {
        return (
            <div className="chat-main">
                <div className="error-messages">
                    <p>Lỗi: {messagesError.message || "Không thể tải tin nhắn."}</p>
                </div>
            </div>
        );
    }

    const handleSelectFile = (event) => {
        const file = event.target.files[0];
       if (file && file.type.startsWith('image/')){
        setSelectedImage(file);
        const reader = new FileReader(); // dùng để đọc file
        reader.onloadend = () =>{
            setImagePreviewUrl(reader.result); // lưu url base 64 vào state để hiện thị trạng thái preview
        };
        reader.readAsDataURL(file) // đọc file dưới dạng data url
       }else{
        setSelectedImage(null); // Reset nếu không phải ảnh hoặc không có file
        setImagePreviewUrl(null);
        if(fileInputRef.current){
            fileInputRef.current.value = '';
        }
        if(file){
            alert('Vui lòng chọn một tệp ảnh hợp lệ.');
        }
       }
    }

    return (
         <div className="chat-main">
            <div className="chat-header">
                <h3>{otherUsername}</h3>
                {otherUserId && (
                    isOtherUserOnline ? <span className="online-indicator">Online</span> : <span className="offline-indicator">Offline</span>
                )}
            </div>
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
                                <p className="message-content">{msg.content}</p>
                                <span className="message-time">{moment(msg.createdAt).format('HH:mm')}</span>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* THÊM VÙNG HIỂN THỊ PREVIEW ẢNH NÀY */}
            {imagePreviewUrl && (
                <div className="image-preview-container">
                    <img src={imagePreviewUrl} alt="Image Preview" className="image-preview" />
                    <button
                        className="remove-image-btn"
                        onClick={() => {
                            setSelectedImage(null); // Xóa file đã chọn
                            setImagePreviewUrl(null); // Xóa URL preview
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ''; // Quan trọng: reset input file để có thể chọn lại cùng một file
                            }
                        }}
                    >
                        &times; {/* Dấu 'X' để đóng/hủy chọn ảnh */}
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
                    disabled={!isSocketReady || !newMessage.trim() || isLoadingMessages}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default MessageBox;