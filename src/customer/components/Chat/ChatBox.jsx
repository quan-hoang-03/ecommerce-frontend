import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  sendMessageWithImage,
  receiveMessage,
  markAsRead,
  fetchUnreadCount,
  deleteMessage,
  deleteConversation,
} from "../../State/Chat/Action";
import { selectConversation } from "../../State/Chat/Action";
import { API_BASE_URL } from "../../../config/apiConfig";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useNotification } from "../../hooks/useNotification";
import NotificationContainer from "../Notification/NotificationContainer";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const ChatBox = ({ isOpen, onClose, receiverId, receiverName, receiverAvatar }) => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [deleteMessageDialogOpen, setDeleteMessageDialogOpen] = useState(false);
  const [deleteConversationDialogOpen, setDeleteConversationDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const jwt = localStorage.getItem("jwt");
  const currentUser = auth.user;
  const messages = receiverId ? (chat.messages[receiverId] || []) : [];
  const { notifications, showInfo, showError, removeNotification } = useNotification();

  useEffect(() => {
    if (isOpen && receiverId && jwt && currentUser) {
      // Fetch messages
      dispatch(fetchMessages(jwt, receiverId));
      
      // Mark messages as read
      dispatch(markAsRead(jwt, receiverId));

      // Connect to WebSocket
      const socket = new SockJS(`${API_BASE_URL}/ws`);
      const client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log("Connected to WebSocket");
          // Subscribe to user's message channel
          client.subscribe(`/topic/messages/${currentUser.id}`, (message) => {
            const messageData = JSON.parse(message.body);
            dispatch(receiveMessage(messageData, currentUser.id));
            
            // Mark as read if it's from the current conversation
            if (messageData.senderId === receiverId || messageData.receiverId === receiverId) {
              dispatch(markAsRead(jwt, receiverId));
            }
          });
        },
        onStompError: (frame) => {
          console.error("STOMP error:", frame);
        },
      });

      client.activate();
      setStompClient(client);

      // Fetch unread count
      dispatch(fetchUnreadCount(jwt));

      return () => {
        client.deactivate();
      };
    }
  }, [isOpen, receiverId, jwt, currentUser]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Close context menu when clicking outside
    const handleClickOutside = (event) => {
      if (contextMenu && !event.target.closest('.context-menu') && !event.target.closest('button[title="Tùy chọn"]')) {
        setContextMenu(null);
        setSelectedMessage(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu]);

  const handleMessageRightClick = (e, msg) => {
    e.preventDefault();
    const senderId = msg.senderId || (msg.sender && msg.sender.id) || (msg.sender && typeof msg.sender === 'object' ? msg.sender.id : null);
    const isSender = senderId === currentUser?.id;
    
    if (isSender) {
      setSelectedMessage(msg);
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleContextMenuAction = async (action, msg) => {
    setContextMenu(null);
    setSelectedMessage(null);
    
    switch (action) {
      case 'delete':
        // "Thu hồi" = Xóa tin nhắn
        handleOpenDeleteMessageDialog(msg.id);
        break;
      case 'forward':
        // TODO: Implement forward functionality
        showInfo('Tính năng chuyển tiếp đang được phát triển');
        break;
      case 'pin':
        // TODO: Implement pin functionality
        showInfo('Tính năng ghim đang được phát triển');
        break;
      case 'report':
        // TODO: Implement report functionality
        showInfo('Tính năng báo cáo đang được phát triển');
        break;
      default:
        break;
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        showError("File phải là hình ảnh");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showError("Kích thước file không được vượt quá 5MB");
        return;
      }

      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if ((!message.trim() && !selectedImage) || !receiverId || !jwt) {
      console.warn("Cannot send message: missing required fields", {
        message: message.trim(),
        selectedImage: !!selectedImage,
        receiverId,
        jwt: !!jwt,
      });
      return;
    }

    if (!currentUser || !currentUser.id) {
      console.error("Cannot send message: currentUser is not available", currentUser);
      showError("Không thể gửi tin nhắn. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      if (selectedImage) {
        // Send message with image
        console.log("Sending message with image:", { receiverId, message, currentUserId: currentUser.id });
        await dispatch(sendMessageWithImage(jwt, receiverId, message, selectedImage, currentUser.id));
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        // Send text message only
        console.log("Sending message:", { receiverId, message, currentUserId: currentUser.id });
        await dispatch(sendMessage(jwt, receiverId, message, currentUser.id));
      }
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      showError("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  const handleOpenDeleteMessageDialog = (messageId) => {
    setMessageToDelete(messageId);
    setDeleteMessageDialogOpen(true);
  };

  const handleCloseDeleteMessageDialog = () => {
    setDeleteMessageDialogOpen(false);
    setMessageToDelete(null);
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      await dispatch(deleteMessage(jwt, messageToDelete, receiverId));
      handleCloseDeleteMessageDialog();
    } catch (error) {
      console.error("Error deleting message:", error);
      showError("Không thể thu hồi tin nhắn. Bạn chỉ có thể thu hồi tin nhắn của chính mình.");
      handleCloseDeleteMessageDialog();
    }
  };

  const handleOpenDeleteConversationDialog = () => {
    setDeleteConversationDialogOpen(true);
  };

  const handleCloseDeleteConversationDialog = () => {
    setDeleteConversationDialogOpen(false);
  };

  const handleDeleteConversation = async () => {
    try {
      await dispatch(deleteConversation(jwt, receiverId));
      showInfo("Đã xóa toàn bộ cuộc trò chuyện thành công");
      handleCloseDeleteConversationDialog();
      // Refresh messages to show empty state
      dispatch(fetchMessages(jwt, receiverId));
    } catch (error) {
      console.error("Error deleting conversation:", error);
      showError("Không thể xóa cuộc trò chuyện. Vui lòng thử lại.");
      handleCloseDeleteConversationDialog();
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)} giờ trước`;
    
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 w-96 h-[600px] bg-white shadow-2xl rounded-t-xl flex flex-col z-50 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          {receiverAvatar ? (
            <img
              src={`${API_BASE_URL}${receiverAvatar}`}
              alt={receiverName}
              className="w-11 h-11 rounded-full border-2 border-white/30 shadow-md object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white/30 shadow-md">
              <span className="text-white font-semibold text-lg">
                {receiverName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-base">{receiverName || "Admin"}</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              <p className="text-xs text-blue-100">Đang hoạt động</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleOpenDeleteConversationDialog}
            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
            title="Xóa cuộc trò chuyện"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1.5 transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative bg-gradient-to-b from-gray-50 to-white">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="font-medium text-gray-700">Chưa có tin nhắn nào</p>
            <p className="text-sm mt-1 text-gray-500">Bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Support both formats: msg.senderId (from normalized response) and msg.sender.id (from ChatMessage object)
            const senderId = msg.senderId || (msg.sender && msg.sender.id) || (msg.sender && typeof msg.sender === 'object' ? msg.sender.id : null);
            const isSender = senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isSender ? "justify-end" : "justify-start"} relative group`}
                onMouseEnter={() => isSender && setHoveredMessageId(msg.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div
                  className={`message-bubble relative max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl shadow-sm transition-all duration-200 ${
                    isSender
                      ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-sm"
                  }`}
                >
                  {isSender && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        const messagesContainer = e.currentTarget.closest('.flex-1');
                        if (messagesContainer) {
                          const containerRect = messagesContainer.getBoundingClientRect();
                          setSelectedMessage(msg);
                          setContextMenu({
                            x: rect.right - containerRect.left - 150,
                            y: rect.top - containerRect.top,
                          });
                        }
                      }}
                      className={`absolute -top-1 -right-1 transition-all duration-200 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-1.5 shadow-lg z-10 cursor-pointer hover:scale-110 ${
                        hoveredMessageId === msg.id ? 'opacity-100' : 'opacity-0'
                      }`}
                      title="Tùy chọn"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  )}
                  {msg.imageUrl && (
                    <div className="mb-2 rounded-xl overflow-hidden shadow-md">
                      <img
                        src={`${API_BASE_URL}${msg.imageUrl}`}
                        alt="Chat image"
                        className="max-w-full h-auto max-h-64 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(`${API_BASE_URL}${msg.imageUrl}`, "_blank")}
                      />
                    </div>
                  )}
                  {msg.content && <p className="text-sm leading-relaxed break-words">{msg.content}</p>}
                  <div className="flex items-center justify-end mt-1.5">
                    <p
                      className={`text-xs ${
                        isSender ? "text-blue-100/80" : "text-gray-400"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Context Menu */}
      {contextMenu && selectedMessage && (
        <div
          className="context-menu absolute bg-white border border-gray-200 text-gray-800 rounded-xl shadow-2xl py-1 z-[60] min-w-[160px] overflow-hidden"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextMenuAction('delete', selectedMessage)}
            className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center space-x-3 text-gray-700 hover:text-red-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="text-sm">Thu hồi</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('forward', selectedMessage)}
            className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 text-gray-700 hover:text-blue-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span className="text-sm">Chuyển tiếp</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('pin', selectedMessage)}
            className="w-full px-4 py-2.5 text-left hover:bg-yellow-50 transition-colors flex items-center space-x-3 text-gray-700 hover:text-yellow-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="text-sm">Ghim</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('report', selectedMessage)}
            className="w-full px-4 py-2.5 text-left hover:bg-orange-50 transition-colors flex items-center space-x-3 text-gray-700 hover:text-orange-600"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm">Báo cáo</span>
          </button>
        </div>
      )}

      {/* Image Preview */}
      {imagePreview && (
        <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white relative">
          <button
            onClick={handleRemoveImage}
            className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-all duration-200 shadow-lg hover:scale-110"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={imagePreview}
            alt="Preview"
            className="max-w-full h-auto max-h-32 rounded-xl shadow-sm"
          />
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="border-t border-gray-200 bg-white" style={{padding:"10px 0"}}>
        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
            id="image-input"
          />
          <label
            htmlFor="image-input"
            className="px-3 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 shadow-sm"
            title="Chọn ảnh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
          />
          <button
            type="submit"
            disabled={!message.trim() && !selectedImage}
            className="p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shrink-0 shadow-md hover:shadow-lg disabled:shadow-none hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Gửi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </form>

      {/* Dialog xác nhận xóa tin nhắn */}
      <Dialog
        open={deleteMessageDialogOpen}
        onClose={handleCloseDeleteMessageDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Xác nhận thu hồi tin nhắn
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.95rem" }}>
            Bạn có chắc chắn muốn thu hồi tin nhắn này?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteMessageDialog}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteMessage}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Thu hồi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog xác nhận xóa cuộc trò chuyện */}
      <Dialog
        open={deleteConversationDialogOpen}
        onClose={handleCloseDeleteConversationDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
          Xác nhận xóa cuộc trò chuyện
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: "0.95rem" }}>
            Bạn có chắc chắn muốn xóa toàn bộ cuộc trò chuyện này?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseDeleteConversationDialog}
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleDeleteConversation}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <NotificationContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </div>
  );
};

export default ChatBox;
