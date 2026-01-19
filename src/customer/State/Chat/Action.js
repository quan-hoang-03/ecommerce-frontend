import axios from "axios";
import { API_BASE_URL } from "../../../config/apiConfig";

// Fetch conversations
const fetchConversationsRequest = () => ({
  type: "FETCH_CONVERSATIONS_REQUEST",
});

const fetchConversationsSuccess = (conversations) => ({
  type: "FETCH_CONVERSATIONS_SUCCESS",
  payload: conversations,
});

const fetchConversationsFailure = (error) => ({
  type: "FETCH_CONVERSATIONS_FAILURE",
  payload: error,
});

export const fetchConversations = (jwt) => async (dispatch) => {
  dispatch(fetchConversationsRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(fetchConversationsSuccess(response.data));
  } catch (error) {
    dispatch(fetchConversationsFailure(error.message));
  }
};

// Fetch messages
const fetchMessagesRequest = () => ({
  type: "FETCH_MESSAGES_REQUEST",
});

const fetchMessagesSuccess = (userId, messages) => ({
  type: "FETCH_MESSAGES_SUCCESS",
  payload: { userId, messages },
});

const fetchMessagesFailure = (error) => ({
  type: "FETCH_MESSAGES_FAILURE",
  payload: error,
});

export const fetchMessages = (jwt, userId) => async (dispatch) => {
  dispatch(fetchMessagesRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/conversation/${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(fetchMessagesSuccess(userId, response.data));
  } catch (error) {
    dispatch(fetchMessagesFailure(error.message));
  }
};

// Send message
const sendMessageRequest = () => ({
  type: "SEND_MESSAGE_REQUEST",
});

const sendMessageSuccess = (message) => ({
  type: "SEND_MESSAGE_SUCCESS",
  payload: message,
});

const sendMessageFailure = (error) => ({
  type: "SEND_MESSAGE_FAILURE",
  payload: error,
});

export const sendMessage = (jwt, receiverId, content, currentUserId) => async (dispatch) => {
  dispatch(sendMessageRequest());
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/chat/send`,
      { receiverId, content },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    const message = { ...response.data, currentUserId };
    dispatch(sendMessageSuccess(message));
    return response.data;
  } catch (error) {
    dispatch(sendMessageFailure(error.message));
    throw error;
  }
};

// Send message with image
export const sendMessageWithImage = (jwt, receiverId, content, imageFile, currentUserId) => async (dispatch) => {
  dispatch(sendMessageRequest());
  try {
    const formData = new FormData();
    formData.append("receiverId", receiverId.toString());
    if (content) {
      formData.append("content", content);
    }
    formData.append("image", imageFile);

    const response = await axios.post(
      `${API_BASE_URL}/api/chat/send-image`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const message = { ...response.data, currentUserId };
    dispatch(sendMessageSuccess(message));
    return response.data;
  } catch (error) {
    dispatch(sendMessageFailure(error.message));
    throw error;
  }
};

// Receive message (from WebSocket)
export const receiveMessage = (message, currentUserId) => ({
  type: "RECEIVE_MESSAGE",
  payload: message,
  currentUserId,
});

// Fetch unread count
const fetchUnreadCountRequest = () => ({
  type: "FETCH_UNREAD_COUNT_REQUEST",
});

const fetchUnreadCountSuccess = (count) => ({
  type: "FETCH_UNREAD_COUNT_SUCCESS",
  payload: count,
});

const fetchUnreadCountFailure = (error) => ({
  type: "FETCH_UNREAD_COUNT_FAILURE",
  payload: error,
});

export const fetchUnreadCount = (jwt) => async (dispatch) => {
  dispatch(fetchUnreadCountRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/unread-count`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(fetchUnreadCountSuccess(response.data.count));
  } catch (error) {
    dispatch(fetchUnreadCountFailure(error.message));
  }
};

// Select conversation
export const selectConversation = (user) => ({
  type: "SELECT_CONVERSATION",
  payload: user,
});

// Mark as read
const markAsReadRequest = () => ({
  type: "MARK_AS_READ_REQUEST",
});

const markAsReadSuccess = (userId) => ({
  type: "MARK_AS_READ_SUCCESS",
  payload: userId,
});

const markAsReadFailure = (error) => ({
  type: "MARK_AS_READ_FAILURE",
  payload: error,
});

export const markAsRead = (jwt, userId) => async (dispatch) => {
  dispatch(markAsReadRequest());
  try {
    await axios.post(
      `${API_BASE_URL}/api/chat/mark-read/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    dispatch(markAsReadSuccess(userId));
  } catch (error) {
    dispatch(markAsReadFailure(error.message));
  }
};

// Fetch admin customers
export const fetchAdminCustomers = (jwt) => async (dispatch) => {
  dispatch(fetchConversationsRequest());
  try {
    const response = await axios.get(`${API_BASE_URL}/api/chat/admin/customers`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(fetchConversationsSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(fetchConversationsFailure(error.message));
    throw error;
  }
};

// Delete message
const deleteMessageRequest = () => ({
  type: "DELETE_MESSAGE_REQUEST",
});

const deleteMessageSuccess = (messageId, userId) => ({
  type: "DELETE_MESSAGE_SUCCESS",
  payload: { messageId, userId },
});

const deleteMessageFailure = (error) => ({
  type: "DELETE_MESSAGE_FAILURE",
  payload: error,
});

export const deleteMessage = (jwt, messageId, userId) => async (dispatch) => {
  dispatch(deleteMessageRequest());
  try {
    await axios.delete(`${API_BASE_URL}/api/chat/message/${messageId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(deleteMessageSuccess(messageId, userId));
  } catch (error) {
    dispatch(deleteMessageFailure(error.message));
    throw error;
  }
};

// Delete conversation
const deleteConversationRequest = () => ({
  type: "DELETE_CONVERSATION_REQUEST",
});

const deleteConversationSuccess = (userId) => ({
  type: "DELETE_CONVERSATION_SUCCESS",
  payload: userId,
});

const deleteConversationFailure = (error) => ({
  type: "DELETE_CONVERSATION_FAILURE",
  payload: error,
});

export const deleteConversation = (jwt, userId) => async (dispatch) => {
  dispatch(deleteConversationRequest());
  try {
    await axios.delete(`${API_BASE_URL}/api/chat/conversation/${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(deleteConversationSuccess(userId));
  } catch (error) {
    dispatch(deleteConversationFailure(error.message));
    throw error;
  }
};
