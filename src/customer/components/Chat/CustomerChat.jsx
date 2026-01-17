import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  fetchMessages,
  fetchUnreadCount,
} from "../../State/Chat/Action";
import { API_BASE_URL } from "../../../config/apiConfig";
import ChatBox from "./ChatBox";

const CustomerChat = () => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt && auth.user && !auth.user.role?.includes("ADMIN")) {
      // Find admin user
      fetchAdminAndOpenChat();
      dispatch(fetchUnreadCount(jwt));
    }
  }, [jwt, auth.user]);

  const fetchAdminAndOpenChat = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/all`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.ok) {
        const users = await response.json();
        const admin = Array.isArray(users) ? users.find((u) => u.role === "ADMIN") : null;
        
        if (admin) {
          setSelectedReceiver({
            id: admin.id,
            name: `${admin.firstName || ""} ${admin.lastName || ""}`.trim() || "Admin",
            avatar: admin.avatar,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching admin:", error);
    }
  };

  const handleChatToggle = () => {
    if (!selectedReceiver) {
      fetchAdminAndOpenChat();
    }
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={handleChatToggle}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center space-x-2"
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
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {chat.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
          </span>
        )}
      </button>

      {/* Chat Box */}
      {selectedReceiver && (
        <ChatBox
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          receiverId={selectedReceiver.id}
          receiverName={selectedReceiver.name}
          receiverAvatar={selectedReceiver.avatar}
        />
      )}
    </>
  );
};

export default CustomerChat;
