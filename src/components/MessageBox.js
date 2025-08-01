import React, { useRef, useEffect, useState } from 'react';
import '../css/AdminChat.css';
import moment from 'moment';
import InputEmoji from 'react-input-emoji';
import { Image } from 'react-feather';
import { API_BASE2 } from '../services/LinkApi'; // <-- Import API_BASE2

// Cập nhật props của MessageBox
const MessageBox = ({
    messages,
    newMessage,
    setNewMessage,
    // XÓA HOẶC BÌNH LUẬN HAI PROPS NÀY, CHÚNG TA SẼ ĐỊNH NGHĨA CHÚNG TRONG NỘI BỘ COMPONENT
    // handleSendMessage,
    // handleSendMessageFromInput,
    isSocketReady,
    selectedRoomId,
    isLoadingMessages,
    messagesError,
    onlineUsers,
    currentUserId,
    chatRooms,
    // socket, // Bạn có thể xóa socket khỏi props nếu không dùng trực tiếp
    sendAdminMessage, // <-- THÊM CÁI NÀY VÀO!
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
            const reader = new FileReader();
            reader.onloadend = () =>{
                setImagePreviewUrl(reader.result);
            };
            reader.readAsDataURL(file)
       }else{
            setSelectedImage(null);
            setImagePreviewUrl(null);
            if(fileInputRef.current){
                fileInputRef.current.value = '';
            }
            if(file){
                alert('Vui lòng chọn một tệp ảnh hợp lệ.');
            }
       }
    };

    const uploadImageToCloudinary = async(file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            // Thay đổi URL để trỏ đến đúng backend
            const response = await fetch(`${API_BASE2}/api/upload/image`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if(response.ok){
                return data.url;
            }else{
                console.error('Lỗi api upload: ', data.message || 'Lỗi ko xác định khi upload ảnh');
                alert('Lỗi tải ảnh lên, sự cố sẽ được khắc phục sớm');
                return null;
            }
        } catch (error) {
            console.error('Lỗi mạng hoặc server khi upload: ', error);
            alert('Không thể kết nối đến máy chủ khi tải ảnh lên!');
            return null;
        }
    }

    // <-- ĐỊNH NGHĨA LẠI HÀM handleSendMessage TẠI ĐÂY -->
    const handleSendMessage = async (event) => {
        event.preventDefault(); // Ngăn chặn reload trang

        if (!isSocketReady || !selectedRoomId || isLoadingMessages) {
            console.warn('MessageBox: Không thể gửi tin nhắn. Socket chưa sẵn sàng, chưa chọn phòng hoặc đang tải tin nhắn.');
            return;
        }

        const messageContent = newMessage.trim();

        const currentChatRoom = chatRooms?.find(room => room._id === selectedRoomId);
        const targetUserId = currentChatRoom?.userId;

        if (!targetUserId) {
            console.error('MessageBox: Không tìm thấy ID người dùng mục tiêu cho phòng chat đã chọn.');
            alert('Không thể gửi tin nhắn: Không tìm thấy thông tin người nhận.');
            return;
        }

        // --- Trường hợp 1: Gửi ảnh (nếu có selectedImage) ---
        if (selectedImage) {
            console.log('MessageBox: Đang xử lý gửi ảnh...');
            const imageUrl = await uploadImageToCloudinary(selectedImage);

            if (imageUrl) {
                console.log('MessageBox: Ảnh đã upload, gọi sendAdminMessage để gửi tin nhắn ảnh.');
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
            } else {
                console.error('MessageBox: Lỗi khi upload ảnh lên Cloudinary.');
                alert('Không thể gửi ảnh: Vui lòng thử lại sau.');
            }
        }
        // --- Trường hợp 2: Gửi tin nhắn văn bản (chỉ khi không có ảnh được chọn VÀ có nội dung text) ---
        else if (messageContent) {
            console.log('MessageBox: Đang xử lý gửi tin nhắn văn bản.');
            sendAdminMessage({
                content: messageContent,
                messageType: 'text',
            });
            setNewMessage('');
        } else {
            console.log('MessageBox: Không có nội dung (văn bản hoặc ảnh) để gửi.');
        }
    };

    // <-- ĐỊNH NGHĨA LẠI HÀM handleSendMessageFromInput TẠI ĐÂY (dành cho InputEmoji onEnter) -->
    const handleSendMessageFromInput = (msg) => {
        // Nếu có ảnh đang được chọn, không gửi text khi nhấn Enter trong InputEmoji.
        // Logic gửi ảnh sẽ được xử lý khi submit form (nhấn nút "Send").
        if (selectedImage) {
            console.log('MessageBox: Có ảnh đang được chọn, bỏ qua gửi văn bản từ InputEmoji onEnter.');
            return;
        }

        const messageContent = msg.trim();
        if (messageContent && isSocketReady && !isLoadingMessages) {
            console.log('MessageBox: Gửi tin nhắn văn bản từ InputEmoji onEnter.');
            
            const currentChatRoom = chatRooms?.find(room => room._id === selectedRoomId);
            const targetUserId = currentChatRoom?.userId;

            if (!targetUserId) {
                console.error('MessageBox (InputEmoji): Không tìm thấy ID người dùng mục tiêu.');
                return;
            }

            sendAdminMessage({
                content: messageContent,
                messageType: 'text',
            });
            setNewMessage('');
        } else {
            console.log('MessageBox: Không có nội dung văn bản để gửi từ InputEmoji.');
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
                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <p className="no-messages">Chưa có tin nhắn nào trong cuộc trò chuyện này.</p>
                    ) : (
                        messages.map((msg, index) => {
                               console.log("Render bubble:", msg); 
                            const senderIdFromMsg = msg.sender && msg.sender._id;
                            const isSenderAdmin = String(senderIdFromMsg).trim() === String(currentUserId).trim();
                            return (
                                <div
            key={msg._id || index}
            className={`message-bubble ${isSenderAdmin ? 'admin-message' : 'user-message'}`}
        >
            {/* Thêm một wrapper để kiểm soát layout nội dung */}
            <div className="message-content-wrapper">
                {/* Kiểm tra nếu là tin nhắn ảnh và có mediaUrl */}
                {msg.messageType === 'image' && msg.mediaUrl ? (
                    <>
                        <img src={msg.mediaUrl} alt="Ảnh chat" className="chat-image-display" />
                        {/* Tùy chọn: nếu muốn hiển thị text caption cùng với ảnh */}
                        {msg.content && msg.content.trim() && <p className="image-caption">{msg.content}</p>}
                    </>
                ) : (
                    // Nếu là tin nhắn văn bản hoặc không có mediaUrl
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

                {/* VÙNG HIỂN THỊ PREVIEW ẢNH NÀY */}
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

                <form className="message-input-form" onSubmit={handleSendMessage}> {/* Đảm bảo gọi handleSendMessage này */}

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
                        // Cập nhật điều kiện disabled: nếu không phải socket ready HOẶC đang tải tin nhắn HOẶC cả text và ảnh đều rỗng
                        disabled={!isSocketReady || isLoadingMessages || (!newMessage.trim() && !selectedImage)}
                    >
                        Gửi
                    </button>
                </form>
            </div>
    );
};

export default MessageBox;