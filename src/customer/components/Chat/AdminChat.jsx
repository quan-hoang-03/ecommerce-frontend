import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchConversations,
  fetchMessages,
  fetchUnreadCount,
} from "../../State/Chat/Action";
import { getUser } from "../../State/Auth/Action";
import { API_BASE_URL } from "../../../config/apiConfig";
import ChatBox from "./ChatBox";

const AdminChat = () => {
  const dispatch = useDispatch();
  const { auth, chat } = useSelector((store) => store);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      // Fetch user profile if not available
      if (!auth.user || !auth.user.id) {
        dispatch(getUser(jwt));
      }
    }
  }, [jwt, auth.user]);

  useEffect(() => {
    if (jwt && auth.user && auth.user.role?.includes("ADMIN")) {
      loadCustomers();
      dispatch(fetchUnreadCount(jwt));
      
      // Refresh unread count every 30 seconds
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount(jwt));
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [jwt, auth.user]);

  const loadAllCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/admin/customers`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      if (response.ok) {
        const allCustomers = await response.json();
        setCustomers(allCustomers || []);
      }
    } catch (error) {
      console.error("Error loading all customers:", error);
    }
  };

  const loadCustomers = async () => {
    try {
      // Load customers with conversations first
      await dispatch(fetchConversations(jwt));
    } catch (error) {
      console.error("Error loading conversations:", error);
      // If conversations fail, load all customers
      loadAllCustomers();
    }
  };

  useEffect(() => {
    // When conversations are loaded, update customers list
    if (chat.conversations && Array.isArray(chat.conversations)) {
      if (chat.conversations.length > 0) {
        // Show customers with conversations
        setCustomers(chat.conversations);
      } else {
        // If no conversations, show all customers
        loadAllCustomers();
      }
    }
  }, [chat.conversations]);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsChatOpen(true);
    if (jwt) {
      dispatch(fetchMessages(jwt, customer.id));
    }
  };

  const handleChatToggle = () => {
    setIsChatOpen(!isChatOpen);
  };

  const getUnreadCountForCustomer = (customerId) => {
    // This would need to be calculated based on unread messages
    // For now, return 0
    return 0;
  };

  return (
    <>
      {/* Chat Button - Always visible when minimized */}
      {!isChatOpen && (
        <button
          onClick={handleChatToggle}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition-all hover:scale-110"
          aria-label="Mở chat"
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
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
              {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Box - Only visible when opened */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white shadow-2xl rounded-lg flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-green-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Chat với khách hàng</h3>
              <p className="text-xs text-green-100">
                {customers.length} cuộc trò chuyện
              </p>
            </div>
            <button
              onClick={handleChatToggle}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Đóng chat"
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

          {/* Chat Content */}
          {selectedCustomer ? (
            <div className="flex-1 overflow-hidden">
              <ChatBox
                isOpen={true}
                onClose={() => {
                  setIsChatOpen(false);
                  setSelectedCustomer(null);
                }}
                receiverId={selectedCustomer.id}
                receiverName={`${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                receiverAvatar={selectedCustomer.avatar}
              />
            </div>
          ) : (
            // Customer List
            <div className="flex-1 overflow-y-auto p-4">
              <h4 className="font-semibold mb-4 text-gray-700">Chọn khách hàng</h4>
              {customers.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <p>Chưa có cuộc trò chuyện nào</p>
                  <button
                    onClick={loadAllCustomers}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Tải danh sách khách hàng
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {customers.map((customer) => {
                    const unreadCount = getUnreadCountForCustomer(customer.id);
                    return (
                      <button
                        key={customer.id}
                        onClick={() => handleSelectCustomer(customer)}
                        className="w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left flex items-center space-x-3"
                      >
                        {customer.avatar ? (
                          <img
                            src={`${API_BASE_URL}${customer.avatar}`}
                            alt={`${customer.firstName} ${customer.lastName}`}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-600 font-semibold">
                              {customer.firstName?.charAt(0)?.toUpperCase()}
                              {customer.lastName?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {customer.firstName} {customer.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{customer.email}</p>
                        </div>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default AdminChat;
