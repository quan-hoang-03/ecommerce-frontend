import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMessages,
  sendMessage,
  receiveMessage,
  markAsRead,
  fetchUnreadCount,
  deleteMessage,
} from "../../State/Chat/Action";
import { selectConversation } from "../../State/Chat/Action";
import { API_BASE_URL } from "../../../config/apiConfig";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const ChatBox = ({ isOpen, onClose, receiverId, receiverName, receiverAvatar }) => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);
  const [message, setMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [hoveredMessageId, setHoveredMessageId] = useState(null);
  const jwt = localStorage.getItem("jwt");
  const currentUser = auth.user;
  const messages = receiverId ? (chat.messages[receiverId] || []) : [];

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
        await handleDeleteMessage(msg.id);
        break;
      case 'forward':
        // TODO: Implement forward functionality
        alert('Tính năng chuyển tiếp đang được phát triển');
        break;
      case 'pin':
        // TODO: Implement pin functionality
        alert('Tính năng ghim đang được phát triển');
        break;
      case 'report':
        // TODO: Implement report functionality
        alert('Tính năng báo cáo đang được phát triển');
        break;
      default:
        break;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!message.trim() || !receiverId || !jwt) {
      console.warn("Cannot send message: missing required fields", {
        message: message.trim(),
        receiverId,
        jwt: !!jwt,
      });
      return;
    }

    if (!currentUser || !currentUser.id) {
      console.error("Cannot send message: currentUser is not available", currentUser);
      alert("Không thể gửi tin nhắn. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      console.log("Sending message:", { receiverId, message, currentUserId: currentUser.id });
      await dispatch(sendMessage(jwt, receiverId, message, currentUser.id));
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Bạn có chắc chắn muốn thu hồi tin nhắn này?")) {
      return;
    }

    try {
      await dispatch(deleteMessage(jwt, messageId, receiverId));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Không thể thu hồi tin nhắn. Bạn chỉ có thể thu hồi tin nhắn của chính mình.");
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
    <div className="fixed bottom-0 right-0 w-96 h-[600px] bg-white shadow-2xl rounded-t-lg flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {receiverAvatar ? (
            <img
              src={`${API_BASE_URL}${receiverAvatar}`}
              alt={receiverName}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center">
              <span className="text-white font-semibold">
                {receiverName?.charAt(0)?.toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold">{receiverName || "Admin"}</h3>
            <p className="text-xs text-blue-100">Đang hoạt động</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg
            className="w-6 h-6"
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Chưa có tin nhắn nào</p>
            <p className="text-sm mt-2">Bắt đầu cuộc trò chuyện!</p>
          </div>
        ) : (
          messages.map((msg) => {
            // Support both formats: msg.senderId (from normalized response) and msg.sender.id (from ChatMessage object)
            const senderId = msg.senderId || (msg.sender && msg.sender.id) || (msg.sender && typeof msg.sender === 'object' ? msg.sender.id : null);
            const isSender = senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isSender ? "justify-end" : "justify-start"} relative`}
                onMouseEnter={() => isSender && setHoveredMessageId(msg.id)}
                onMouseLeave={() => setHoveredMessageId(null)}
              >
                <div
                  className={`message-bubble relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isSender
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
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
                      className={`absolute -top-1 -right-1 transition-opacity duration-200 bg-gray-800 hover:bg-gray-700 text-white rounded-full p-1.5 shadow-lg z-10 cursor-pointer ${
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
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={`text-xs ${
                        isSender ? "text-blue-100" : "text-gray-500"
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
          className="context-menu absolute bg-gray-800 text-white rounded-lg shadow-xl py-2 z-[60] min-w-[150px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextMenuAction('delete', selectedMessage)}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Thu hồi</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('forward', selectedMessage)}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
            <span>Chuyển tiếp</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('pin', selectedMessage)}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span>Ghim</span>
          </button>
          <button
            onClick={() => handleContextMenuAction('report', selectedMessage)}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Báo cáo</span>
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Gửi
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
