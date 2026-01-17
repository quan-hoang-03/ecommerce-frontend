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
    if (!window.confirm("Bạn có chắc chắn muốn xóa tin nhắn này?")) {
      return;
    }

    try {
      await dispatch(deleteMessage(jwt, messageId, receiverId));
    } catch (error) {
      console.error("Error deleting message:", error);
      alert("Không thể xóa tin nhắn. Bạn chỉ có thể xóa tin nhắn của chính mình.");
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                className={`flex ${isSender ? "justify-end" : "justify-start"} group`}
              >
                <div
                  className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isSender
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p
                      className={`text-xs ${
                        isSender ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                    {isSender && (
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-300 hover:text-red-100"
                        title="Xóa tin nhắn"
                      >
                        <svg
                          className="w-4 h-4"
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
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

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
