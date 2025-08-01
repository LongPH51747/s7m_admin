import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // Import useAuth để lấy thông tin xác thực
import { API_BASE, API_BASE2 } from "../services/LinkApi"; // API_BASE cho Socket.IO, API_BASE2 cho upload

// Tạo context
const SocketContext = createContext(null);

// Hook tùy chỉnh để sử dụng context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, accessToken, logout, user } = useAuth();

  const socketRef = useRef(null);
  const [isSocketReady, setIsSocketReady] = useState(false);
  const isConnecting = useRef(false);

  // States để quản lý dữ liệu chat của Admin
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoadingChatRooms, setIsLoadingChatRooms] = useState(false);
  const [chatRoomsError, setChatRoomsError] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // Danh sách người dùng online

  // Lấy userId của Admin từ AuthContext
  const currentUserId = user ? user._id : null;

  // Ref để lưu trữ giá trị hiện tại của selectedRoomId và currentUserId
  const latestSelectedRoomId = useRef(selectedRoomId);
  const latestCurrentUserId = useRef(currentUserId);

  // Cập nhật ref mỗi khi state tương ứng thay đổi
  useEffect(() => {
    latestSelectedRoomId.current = selectedRoomId;
  }, [selectedRoomId]);

  useEffect(() => {
    latestCurrentUserId.current = currentUserId;
  }, [currentUserId]);

  // Hàm tạo nội dung xem trước tin nhắn một cách nhất quán
  // roomUser bây giờ có thể là một object { _id, username, fullname, avatar }
  const getMessagePreview = (
    message,
    roomUser, 
    currentUserId,
    fallbackContent
  ) => {
    if (message) {
      // Ưu tiên kiểm tra mediaUrl để xác định tin nhắn ảnh
      if (message.mediaUrl) {
        if (
          message.sender &&
          String(message.sender._id) === String(currentUserId)
        ) {
          return "Bạn đã gửi một ảnh";
        } else {
          // SỬA ĐỔI Ở ĐÂY: Sử dụng fullname hoặc username từ roomUser object
          const senderName = roomUser?.fullname || roomUser?.username || "Người dùng";
          return `${senderName} đã gửi một ảnh`;
        }
      }
      // Nếu không có ảnh, hiển thị nội dung text
      return message.content || "...";
    }

    // Phương án dự phòng cuối cùng nếu không có object 'message'
    return fallbackContent || "No messages yet.";
  };

  // Hàm sắp xếp danh sách chat theo thời gian tin nhắn mới nhất (sử dụng useCallback để ổn định)
  const sortChatsByLatestMessage = useCallback((chats) => {
    return [...chats].sort((a, b) => {
      const dateA = a.lastMessage?.createdAt || a.updatedAt || 0;
      const dateB = b.lastMessage?.createdAt || b.updatedAt || 0;
      return new Date(dateB) - new Date(dateA);
    });
  }, []);

  // --- useEffect 1: Quản lý vòng đời kết nối Socket.IO ---
  useEffect(() => {
    console.log(">>> SocketContext useEffect 1 (Connection) Triggered");
    console.log("Dependencies at trigger:", {
      isAuthenticated,
      accessToken: accessToken ? "Exists" : "Missing",
      userId: user?._id,
    });
    console.log("Current state:", {
      socketRefCurrent: socketRef.current ? "Exists" : "Null",
      isSocketReady,
      isConnectingCurrent: isConnecting.current,
    });
    console.log(">>> Full accessToken value:", accessToken);
    console.log("====================================================");

    if (
      isAuthenticated &&
      accessToken &&
      user?._id &&
      !socketRef.current &&
      !isConnecting.current
    ) {
      isConnecting.current = true;
      console.log("Socket: SET isConnecting.current = true");
      console.log(
        "Socket: Attempting to initialize and connect new Socket.IO instance..."
      );

      const newSocket = io(API_BASE, {
        auth: {
          token: accessToken,
        },
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        autoConnect: false,
      });

      socketRef.current = newSocket;
      console.log(
        "Socket: SET socketRef.current = newSocket (ID:",
        newSocket.id,
        ")"
      );

      newSocket.on("connect", () => {
        console.log("Socket: Connected with ID:", newSocket.id);
        newSocket.emit("authenticate", accessToken);
      });

      newSocket.on("authenticated", () => {
        console.log("Socket: Authenticated successfully!");
        setIsSocketReady(true);
        isConnecting.current = false;
        newSocket.emit("addNewUser", user._id);
        console.log("Socket: Emitting 'addNewUser' for user:", user._id);
      });

      newSocket.on("unauthorized", (reason) => {
        console.error("Socket: Authentication failed:", reason.message);
        // Thay thế alert bằng một thông báo trên UI nếu có thể
        console.warn(
          "Phiên đăng nhập hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại."
        );
        logout();
        newSocket.disconnect();
        socketRef.current = null;
        setIsSocketReady(false);
        isConnecting.current = false;
      });

      newSocket.on("disconnect", (reason) => {
        console.warn("Socket: Disconnected:", reason);
        setIsSocketReady(false);
        if (socketRef.current === newSocket) {
          socketRef.current = null;
        }
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket: Full Connection error object:", error);
        setIsSocketReady(false);
        isConnecting.current = false;
      });

      newSocket.on("error", (error) => {
        console.error("Socket: General error event:", error);
      });

      newSocket.connect();

      return () => {
        console.log("Socket: Cleanup function of useEffect 1 running...");
        if (newSocket && (newSocket.connected || newSocket.connecting)) {
          console.log(
            "Socket: Disconnecting newSocket instance during cleanup (ID:",
            newSocket.id,
            ")."
          );
          newSocket.off("connect");
          newSocket.off("authenticated");
          newSocket.off("unauthorized");
          newSocket.off("disconnect");
          newSocket.off("connect_error");
          newSocket.off("error");
          newSocket.disconnect();
        }
        if (socketRef.current === newSocket) {
          socketRef.current = null;
        }
        setIsSocketReady(false);
      };
    } else if (
      (!isAuthenticated || !accessToken || !user?._id) &&
      socketRef.current
    ) {
      console.log(
        "Socket: User logged out or token/user missing/invalid, explicitly disconnecting existing socket..."
      );
      if (socketRef.current.connected) {
        socketRef.current.disconnect();
      }
      socketRef.current = null;
      setIsSocketReady(false);
      isConnecting.current = false;
    } else {
      console.log(
        "Socket: Conditions NOT met for new Socket.IO connection or explicit disconnection."
      );
    }
  }, [isAuthenticated, accessToken, user?._id, logout]);

  // --- useEffect 2: Yêu cầu Danh sách Phòng Chat & Đăng ký Listeners chung ---
  // Bao gồm cả chat_history listener ở đây để nó ổn định.
  useEffect(() => {
    if (!isSocketReady || !socketRef.current || !currentUserId) {
      console.log(
        "SocketContext (Chat Logic): Socket not ready, not available, or currentUserId missing. Resetting chat rooms & listeners."
      );
      setChatRooms([]);
      setIsLoadingChatRooms(false);
      setChatRoomsError(null);
      // setOnlineUsers([]); // Đã bỏ dòng này như đã thảo luận
      return;
    }

    const socket = socketRef.current;

    console.log(
      "SocketContext (Chat Logic): Socket is ready! Requesting chat rooms..."
    );
    setIsLoadingChatRooms(true);
    setChatRoomsError(null);
    socket.emit("request_chat_rooms");

    const handleChatRoomList = (rooms) => {
      console.log(
        "SocketContext (Chat Logic): Received chat room list:",
        rooms
      );
      // Áp dụng logic tạo preview cho danh sách ban đầu
      const processedRooms = rooms.map((room) => ({
        ...room,
        lastMessageContent: getMessagePreview(
          room.lastMessage,
          room.user, // room.user bây giờ là object { _id, username, fullname, avatar }
          latestCurrentUserId.current,
          room.lastMessageContent
        ),
      }));
      setChatRooms(sortChatsByLatestMessage(processedRooms));
      setIsLoadingChatRooms(false);
      setChatRoomsError(null);
      if (rooms.length > 0 && !latestSelectedRoomId.current) {
        setSelectedRoomId(rooms[0]._id);
      }
    };

    const handleReceiveMessage = (message) => {
      console.log("FE ADMIN: Đã nhận được receive_message:", message);
      if (message.chatRoomId === latestSelectedRoomId.current) {
        setMessages((prevMessages) => {
          const isMessageAlreadyExist = prevMessages.some(
            (msg) => msg._id === message._id
          );
          if (isMessageAlreadyExist) return prevMessages;
          console.log("FE ADMIN: Thêm message vào mảng:", message);
          return [...prevMessages, message];
        });
      }

      setChatRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room._id === message.chatRoomId) {
            return {
              ...room,
              lastMessage: message, // Cập nhật toàn bộ object tin nhắn cuối
              lastMessageTimestamp: message.createdAt,
              // Luôn dùng hàm getMessagePreview để có sự nhất quán
              lastMessageContent: getMessagePreview(
                message,
                room.user, // room.user bây giờ là object { _id, username, fullname, avatar }
                latestCurrentUserId.current,
                message.content
              ),
              unreadCountAdmin:
                message.sender &&
                String(message.sender._id) !== String(latestCurrentUserId.current) &&
                String(message.chatRoomId) !== String(latestSelectedRoomId.current)
                  ? (room.unreadCountAdmin || 0) + 1
                  : room.unreadCountAdmin,
            };
          }
          return room;
        });
        return sortChatsByLatestMessage(updatedRooms);
      });
    };

    const handleChatRoomUpdate = (roomOverview) => {
      console.log(
        "SocketContext (Chat Logic): Received chatRoomUpdatedByClient:",
        roomOverview
      );
      setChatRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room._id === roomOverview._id) {
            // Hợp nhất dữ liệu mới
            const mergedRoom = { ...room, ...roomOverview };
            // Tạo lại preview từ dữ liệu đã hợp nhất để đảm bảo tính đúng đắn
            const finalPreview = getMessagePreview(
              mergedRoom.lastMessage,
              mergedRoom.user, // mergedRoom.user bây giờ là object { _id, username, fullname, avatar }
              latestCurrentUserId.current,
              mergedRoom.lastMessageContent
            );
            return {
              ...mergedRoom,
              lastMessageContent: finalPreview,
            };
          }
          return room;
        });
        return sortChatsByLatestMessage(updatedRooms);
      });
    };

    const handleMessageError = (errorMsg) => {
      console.error(
        "SocketContext (Chat Logic): Socket Message Error:",
        errorMsg
      );
      setMessagesError({
        error: true,
        message: errorMsg.message || "Lỗi khi gửi tin nhắn.",
      });
      setIsLoadingMessages(false);
      if (isLoadingMessages) setIsLoadingMessages(false);
    };

    // Hàm xử lý sự kiện online_users_update
    const handleGetOnlineUsers = (onlineUsersList) => {
      setOnlineUsers(onlineUsersList);
      // DÒNG LOG QUAN TRỌNG ĐỂ XÁC NHẬN DỮ LIỆU ĐƯỢC NHẬN TỪ BACKEND
      console.log(
        "SocketContext (Chat Logic): Received online users list from backend and UPDATED STATE:",
        onlineUsersList
      );
    };

    const handleChatHistory = (data) => {
      // Đổi tên biến 'history' thành 'data' cho rõ ràng
      console.log(
        "SocketContext (Chat History): >>> handleChatHistory triggered. Received data:",
        data
      );

      // KIỂM TRA và LẤY ĐÚNG MẢNG `messages` từ trong object data
      if (data && Array.isArray(data.messages)) {
        setMessages(data.messages);
      } else {
        // Nếu dữ liệu không hợp lệ, log lỗi và set về mảng rỗng để tránh crash
        console.error(
          "Dữ liệu nhận được từ 'chat_history' không hợp lệ hoặc không chứa mảng messages:",
          data
        );
        setMessages([]);
      }

      setIsLoadingMessages(false);
      setMessagesError(null);
    };

    console.log("Socket: Registering chat_room_list listener...");
    socket.on("chat_room_list", handleChatRoomList);
    console.log("Socket: Registering receive_message listener...");
    socket.on("receive_message", handleReceiveMessage);
    console.log("Socket: Registering chatRoomUpdatedByClient listener...");
    socket.on("chatRoomUpdatedByClient", handleChatRoomUpdate);
    console.log("Socket: Registering message_error listener...");
    socket.on("message_error", handleMessageError);
    console.log("Socket: Registering online_users_update listener...");
    socket.on("online_users_update", handleGetOnlineUsers);
    console.log("Socket: Registering chat_history listener...");
    socket.on("chat_history", handleChatHistory);

    return () => {
      console.log(
        "SocketContext (Chat Logic): Cleaning up chat data listeners..."
      );
      console.log("Socket: Unregistering chat_room_list listener...");
      socket.off("chat_room_list", handleChatRoomList);
      console.log("Socket: Unregistering receive_message listener...");
      socket.off("receive_message", handleReceiveMessage);
      console.log("Socket: Unregistering chatRoomUpdatedByClient listener...");
      socket.off("chatRoomUpdatedByClient", handleChatRoomUpdate);
      console.log("Socket: Unregistering message_error listener...");
      socket.off("message_error", handleMessageError);
      console.log("Socket: Unregistering getOnlineUsers listener...");
      socket.off("online_users_update", handleGetOnlineUsers);
      console.log("Socket: Unregistering chat_history listener...");
      socket.off("chat_history", handleChatHistory);
    };
  }, [isSocketReady, currentUserId, sortChatsByLatestMessage]);

  // --- useEffect 3: Chỉ yêu cầu Lịch sử Tin nhắn & Đánh dấu đã đọc khi selectedRoomId thay đổi ---
  useEffect(() => {
    if (
      !isSocketReady ||
      !socketRef.current ||
      !selectedRoomId ||
      !currentUserId
    ) {
      console.log(
        "SocketContext (Chat History): Conditions not met for fetching chat history or marking as read."
      );
      setMessages([]);
      setIsLoadingMessages(false);
      setMessagesError(null);
      return;
    }

    const socket = socketRef.current;

    console.log(
      `SocketContext (Chat History): Selected room changed to ${selectedRoomId}. Requesting chat history...`
    );
    setIsLoadingMessages(true);
    setMessagesError(null);
    socket.emit("request_chat_history", selectedRoomId);

    // SỬA ĐỔI Ở ĐÂY: Đảm bảo format của emit "mark_as_read" khớp với backend
    socket.emit("mark_as_read", {
      chatRoomId: selectedRoomId,
      readerId: currentUserId,
    });
    console.log(
      `SocketContext (Chat History): Emitting 'mark_as_read' for room ${selectedRoomId} by ${currentUserId}`
    );

    return () => {
      console.log(
        "SocketContext (Chat History): Cleanup of useEffect 3 (only mark_as_read event emitted)"
      );
    };
  }, [selectedRoomId, isSocketReady, currentUserId]);

  const selectAdminChatRoom = useCallback((roomId) => {
    setSelectedRoomId(roomId);
    setMessages([]);
    setIsLoadingMessages(true);
    setMessagesError(null);
  }, []);

  const sendAdminMessage = useCallback(
    (messageObject) => {
      if (
        !selectedRoomId ||
        !socketRef.current ||
        !isSocketReady ||
        !currentUserId
      ) {
        console.warn(
          "Không thể gửi tin nhắn: Thiếu phòng chat đc chọn, socket, hoặc thiếu thông tin xác thực người dùng."
        );
        return;
      }

      const socket = socketRef.current;
      if (!socket.connected) {
        console.warn(
          'SocketContext (Logic Chat): Socket chưa kết nối khi cố gắng gửi sự kiện "send_message".'
        );
        // Thay thế alert bằng một thông báo trên UI nếu có thể
        console.warn(
          "Kết nối Socket.IO chưa sẵn sàng. Vui lòng thử lại sau giây lát."
        );
        return;
      }

      if (
        messageObject.messageType === "text" &&
        (!messageObject.content || !messageObject.content.trim())
      ) {
        console.warn("Không thể gửi tin nhắn văn bản: Nội dung trống.");
        return;
      }

      if (messageObject.messageType === "image" && !messageObject.mediaUrl) {
        console.warn("Không thể gửi tin nhắn ảnh: mediaUrl bị thiếu.");
        // Thay thế alert bằng một thông báo trên UI nếu có thể
        console.warn("Không thể gửi ảnh: URL ảnh bị thiếu.");
        return;
      }

      if (!messageObject.content && !messageObject.mediaUrl) {
        console.warn(
          "Không thể gửi tin nhắn: Không có nội dung (văn bản hoặc media) được cung cấp."
        );
        return;
      }

      const currentChatRoom = chatRooms.find(
        (room) => room._id === selectedRoomId
      );
      if (!currentChatRoom || !currentChatRoom.userId) {
        console.error(
          "SocketContext (Logic Chat): Không thể tìm thấy ID người dùng mục tiêu cho phòng chat đã chọn. Dữ liệu phòng chat:",
          currentChatRoom
        );
        // Thay thế alert bằng một thông báo trên UI nếu có thể
        console.warn("Không thể gửi tin nhắn: Không tìm thấy thông tin người nhận.");
        return;
      }

      const targetUserId = currentChatRoom.userId; // id của người dùng mà admin đang chat cùng

      const messageData = {
        chatRoomId: selectedRoomId,
        targetUserId: targetUserId,
        content: messageObject.content ? messageObject.content.trim() : "",
        messageType: messageObject.messageType,
        mediaUrl: messageObject.mediaUrl,
      };

      console.log(
        'SocketContext (Logic Chat): Đang gửi sự kiện "send_message":',
        messageData
      );
      socket.emit("send_message", messageData);
    },
    [selectedRoomId, isSocketReady, chatRooms, currentUserId] // Thêm currentUserId vào dependencies
  );

  const contextValue = {
    socket: socketRef.current,
    isSocketReady,
    chatRooms,
    selectedRoomId,
    messages,
    isLoadingChatRooms,
    chatRoomsError,
    isLoadingMessages,
    messagesError,
    onlineUsers,
    selectAdminChatRoom,
    sendAdminMessage,
    currentUserId,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
